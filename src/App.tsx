import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import MyEvents from './pages/MyEvents';
import Map from './pages/Map';
import EventDetail from './pages/EventDetail.tsx';

const Events = () => <div className="container"><h1>Všechny Akce</h1></div>;

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/my-events" replace />} />
          <Route path="/events" element={<Events />} />
          <Route path="/my-events" element={<MyEvents />} />
          <Route path="/map" element={<Map />} />
          <Route path="/event/:id" element={<EventDetail />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;