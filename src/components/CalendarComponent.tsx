import { useMemo, useState } from 'react';
import type { AppEvent } from '../App';
import '../styles/calendar.css';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarProps {
  events: AppEvent[];
}

export default function CalendarComponent({ events }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const eventsByDay = useMemo(() => {
    const map: Record<string, AppEvent[]> = {};
    events.forEach(event => {
      if (!event.isSaved || !event.timestamp) return;
      const day = new Date(event.timestamp).toISOString().slice(0, 10);
      if (!map[day]) map[day] = [];
      map[day].push(event);
    });
    return map;
  }, [events]);

  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days: (number | null)[] = [];
    
    
    for (let i = startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1; i > 0; i--) {
      days.push(null);
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    
    return days;
  }, [currentDate]);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const formatMonth = () => {
    return currentDate.toLocaleDateString('cs-CZ', { month: 'long', year: 'numeric' });
  };

  const getDayString = (day: number) => {
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    return `${year}-${month}-${dayStr}`;
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button onClick={handlePrevMonth} className="nav-button" aria-label="Předchozí měsíc">
          <ChevronLeft size={16} />
        </button>
        <h3 className="calendar-month">{formatMonth()}</h3>
        <button onClick={handleNextMonth} className="nav-button" aria-label="Následující měsíc">
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="calendar-grid">
        <div className="weekday-header">Po</div>
        <div className="weekday-header">Út</div>
        <div className="weekday-header">St</div>
        <div className="weekday-header">Čt</div>
        <div className="weekday-header">Pá</div>
        <div className="weekday-header">So</div>
        <div className="weekday-header">Ne</div>

        {calendarDays.map((day, index) => {
          const dayString = day ? getDayString(day) : null;
          const hasSavedEvents = dayString && eventsByDay[dayString] && eventsByDay[dayString].length > 0;
          const today = isToday(day || 0);

          return (
            <div
              key={index}
              className={`calendar-day ${!day ? 'empty' : ''} ${today ? 'today' : ''}`}
            >
              <span className="day-number">{day}</span>
              {hasSavedEvents && <div className="event-indicator"></div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}