import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { mockEvents } from '../data/mockEvents';
import '../styles/map.css';

import 'leaflet/dist/leaflet.css';

function MapUpdater({ center, zoom }: { center: [number, number], zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.5 });
  }, [center, zoom, map]);
  return null;
}

function getDistanceInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
  return R * c;
}

export default function Map() {
  const [activeTab, setActiveTab] = useState<'all' | 'local'>('all');

  const localCenter: [number, number] = [49.195, 16.606]; //TODO - získat aktuální polohu uživatele
  const RADIUS_KM = 30; 

  const currentCenter: [number, number] = activeTab === 'all' ? [49.8, 15.5] : localCenter;
  const currentZoom: number = activeTab === 'all' ? 7 : 11;

  const displayedEvents = mockEvents.filter(event => {
    if (activeTab === 'all') return true;

    const distance = getDistanceInKm(localCenter[0], localCenter[1], event.lat, event.lng);

    return distance <= RADIUS_KM;
  });

  return (
    <div className="container page-container">
      <div className="tabs-container">
        <button 
          className={`tab-button ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          Mapa akcí
        </button>
        <button 
          className={`tab-button ${activeTab === 'local' ? 'active' : ''}`}
          onClick={() => setActiveTab('local')}
        >
          Akce ve vašem okolí
        </button>
      </div>

      <h2 className="section-title">
        {activeTab === 'all' && 'Mapa akcí'}
        {activeTab === 'local' && `Akce ve vašem okolí`}
      </h2>

      <div className="map-wrapper">
        <MapContainer 
          center={[49.8, 15.5]}
          zoom={7}
          scrollWheelZoom={true}
          className="leaflet-map"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <MapUpdater center={currentCenter} zoom={currentZoom} />
          
          {displayedEvents.map((event) => (
            <Marker key={event.id} position={[event.lat, event.lng]}>
              <Popup>
                <strong>{event.title}</strong><br />
                {event.location}<br />
                <small>({Math.round(getDistanceInKm(localCenter[0], localCenter[1], event.lat, event.lng))} km od vás)</small>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

    </div>
  );
}