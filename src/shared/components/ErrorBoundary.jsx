import { Component } from "react";

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error("[ErrorBoundary]", error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0f172a", padding: "2rem" }}>
          <div style={{ maxWidth: "32rem", width: "100%", background: "rgba(127,29,29,0.25)", border: "1px solid #991b1b", borderRadius: "1rem", padding: "2rem", color: "#fff" }}>
            <h1 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#f87171", marginBottom: "0.75rem" }}>
              Erreur de chargement
            </h1>
            <p style={{ color: "#cbd5e1", fontSize: "0.875rem", marginBottom: "1rem" }}>
              {this.state.error.message}
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{ background: "#b91c1c", color: "#fff", fontSize: "0.875rem", fontWeight: 600, padding: "0.5rem 1rem", borderRadius: "0.5rem", border: "none", cursor: "pointer" }}
            >
              Recharger la page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
