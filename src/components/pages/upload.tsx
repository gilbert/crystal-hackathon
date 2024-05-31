import { useEffect, useState } from 'react'
import { Link } from 'wouter';
import './upload.css';
export function Upload() {
  return (
    <div className="upload">
      <h1 className="title">Select a Cause</h1>
      <div className="button-container">
        <Link to="/record/p"  className="cause_button">Plant a Tree</Link>
        <Link to="/record/d" className="cause_button">Do 20 squats</Link>
      </div>
    </div>
  )
}
