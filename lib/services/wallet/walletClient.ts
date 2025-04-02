'use client'

import { HD, Mnemonic, ECDSA, BigNumber } from '@bsv/sdk'
import { RequiredSignature, Signature } from '../walletApi/types'

export class WalletClient {
  private hdPrivateKey: HD
  private mnemonic: string

  private constructor(hdPrivateKey: HD, mnemonic: string) {
    this.hdPrivateKey = hdPrivateKey
    this.mnemonic = mnemonic
  }

  static createNew(): WalletClient {
    const mnemonic = Mnemonic.fromRandom()
    const hdPrivateKey = HD.fromSeed(mnemonic.toSeed())
    return new WalletClient(hdPrivateKey, mnemonic.toString())
  }

  static fromMnemonic(mnemonicString: string): WalletClient {
    if (!WalletClient.validateMnemonic(mnemonicString)) {
      throw new Error('Invalid mnemonic')
    }
    const mnemonic = Mnemonic.fromString(mnemonicString)
    const hdPrivateKey = HD.fromSeed(mnemonic.toSeed())
    return new WalletClient(hdPrivateKey, mnemonicString)
  }

  static validateMnemonic(mnemonic: string): boolean {
    try {
      return Mnemonic.isValid(mnemonic)
    } catch {
      return false
    }
  }

  getWalletExtendedPublicKey(): string {
    return this.hdPrivateKey.toPublic().toString()
  };

  sign(requiredSignatures: RequiredSignature[]): Signature[] {
    return requiredSignatures.map(({ derivationPath, signatureHash, inputIndex }) => {
      // Derive the private key for this path
      const childPrivateKey = this.hdPrivateKey.derive(derivationPath)
      const privateKey = childPrivateKey.privKey;

      // Create signature
      const signature = ECDSA.sign(
        new BigNumber(signatureHash, 'hex', 'le'),
        privateKey,
      );

      // Get public key
      const publicKey = privateKey.toPublicKey()

      return {
        inputIndex,
        publicKey: publicKey.toDER('hex').toString(),
        signature: signature.toDER('hex').toString(),
      }
    });
  }

  getMnemonic(): string {
    return this.mnemonic
  }

  getXpub(): string {
    return this.hdPrivateKey.toPublic().toString()
  }
}

// Create a singleton instance for the client-side wallet
let walletInstance: WalletClient | null = null

export function getWallet(): WalletClient | null {
  return walletInstance
}

export function createWallet(): WalletClient {
  walletInstance = WalletClient.createNew()
  return walletInstance
}

export function importWallet(mnemonic: string): WalletClient {
  walletInstance = WalletClient.fromMnemonic(mnemonic)
  return walletInstance
}

export function clearWallet(): void {
  walletInstance = null
} 