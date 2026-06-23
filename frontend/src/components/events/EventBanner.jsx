import { useState } from "react";
import useEvents from "../../hooks/useEvents";

const EventBanner = () => {
  const { events, isLoading } = useEvents();
  const [selectedEvent, setSelectedEvent] = useState(null);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const truncateText = (text, maxLength = 100) => {
    if (!text) return "";
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  if (isLoading) {
    return (
      <div className="event-banner-container">
        <p className="event-banner-loading">Loading events...</p>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="event-banner-container">
        <p className="event-banner-empty">No upcoming events at this time.</p>
      </div>
    );
  }

  const duplicatedEvents = [...events, ...events];

  return (
    <>
      <div className="event-banner-wrapper">
        <h3 className="event-banner-heading">Upcoming Events</h3>
        <div className="event-banner-track-container">
          <div className="event-banner-track">
            {duplicatedEvents.map((event, index) => (
              <div
                key={index}
                className="event-card"
                onClick={() => setSelectedEvent(event)}
                style={{ cursor: "pointer" }}
              >
                <div className="event-card-badge">Upcoming</div>
                <h4 className="event-card-name">{event.name}</h4>
                <div className="event-card-detail">
                  <span className="event-card-icon">📅</span>
                  <span>
                    {formatDate(event.event_date)} at {formatTime(event.event_date)}
                  </span>
                </div>
                <div className="event-card-detail">
                  <span className="event-card-icon">📍</span>
                  <span>{event.location}</span>
                </div>
                <p className="event-card-theme">{truncateText(event.theme)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div className="modal-overlay" onClick={() => setSelectedEvent(null)}>
          <div className="event-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="event-modal-close"
              onClick={() => setSelectedEvent(null)}
            >
              ✕
            </button>
            <div className="event-modal-badge">Upcoming Event</div>
            <h2 className="event-modal-title">{selectedEvent.name}</h2>
            <div className="event-modal-details">
              <div className="event-modal-detail-row">
                <span className="event-modal-icon">📅</span>
                <div>
                  <strong>Date & Time</strong>
                  <p>
                    {formatDate(selectedEvent.event_date)} at{" "}
                    {formatTime(selectedEvent.event_date)}
                  </p>
                </div>
              </div>
              <div className="event-modal-detail-row">
                <span className="event-modal-icon">📍</span>
                <div>
                  <strong>Location</strong>
                  <p>{selectedEvent.location}</p>
                </div>
              </div>
              <div className="event-modal-detail-row">
                <span className="event-modal-icon">📝</span>
                <div>
                  <strong>Theme / Purpose</strong>
                  <p>{selectedEvent.theme}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EventBanner;