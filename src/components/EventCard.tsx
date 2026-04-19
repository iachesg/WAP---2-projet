import { Bookmark, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { AppEvent } from '../App';
import '../styles/eventCard.css';

interface EventCardProps {
  event: AppEvent;
  toggleSaved: (id: number) => void;
}

export default function EventCard({ event, toggleSaved }: EventCardProps) {

  function handleSavedClick(e: React.MouseEvent) {
    e.preventDefault(); // Zabrání přechodu na odkaz
    toggleSaved(event.id);
  };

  return (
    <article className="event-card">
      <Link to={`/event/${event.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <div className="event-image-container">
          <img src={event.imageUrl} alt={event.title} className="event-image" />
          <div className="event-actions">
            <button className={`action-btn ${event.isSaved ? 'active' : ''}`} onClick={handleSavedClick}>
              <Bookmark size={16} color={event.isSaved ? "var(--accent-color)" : "currentColor"} />
            </button>
            <button className="action-btn">
              <Share2 size={16} />
            </button>
          </div>
        </div>
        <div className="skeleton-content">
          <div className="skeleton-title" style={{ background: 'none', color: 'var(--text-color)', height: 'auto', width: 'auto', fontWeight: 600, fontSize: '1.1rem', padding: 0 }}>{event.title}</div>
           <div className="skeleton-date" style={{ background: 'none', color: '#666', height: 'auto', width: 'auto', fontSize: '0.9rem', padding: 0 }}>{event.dateFrom}</div>
          <div className="skeleton-description" style={{ background: 'none', color: '#666', height: 'auto', width: 'auto', fontSize: '0.95rem', padding: 0 }}>{event.description}</div>
          <div className="skeleton-footer" style={{ background: 'none', color: 'var(--accent-color)', height: 'auto', width: 'auto', fontSize: '0.85rem', padding: 0 }}>{event.categories}</div>
        </div>
      </Link>
    </article>
  );
}