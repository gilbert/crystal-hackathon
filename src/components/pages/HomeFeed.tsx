import { useEffect, useState } from 'react'
import { useLocation } from 'wouter'

import dummyImage from '../../assets/images/dummy.png'
import logo from '../../assets/images/logo.jpeg'
import profileImage from '../../assets/images/pp.jpg'
import { useSession } from '../../hooks/session'
import './homefeed.css'
import MainButton from './mainbutton.tsx'

// Import the MainButton component

export function HomeFeed() {
  const { session, sessionReady, signOut } = useSession()
  const [, setLocation] = useLocation()
  const [posts, setPosts] = useState([
    {
      id: '100',
      title: 'Sam Deo',
      category: 'Cleanup at Consensus',
      content: 'Picked up Trask at Consensus 2024.',
      imageUrl: dummyImage,
      upvotes: 6,
      upvoted: false,
    },
    {
      id: '101',
      category: 'Alice Smith',
      title: 'Chris',
      content: 'Participated in a community cleanup drive at the local park.',
      imageUrl: dummyImage,
      upvotes: 10,
      upvoted: false,
    },
  ])

  useEffect(() => {
    if (sessionReady && !session) {
      setLocation('/login')
    }
  }, [sessionReady, setLocation])

  const handleUpvote = (postId: any) => {
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
    <div className="home-feed">
      <header className="header">
        <div className="logo-container">
          <img src={logo} alt="Logo" className="logo" />
          <div className="network-info">
            <span className="network-name">Crystal Networks</span>
          </div>
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
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
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

      {/* Tagline for the app */}
      {/* sEARCH BOX GOES HERE WITH TAGLINE AND SEARCH ICON */}
      <div className="search-bar">
        <input
          type="text"
          className="search-input"
          placeholder="Do for Community, Earn from Community!🙌"
        />
        <span className="material-icons search-icon">search</span>
      </div>

      <div className="post-list">
        {posts.map((post) => (
          <div key={post.id} className="post">
            <div className="post-header">
              <div className="profile-info">
                <img src={profileImage} alt="Profile" className="profile-image" />
                <div className="user-details">
                  <span className="title">{post.title}</span>
                  <span className="empty-space"></span>
                  <span className="category">{post.category.toLowerCase()}</span>
                </div>
              </div>
            </div>
            <div className="post-image">
              <img src={post.imageUrl} alt={post.title} />
            </div>
            <div className="post-content">
              <p>{post.content}</p>
            </div>
            <div className="post-footer">
              <div className="post-upvote">
                <button
                  className={`upvote-button ${post.upvoted ? 'upvoted' : ''}`}
                  onClick={() => handleUpvote(post.id)}
                >
                  <i className="material-icons">thumb_up</i>
                  <span className="upvote-icon"></span>
                  <span>{post.upvotes}</span>
                </button>
              </div>
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
  )
}

function bigintToStringWithDecimals(bigint: BigInt, decimalPlaces: number, roundTo: number) {
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
