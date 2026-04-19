import { useState, useMemo } from 'react';
import { useSearch } from '../SearchContext';
import { filterEventsByText } from '../utils/filterEvents';
import EventCard from '../components/EventCard';
import SkeletonEventCard from '../components/SkeletonEventCard';
import type { AppEvent } from '../App';
import { SlidersHorizontal, Filter, Calendar } from 'lucide-react';
import '../styles/events.css';

interface EventsProps {
  events: AppEvent[];
  toggleSaved: (id: number) => void;
  error?: string | null;
}

type SortOption = 'dateAsc' | 'dateDesc' | 'nameAsc' | 'nameDesc';
type TimeframeOption = 'anytime' | 'today' | 'tomorrow' | 'thisWeek' | 'thisWeekend'


export default function Events({ events, toggleSaved, error }: EventsProps) {
  const [displayCount, setDisplayCount] = useState(50);
  const [sortBy, setSortBy] = useState<SortOption>('dateAsc');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTimeframe, setSelectedTimeframe] = useState<TimeframeOption>('anytime');

  // Handlery pro selecty
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
    setDisplayCount(50);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value as SortOption);
    setDisplayCount(50);
  };

  const handleDayChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTimeframe(e.target.value as TimeframeOption);
    setDisplayCount(50);
  };
  const { searchText } = useSearch();
  const [loading, setLoading] = useState(true);

  useState(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  });

  const getTimeframeRange = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const todayStart = now.getTime();
    const todayEnd = todayStart + 24 * 60 * 60 * 1000 - 1;

    const tomorrowStart = todayStart + 24 * 60 * 60 * 1000;
    const tomorrowEnd = tomorrowStart + 24 * 60 * 60 * 1000 - 1;

    // this week (monday till sunday)
    const dayOfWeek = now.getDay();
    const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const weekStartDate = new Date(now);
    weekStartDate.setDate(now.getDate() - daysFromMonday);
    const weekStart = weekStartDate.getTime();
    const weekEnd = weekStart + 7 * 24 * 60 * 60 * 1000 - 1;

    // saturday-sunday
    const weekendStartDate = new Date(now);
    weekendStartDate.setDate(now.getDate() + (6 - daysFromMonday));
    const weekendStart = weekendStartDate.getTime();
    const weekendEnd = weekStart + 7 * 24 * 60 * 60 * 1000 - 1;

    const formatDate = (ts: number) => {
      return new Date(ts).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'numeric' });
    };

    return (timeframe: TimeframeOption) => {
      switch (timeframe) {
        case 'today':
          return { start: todayStart, end: todayEnd, label: `Dnes (${formatDate(todayStart)})` };
        case 'tomorrow':
          return { start: tomorrowStart, end: tomorrowEnd, label: `Zítra (${formatDate(tomorrowStart)})` };
        case 'thisWeek':
          return { start: weekStart, end: weekEnd, label: `Tento týden (${formatDate(weekStart)} - ${formatDate(weekEnd)})` };
        case 'thisWeekend':
          return { start: weekendStart, end: weekendEnd, label: `Tento víkend (${formatDate(weekendStart)} - ${formatDate(weekendEnd)})` };
        default:
          return null;
      }
    };
  }, []);



  const uniqueCategories = useMemo(() => {
    const allCategories = events.flatMap(event => {
      if (!event.categories) return [];
      return event.categories.split(',').map(cat => cat.trim());
    });

    return Array.from(new Set(allCategories)).sort();
  }, [events]);

  const processedEvents = filterEventsByText(
    events
      .filter(event => typeof event.timestamp === 'number' && event.timestamp > 0 && event.timestamp >= new Date().setHours(0,0,0,0))
      .filter(event => {
        if (selectedTimeframe === 'anytime') return true;
        const range = getTimeframeRange(selectedTimeframe);
        if (!range || !event.timestamp) return true;
        return event.timestamp >= range.start && event.timestamp <= range.end;
      })
      .filter(event => {
        if (selectedCategory === 'all') return true;
        if (!event.categories) return false;
        const eventCats = event.categories.split(',').map(cat => cat.trim());
        return eventCats.includes(selectedCategory);
      }),
    searchText
  );

  if (selectedTimeframe === 'anytime') {
    processedEvents.sort((a, b) => (a.timestamp || Infinity) - (b.timestamp || Infinity));
    if (processedEvents.length > 1) {
      const rest = processedEvents.slice(1);
      for (let i = rest.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [rest[i], rest[j]] = [rest[j], rest[i]];
      }
      processedEvents.splice(1, rest.length, ...rest);
    }
  } else {
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
  }

  const displayedEvents = processedEvents.slice(0, displayCount);

  return (
    <div className="container page-container">
      <div className="events-header">
        <h1 className="section-title">Všechny dostupné akce</h1>
      </div>

      <div className="filters-bar">
        {/* search bar only in nav*/}
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
        <div className="filter-wrapper">  
          <Calendar size={18} className="filter-icon"/>
           <select 
            className="filter-select" 
            value={selectedTimeframe} 
            onChange={handleDayChange}
          >
            <option value="anytime">Kdykoliv</option>
            <option value="today">{getTimeframeRange('today')?.label}</option>
            <option value="tomorrow">{getTimeframeRange('tomorrow')?.label}</option>
            <option value="thisWeek">{getTimeframeRange('thisWeek')?.label}</option>
            <option value="thisWeekend">{getTimeframeRange('thisWeekend')?.label}</option>
          </select>
        </div>

      </div>

      <div className="events-grid">
        {error ? (
          <div className="no-results-message" style={{ color: 'var(--error-color, #c00)', textAlign: 'center', gridColumn: '1/-1' }}>
            <h2>Chyba při načítání dat</h2>
            <p>{error}</p>
            <button className="primary-button" onClick={() => window.location.reload()} style={{ marginTop: '2rem' }}>Zkusit znovu načíst</button>
          </div>
        ) : loading ? (
          <>
            {Array.from({ length: 6 }).map((_, i) => (
              <div className="event-card-skeleton-wrapper" key={i} style={{ gridColumn: 'span 1' }}>
                <SkeletonEventCard />
              </div>
            ))}
          </>
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

      {displayCount < processedEvents.length && !error && (
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