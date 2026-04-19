import { useState } from 'react';
import { useSearch } from '../SearchContext';
import { filterEventsByText } from '../utils/filterEvents';
import EventCard from '../components/EventCard';
import type { AppEvent } from '../App';
import '../styles/myEvents.css';

type TabType = 'saved' | 'favorite' | 'past';

interface MyEventsProps {
  events: AppEvent[];
  toggleSaved: (id: number) => void;
}


export default function MyEvents({ events, toggleSaved }: MyEventsProps) {
  const [activeTab, setActiveTab] = useState<TabType>('saved');
  const { searchText } = useSearch();

  const getFilteredEvents = () => {
    let filtered = [] as AppEvent[];
    switch (activeTab) {
      case 'saved':
        filtered = events.filter(event => event.isSaved);
        break;
      case 'favorite':
        filtered = events.filter(event => event.isFavorite);
        break;
      case 'past':
        filtered = events.filter(event => {
          if (!event.isSaved && !event.isFavorite) return false;
          const endTime = event.timestampTo || event.timestamp;
          if (!endTime) return false;
          return endTime < Date.now();
        });
        break;
      default:
        filtered = events;
    }

    // Search filter sdílený s Events
    return filterEventsByText(filtered, searchText);
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
            <EventCard key={event.id} event={event} toggleSaved={toggleSaved} />
          ))
        ) : (
          <p>V této kategorii zatím nemáte žádné akce.</p>
        )}
      </div>

    </div>
  );
}