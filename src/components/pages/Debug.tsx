import { useSuiClient } from '@mysten/dapp-kit'
import { useEnokiFlow } from '@mysten/enoki/react'
import { Transaction } from '@mysten/sui/transactions'
import { useEffect, useState } from 'react'
import { useLocation } from 'wouter'

import { useSession } from '../../hooks/session'

export function Debug() {
  const client = useSuiClient()
  const enokiFlow = useEnokiFlow()

  const { session, sessionReady, signOut } = useSession()
  const [, setLocation] = useLocation()
  // const [sendTo, setSendTo] = useState('')
  const [sendTo, setSendTo] = useState(
    '0xf4b3eff2571e1bf058493d59aa053fcf0db023e7e23cd24b7eb0235279ac9364',
  )

  useEffect(() => {
    if (sessionReady && !session) {
      setLocation('/login')
    }
  }, [sessionReady])

  async function handleCopyClick() {
    if (!session) return
    const textarea = document.createElement('textarea')
    textarea.value = session.address
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
    alert('Address copied to clipboard!')
  }

  async function sendSui() {
    // Get the keypair for the current user.
    const keypair = await enokiFlow.getKeypair({ network: 'testnet' })

    const txb = new Transaction()
    const [coin] = txb.splitCoins(txb.gas, [10000000])
    txb.transferObjects([coin], sendTo)

    try {
      // Sign and execute the transaction block, using the Enoki keypair
      console.log('Sending sui...')
      const res = await client.signAndExecuteTransaction({
        signer: keypair,
        transaction: txb,
      })
      console.log('Done', res)
    } catch (err) {
      console.log('Failed', err)
    }
  }

  return (
    <div>
      <div>
        <div>
          <h2>
            Logged in as{' '}
            {session && (
              <span onClick={handleCopyClick} style={{ cursor: 'pointer' }}>
                {session.address.slice(0, 6)}..{session.address.slice(-4)}
              </span>
            )}
          </h2>
        </div>
      </div>
      <h1>Debug</h1>
      <div>
        <input
          type="text"
          value={sendTo}
          onInput={(e) => {
            let addr = e.currentTarget.value
            addr = addr.replace(/[^a-fA-F0-9]/g, '')
            if (addr.match(/^[a-fA-F0-9]+$/)) {
              setSendTo('0x' + e.currentTarget.value)
            } else {
              setSendTo('Invalid address')
            }
          }}
        />
        <button
          onClick={() => {
            sendSui()
          }}
        >
          Send 0.01 SUI
        </button>
      </div>
      <div style={{ marginTop: '2rem' }}>
        <button
          onClick={() => {
            signOut()
            setLocation('/login')
          }}
        >
          Sign Out
        </button>
      </div>
    </div>
  )
}
