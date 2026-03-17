import { useParams, useNavigate, Link } from 'react-router-dom';
import { mockEvents } from '../data/mockEvents';
import { Calendar, MapPin, ArrowLeft } from 'lucide-react';
import '../styles/detail.css';

export default function DetailAkce() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const event = mockEvents.find(e => e.id === Number(id));
  if (!event) {
    return (
      <div className="container">
        <h2>Akce nenalezena!</h2>
        <Link to="/">Zpět na přehled</Link>
      </div>
    );
  }

  return (
    <div className="container detail-container">
      <button onClick={() => navigate(-1)} className="back-button">
        <ArrowLeft size={16} /> Zpět
      </button>

      <div className="detail-header">
        <img src={event.imageUrl} alt={event.title} className="detail-hero-image" />
        <div className="detail-main-info">
          <h1>{event.title}</h1>
          <div className="detail-meta">
            <span>
              <MapPin size={18} /> {event.location}
            </span>
            <span>
              <Calendar size={18} /> 27. únor 2026 (12:30)
            </span>
          </div>
          <button className="primary-button" onClick={() => alert('Uloženo do kalendáře!')}>
            Uložit do kalendáře
          </button>
        </div>
      </div>

      <div className="detail-content">
        <section>
          <h2>O akci</h2>
          <p>{event.description}</p>
        </section>

        <section>
          <h2>Informace o účinkujících</h2>
          <p>
            Tato sekce obsahuje detaily o účinkujících.
          </p>
        </section>
      </div>
    </div>
  );
}