import { useState } from "react";
import useLocationSearch from "../../hooks/useLocationSearch";
import api from "../../services/api";
import CSVUpload from "./CSVUpload";
import "../../styles/enrollment.css";

const EnrollmentForm = ({ onEnrollSuccess }) => {
  const [activeTab, setActiveTab] = useState("manual");
  const [formData, setFormData] = useState({
    learnerName: "", institutionName: "", gender: "", disability: false,
    educationLevel: "", areaType: "Rural", location: "",
  });
  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { searchTerm, setSearchTerm, suggestions, isLoading, isOpen, selectLocation, clearSearch } = useLocationSearch();
  const educationLevels = ["Early Education", "Primary", "Secondary", "Tertiary", "Professional"];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleLocationSelect = (loc) => { selectLocation(loc); setFormData(prev => ({ ...prev, location: loc })); };
  const handleLocationInput = (e) => { setSearchTerm(e.target.value); setFormData(prev => ({ ...prev, location: e.target.value })); };

  const validate = () => {
    const e = {};
    if (!formData.learnerName.trim()) e.learnerName = "Required";
    if (!formData.institutionName.trim()) e.institutionName = "Required";
    if (!formData.gender) e.gender = "Required";
    if (!formData.educationLevel) e.educationLevel = "Required";
    if (!formData.location.trim()) e.location = "Required";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validate();
    if (Object.keys(v).length) { setErrors(v); return; }
    setIsSubmitting(true);
    try {
      await api.post("/enrollment", formData);
      setSubmitStatus("success");
      setFormData({ learnerName: "", institutionName: "", gender: "", disability: false, educationLevel: "", areaType: "Rural", location: "" });
      clearSearch();
      if (onEnrollSuccess) onEnrollSuccess();
      setTimeout(() => setSubmitStatus(null), 3000);
    } catch { setSubmitStatus("error"); } finally { setIsSubmitting(false); }
  };

  return (
    <div className="section-container">
      <h2 className="section-title">Enrollment</h2>
      <div className="enrollment-tabs">
        <button className={`tab-btn ${activeTab === "manual" ? "active" : ""}`} onClick={() => setActiveTab("manual")}>📝 Manual</button>
        <button className={`tab-btn ${activeTab === "csv" ? "active" : ""}`} onClick={() => setActiveTab("csv")}>📁 CSV</button>
      </div>
      {activeTab === "manual" && (
        <>
          {submitStatus === "success" && <div className="alert alert-success">Learner added!</div>}
          {submitStatus === "error" && <div className="alert alert-error">Failed.</div>}
          <form onSubmit={handleSubmit} className="enrollment-form">
            <div className="enrollment-columns">
              <div className="enrollment-column">
                <div className="form-group"><label className="form-label">Name</label><input type="text" name="learnerName" value={formData.learnerName} onChange={handleChange} className={`form-input ${errors.learnerName?"input-error":""}`} /></div>
                <div className="form-group"><label className="form-label">Institution</label><input type="text" name="institutionName" value={formData.institutionName} onChange={handleChange} className={`form-input ${errors.institutionName?"input-error":""}`} /></div>
                <div className="form-group"><label className="form-label">Gender</label><div className="radio-group"><label className="radio-label"><input type="radio" name="gender" value="Male" checked={formData.gender==="Male"} onChange={handleChange} /> Male</label><label className="radio-label"><input type="radio" name="gender" value="Female" checked={formData.gender==="Female"} onChange={handleChange} /> Female</label></div></div>
                <div className="form-group"><label className="checkbox-label"><input type="checkbox" name="disability" checked={formData.disability} onChange={handleChange} /> Disability</label></div>
              </div>
              <div className="enrollment-column">
                <div className="form-group"><label className="form-label">Education Level</label><select name="educationLevel" value={formData.educationLevel} onChange={handleChange} className={`form-select ${errors.educationLevel?"input-error":""}`}><option value="">Select</option>{educationLevels.map(l=><option key={l} value={l}>{l}</option>)}</select></div>
              </div>
              <div className="enrollment-column">
                <div className="form-group"><label className="form-label">Area Type</label><select name="areaType" value={formData.areaType} onChange={handleChange} className="form-select"><option value="Rural">Rural</option><option value="Urban">Urban</option></select></div>
                <div className="form-group">
                  <label className="form-label">Location</label>
                  <div className="autocomplete-wrapper">
                    <input type="text" value={searchTerm} onChange={handleLocationInput} className={`form-input ${errors.location?"input-error":""}`} placeholder="Search..." autoComplete="off" />
                    {isLoading && <span className="autocomplete-spinner">⟳</span>}
                    {searchTerm && !isLoading && <button type="button" className="autocomplete-clear" onClick={clearSearch}>✕</button>}
                    {isOpen && suggestions.length>0 && <ul className="autocomplete-dropdown">{suggestions.map((l,i)=><li key={i} className="autocomplete-item" onClick={()=>handleLocationSelect(l)}>{l}</li>)}</ul>}
                    {isOpen && !isLoading && suggestions.length===0 && <ul className="autocomplete-dropdown"><li className="autocomplete-item no-results">No results</li></ul>}
                  </div>
                </div>
              </div>
            </div>
            <div className="form-footer"><button type="submit" className="btn-submit" disabled={isSubmitting}>{isSubmitting?"Adding...":"Add Learner"}</button></div>
          </form>
        </>
      )}
      {activeTab === "csv" && <CSVUpload onSuccess={onEnrollSuccess} />}
    </div>
  );
};

export default EnrollmentForm;