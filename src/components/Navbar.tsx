
import React from 'react';
import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Calendar, Menu, X } from 'lucide-react';
import { useSearch } from '../SearchContext';
import '../styles/navbar.css';



function useLockBodyScroll(lock: boolean) {
  React.useEffect(() => {
    if (lock) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [lock]);
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const mobileSearchInputRef = useRef<HTMLInputElement>(null);

  useLockBodyScroll(menuOpen);
  const { searchText, setSearchText } = useSearch();

  useEffect( () => {
    if(mobileSearchOpen){
      mobileSearchInputRef.current?.focus();
    }
  },[mobileSearchOpen])

  const closeMobileSearch = () => {
    setMobileSearchOpen(false);
  };

  return (
    <header className="navbar">
      <div className="navbar-container container">
 
        {/* ── Logo — always visible, always left ── */}
        <div className="navbar-logo">
          <Link to="/">
            <img
              src="/vut.svg"
              alt="VUT logo"
              className="logo-placeholder"
              style={{ width: 60, height: 60, objectFit: 'contain', background: 'none' }}
            />
          </Link>
        </div>
 
        {/* ── Desktop nav links (fixed slide-out on mobile → no layout impact) ── */}
        {menuOpen && (
          <div className="navbar-overlay" onClick={() => setMenuOpen(false)} />
        )}
        <nav className={`navbar-links${menuOpen ? ' open' : ''}`}>
          <button
            className="navbar-close"
            aria-label="Zavřít menu"
            onClick={() => setMenuOpen(false)}
          >
            <X size={28} />
          </button>
          <Link to="/events" onClick={() => setMenuOpen(false)}>Akce</Link>
          <Link to="/my-events" onClick={() => setMenuOpen(false)}>Moje akce</Link>
          <Link to="/map" onClick={() => setMenuOpen(false)}>Mapa</Link>
        </nav>
 
        {/* Desktop*/}
        <div className="navbar-actions">
          <div className="search-bar">
            <Search size={22} />
            <input
              type="text"
              placeholder="Hledat..."
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
            />
          </div>
          <button className="icon-button">
            <Calendar size={22} />
          </button>
        </div>
 
        {/* Mobile */}
        <div className={`navbar-mobile-search${mobileSearchOpen ? ' active' : ''}`}>
          <Search size={22} className="mobile-search-icon" />
          <input
            ref={mobileSearchInputRef}
            type="text"
            placeholder="Hledat..."
            className="mobile-search-input"
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
          />
          <button
            className="mobile-search-close"
            aria-label="Zavřít vyhledávání"
            onClick={closeMobileSearch}
          >
            <X size={28} />
          </button>
        </div>
 
        {/* Mobile*/}
        <div className={`navbar-mobile-controls${mobileSearchOpen ? ' hidden' : ''}`}>
          <button
            className="icon-button"
            aria-label="Hledat"
            onClick={() => setMobileSearchOpen(true)}
          >
            <Search size={22} />
          </button>
          <button
            className="navbar-hamburger"
            aria-label="Otevřít menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <Menu size={28} />
          </button>
        </div>
 
      </div>
    </header>
  );
}