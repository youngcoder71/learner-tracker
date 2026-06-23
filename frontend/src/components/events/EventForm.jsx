import { useState } from "react";
import useLocationSearch from "../../hooks/useLocationSearch";
import useEvents from "../../hooks/useEvents";

const EventForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    areaType: "Rural",
    location: "",
    dateTime: "",
    theme: "",
  });

  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState(null);

  const { addEvent } = useEvents();
  const { searchTerm, setSearchTerm, suggestions, isLoading, isOpen, selectLocation, clearSearch } = useLocationSearch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleLocationSelect = (location) => {
    selectLocation(location);
    setFormData((prev) => ({ ...prev, location: location }));
    if (errors.location) setErrors((prev) => ({ ...prev, location: "" }));
  };

  const handleLocationInputChange = (e) => {
    setSearchTerm(e.target.value);
    setFormData((prev) => ({ ...prev, location: e.target.value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Event name is required";
    if (!formData.location.trim()) newErrors.location = "Location is required";
    if (!formData.dateTime) newErrors.dateTime = "Date and time are required";
    if (!formData.theme.trim()) newErrors.theme = "Theme is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const result = await addEvent({
      ...formData,
      dateTime: formData.dateTime,
      event_date: formData.dateTime,
    });

    if (result.success) {
      setSubmitStatus("success");
      setFormData({ name: "", areaType: "Rural", location: "", dateTime: "", theme: "" });
      clearSearch();
      setTimeout(() => setSubmitStatus(null), 3000);
    } else {
      setSubmitStatus("error");
    }
  };

  return (
    <div className="section-container">
      <h2 className="section-title">Add New Event</h2>

      {submitStatus === "success" && (
        <div className="alert alert-success">
          Event submitted for review. It will appear on the banner once approved.
        </div>
      )}
      {submitStatus === "error" && (
        <div className="alert alert-error">Failed to add event. Please try again.</div>
      )}

      <form onSubmit={handleSubmit} className="event-form">
        <div className="event-form-columns">
          {/* Column 1 */}
          <div className="event-form-column">
            <div className="form-group">
              <label className="form-label" htmlFor="eventName">Name of Event</label>
              <input type="text" id="eventName" name="name" value={formData.name} onChange={handleChange} className={`form-input ${errors.name ? "input-error" : ""}`} placeholder="Enter event name" />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>

            {/* Area Type + Location Row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "12px" }}>
              <div className="form-group">
                <label className="form-label">Area Type</label>
                <select name="areaType" value={formData.areaType} onChange={handleChange} className="form-select">
                  <option value="Rural">Rural</option>
                  <option value="Urban">Urban</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Location</label>
                <div className="autocomplete-wrapper">
                  <input type="text" value={searchTerm} onChange={handleLocationInputChange} className={`form-input ${errors.location ? "input-error" : ""}`} placeholder="Search location..." autoComplete="off" />
                  {isLoading && <span className="autocomplete-spinner">⟳</span>}
                  {searchTerm && !isLoading && <button type="button" className="autocomplete-clear" onClick={clearSearch}>✕</button>}
                  {isOpen && suggestions.length > 0 && (
                    <ul className="autocomplete-dropdown">
                      {suggestions.map((location, index) => (
                        <li key={index} className="autocomplete-item" onClick={() => handleLocationSelect(location)}>{location}</li>
                      ))}
                    </ul>
                  )}
                  {isOpen && !isLoading && suggestions.length === 0 && (
                    <ul className="autocomplete-dropdown"><li className="autocomplete-item no-results">No locations found</li></ul>
                  )}
                </div>
                {errors.location && <span className="error-message">{errors.location}</span>}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="eventDateTime">Date & Time</label>
              <input type="datetime-local" id="eventDateTime" name="dateTime" value={formData.dateTime} onChange={handleChange} className={`form-input ${errors.dateTime ? "input-error" : ""}`} />
              {errors.dateTime && <span className="error-message">{errors.dateTime}</span>}
            </div>
          </div>

          {/* Column 2 */}
          <div className="event-form-column">
            <div className="form-group">
              <label className="form-label" htmlFor="eventTheme">Theme / Purpose</label>
              <textarea id="eventTheme" name="theme" value={formData.theme} onChange={handleChange} className={`form-textarea ${errors.theme ? "input-error" : ""}`} placeholder="Describe the theme or purpose of the event..." rows={8} />
              {errors.theme && <span className="error-message">{errors.theme}</span>}
            </div>
          </div>
        </div>

        <div className="form-footer">
          <button type="submit" className="btn-submit">Submit Event</button>
        </div>
      </form>
    </div>
  );
};

export default EventForm;