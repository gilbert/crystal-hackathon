import axios from 'axios'
import { useEffect, useState } from 'react'
import { useLocation } from 'wouter'

import dummyImage from '../../assets/images/dummy.png'
import logo from '../../assets/images/logo.jpeg'
import { useSession } from '../../hooks/session'
import './homefeed.css'
import MainButton from './mainbutton.tsx'

// Import the MainButton component

export function HomeFeed() {
  const session = useSession()
  const [, setLocation] = useLocation()
  const [posts, setPosts] = useState([])

  const callPosts = async () => {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      withCredentials: true,
    }
    const {data} = await axios.get('http://localhost:3000/feed', config)
    setPosts(data)
  }

  console.log(posts)

  useEffect(() => {
    if (!session.user) {
      setLocation('/login')
    }

    callPosts()
  }, [session.user, setLocation])

  const handleUpvote = (postId) => {
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
              <span>7</span>
            </div>
          </header>

          <div className="search-bar">
            <input type="text" placeholder="Search" />
          </div>

          <div className="post-list">
            {posts.map((post) => (
              <div key={post.id} className="post">
                <div className="profile-info">
                  <img src={dummyImage} alt="Profile" className="profile-image" />
                  <div className="user-details">
                    <span className="profile-name">{post.address}</span>
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
