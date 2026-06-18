import { useCopyToClipboard } from "../../hooks/useCopyToClipboard";
import "../../styles/auth.css";

const PasswordModal = ({ password, onClose }) => {
  const { copied, copyToClipboard } = useCopyToClipboard();

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3 className="modal-title">Your Password</h3>
        <p className="modal-warning">
          Copy this password now. <strong>It will not be shown again.</strong>
        </p>
        <div className="password-display">
          <code className="password-text">{password}</code>
          <button
            className="btn-copy"
            onClick={() => copyToClipboard(password)}
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
        <p className="modal-info">
          This password has also been sent to your email.
        </p>
        <button className="btn-auth" onClick={onClose}>
          I've Saved My Password
        </button>
      </div>
    </div>
  );
};

export default PasswordModal;