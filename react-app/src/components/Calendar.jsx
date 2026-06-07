import React from 'react';
import { Plus } from 'lucide-react';

const Calendar = ({ currentDate, events, onSelectDate, onSelectEvent, activeFilter }) => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Get the first day of the month (0 = Sunday, ..., 6 = Saturday)
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  // Get number of days in the month
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  // Get number of days in the previous month
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  // Generate day cells
  const dayCells = [];

  // Previous month days
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    dayCells.push({
      date: new Date(year, month - 1, daysInPrevMonth - i),
      isCurrentMonth: false,
    });
  }

  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    dayCells.push({
      date: new Date(year, month, i),
      isCurrentMonth: true,
    });
  }

  // Next month days to fill the grid (multiple of 7, total 42 cells is standard)
  const totalCells = 42;
  const nextMonthDaysNeeded = totalCells - dayCells.length;
  for (let i = 1; i <= nextMonthDaysNeeded; i++) {
    dayCells.push({
      date: new Date(year, month + 1, i),
      isCurrentMonth: false,
    });
  }

  // Match events for a given day
  const getEventsForDay = (dayDate) => {
    const dayStart = new Date(dayDate.getFullYear(), dayDate.getMonth(), dayDate.getDate(), 0, 0, 0);
    const dayEnd = new Date(dayDate.getFullYear(), dayDate.getMonth(), dayDate.getDate(), 23, 59, 59, 999);

    return events.filter(event => {
      const eventStart = new Date(event.startDate);
      const eventEnd = new Date(event.endDate);
      
      // Match active category filter
      if (activeFilter !== 'all' && event.category !== activeFilter) {
        return false;
      }
      
      // Event falls on this day if eventStart <= dayEnd && eventEnd >= dayStart
      return eventStart <= dayEnd && eventEnd >= dayStart;
    });
  };

  const isToday = (date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="calendar-card">
      <div className="weekdays-grid">
        {weekDays.map((day) => (
          <div key={day} className="weekday">
            {day}
          </div>
        ))}
      </div>
      <div className="days-grid">
        {dayCells.map((cell, index) => {
          const dayEvents = getEventsForDay(cell.date);
          const cellIsToday = isToday(cell.date);
          
          return (
            <div
              key={index}
              className={`day-cell ${!cell.isCurrentMonth ? 'outside-month' : ''} ${cellIsToday ? 'today' : ''}`}
              onClick={() => onSelectDate(cell.date)}
            >
              <div className="day-number-wrapper">
                <span className="day-number">{cell.date.getDate()}</span>
                <button 
                  className="quick-add-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectDate(cell.date);
                  }}
                  title="Add Event"
                >
                  <Plus size={14} />
                </button>
              </div>
              
              <div className="day-events-container">
                {dayEvents.map((event) => (
                  <div
                    key={event._id}
                    className={`day-event-badge ${event.category || 'general'}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectEvent(event);
                    }}
                    title={`${event.title} (${event.category})`}
                  >
                    {event.title}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
