import { useState, useRef } from "react";
import api from "../../services/api";
import "../../styles/enrollment.css";

const CSVUpload = ({ onSuccess }) => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === "text/csv") {
      setFile(selectedFile);
      setError(null);
      setResult(null);
    } else if (selectedFile) {
      setError("Please select a valid CSV file");
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === "text/csv") {
      setFile(droppedFile);
      setError(null);
      setResult(null);
    } else {
      setError("Please drop a valid CSV file");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const removeFile = () => {
    setFile(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const downloadTemplate = () => {
    const csvContent = "learner_name,institution_name,gender,disability,education_level,location\nJohn Doe,St Mary School,Male,No,Primary,Dar es Salaam\nJane Smith,St Mary School,Female,Yes,Secondary,Arusha";
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "learner_template.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("csvFile", file);

      const response = await api.post("/enrollment/csv", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setResult(response.data);
      if (response.data.enrolled > 0 && onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="csv-upload-container">
      <div className="csv-header">
        <h3>Bulk Upload (CSV)</h3>
        <button type="button" className="btn-template" onClick={downloadTemplate}>
          📥 Download Template
        </button>
      </div>

      <p className="csv-instructions">
        Fill the template with learner details and upload the CSV file.
      </p>

      <div
        className={`csv-dropzone ${file ? "has-file" : ""}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {!file ? (
          <>
            <span className="csv-drop-icon">📁</span>
            <p>Drag & drop CSV file here</p>
            <p className="csv-or">or</p>
            <label className="csv-browse-btn">
              Browse Files
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                ref={fileInputRef}
                className="file-input-hidden"
              />
            </label>
          </>
        ) : (
          <div className="csv-file-info">
            <span className="csv-file-icon">📄</span>
            <span className="csv-file-name">{file.name}</span>
            <span className="csv-file-size">({(file.size / 1024).toFixed(1)} KB)</span>
            <button type="button" className="csv-remove-btn" onClick={removeFile}>
              ✕
            </button>
          </div>
        )}
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {result && (
        <div className={`csv-result ${result.errors?.length > 0 ? "has-errors" : "all-success"}`}>
          <p className="csv-result-summary">
            ✅ {result.enrolled} learners enrolled
            {result.errors?.length > 0 && ` • ⚠️ ${result.errors.length} errors`}
          </p>
          {result.errors?.length > 0 && (
            <ul className="csv-error-list">
              {result.errors.map((err, i) => (
                <li key={i}>{err.message}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      {file && (
        <button
          className="btn-submit"
          onClick={handleUpload}
          disabled={isUploading}
          style={{ marginTop: "16px" }}
        >
          {isUploading ? "Uploading..." : "Upload CSV"}
        </button>
      )}
    </div>
  );
};

export default CSVUpload;