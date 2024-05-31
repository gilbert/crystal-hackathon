import { useEnokiFlow } from '@mysten/enoki/react'
import { useStore } from '@nanostores/react'

export function useSession() {
  const enokiFlow = useEnokiFlow()
  const user = useStore(enokiFlow.$zkLoginState)
  const session = useStore(enokiFlow.$zkLoginSession)
  const sessionHandle = {
    sessionReady: session.initialized,
    session:
      user.address && session.value
        ? {
            ...session.value,
            address: user.address,
          }
        : null,
    signOut() {
      enokiFlow.logout()
    },
  }
  return sessionHandle
}
