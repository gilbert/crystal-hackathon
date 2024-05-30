import { useState } from 'react'

type User = {
  address: string
}
let _user: User | null = localStorage.getItem('user')
  ? JSON.parse(localStorage.getItem('user')!)
  : null

export function useSession() {
  const [user, setUser] = useState<User | null>(_user)
  const session = {
    user,
    signIn(address: string) {
      _user = { address }
      setUser(_user)
      localStorage.setItem('user', JSON.stringify(_user))
      session.user = user
    },
    signOut() {
      _user = null
      setUser(null)
      localStorage.removeItem('user')
    },
  }
  return session
}
