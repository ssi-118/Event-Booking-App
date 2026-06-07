import React, { useState, useEffect } from 'react';
import { X, Trash2, AlertCircle } from 'lucide-react';

const EventModal = ({ isOpen, onClose, selectedDate, selectedEvent, onSave, onDelete }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('general');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [location, setLocation] = useState('');
  const [color, setColor] = useState('#64748b'); // Default General color
  const [error, setError] = useState('');

  // Standard category colors
  const colorPresets = [
    { name: 'Work', hex: '#8b5cf6' },      // Purple
    { name: 'Personal', hex: '#10b981' },  // Green
    { name: 'Meeting', hex: '#3b82f6' },   // Blue
    { name: 'Holiday', hex: '#f59e0b' },   // Orange
    { name: 'Urgent', hex: '#ef4444' },    // Red
    { name: 'General', hex: '#64748b' }    // Slate/Gray
  ];

  // Helper to format Date object to YYYY-MM-DDTHH:MM local string
  const formatDateToLocalInput = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const tzOffset = d.getTimezoneOffset() * 60000;
    const localISOTime = new Date(d.getTime() - tzOffset).toISOString().slice(0, 16);
    return localISOTime;
  };

  useEffect(() => {
    if (isOpen) {
      setError('');
      if (selectedEvent) {
        // Edit Mode: Prefill with existing event data
        setTitle(selectedEvent.title || '');
        setDescription(selectedEvent.description || '');
        setCategory(selectedEvent.category || 'general');
        setStartDate(formatDateToLocalInput(selectedEvent.startDate));
        setEndDate(formatDateToLocalInput(selectedEvent.endDate));
        setLocation(selectedEvent.location || '');
        setColor(selectedEvent.color || '#64748b');
      } else {
        // Create Mode: Prefill with default date selection
        setTitle('');
        setDescription('');
        setCategory('general');
        
        const start = selectedDate ? new Date(selectedDate) : new Date();
        // Set default start time to 09:00 AM on selected date if new
        start.setHours(9, 0, 0, 0);
        
        const end = new Date(start.getTime() + 60 * 60 * 1000); // Default 1 hour later
        
        setStartDate(formatDateToLocalInput(start));
        setEndDate(formatDateToLocalInput(end));
        setLocation('');
        setColor('#64748b');
      }
    }
  }, [isOpen, selectedEvent, selectedDate]);

  // Sync color when category changes
  const handleCategoryChange = (e) => {
    const selectedCat = e.target.value;
    setCategory(selectedCat);
    
    // Find preset color matching selected category
    const matchedPreset = colorPresets.find(
      preset => preset.name.toLowerCase() === selectedCat.toLowerCase()
    );
    if (matchedPreset) {
      setColor(matchedPreset.hex);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Event title is required.');
      return;
    }
    if (!startDate || !endDate) {
      setError('Start date and end date are required.');
      return;
    }
    if (new Date(endDate) < new Date(startDate)) {
      setError('End date must be after the start date.');
      return;
    }

    const eventData = {
      title: title.trim(),
      description: description.trim(),
      category,
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(endDate).toISOString(),
      location: location.trim(),
      color
    };

    if (selectedEvent) {
      eventData._id = selectedEvent._id;
    }

    onSave(eventData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="modal-header">
          <h3 className="modal-title">
            {selectedEvent ? 'Edit Event Details' : 'Schedule New Event'}
          </h3>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="modal-form">
          {error && (
            <div className="alert-banner">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          {/* Title */}
          <div className="form-group">
            <label className="form-label">Event Title</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Project Review Sync"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
              required
            />
          </div>

          {/* Dates Row */}
          <div className="form-group-row">
            <div className="form-group">
              <label className="form-label">Starts At</label>
              <input
                type="datetime-local"
                className="form-input"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Ends At</label>
              <input
                type="datetime-local"
                className="form-input"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Category Dropdown */}
          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              className="form-select"
              value={category}
              onChange={handleCategoryChange}
            >
              <option value="general">General</option>
              <option value="work">Work</option>
              <option value="personal">Personal</option>
              <option value="meeting">Meeting</option>
              <option value="holiday">Holiday</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          {/* Color Presets */}
          <div className="form-group">
            <label className="form-label">Event Color Accent</label>
            <div className="color-picker-wrapper">
              {colorPresets.map((preset) => (
                <button
                  key={preset.hex}
                  type="button"
                  className={`color-option-btn ${color === preset.hex ? 'selected' : ''}`}
                  style={{ backgroundColor: preset.hex }}
                  onClick={() => setColor(preset.hex)}
                  title={preset.name}
                />
              ))}
            </div>
          </div>

          {/* Location */}
          <div className="form-group">
            <label className="form-label">Location / Link</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Conference Room B or Google Meet Link"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              maxLength={150}
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label">Description / Notes</label>
            <textarea
              className="form-textarea"
              placeholder="Add details, agendas, or reminders..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={500}
            />
          </div>

          {/* Footer Actions */}
          <div className="modal-footer">
            {selectedEvent && (
              <button
                type="button"
                className="btn-danger modal-footer-left"
                onClick={() => onDelete(selectedEvent._id)}
              >
                <Trash2 size={16} />
                Delete
              </button>
            )}
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {selectedEvent ? 'Save Changes' : 'Schedule Event'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default EventModal;
