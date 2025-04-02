import { NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import { WalletApi } from '@/lib/services/walletApi/walletApi'

const XPUB_COOKIE = 'xpub'

export async function GET(request: NextRequest) {
  try {
    const walletExtendedPublicKey = request.nextUrl.searchParams.get('walletExtendedPublicKey')

    // Validate the xpub format (basic check)
    if (!walletExtendedPublicKey || !walletExtendedPublicKey.startsWith('xpub')) {
      return Response.json(
        { error: 'Invalid wallet extended public key' },
        { status: 401 }
      )
    }

    const walletApi = new WalletApi({
      appId: process.env.WALLET_API_ID as string,
      appSecret: process.env.WALLET_API_SECRET as string,
      walletXpub: walletExtendedPublicKey,
    });

    await walletApi.getDepositInfo();
    cookies().set(XPUB_COOKIE, walletExtendedPublicKey, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    })

    return Response.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: 'Invalid request' },
      { status: 400 }
    )
  }
} 