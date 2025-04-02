// Types based on OpenAPI schema definitions

import { ApiError, Balances, ConfirmTransactionRequest, CreateWalletRequest, DepositInfo, TransactionResult, TransactionsList, TransactionTemplate, TransactionTemplateRequest } from "./types";

// Base API configuration
const API_BASE_URL = 'http://localhost:3000/v1/waas'

// Helper function to handle API responses
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error: ApiError = await response.json()
    throw new Error(error.message)
  }
  return response.json()
}

// API class implementation
export class WalletApi {
  private headers: Record<string, string>;

  constructor({appId, appSecret, walletXpub}: {appId: string; appSecret: string; walletXpub?: string}) {
    this.headers = {
      'app-id': appId,
      'app-secret': appSecret,
      ...(walletXpub && { 'wallet-xpub': walletXpub })
    }
  }

  async createWallet(request: CreateWalletRequest): Promise<DepositInfo> {
    const response = await fetch(`${API_BASE_URL}/account/selfCustodial`, {
      method: 'POST',
      headers: {
        ...this.headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(request)
    })
    return handleResponse<DepositInfo>(response)
  }

  async getTransactionTemplate(request: TransactionTemplateRequest): Promise<TransactionTemplate> {
    const response = await fetch(`${API_BASE_URL}/wallet/pay/template`, {
      method: 'POST',
      headers: {
        ...this.headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(request)
    })
    return handleResponse<TransactionTemplate>(response)
  }

  async confirmTransaction(request: ConfirmTransactionRequest): Promise<TransactionResult> {
    const response = await fetch(`${API_BASE_URL}/wallet/pay/broadcast`, {
      method: 'POST',
      headers: {
        ...this.headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(request)
    })
    return handleResponse<TransactionResult>(response)
  }

  async getDepositInfo(): Promise<DepositInfo> {
    const response = await fetch(`${API_BASE_URL}/wallet/depositInfo`, {
      headers: this.headers
    })
    return handleResponse<DepositInfo>(response)
  }

  async getBalances(): Promise<Balances> {
    const response = await fetch(`${API_BASE_URL}/wallet/balances`, {
      headers: this.headers
    })
    return handleResponse<Balances>(response)
  }

  async getTransactions(): Promise<TransactionsList> {
    const response = await fetch(`${API_BASE_URL}/wallet/transactions`, {
      headers: this.headers
    })
    return handleResponse<TransactionsList>(response)
  }
}
