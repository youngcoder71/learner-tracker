import { useState } from "react";
import { registerUser } from "../../services/authService";
import PasswordModal from "./PasswordModal";
import "../../styles/auth.css";

const RegisterForm = ({ onSwitchView }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    schoolName: "",
    email: "",
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    if (serverError) setServerError("");
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.schoolName.trim()) newErrors.schoolName = "School name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Invalid email format";
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
      const data = await registerUser({
        ...formData,
        position: "teacher", // Default position
      });
      setGeneratedPassword(data.password);
      setShowModal(true);
    } catch (error) {
      setServerError(error.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setGeneratedPassword("");
    onSwitchView("login");
  };

  return (
    <>
      <div className="auth-card">
        <h2 className="auth-title">Create Account</h2>
        <p className="auth-subtitle">Register to get started</p>

        {serverError && <div className="alert alert-error">{serverError}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label" htmlFor="fullName">Full Name</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className={`form-input ${errors.fullName ? "input-error" : ""}`}
              placeholder="Enter your full name"
            />
            {errors.fullName && <span className="error-message">{errors.fullName}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="schoolName">Name of School / Institution</label>
            <input
              type="text"
              id="schoolName"
              name="schoolName"
              value={formData.schoolName}
              onChange={handleChange}
              className={`form-input ${errors.schoolName ? "input-error" : ""}`}
              placeholder="Enter school or institution name"
            />
            {errors.schoolName && <span className="error-message">{errors.schoolName}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="regEmail">Email</label>
            <input
              type="email"
              id="regEmail"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`form-input ${errors.email ? "input-error" : ""}`}
              placeholder="Enter your email"
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <button type="submit" className="btn-auth" disabled={isSubmitting}>
            {isSubmitting ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div className="auth-links">
          <p className="auth-text">
            Already have an account?{" "}
            <button onClick={() => onSwitchView("login")} className="auth-link">
              Sign In
            </button>
          </p>
        </div>
      </div>

      {showModal && (
        <PasswordModal password={generatedPassword} onClose={handleCloseModal} />
      )}
    </>
  );
};

export default RegisterForm;