import Link from "next/link"
import { siteConfig } from "@/config/site"
import { buttonVariants } from "@/components/ui/button"
import Wallet from "@/app/components/Wallet"
import { cookies } from "next/headers";
import { getWalletApi } from "@/lib/serviceFactory";

export default async function Page() {
  const walletApi = getWalletApi();

  const [transactions, balances, depositInfo] = await Promise.all([
    walletApi.getTransactions(),
    walletApi.getBalances(),
    walletApi.getDepositInfo()
  ]);

  return (
    <Wallet 
      transactions={transactions.items} 
      balance={balances.items[1]}
      depositInfo={depositInfo}
    />
  )
}
