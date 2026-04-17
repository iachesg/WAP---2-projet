import { useState, useMemo } from 'react';
import { useSearch } from '../SearchContext';
import EventCard from '../components/EventCard';
import SkeletonEventCard from '../components/SkeletonEventCard';
import type { AppEvent } from '../App';
import { SlidersHorizontal, Filter } from 'lucide-react'; 
import '../styles/events.css';

interface EventsProps {
  events: AppEvent[];
  toggleSaved: (id: number) => void;
  error?: string | null;
}

type SortOption = 'dateAsc' | 'dateDesc' | 'nameAsc' | 'nameDesc';

export default function Events({ events, toggleSaved, error }: EventsProps) {
  const [displayCount, setDisplayCount] = useState(50);
  const [sortBy, setSortBy] = useState<SortOption>('dateAsc');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { searchText } = useSearch();
  const [loading, setLoading] = useState(true);

  
  useState(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  });

  const uniqueCategories = useMemo(() => {
    const allCategories = events.flatMap(event => {
      if (!event.categories) return [];
      return event.categories.split(',').map(cat => cat.trim());
    });
    
    return Array.from(new Set(allCategories)).sort();
  }, [events]);

  const processedEvents = events
    .filter(event => {
      if (selectedCategory === 'all') return true;
      if (!event.categories) return false;
      const eventCats = event.categories.split(',').map(cat => cat.trim());
      return eventCats.includes(selectedCategory);
    })
    .filter(event =>
      event.title.toLowerCase().includes(searchText.toLowerCase())
    );

  processedEvents.sort((a, b) => {
    switch (sortBy) {
      case 'dateAsc':
        return (a.timestamp || Infinity) - (b.timestamp || Infinity);
      case 'dateDesc':
        return (b.timestamp || 0) - (a.timestamp || 0);
      case 'nameAsc':
        return a.title.localeCompare(b.title, 'cs'); 
      case 'nameDesc':
        return b.title.localeCompare(a.title, 'cs');
      default:
        return 0;
    }
  });

  const displayedEvents = processedEvents.slice(0, displayCount);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
    setDisplayCount(50);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value as SortOption);
    setDisplayCount(50);
  };

  return (
    <div className="container page-container">
      <div className="events-header">
        <h1 className="section-title">Všechny dostupné akce</h1>
      </div>

      <div className="filters-bar">        
        {/* search bar je pouze v navigaci */}
        <div className="filter-wrapper">
          <Filter size={18} className="filter-icon" />
          <select 
            className="filter-select" 
            value={selectedCategory} 
            onChange={handleCategoryChange}
          >
            <option value="all">Všechny kategorie</option>
            {uniqueCategories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="filter-wrapper">
          <SlidersHorizontal size={18} className="filter-icon" />
          <select 
            className="filter-select" 
            value={sortBy} 
            onChange={handleSortChange}
          >
            <option value="dateAsc">Od nejbližšího data</option>
            <option value="dateDesc">Od nejvzdálenějšího data</option>
            <option value="nameAsc">Abecedně (A-Z)</option>
            <option value="nameDesc">Abecedně (Z-A)</option>
          </select>
        </div>
        
      </div>

      <div className="events-grid">
        {error ? (
          <div className="no-results-message" style={{color: 'var(--error-color, #c00)', textAlign: 'center', gridColumn: '1/-1'}}>
            <h2>Chyba při načítání dat</h2>
            <p>{error}</p>
            <button className="primary-button" onClick={() => window.location.reload()} style={{marginTop: '2rem'}}>Zkusit znovu načíst</button>
          </div>
        ) : loading ? (
          Array.from({ length: 6 }).map((_, i) => <SkeletonEventCard key={i} />)
        ) : displayedEvents.length > 0 ? (
          displayedEvents.map(event => (
            <EventCard key={event.id} event={event} toggleSaved={toggleSaved} />
          ))
        ) : (
          <div className="no-results-message">
            <p>Zadanému filtru nevyhovují žádné akce.</p>
            <button className="primary-button" onClick={() => setSelectedCategory('all')}>
              Zrušit filtr
            </button>
          </div>
        )}
      </div>

      {displayCount < processedEvents.length && (
        <div className="load-more-container">
          <button 
            className="primary-button" 
            onClick={() => setDisplayCount(prev => prev + 50)}
          >
            Načíst další akce
          </button>
        </div>
      )}
    </div>
  );
}