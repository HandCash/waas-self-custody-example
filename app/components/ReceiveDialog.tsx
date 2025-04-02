'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Download, Copy, Check } from "lucide-react"
import { useState } from "react"
import QRCode from "react-qr-code"
import { useRouter } from "next/navigation"

interface ReceiveDialogProps {
  depositInfo: {
    id: string
    alias: string
    paymail: string
    base58Address: string
  }
}

export function ReceiveDialog({ depositInfo }: ReceiveDialogProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter();
  const copyToClipboard = async (text: string, field: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const CopyButton = ({ text, field }: { text: string, field: string }) => (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => copyToClipboard(text, field)}
    >
      {copiedField === field ? (
        <Check className="h-4 w-4" />
      ) : (
        <Copy className="h-4 w-4" />
      )}
    </Button>
  )

  const onOpenChange = (open: boolean) => {
    if (!open) {
      router.refresh()
    }
    setIsOpen(open)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex-1">
          <Download className="mr-2 h-4 w-4" /> Receive
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Receive Funds</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="identifiers" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="identifiers">Identifiers</TabsTrigger>
            <TabsTrigger value="address">Address</TabsTrigger>
          </TabsList>
          <TabsContent value="identifiers" className="space-y-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Account ID</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    readOnly
                    value={depositInfo.id}
                    className="flex-1"
                  />
                  <CopyButton text={depositInfo.id} field="id" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Alias</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    readOnly
                    value={depositInfo.alias}
                    className="flex-1"
                  />
                  <CopyButton text={depositInfo.alias} field="alias" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Paymail</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    readOnly
                    value={depositInfo.paymail}
                    className="flex-1"
                  />
                  <CopyButton text={depositInfo.paymail} field="paymail" />
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="address" className="space-y-6">
            <div className="space-y-2">
              <Label>Bitcoin Address</Label>
              <div className="flex items-center space-x-2">
                <Input
                  readOnly
                  value={depositInfo.base58Address}
                  className="flex-1"
                />
                <CopyButton text={depositInfo.base58Address} field="address" />
              </div>
            </div>
            <div className="flex justify-center p-4 bg-white rounded-lg">
              <QRCode
                value={depositInfo.base58Address}
                size={200}
                level="H"
              />
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
} 