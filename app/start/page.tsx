'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { createWallet, importWallet, WalletClient } from "@/lib/services/wallet/walletClient"
import { useToast } from "@/hooks/use-toast"
import { createAccount, validateAccount } from "@/app/actions/wallet/createAccount"

export default function StartPage() {
  const [showImport, setShowImport] = useState(false)
  const [mnemonic, setMnemonic] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleCreateWallet = async () => {
    try {
      setIsLoading(true)
      // Create wallet locally
      const wallet = createWallet()
      const xpub = wallet.getWalletExtendedPublicKey()

      // Create account on server
      const result = await createAccount(xpub)
      if (!result.success) {
        throw new Error(result.error)
      }

      // Store mnemonic and redirect
      localStorage.setItem('wallet_mnemonic', wallet.getMnemonic())
      router.push('/')
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error creating wallet",
        description: error instanceof Error ? error.message : "An unexpected error occurred"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleImportWallet = async () => {
    try {
      setIsLoading(true)
      if (!WalletClient.validateMnemonic(mnemonic)) {
        throw new Error('Invalid mnemonic phrase')
      }

      // Import wallet locally
      const wallet = importWallet(mnemonic)
      const xpub = wallet.getWalletExtendedPublicKey()

      // Create account on server
      const result = await validateAccount(xpub)
      if (!result.success) {
        throw new Error(result.error)
      }

      // Store mnemonic and redirect
      localStorage.setItem('wallet_mnemonic', mnemonic)
      router.push('/')
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Invalid mnemonic",
        description: error instanceof Error ? error.message : "Please check your recovery phrase and try again"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Welcome to Your Wallet</CardTitle>
          <CardDescription>
            Create a new wallet or import an existing one
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!showImport ? (
            <>
              <Button 
                className="w-full" 
                size="lg"
                onClick={handleCreateWallet}
                disabled={isLoading}
              >
                {isLoading ? "Creating..." : "Create New Wallet"}
              </Button>
              <Button 
                className="w-full" 
                variant="outline" 
                size="lg"
                onClick={() => setShowImport(true)}
              >
                Import Existing Wallet
              </Button>
            </>
          ) : (
            <div className="space-y-4">
              <Input
                placeholder="Enter your 12-word recovery phrase"
                value={mnemonic}
                onChange={(e) => setMnemonic(e.target.value)}
              />
              <div className="flex gap-2">
                <Button 
                  className="flex-1"
                  onClick={handleImportWallet}
                  disabled={isLoading}
                >
                  {isLoading ? "Importing..." : "Import"}
                </Button>
                <Button 
                  className="flex-1"
                  variant="outline"
                  onClick={() => setShowImport(false)}
                >
                  Back
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 