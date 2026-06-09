import { Component } from "react";

export class ErrorBoundary extends Component {
  state = { error: null, info: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error("[ErrorBoundary]", error, info);
    this.setState({ info });
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-8">
          <div className="max-w-lg w-full bg-red-950/40 border border-red-800 rounded-2xl p-8 text-white">
            <h1 className="text-xl font-bold text-red-400 mb-3">Erreur de chargement</h1>
            <p className="text-slate-300 text-sm mb-4">{this.state.error.message}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-700 hover:bg-red-600 text-white text-sm font-semibold px-4 py-2 rounded-lg"
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
