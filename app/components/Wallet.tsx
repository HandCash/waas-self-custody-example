'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import TransactionItem from "./TransactionItem"
import { Balance, TransactionResult, DepositInfo } from "@/lib/services/walletApi/types"
import { ReceiveDialog } from "./ReceiveDialog"
import SendMoneyDialog from "./SendMoneyDialog"
import { useState, useEffect } from "react"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Shield } from "lucide-react"
import ExportWalletDialog from "./ExportWalletDialog"
import { useRouter } from "next/navigation"
import { WalletClient, importWallet } from "@/lib/services/wallet/walletClient"

interface Props {
    transactions: TransactionResult[];
    balance: Balance;
    depositInfo: DepositInfo;
}

export default function Wallet({ transactions, balance, depositInfo }: Props) {
    const router = useRouter()
    const [isExportWalletOpen, setIsExportWalletOpen] = useState(false)

    useEffect(() => {
        const storedMnemonic = localStorage.getItem('wallet_mnemonic')
        if (!storedMnemonic || !WalletClient.validateMnemonic(storedMnemonic)) {
            router.push('/start')
            return
        }
        importWallet(storedMnemonic)
    }, [router])

    return (
        <>
            <div className="min-h-screen flex items-center justify-center p-4 bg-">
                <Card className="w-full max-w-md">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0">
                        <CardTitle className="text-2xl font-bold">My Wallet</CardTitle>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <Shield className="h-5 w-5" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => setIsExportWalletOpen(true)}>Export Wallet</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </CardHeader>

                    <CardContent>
                        <div className="text-center">
                            <p className="text-sm text-muted-foreground">Current Balance</p>
                            <p className="text-4xl font-bold">${balance.fiatEquivalent.units.toFixed(2)}</p>
                        </div>
                        <div className="flex gap-4 mt-12 mb-6">
                            <SendMoneyDialog balance={balance} />
                            <ReceiveDialog depositInfo={depositInfo} />
                        </div>

                        <div className="space-y-4">
                            <h3 className="font-semibold">Recent Transactions</h3>
                            {transactions.map((transaction) => (
                                <TransactionItem
                                    key={transaction.transactionId}
                                    transaction={transaction}
                                />
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <ExportWalletDialog
                open={isExportWalletOpen}
                onOpenChange={setIsExportWalletOpen}
            />
        </>
    )
} 