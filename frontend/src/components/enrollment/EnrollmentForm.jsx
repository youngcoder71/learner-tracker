import { useState } from "react";
import useLocationSearch from "../../hooks/useLocationSearch";
import api from "../../services/api";
import "../../styles/enrollment.css";

const EnrollmentForm = ({ onEnrollSuccess }) => {
  const [formData, setFormData] = useState({
    learnerName: "",
    institutionName: "",
    gender: "",
    disability: false,
    educationLevel: "",
    location: "",
  });

  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    searchTerm,
    setSearchTerm,
    suggestions,
    isLoading,
    isOpen,
    selectLocation,
    clearSearch,
  } = useLocationSearch();

  const educationLevels = [
    "Early Education",
    "Primary",
    "Secondary",
    "Tertiary",
    "Professional",
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleLocationSelect = (location) => {
    selectLocation(location);
    setFormData((prev) => ({ ...prev, location: location }));
    if (errors.location) {
      setErrors((prev) => ({ ...prev, location: "" }));
    }
  };

  const handleLocationInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setFormData((prev) => ({ ...prev, location: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.learnerName.trim()) newErrors.learnerName = "Learner name is required";
    if (!formData.institutionName.trim()) newErrors.institutionName = "Institution name is required";
    if (!formData.gender) newErrors.gender = "Please select a gender";
    if (!formData.educationLevel) newErrors.educationLevel = "Please select education level";
    if (!formData.location.trim()) newErrors.location = "Location is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post("/enrollment", {
        learnerName: formData.learnerName,
        institutionName: formData.institutionName,
        gender: formData.gender,
        disability: formData.disability,
        educationLevel: formData.educationLevel,
        location: formData.location,
      });

      setSubmitStatus("success");
      setFormData({
        learnerName: "",
        institutionName: "",
        gender: "",
        disability: false,
        educationLevel: "",
        location: "",
      });
      clearSearch();

      if (onEnrollSuccess) {
        onEnrollSuccess();
      }

      setTimeout(() => setSubmitStatus(null), 3000);
    } catch (error) {
      setSubmitStatus("error");
      console.error("Enrollment error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="section-container">
      <h2 className="section-title">Enroll New Learner</h2>

      {submitStatus === "success" && (
        <div className="alert alert-success">Learner added successfully!</div>
      )}
      {submitStatus === "error" && (
        <div className="alert alert-error">Failed to enroll learner. Please try again.</div>
      )}

      <form onSubmit={handleSubmit} className="enrollment-form">
        <div className="enrollment-columns">
          {/* Column 1 */}
          <div className="enrollment-column">
            <div className="form-group">
              <label className="form-label" htmlFor="learnerName">
                Name of Learner
              </label>
              <input
                type="text"
                id="learnerName"
                name="learnerName"
                value={formData.learnerName}
                onChange={handleChange}
                className={`form-input ${errors.learnerName ? "input-error" : ""}`}
                placeholder="Enter learner name"
              />
              {errors.learnerName && (
                <span className="error-message">{errors.learnerName}</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="institutionName">
                Name of Institution
              </label>
              <input
                type="text"
                id="institutionName"
                name="institutionName"
                value={formData.institutionName}
                onChange={handleChange}
                className={`form-input ${errors.institutionName ? "input-error" : ""}`}
                placeholder="Enter institution name"
              />
              {errors.institutionName && (
                <span className="error-message">{errors.institutionName}</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Gender</label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="gender"
                    value="Male"
                    checked={formData.gender === "Male"}
                    onChange={handleChange}
                    className="radio-input"
                  />
                  Male
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="gender"
                    value="Female"
                    checked={formData.gender === "Female"}
                    onChange={handleChange}
                    className="radio-input"
                  />
                  Female
                </label>
              </div>
              {errors.gender && (
                <span className="error-message">{errors.gender}</span>
              )}
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="disability"
                  checked={formData.disability}
                  onChange={handleChange}
                  className="checkbox-input"
                />
                Yes, has a disability
              </label>
            </div>
          </div>

          {/* Column 2 */}
          <div className="enrollment-column">
            <div className="form-group">
              <label className="form-label" htmlFor="educationLevel">
                Education Level
              </label>
              <select
                id="educationLevel"
                name="educationLevel"
                value={formData.educationLevel}
                onChange={handleChange}
                className={`form-select ${errors.educationLevel ? "input-error" : ""}`}
              >
                <option value="">Select Level</option>
                {educationLevels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
              {errors.educationLevel && (
                <span className="error-message">{errors.educationLevel}</span>
              )}
            </div>
          </div>

          {/* Column 3 */}
          <div className="enrollment-column">
            <div className="form-group">
              <label className="form-label" htmlFor="location">
                Geographical Location
              </label>
              <div className="autocomplete-wrapper">
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={searchTerm}
                  onChange={handleLocationInputChange}
                  className={`form-input ${errors.location ? "input-error" : ""}`}
                  placeholder="Search location..."
                  autoComplete="off"
                />
                {isLoading && (
                  <span className="autocomplete-spinner">⟳</span>
                )}
                {searchTerm && !isLoading && (
                  <button
                    type="button"
                    className="autocomplete-clear"
                    onClick={clearSearch}
                  >
                    ✕
                  </button>
                )}
                {isOpen && suggestions.length > 0 && (
                  <ul className="autocomplete-dropdown">
                    {suggestions.map((location, index) => (
                      <li
                        key={index}
                        className="autocomplete-item"
                        onClick={() => handleLocationSelect(location)}
                      >
                        {location}
                      </li>
                    ))}
                  </ul>
                )}
                {isOpen && !isLoading && suggestions.length === 0 && (
                  <ul className="autocomplete-dropdown">
                    <li className="autocomplete-item no-results">
                      No locations found
                    </li>
                  </ul>
                )}
              </div>
              {errors.location && (
                <span className="error-message">{errors.location}</span>
              )}
            </div>
          </div>
        </div>

        <div className="form-footer">
          <button type="submit" className="btn-submit" disabled={isSubmitting}>
            {isSubmitting ? "Adding..." : "Add Learner"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EnrollmentForm;