import { Link } from 'react-router-dom';
import { Search, Calendar } from 'lucide-react';
import '../styles/navbar.css';

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-container container">
        <div className="navbar-logo">
          <Link to="/">
             <div className="logo-placeholder">T</div>
          </Link>
        </div>

        <nav className="navbar-links">
          <Link to="/events">Akce</Link>
          <Link to="/my-events">Moje akce</Link>
          <Link to="/map">Mapa</Link>
        </nav>

        <div className="navbar-actions">
          <div className="search-bar">
            <Search size={20} />
            <input type="text" placeholder="Hledat..." />
          </div>
          <button className="icon-button">
            <Calendar size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}