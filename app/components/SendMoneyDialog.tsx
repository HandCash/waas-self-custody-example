'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Search, Send } from 'lucide-react'
import { Balance, RequiredSignature } from '@/lib/services/walletApi/types'
import { DialogTrigger } from '@radix-ui/react-dialog'
import { getTransactionTemplate, confirmTransaction } from '@/app/actions/wallet/createTransaction'
import { useToast } from "@/hooks/use-toast"
import { getWallet } from '@/lib/services/wallet/walletClient'
import { useRouter } from 'next/navigation'

interface SendMoneyDialogProps {
  balance: Balance;
}

export default function SendMoneyDialog({
  balance,
}: SendMoneyDialogProps) {
  const [amount, setAmount] = useState('');
  const [receiver, setReceiver] = useState('');
  const [note, setNote] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const exchangeRate = balance.fiatEquivalent.units / balance.units;

  const signTransaction = async (requiredSignatures: RequiredSignature[]) => {
    const wallet = getWallet()
    if (!wallet) {
      throw new Error('Wallet not initialized')
    }
    return wallet.sign(requiredSignatures)
  }


  const handleSendMoney = async () => {
    try {
      setIsSending(true)
      const templateResult = await getTransactionTemplate({
        amount: Number(amount),
        receiver,
        note,
        denominationCurrencyCode: balance.fiatEquivalent.currencyCode
      });

      if (!templateResult.success) {
        throw new Error(templateResult.error);
      }

      const { unsignedTransactionTemplateId, requiredSignatures } = templateResult.data!;

      const signatures = await signTransaction(requiredSignatures);

      const confirmTransactionResult = await confirmTransaction(unsignedTransactionTemplateId, signatures);

      if (!confirmTransactionResult.success) {
        throw new Error(confirmTransactionResult.error);
      }

      toast({
        title: "Money sent successfully",
        description: `Sent $${amount} to ${receiver}`,
      })
      setIsOpen(false)
      setAmount('')
      setReceiver('')
      setNote('')
      router.refresh()
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Failed to send money",
        description: "An unexpected error occurred",
      })
    } finally {
      setIsSending(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="flex-1" variant="default">
          <Send className="mr-2 h-4 w-4" /> Send
        </Button>
      </DialogTrigger>
      <DialogContent className="dark max-w-md p-0 bg-black text-white">
        <div className="space-y-6 p-6">
          {/* Header */}
          <DialogHeader className="flex-row items-center space-y-0 space-x-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsOpen(false)}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <DialogTitle className="text-xl">Send money</DialogTitle>
          </DialogHeader>

          {/* Amount Input */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-sm text-gray-400">Amount</label>
              <span className="text-sm text-green-500">${balance.fiatEquivalent.units.toFixed(2)} Available</span>
            </div>
            <div className="relative">
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-zinc-900 border-0 px-6 h-14 text-lg"
                placeholder="0.00"
              />
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400">$</span>
            </div>
            <div className="text-sm text-gray-400">
              You will send {amount ? (Number(amount) / exchangeRate).toFixed(8) : '0'} BSV
            </div>
          </div>

          {/* Receiver Input */}
          <div className="space-y-2">
            <label className="text-sm text-gray-400">Receiver</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                className="bg-zinc-900 border-0 pl-10 pr-12 h-14"
                placeholder="$handle, address or paymail"
                value={receiver}
                onChange={(e) => setReceiver(e.target.value)}
              />
            </div>
          </div>

          {/* Note Input */}
          <div className="space-y-2">
            <label className="text-sm text-gray-400">Note</label>
            <Input
              className="bg-zinc-900 border-0 h-14"
              placeholder="Add note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
        </div>

        {/* Send Button */}
        <div className="p-6 pt-0">
          <Button
            className="w-full bg-white hover:bg-gray-300 text-black h-14 text-lg rounded-lg"
            disabled={!amount || Number(amount) <= 0 || !receiver || isSending}
            onClick={handleSendMoney}
          >
            {isSending ? "Sending..." : "Send money"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
