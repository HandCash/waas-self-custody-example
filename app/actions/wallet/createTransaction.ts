'use server'

import { getWalletApi } from "@/lib/serviceFactory"
import { Signature } from "@/lib/services/walletApi/types"

interface SendMoneyParams {
  amount: number
  receiver: string
  note: string
  denominationCurrencyCode: string
}
interface TransactionTemplateResult {
  success: boolean;
  data?: {
    unsignedTransactionTemplateId: string;
    requiredSignatures: {
      derivationPath: string;
      signatureHash: string;
      inputIndex: number;
    }[];
  };
  error?: string;
}

interface ConfirmTransactionResult {
  success: boolean;
  data?: any;
  error?: string;
}

export async function getTransactionTemplate({
  amount,
  receiver,
  note,
  denominationCurrencyCode
}: SendMoneyParams): Promise<TransactionTemplateResult> {
  try {
    const walletApi = getWalletApi()
    const template = await walletApi.getTransactionTemplate({
      note,
      receivers: [{
        amount,
        destination: receiver,
        denominationCurrencyCode
      }]
    })
    return { success: true, data: template }
  } catch (error) {
    console.error('Get transaction template error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get transaction template'
    }
  }
}

export async function confirmTransaction(
  unsignedTransactionTemplateId: string,
  signatures: Signature[],
): Promise<ConfirmTransactionResult> {
  try {
    const walletApi = getWalletApi()
    const result = await walletApi.confirmTransaction({
      unsignedTransactionTemplateId,
      signatures
    })
    return { success: true, data: result }
  } catch (error) {
    console.error('Confirm transaction error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to confirm transaction'
    }
  }
}