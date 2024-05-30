import { useEnokiFlow } from '@mysten/enoki/react'
import { useEffect } from 'react'
import { useLocation } from 'wouter'

import { useSession } from '../../hooks/session'

export function Authn() {
  const { session } = useSession()
  const [, setLocation] = useLocation()
  const enokiFlow = useEnokiFlow()

  useEffect(() => {
    if (session) {
      setLocation('/')
    }
  }, [session])

  async function login() {
    const googleSignInUrl = await enokiFlow.createAuthorizationURL({
      provider: 'google',
      clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      redirectUrl: window.location.href.split('#')[0],
      network: 'testnet',
    })
    // Redirect the browser to the google sign-in URL:
    window.location.href = googleSignInUrl
  }

  async function completeLogin() {
    try {
      await enokiFlow.handleAuthCallback()
    } catch (error) {
      console.error('Erro handling auth callback', error)
    } finally {
      // Fetch the session
      const session = await enokiFlow.getSession()
      console.log('Session', session)

      // remove the URL fragment
      window.history.replaceState(null, '', window.location.pathname)
    }
  }

  useEffect(() => {
    completeLogin()
  }, [])

  return (
    <div>
      <h1>Authn</h1>
      <button onClick={login}>Login</button>
    </div>
  )
}
