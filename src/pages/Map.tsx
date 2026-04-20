import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import type { AppEvent } from "../App";
import "../styles/map.css";

import "leaflet/dist/leaflet.css";

function MapUpdater({
  center,
  zoom,
}: {
  center: [number, number];
  zoom: number;
}) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.5 });
  }, [center, zoom, map]);
  return null;
}

function getDistanceInKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

interface MapProps {
  events: AppEvent[];
}

export default function Map({ events }: MapProps) {
  const [activeTab, setActiveTab] = useState<"all" | "local">("all");

  const [localCenter, setLocalCenter] = useState<[number, number]>([
    49.195, 16.606,
  ]);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const RADIUS_KM = 20;

  const handleGetLocation = () => {
    setIsLocating(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError("Geolokace není podporována.");
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocalCenter([pos.coords.latitude, pos.coords.longitude]);
        setActiveTab("local");
        setIsLocating(false);
      },
      (err) => {
        setLocationError("Polohu se nepodařilo zjistit: " + err.message);
        setIsLocating(false);
      },
    );
  };

  const currentCenter: [number, number] =
    activeTab === "all" ? [49.8, 15.5] : localCenter;
  const currentZoom: number = activeTab === "all" ? 7 : 12;

  const displayedEvents = events.filter((event) => {
    if (activeTab === "all") return true;

    const distance = getDistanceInKm(
      localCenter[0],
      localCenter[1],
      event.lat,
      event.lng,
    );

    return distance <= RADIUS_KM;
  });

  return (
    <div className="container page-container">
      <div className="tabs-container">
        <button
          className={`tab-button ${activeTab === "all" ? "active" : ""}`}
          onClick={() => setActiveTab("all")}
        >
          Mapa akcí
        </button>
        <button
          className={`tab-button ${activeTab === "local" ? "active" : ""}`}
          onClick={() => setActiveTab("local")}
        >
          Akce ve vašem okolí
        </button>
      </div>

      <div className="map-header-container">
        <h2 className="section-title">
          {activeTab === "all" && "Mapa akcí"}
          {activeTab === "local" && `Akce ve vašem okolí`}
        </h2>

        <div className="location-action-bar">
          <button
            className="primary-button location-btn"
            onClick={handleGetLocation}
            disabled={isLocating}
          >
            {isLocating ? "Hledám polohu..." : "📍 Najít moji polohu"}
          </button>

          {locationError && (
            <span className="location-error-text">{locationError}</span>
          )}
        </div>
      </div>

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
                <div className="map-popup-container">
                  <strong className="map-popup-title">{event.title}</strong>
                  <span className="map-popup-category">{event.categories}</span>
                  <small className="map-popup-distance">
                    (
                    {Math.round(
                      getDistanceInKm(
                        localCenter[0],
                        localCenter[1],
                        event.lat,
                        event.lng,
                      ),
                    )}{" "}
                    km od vás)
                  </small>

                  <Link
                    to={`/event/${event.id}`}
                    className="primary-button map-popup-button"
                  >
                    Detail akce
                  </Link>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
