import { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "40px", textAlign: "center" }}>
          <h2 style={{ color: "#e53935" }}>Something went wrong</h2>
          <p style={{ color: "#666", marginTop: "16px" }}>
            {this.state.error?.message || "Unknown error"}
          </p>
          <pre style={{ 
            background: "#f5f5f5", 
            padding: "16px", 
            borderRadius: "8px", 
            marginTop: "16px",
            textAlign: "left",
            maxWidth: "600px",
            margin: "16px auto",
            overflow: "auto",
            fontSize: "12px"
          }}>
            {this.state.error?.stack || "No stack trace"}
          </pre>
          <button 
            onClick={() => window.location.reload()}
            style={{
              marginTop: "24px",
              padding: "12px 24px",
              background: "#ff6b00",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "14px"
            }}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;