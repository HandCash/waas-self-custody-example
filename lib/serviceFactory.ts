import { WalletApi } from "./services/walletApi/walletApi";
import { cookies } from 'next/headers';

export function getWalletApi(xpub?: string) {
  const walletXpub = xpub ?? cookies().get('xpub')?.value;
  return new WalletApi({
    appId: process.env.WALLET_API_ID as string,
    appSecret: process.env.WALLET_API_SECRET as string,
    walletXpub: walletXpub,
  });
}

