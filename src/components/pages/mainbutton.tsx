// MainButton.jsx
import { Link } from 'wouter';
import './mainbutton.css';

function MainButton({ onClick }) {
  return (
    <Link to='/upload'><button className="main-button" onClick={onClick}>+</button></Link>
  );
}

export default MainButton;
