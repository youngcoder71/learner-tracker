import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";
import "../../styles/auth.css";

const ResetPasswordForm = ({ onSwitchView }) => {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValid, setIsValid] = useState(null);

  useEffect(() => {
    if (token) {
      api.get(`/auth/verify-reset-token/${token}`)
        .then(() => setIsValid(true))
        .catch(() => setIsValid(false));
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      await api.post("/auth/reset-password", { token, newPassword });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isValid === null) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <p style={{ textAlign: "center" }}>Verifying reset link...</p>
        </div>
      </div>
    );
  }

  if (isValid === false) {
    return (
      <div className="auth-page">
        <div className="auth-card" style={{ textAlign: "center" }}>
          <h2 className="auth-title">Invalid Link</h2>
          <p style={{ color: "#e53935", marginBottom: "20px" }}>
            This reset link is invalid or has expired.
          </p>
          <button className="btn-auth" onClick={() => onSwitchView("forgot")}>
            Request New Link
          </button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="auth-page">
        <div className="auth-card" style={{ textAlign: "center" }}>
          <div className="alert alert-success" style={{ marginBottom: "20px" }}>
            Password reset successful!
          </div>
          <p style={{ marginBottom: "20px" }}>You can now log in with your new password.</p>
          <button className="btn-auth" onClick={() => onSwitchView("login")}>
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-card">
      <h2 className="auth-title">Reset Password</h2>
      <p className="auth-subtitle">Enter your new password</p>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label className="form-label" htmlFor="newPassword">New Password</label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="form-input"
            placeholder="Enter new password (min 6 characters)"
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="form-input"
            placeholder="Confirm your new password"
          />
        </div>
        <button type="submit" className="btn-auth" disabled={isSubmitting}>
          {isSubmitting ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordForm;