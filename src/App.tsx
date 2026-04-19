import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import { SearchProvider } from './SearchContext';
import MyEvents from './pages/MyEvents';
import Map from './pages/Map';
import EventDetail from './pages/EventDetail.tsx';
import Events from './pages/Events.tsx';
import Calendar from './components/CalendarComponent.tsx';

export interface AppEvent {
  id: number;
  title: string;
  description: string;
  fullDescription?: string;
  imageUrl: string;
  lat: number;
  lng: number;
  isFavorite?: boolean;
  isSaved?: boolean;
  dateFrom?: string;
  dateTo?: string;
  categories?: string;
  tickets?: string;
  ticketsUrl?: string;
  sourceUrl?: string;
  organizerEmail?: string;
  timestamp?: number;
  timestampTo?: number;
}

interface BrnoApiFeature {
  properties: {
    ObjectId: number;
    name?: string;
    text?: string;
    first_image?: string;
    categories?: string;
    date_from?: number;
    date_to?: number;
    tickets?: string;
    tickets_url?: string;
    url?: string;
    organizer_email?: string;
  };
  geometry?: {
    coordinates: [number, number]; 
  };
}

function decodeHTMLEntities (text: string | undefined) {
  if (!text) return '';
  const doc = new DOMParser().parseFromString(text, "text/html");
  return doc.documentElement.textContent || text;
};

function App() {
  const [events, setEvents] = useState<AppEvent[]>([]);
  const [error, setError] = useState<string | null>(null);

  const toggleFavorite = (id: number) => {
    setEvents(prevEvents => {
      const newEvents = prevEvents.map(event => 
        event.id === id ? { ...event, isFavorite: !event.isFavorite } : event
      );
      const favoriteIds = newEvents.filter(e => e.isFavorite).map(e => e.id);
      localStorage.setItem('favorites', JSON.stringify(favoriteIds));
      return newEvents;
    });
  };

  const toggleSaved = (id: number) => {
    setEvents(prevEvents => {
      const newEvents = prevEvents.map(event => 
        event.id === id ? { ...event, isSaved: !event.isSaved } : event
      );
      const savedIds = newEvents.filter(e => e.isSaved).map(e => e.id);
      localStorage.setItem('savedEvents', JSON.stringify(savedIds));
      return newEvents;
    });
  };

  useEffect(() => {
    const fetchBrnoEvents = async () => {
      try {
        const response = await fetch(
          'https://services6.arcgis.com/fUWVlHWZNxUvTUh8/arcgis/rest/services/Events/FeatureServer/0/query?outFields=*&where=1%3D1&f=geojson'
        );
        if (!response.ok) {
          throw new Error('Nepodařilo se načíst data z API.');
        }
        const data = await response.json();

        const storedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        const storedSaved = JSON.parse(localStorage.getItem('savedEvents') || '[]');

        const mappedEvents: AppEvent[] = data.features.map((feature: BrnoApiFeature) => {
          const props = feature.properties;
          const coords = feature.geometry?.coordinates;

          const cleanTitle = decodeHTMLEntities(props.name) || 'Akce bez názvu';
          
          let formattedDateFrom = 'Termín neurčen';
          if (props.date_from) {
             const dateObj = new Date(props.date_from);
             formattedDateFrom = dateObj.toLocaleDateString('cs-CZ', { 
               day: 'numeric', month: 'long', year: 'numeric' 
             });
          }

          let formattedDateTo = '';
          if (props.date_to) {
             const dateObj = new Date(props.date_to);
             formattedDateTo = dateObj.toLocaleDateString('cs-CZ', { 
               day: 'numeric', month: 'long', year: 'numeric' 
             });
          }

          const validImage = props.first_image || `https://picsum.photos/seed/${props.ObjectId || Math.random()}/400/250`;

          let cleanDescription = 'Popis není k dispozici.';
          if (props.text) {
             const noTags = props.text.replace(/<[^>]*>?/gm, '');
             cleanDescription = decodeHTMLEntities(noTags);
             if (cleanDescription.length > 150) {
               cleanDescription = cleanDescription.substring(0, 150) + '...';
             }
          }

          return {
            id: props.ObjectId,
            title: cleanTitle,
            description: cleanDescription,
            fullDescription: props.text,
            imageUrl: validImage,
            lat: coords ? coords[1] : 49.195,
            lng: coords ? coords[0] : 16.606,
            isFavorite: storedFavorites.includes(props.ObjectId),
            isSaved: storedSaved.includes(props.ObjectId),
            dateFrom: formattedDateFrom,
            dateTo: formattedDateTo,
            categories: props.categories,
            tickets: props.tickets,
            ticketsUrl: props.tickets_url,
            sourceUrl: props.url,
            organizerEmail: props.organizer_email,
            timestamp: props.date_from,
            timestampTo: props.date_to
          };
        });

        setEvents(mappedEvents); 
      } catch (error: any) {
        setError(error?.message || 'Nastala neznámá chyba při načítání dat.');
        console.error("Chyba při stahování dat z API data.brno.cz:", error);
      }
    };

    fetchBrnoEvents();
  }, []);



  return (
    <SearchProvider>
      <BrowserRouter>
        <Navbar events={events} />
        <main>
          <Routes>
            <Route path="/" element={<Navigate to="/events" replace />} />
            <Route path="/events" element={<Events events={events} toggleSaved={toggleSaved} error={error}/>} />
            <Route path="/my-events" element={<MyEvents events={events} toggleSaved={toggleSaved}/>} />
            <Route path="/map" element={<Map events={events} />} />
            <Route path="/event/:id" element={<EventDetail events={events} toggleSaved={toggleSaved} toggleFavorite={toggleFavorite}/>} />
            <Route path="/calendar" element={<Calendar events={events} />} />
          </Routes>
        </main>
      </BrowserRouter>
    </SearchProvider>
  );
}

export default App;