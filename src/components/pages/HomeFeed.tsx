import { useEffect } from 'react'
import { useLocation } from 'wouter'

import { useSession } from '../../hooks/session'

export function HomeFeed() {
  const session = useSession()
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
    if (!session.user) {
      setLocation('/login')
    }
  })

  return (
    <div>
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
            session.signOut()
            setLocation('/login')
          }}
        >
          Sign Out
        </button>
      </div>
    </div>
  )
}
