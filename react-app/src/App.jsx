import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon } from 'lucide-react';
import Calendar from './components/Calendar';
import EventList from './components/EventList';
import EventModal from './components/EventModal';
import './App.css';

const API_URL = 'http://localhost:5000/api/events';

function App() {
  const [events, setEvents] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Fetch all events on load
  const fetchEvents = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Calendar month navigation
  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // Event modal actions
  const handleOpenAddModal = (date = new Date()) => {
    setSelectedEvent(null);
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (event) => {
    setSelectedDate(null);
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDate(null);
    setSelectedEvent(null);
  };

  // API submit actions
  const handleSaveEvent = async (eventData) => {
    const isEditing = !!eventData._id;
    const url = isEditing ? `${API_URL}/${eventData._id}` : API_URL;
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save event');
      }

      await fetchEvents();
      handleCloseModal();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;

    try {
      const response = await fetch(`${API_URL}/${eventId}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete event');

      await fetchEvents();
      handleCloseModal();
    } catch (error) {
      alert(error.message);
    }
  };

  // Format header month title
  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const fullYear = currentDate.getFullYear();

  return (
    <div className="app-container">
      {/* Sidebar - Search, Filters, and List */}
      <EventList
        events={events}
        onSelectEvent={handleOpenEditModal}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Main dashboard containing custom monthly calendar */}
      <main className="main-content">
        
        {/* Navigation & Header */}
        <header className="dashboard-header">
          <div className="calendar-navigation">
            <h1 className="month-title">
              {monthName} <span style={{ fontWeight: 400, opacity: 0.8 }}>{fullYear}</span>
            </h1>
            <button className="nav-btn" onClick={handlePrevMonth} title="Previous Month">
              <ChevronLeft size={20} />
            </button>
            <button className="btn-today" onClick={handleToday}>
              Today
            </button>
            <button className="nav-btn" onClick={handleNextMonth} title="Next Month">
              <ChevronRight size={20} />
            </button>
          </div>

          <button className="btn-primary" onClick={() => handleOpenAddModal(currentDate)}>
            <Plus size={18} />
            Schedule Event
          </button>
        </header>

        {/* Custom Month Calendar Grid */}
        <Calendar
          currentDate={currentDate}
          events={events}
          onSelectDate={handleOpenAddModal}
          onSelectEvent={handleOpenEditModal}
          activeFilter={activeFilter}
        />

      </main>

      {/* Add / Edit Event Dialog Modal */}
      <EventModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        selectedDate={selectedDate}
        selectedEvent={selectedEvent}
        onSave={handleSaveEvent}
        onDelete={handleDeleteEvent}
      />
    </div>
  );
}

export default App;
