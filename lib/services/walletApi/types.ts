export interface CreateWalletRequest {
    walletExtendedPublicKey: string
    alias: string
  }
  
  export interface DepositInfo {
    id: string
    alias: string
    paymail: string
    base58Address: string
  }
  
  export interface Receiver {
    amount: number
    destination: string
    denominationCurrencyCode: string
  }
  
  export interface TransactionTemplateRequest {
    note: string
    receivers: Receiver[]
  }
  
  export interface RequiredSignature {
    derivationPath: string
    signatureHash: string
    inputIndex: number
  }
  
  export interface TransactionTemplate {
    unsignedTransactionTemplateId: string
    requiredSignatures: RequiredSignature[]
  }
  
  export interface Signature {
    inputIndex: number
    publicKey: string
    signature: string
  }
  
  export interface ConfirmTransactionRequest {
    unsignedTransactionTemplateId: string
    signatures: Signature[]
  }
  
  export interface CurrencyData {
    code: string
    name: string
    symbol: string
  }
  
  export interface TransactionParticipant {
    type: string
    user: string
    profilePictureUrl: string
    displayName: string
    amount: number
    instrumentId: string
    instrumentQuantity: number
    tags: string[]
  }
  
  export interface Attachment {
    value: string
    format: string
  }
  
  export interface TransactionResult {
    transactionId: string
    note: string
    type: string
    time: number
    units: number
    satoshiFees: number
    fiatEquivalent: {
      currencyCode: string
      units: number
    }
    currency: CurrencyData
    participants: TransactionParticipant[]
    attachments: Attachment[]
    app: {
      name: string
      iconUrl: string
    }
    item?: {
      imageUrl: string
      name: string
      collectionName: string
      origin: string
      groupingValue: string
    }
  }
  
  export interface Balance {
    currency: {
      code: string
      logoUrl: string
      symbol: string
    }
    units: number
    fiatEquivalent: {
      currencyCode: string
      units: number
    }
  }
  
  export interface Balances {
    items: Balance[]
  }
  
  export interface TransactionsList {
    from: number
    to: number
    items: TransactionResult[]
  }
  
  export interface ApiError {
    message: string
    details?: Record<string, unknown>
  }