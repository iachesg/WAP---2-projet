import React from 'react';
import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Calendar, Menu, X } from 'lucide-react';
import { useSearch } from '../SearchContext';
import CalendarComponent from './CalendarComponent';
import type { AppEvent } from '../App';
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

interface NavbarProps {
  events: AppEvent[];
}

export default function Navbar({ events }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calendarMobileOpen, setCalendarMobileOpen] = useState(false);
  const mobileSearchInputRef = useRef<HTMLInputElement>(null);
  const calendarDropdownRef = useRef<HTMLDivElement>(null); // desktop
  const calendarMobileDropdownRef = useRef<HTMLDivElement>(null); // mobile

  useLockBodyScroll(menuOpen);
  const { searchText, setSearchText } = useSearch();

    const closeMobileSearch = () => {
      setMobileSearchOpen(false);
    };
  useEffect( () => {
    if(mobileSearchOpen){
      mobileSearchInputRef.current?.focus();
    }
  },[mobileSearchOpen])

  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        calendarDropdownRef.current &&
        !calendarDropdownRef.current.contains(event.target as Node)
      ) {
        setCalendarOpen(false);
      }
    };
    if (calendarOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [calendarOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        calendarMobileDropdownRef.current &&
        !calendarMobileDropdownRef.current.contains(event.target as Node)
      ) {
        setCalendarMobileOpen(false);
      }
    };
    if (calendarMobileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [calendarMobileOpen]);

  const closeBothCalendars = () => {
    setCalendarOpen(false);
    setCalendarMobileOpen(false);
  };

  return (
    <header className="navbar">
      <div className="navbar-container container">
 
        {/* Logo */}
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
 
        {/* Desktop nav links */}
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
          <div ref={calendarDropdownRef} className="calendar-dropdown-wrapper">
            <button 
              className="icon-button" 
              aria-label="Kalendář"
              onClick={() => setCalendarOpen(!calendarOpen)}
              title="Kalendář uložených akcí"
            >
              <Calendar size={22} />
            </button>
            {calendarOpen && (
              <div className="calendar-dropdown">
                <CalendarComponent events={events} onNavigate={closeBothCalendars} />
              </div>
            )}
          </div>
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
          <div ref={calendarMobileDropdownRef} className="calendar-mobile-wrapper">
            <button
              className="icon-button"
              aria-label="Kalendář"
              onClick={() => setCalendarMobileOpen(!calendarMobileOpen)}
              title="Kalendář uložených akcí"
            >
              <Calendar size={22} />
            </button>
            {calendarMobileOpen && (
              <div className="calendar-dropdown-mobile">
                <CalendarComponent events={events} onNavigate={closeBothCalendars} />
              </div>
            )}
          </div>
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