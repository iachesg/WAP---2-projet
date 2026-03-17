import { useState } from 'react';
import EventCard from '../components/EventCard';
import { mockEvents } from '../data/mockEvents';
import '../styles/myEvents.css';

type TabType = 'saved' | 'favorite' | 'past';

export default function MyEvents() {
  const [activeTab, setActiveTab] = useState<TabType>('saved');

  const getFilteredEvents = () => {
    switch (activeTab) {
      case 'saved':
        return mockEvents.filter(event => event.isSaved);
      case 'favorite':
        return mockEvents.filter(event => event.isFavorite);
      case 'past':
        return []; 
      default:
        return mockEvents;
    }
  };

  const displayedEvents = getFilteredEvents();

  return (
    <div className="container page-container">
      <div className="tabs-container">
        <button 
          className={`tab-button ${activeTab === 'saved' ? 'active' : ''}`}
          onClick={() => setActiveTab('saved')}
        >
          Uložené akce
        </button>
        <button 
          className={`tab-button ${activeTab === 'favorite' ? 'active' : ''}`}
          onClick={() => setActiveTab('favorite')}
        >
          Oblíbené akce
        </button>
        <button 
          className={`tab-button ${activeTab === 'past' ? 'active' : ''}`}
          onClick={() => setActiveTab('past')}
        >
          Proběhlé
        </button>
      </div>

      <h2 className="section-title">
        {activeTab === 'saved' && 'Uložené akce'}
        {activeTab === 'favorite' && 'Oblíbené akce'}
        {activeTab === 'past' && 'Proběhlé akce'}
      </h2>

      <div className="events-grid">
        {displayedEvents.length > 0 ? (
          displayedEvents.map(event => (
            <EventCard key={event.id} event={event} />
          ))
        ) : (
          <p>V této kategorii zatím nemáte žádné akce.</p>
        )}
      </div>

    </div>
  );
}