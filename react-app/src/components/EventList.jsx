import React from 'react';
import { CalendarDays, Search, MapPin, Clock } from 'lucide-react';

const EventList = ({ events, onSelectEvent, activeFilter, setActiveFilter, searchQuery, setSearchQuery }) => {
  
  const categories = [
    { id: 'all', label: 'All Categories', class: '' },
    { id: 'work', label: 'Work', class: 'work' },
    { id: 'personal', label: 'Personal', class: 'personal' },
    { id: 'meeting', label: 'Meeting', class: 'meeting' },
    { id: 'holiday', label: 'Holiday', class: 'holiday' },
    { id: 'urgent', label: 'Urgent', class: 'urgent' },
    { id: 'general', label: 'General', class: 'general' }
  ];

  // Helper to format event date/time beautifully
  const formatEventTime = (startDateStr, endDateStr) => {
    const start = new Date(startDateStr);
    const end = new Date(endDateStr);
    
    const optionsDate = { month: 'short', day: 'numeric' };
    const optionsTime = { hour: '2-digit', minute: '2-digit', hour12: true };
    
    const isSameDay = start.toDateString() === end.toDateString();
    
    if (isSameDay) {
      return `${start.toLocaleDateString(undefined, optionsDate)} • ${start.toLocaleTimeString(undefined, optionsTime)} - ${end.toLocaleTimeString(undefined, optionsTime)}`;
    } else {
      return `${start.toLocaleDateString(undefined, optionsDate)} - ${end.toLocaleDateString(undefined, optionsDate)}`;
    }
  };

  // Filter events based on search query and category
  const filteredEvents = events.filter(event => {
    const matchesCategory = activeFilter === 'all' || event.category === activeFilter;
    const matchesSearch = 
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (event.description && event.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (event.location && event.location.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="sidebar">
      {/* Brand logo & header */}
      <div className="brand">
        <CalendarDays className="brand-icon" size={28} />
        <span className="brand-name">EventHub</span>
      </div>

      {/* Search Bar */}
      <div className="sidebar-section">
        <span className="sidebar-section-title">Search Events</span>
        <div className="search-wrapper">
          <Search className="search-icon" size={18} />
          <input
            type="text"
            className="search-input"
            placeholder="Search title, details, place..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Category Filters */}
      <div className="sidebar-section">
        <span className="sidebar-section-title">Filter by Category</span>
        <div className="category-filters">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`filter-badge ${activeFilter === cat.id ? 'active' : ''}`}
              onClick={() => setActiveFilter(cat.id)}
            >
              {cat.id !== 'all' && <span className={`dot ${cat.class}`}></span>}
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Events List */}
      <div className="sidebar-section" style={{ flex: 1 }}>
        <span className="sidebar-section-title">Upcoming Schedule</span>
        <div className="upcoming-events-list">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <div
                key={event._id}
                className={`event-card ${event.category || 'general'}`}
                onClick={() => onSelectEvent(event)}
              >
                <div className="event-card-title">{event.title}</div>
                <div className="event-card-meta">
                  <span>
                    <Clock size={12} />
                    {formatEventTime(event.startDate, event.endDate)}
                  </span>
                </div>
                {event.location && (
                  <div className="event-card-meta">
                    <span>
                      <MapPin size={12} />
                      {event.location}
                    </span>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="no-events">No events scheduled.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventList;
