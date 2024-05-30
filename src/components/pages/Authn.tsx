// import { useSuiClient } from '@mysten/dapp-kit';
// import { useEnokiFlow } from '@mysten/enoki/react';
// import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
// import { generateNonce, generateRandomness } from '@mysten/zklogin';
import { useLocation } from 'wouter'

import { useSession } from '../../hooks/session'

export function Authn() {
  const session = useSession()
  const [, setLocation] = useLocation()
  // const client = useSuiClient()
  // const enokiFlow = useEnokiFlow()

  async function login() {
    session.signIn('0x1234')
    setLocation('/')
    // const googleSignInUrl = await enokiFlow.createAuthorizationURL({
    //   provider: 'google',
    //   clientId: 'your-client-id',
    //   redirectUrl: 'your-redirect-url',
    // });
    // // Redirect the browser to the google sign-in URL:
    // window.location.href = googleSignInUrl;
  }

  return (
    <div>
      <h1>Authn</h1>
      <button onClick={login}>Login</button>
    </div>
  )
}
