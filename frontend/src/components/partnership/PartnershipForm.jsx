import { useState } from "react";
import "../../styles/partnership.css";

const PartnershipForm = () => {
  const [formData, setFormData] = useState({
    partner: "",
    mou: "",
    photoLink: "",
  });

  const [csvFile, setCsvFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleRadioChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleCsvChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "text/csv") {
      setCsvFile(file);
      if (errors.csvFile) {
        setErrors((prev) => ({ ...prev, csvFile: "" }));
      }
    } else if (file) {
      setErrors((prev) => ({ ...prev, csvFile: "Please upload a valid CSV file" }));
    }
  };

  const removeCsv = () => {
    setCsvFile(null);
    const fileInput = document.getElementById("csvInput");
    if (fileInput) fileInput.value = "";
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.partner) newErrors.partner = "Required";
    if (!formData.mou) newErrors.mou = "Required";
    if (!csvFile) newErrors.csvFile = "CSV required";
    if (!formData.photoLink.trim()) {
      newErrors.photoLink = "Photo link required";
    } else if (
      !formData.photoLink.startsWith("http://") &&
      !formData.photoLink.startsWith("https://")
    ) {
      newErrors.photoLink = "Must be a valid URL";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const formPayload = new FormData();
    formPayload.append("partner", formData.partner);
    formPayload.append("mou", formData.mou);
    formPayload.append("csvFile", csvFile);
    formPayload.append("photoLink", formData.photoLink);

    try {
         const response = await fetch("http://localhost:5000/api/partnerships", {
         method: "POST",
         body: formPayload,
        });

      if (response.ok) {
        setSubmitStatus("success");
        setFormData({ partner: "", mou: "", photoLink: "" });
        setCsvFile(null);
        document.getElementById("csvInput").value = "";
        setTimeout(() => setSubmitStatus(null), 3000);
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      setSubmitStatus("error");
    }
  };

  return (
    <div className="section-container">
      <h2 className="section-title">Partnership</h2>

      {submitStatus === "success" && (
        <div className="alert alert-success">
          Partnership details submitted successfully!
        </div>
      )}
      {submitStatus === "error" && (
        <div className="alert alert-error">
          Failed to submit. Please try again.
        </div>
      )}

      <form onSubmit={handleSubmit} className="partnership-form">
        <div className="partnership-columns">
          {/* Left Column — Radio Questions */}
          <div className="partnership-column">
            <div className="partnership-row">
              <div className="form-group form-group-inline">
                <label className="form-label">Are you a partner?</label>
                <div className="radio-group">
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="partner"
                      value="Yes"
                      checked={formData.partner === "Yes"}
                      onChange={handleRadioChange}
                      className="radio-input"
                    />
                    Yes
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="partner"
                      value="No"
                      checked={formData.partner === "No"}
                      onChange={handleRadioChange}
                      className="radio-input"
                    />
                    No
                  </label>
                </div>
                {errors.partner && <span className="error-message">{errors.partner}</span>}
              </div>

              <div className="form-group form-group-inline">
                <label className="form-label">Do you have an MOU?</label>
                <div className="radio-group">
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="mou"
                      value="Yes"
                      checked={formData.mou === "Yes"}
                      onChange={handleRadioChange}
                      className="radio-input"
                    />
                    Yes
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="mou"
                      value="No"
                      checked={formData.mou === "No"}
                      onChange={handleRadioChange}
                      className="radio-input"
                    />
                    No
                  </label>
                </div>
                {errors.mou && <span className="error-message">{errors.mou}</span>}
              </div>
            </div>
          </div>

          {/* Right Column — CSV + Link */}
          <div className="partnership-column">
            <div className="form-group">
              <label className="form-label">Upload CSV</label>
              <div className="csv-compact-zone">
                {!csvFile ? (
                  <label className="csv-upload-label">
                    <span className="csv-upload-icon">📁</span>
                    <span>Choose CSV file</span>
                    <input
                      type="file"
                      id="csvInput"
                      accept=".csv"
                      onChange={handleCsvChange}
                      className="file-input-hidden"
                    />
                  </label>
                ) : (
                  <div className="csv-selected">
                    <span className="csv-name">{csvFile.name}</span>
                    <button type="button" className="file-remove-btn" onClick={removeCsv}>✕</button>
                  </div>
                )}
              </div>
              {errors.csvFile && <span className="error-message">{errors.csvFile}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="photoLink">Attach Link</label>
              <input
                type="url"
                id="photoLink"
                name="photoLink"
                value={formData.photoLink}
                onChange={handleInputChange}
                className={`form-input ${errors.photoLink ? "input-error" : ""}`}
                placeholder="https://drive.google.com/your-photo"
              />
              {errors.photoLink && <span className="error-message">{errors.photoLink}</span>}
            </div>
          </div>
        </div>

        <div className="form-footer">
          <button type="submit" className="btn-submit">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default PartnershipForm;