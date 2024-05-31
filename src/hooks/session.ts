import { useSuiClient } from '@mysten/dapp-kit'
import { useEnokiFlow } from '@mysten/enoki/react'
import { useStore } from '@nanostores/react'
import { useEffect, useState } from 'react'

export function useSession() {
  const enokiFlow = useEnokiFlow()
  const userStore = useStore(enokiFlow.$zkLoginState)
  const sessionStore = useStore(enokiFlow.$zkLoginSession)

  const [balance, setBalance] = useState<BigInt | null>(null)

  const session =
    userStore.address && sessionStore.value
      ? {
          ...sessionStore.value,
          address: userStore.address,
          balance,
        }
      : null

  const client = useSuiClient()

  useEffect(() => {
    if (session) {
      client.getBalance({ owner: session.address }).then((balance) => {
        // console.log('BALANCE', balance.totalBalance)
        setBalance(BigInt(balance.totalBalance))
      })
    }
  }, [session?.address])

  const sessionHandle = {
    sessionReady: sessionStore.initialized,
    session,
    signOut() {
      enokiFlow.logout()
    },
    async refreshBalance() {
      await client.getBalance({ owner: session!.address }).then((balance) => {
        // console.log('BALANCE', balance.totalBalance)
        setBalance(BigInt(balance.totalBalance))
      })
    },
  }
  return sessionHandle
}
