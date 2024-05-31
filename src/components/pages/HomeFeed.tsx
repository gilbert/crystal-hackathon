import { useEffect } from 'react'
import { useLocation } from 'wouter'

import { useSession } from '../../hooks/session'

export function HomeFeed() {
  const { session, sessionReady, signOut } = useSession()
  const [, setLocation] = useLocation()
  let data = [
    {
      id: '100',
      title: 'First Post',
      content: 'This is the first post',
    },
    {
      id: '200',
      title: 'Second Post',
      content: 'This is the second post',
    },
  ]

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
            {session && session.balance !== null && (
              <span>
                <br />
                Balance: {bigintToStringWithDecimals(session.balance, 7)} CRYSTAL
              </span>
            )}
          </h2>
        </div>
      </div>
      <h1>Home</h1>
      <div className="CauseList">
        {data.map((post) => (
          <div key={post.id} className="Cause">
            <h2>{post.title}</h2>
            <p>{post.content}</p>
          </div>
        ))}
      </div>
      <div>
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

function bigintToStringWithDecimals(bigint: BigInt, decimalPlaces: number) {
  // Convert the BigInt to a string
  let bigintStr = bigint.toString()

  // Ensure the bigintStr has at least decimalPlaces + 1 digits to handle decimal conversion properly
  if (bigintStr.length <= decimalPlaces) {
    bigintStr = bigintStr.padStart(decimalPlaces + 1, '0')
  }

  // Get the part before the decimal point
  let integerPart = bigintStr.slice(0, -decimalPlaces)

  // Get the fractional part (last decimalPlaces digits)
  let fractionalPart = bigintStr.slice(-decimalPlaces)

  // Handle the case where the integer part is empty (i.e., the number is less than 10^decimalPlaces)
  if (integerPart === '') {
    integerPart = '0'
  }

  // Combine the parts into the final string
  return `${integerPart}.${fractionalPart}`
}
