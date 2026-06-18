import { useState } from "react";
import { forgotPassword } from "../../services/authService";
import "../../styles/auth.css";

const ForgotPasswordForm = ({ onSwitchView }) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    setIsSubmitting(true);
    setError("");
    try {
      await forgotPassword(email);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-card">
      <h2 className="auth-title">Forgot Password</h2>
      <p className="auth-subtitle">Enter your email to receive a reset link</p>

      {success ? (
        <div className="forgot-success">
          <div className="alert alert-success">
            If an account with that email exists, a reset link has been sent.
          </div>
          <button onClick={() => onSwitchView("login")} className="btn-auth">
            Back to Sign In
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="alert alert-error">{error}</div>}
          <div className="form-group">
            <label className="form-label" htmlFor="forgotEmail">Email</label>
            <input
              type="email"
              id="forgotEmail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              placeholder="Enter your email"
            />
          </div>
          <button type="submit" className="btn-auth" disabled={isSubmitting}>
            {isSubmitting ? "Sending..." : "Send Reset Link"}
          </button>
          <div className="auth-links">
            <button onClick={() => onSwitchView("login")} className="auth-link">
              Back to Sign In
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ForgotPasswordForm;