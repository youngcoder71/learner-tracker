import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { loginUser } from "../../services/authService";
import "../../styles/auth.css";

const LoginForm = ({ onSwitchView }) => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    if (serverError) setServerError("");
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
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
      const data = await loginUser(formData.email, formData.password);
      login(data.user, data.token);
    } catch (error) {
      setServerError(error.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-card">
      <h2 className="auth-title">Welcome Back</h2>
      <p className="auth-subtitle">Sign in to your account</p>

      {serverError && <div className="alert alert-error">{serverError}</div>}

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label className="form-label" htmlFor="loginEmail">Email</label>
          <input
            type="email"
            id="loginEmail"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`form-input ${errors.email ? "input-error" : ""}`}
            placeholder="Enter your email"
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="loginPassword">Password</label>
          <input
            type="password"
            id="loginPassword"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`form-input ${errors.password ? "input-error" : ""}`}
            placeholder="Enter your password"
          />
          {errors.password && <span className="error-message">{errors.password}</span>}
        </div>

        <button type="submit" className="btn-auth" disabled={isSubmitting}>
          {isSubmitting ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <div className="auth-links">
        <button onClick={() => onSwitchView("forgot")} className="auth-link">
          Forgot password?
        </button>
        <p className="auth-text">
          Don't have an account?{" "}
          <button onClick={() => onSwitchView("register")} className="auth-link">
            Register
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;