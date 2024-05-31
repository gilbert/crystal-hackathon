// import React from 'react';
import { Link } from 'wouter';
import CleanCommunity from '../../assets/images/clean.jpeg';
import PromoteFitness from '../../assets/images/fitness.jpeg';
import plantImage from '../../assets/images/plant.jpeg';

import logo from '../../assets/images/logo.jpeg';
import MainButton from './mainbutton'; // Ensure the path is correct
import './upload.css';

export function Upload() {
  return (
    <div className="upload">
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

      <h1 className="cause">Select a Cause</h1>
      <div className="image-container">
        <Link to="/record/p">
          <div className="image-overlay">
            <img src={plantImage} alt="Plant a Tree" className="cause_image" />
            <div className="overlay-text">Plant a Tree</div>
          </div>
        </Link>
        <Link to="/record/d">
          <div className="image-overlay">
            <img src={CleanCommunity} alt="Clean Community" className="cause_image" />
            <div className="overlay-text">Clean your Community</div>
          </div>
        </Link>
        <Link to="/record/f">
          <div className="image-overlay">
            <img src={PromoteFitness} alt="Promote Fitness" className="cause_image" />
            <div className="overlay-text">Promote Fitness</div>
          </div>
        </Link>
      </div>

      <nav className="bottom-nav">
        <button className="nav-button home">Home</button>
        <button className="nav-button search">Search</button>
        <MainButton />
        <button className="nav-button causes">Causes</button>
        <button className="nav-button profile">Profile</button>
      </nav>
    </div>
  );
}
