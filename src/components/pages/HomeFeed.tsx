import { useSuiClient } from '@mysten/dapp-kit'
import { useEnokiFlow } from '@mysten/enoki/react'
import { Transaction } from '@mysten/sui/transactions'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useLocation } from 'wouter'

import dummyImage from '../../assets/images/dummy.png'
import logo from '../../assets/images/logo.jpeg'
import { useSession } from '../../hooks/session'
import './homefeed.css'
import MainButton from './mainbutton.tsx'

// Import the MainButton component

type Post = {
  id: number
  address: string
  videoUrl: string
  upvotes: number
  upvoted?: boolean
}

export function HomeFeed() {
  const { session, refreshBalance, signOut } = useSession()
  const [, setLocation] = useLocation()
  const [posts, setPosts] = useState<Post[]>([])
  const enokiFlow = useEnokiFlow()
  const client = useSuiClient()

  const callPosts = async () => {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      withCredentials: true,
    }
    const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/feed`, config)
    setPosts(data)
  }

  useEffect(() => {
    if (!session) {
      setLocation('/login')
    }

    callPosts()
  }, [session?.address, setLocation])

  async function handleUpvote(postId: number) {
    const post = posts.find((post) => post.id === postId)!

    if (post.address === session?.address) {
      return
    }

    // Get the keypair for the current user.
    const keypair = await enokiFlow.getKeypair({ network: 'testnet' })

    const txb = new Transaction()
    const [coin] = txb.splitCoins(txb.gas, [10000000 * 5])
    txb.transferObjects([coin], post.address)

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

    await axios.post(`${import.meta.env.VITE_BACKEND_URL}/upvote/${post.id}`)

    setPosts(
      posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              upvoted: !post.upvoted,
              upvotes: post.upvoted ? post.upvotes - 1 : post.upvotes + 1,
            }
          : post,
      ),
    )
    await refreshBalance()
  }

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
    <>
      {posts && (
        <div className="home-feed">
          <header className="header">
            <div className="logo-container">
              <img src={logo} alt="Logo" className="logo" />
              <span className="network-name">Crystal Networks</span>
            </div>
            <div className="crystal-count">
              <div>
                {session && (
                  <span onClick={handleCopyClick} style={{ cursor: 'pointer' }}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{
                        height: '1rem',
                        marginRight: '0.1rem',
                        position: 'relative',
                        top: '0.1rem',
                      }}
                    >
                      <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
                      <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
                    </svg>
                    {session.address.slice(0, 6)}..{session.address.slice(-4)}
                  </span>
                )}
              </div>

              {session && session.balance !== null && (
                <span style={{ color: 'white' }}>
                  {bigintToStringWithDecimals(session.balance, 7, 1)} CRYSTAL
                </span>
              )}
            </div>
          </header>

          <div className="post-list">
            {posts.map((post) => (
              <div key={post.id} className="post">
                <div className="profile-info">
                  <img src={dummyImage} alt="Profile" className="profile-image" />
                  <div className="user-details">
                    <span className="profile-name">
                      {post.address.slice(0, 6)}..{post.address.slice(-4)}
                    </span>
                  </div>
                </div>
                <div className="post-image">
                  <video src={post.videoUrl} controls width="450px" height="350px" />
                </div>
                {/* <div className="post-content">
                  <p>{post.content}</p>
                </div> */}
                <div className="post-upvote">
                  <button
                    className={`upvote-button ${post.upvoted ? 'upvoted' : ''}`}
                    onClick={() => handleUpvote(post.id)}
                  >
                    <i className="material-icons">thumb_up</i> {/* Material Icon for upvote */}
                    <span className="upvote-icon"></span>
                    <span>{post.upvotes}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <nav className="bottom-nav">
            <button className="nav-button home">Home</button>
            <button className="nav-button search">Search</button>
            <MainButton /> {/* Use the MainButton component here */}
            <button className="nav-button causes">Causes</button>
            <button className="nav-button profile">Profile</button>
          </nav>
        </div>
      )}
    </>
  )
}

export function bigintToStringWithDecimals(bigint: BigInt, decimalPlaces: number, roundTo: number) {
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

  // Convert the fractional part to a number, round it, and convert back to string
  let fractionalNumber = parseFloat('0.' + fractionalPart)
  let roundedFractionalNumber = fractionalNumber.toFixed(roundTo)

  // Remove the "0." part from the rounded fractional number string
  let roundedFractionalPart = roundedFractionalNumber.slice(2)

  // Ensure the rounded fractional part has the correct number of digits
  if (roundedFractionalPart.length < roundTo) {
    roundedFractionalPart = roundedFractionalPart.padEnd(roundTo, '0')
  }

  // Combine the parts into the final string
  return `${integerPart}.${roundedFractionalPart}`
}
