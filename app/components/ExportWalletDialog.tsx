'use client'

import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, Copy, CheckCircle2, AlertTriangle } from 'lucide-react'
import { getWallet } from '@/lib/services/wallet/walletClient'
interface ExportWalletDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function ExportWalletDialog({
  open,
  onOpenChange,
}: ExportWalletDialogProps) {
  const [copied, setCopied] = useState(false)
  const [mnemonic, setMnemonic] = useState('')

  useEffect(() => {
    const wallet = getWallet()
    if (wallet) {
      setMnemonic(wallet.getMnemonic())
    }
  }, [])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(mnemonic)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Shield className="h-5 w-5 text-orange-500" />
            Export Wallet
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Security Warning */}
          <Alert variant="destructive" className="border-orange-500/50 bg-orange-500/10">
            <AlertTriangle className="h-4 w-4 text-orange-500" />
            <AlertDescription className="text-orange-500">
              Never share your recovery phrase. Anyone with these words can steal your funds.
            </AlertDescription>
          </Alert>

          {/* Mnemonic Display */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Recovery Phrase
            </label>
            <div className="relative">
              <div className="grid grid-cols-3 gap-2 rounded-lg border bg-muted p-4">
                {mnemonic.split(' ').map((word, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{index + 1}.</span>
                    <span className="font-mono text-sm">{word}</span>
                  </div>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="absolute right-2 top-2"
                onClick={handleCopy}
              >
                {copied ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Additional Warnings */}
          <div className="space-y-4 rounded-lg bg-muted p-4">
            <h4 className="font-medium">Important Security Tips:</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Store these words in a secure location</li>
              <li>• Never store them digitally or take screenshots</li>
              <li>• Write them down on paper and store in multiple secure locations</li>
              <li>• Never share these words with anyone, including support staff</li>
            </ul>
          </div>

          {/* Confirmation Button */}
          <Button
            className="w-full"
            variant="destructive"
            onClick={() => onOpenChange(false)}
          >
            I Have Safely Stored My Recovery Phrase
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
