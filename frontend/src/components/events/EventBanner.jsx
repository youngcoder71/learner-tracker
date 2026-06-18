import useEvents from "../../hooks/useEvents";

const EventBanner = () => {
  const { events, isLoading } = useEvents();

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
    <div className="event-banner-wrapper">
      <h3 className="event-banner-heading">Upcoming Events</h3>
      <div className="event-banner-track-container">
        <div className="event-banner-track">
          {duplicatedEvents.map((event, index) => (
            <div key={index} className="event-card">
              <div className="event-card-badge">Upcoming</div>
              <h4 className="event-card-name">{event.name}</h4>
              <div className="event-card-detail">
                <span className="event-card-icon">📅</span>
                <span>
                  {formatDate(event.dateTime)} at {formatTime(event.dateTime)}
                </span>
              </div>
              <div className="event-card-detail">
                <span className="event-card-icon">📍</span>
                <span>{event.location}</span>
              </div>
              <p className="event-card-theme">
                {truncateText(event.theme)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventBanner;