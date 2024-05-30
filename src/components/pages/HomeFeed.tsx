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
