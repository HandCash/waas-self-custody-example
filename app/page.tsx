import Wallet from "@/app/components/Wallet";
import { cookies } from "next/headers";
import { getWalletApi } from "@/lib/serviceFactory";
import { redirect } from "next/navigation";

export default async function Page() {
  if (!cookies().has('xpub')) {
    return redirect('/start')
  }

  const walletApi = getWalletApi();
  const [transactions, balances, depositInfo] = await Promise.all([
    walletApi.getTransactions(),
    walletApi.getBalances(),
    walletApi.getDepositInfo()
  ]);

  return (
    <Wallet 
      transactions={transactions.items} 
      balance={balances.items[1]}
      depositInfo={depositInfo}
    />
  )
}
