'use server'

import { getWalletApi } from "@/lib/serviceFactory"
import moment from "moment"
import { cookies } from "next/headers"

interface CreateAccountResult {
  success: boolean
  error?: string
}

export async function createAccount(walletExtendedPublicKey: string): Promise<CreateAccountResult> {
  try {
    const walletApi = getWalletApi(walletExtendedPublicKey)

    await walletApi.createWallet({
      walletExtendedPublicKey,
      alias: `wallet_${new Date().getTime().toString().slice(6)}`
    })

    cookies().set('xpub', walletExtendedPublicKey)

    return { success: true }
  } catch (error) {
    console.error('Create account error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create account'
    }
  }
} 

export async function validateAccount(walletExtendedPublicKey: string): Promise<CreateAccountResult> {
  try {
    const walletApi = getWalletApi(walletExtendedPublicKey)

    await walletApi.getDepositInfo();
    cookies().set('xpub', walletExtendedPublicKey)

    return { success: true }
  } catch (error) {
    console.error('Validate account error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to validate account'
    }
  }
} 