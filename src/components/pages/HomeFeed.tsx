import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import dummyImage from '../../assets/images/dummy.png';
import logo from '../../assets/images/logo.jpeg';
import profileImage from '../../assets/images/pp.jpg';
import { useSession } from '../../hooks/session';
import './homefeed.css';
import MainButton from './mainbutton.tsx'; // Import the MainButton component

export function HomeFeed() {
  const session = useSession();
  const [, setLocation] = useLocation();
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
    }
  ]);

  useEffect(() => {
    if (!session.user) {
      setLocation('/login');
    }
  }, [session.user, setLocation]);

  const handleUpvote = (postId) => {
    setPosts(posts.map(post => 
      post.id === postId ? { ...post, upvoted: !post.upvoted, upvotes: post.upvoted ? post.upvotes - 1 : post.upvotes + 1 } : post
    ));
  };

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
      <span>70 Crystals</span>
    </div>
  </header>

      {/* Tagline for the app */}
      {/* sEARCH BOX GOES HERE WITH TAGLINE AND SEARCH ICON */}
      <div className="search-bar">
  <input type="text" className="search-input" placeholder="Do for Community, Earn from Community!🙌" />
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
          <button className={`upvote-button ${post.upvoted ? 'upvoted' : ''}`} onClick={() => handleUpvote(post.id)}>
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
  );
}

export default HomeFeed;
