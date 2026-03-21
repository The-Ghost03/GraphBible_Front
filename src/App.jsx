import { BrowserRouter as Router } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AppRouter } from "./app/router";

export default function App() {
  return (
    <Router>
      <AppRouter />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#1e293b", // slate-800
            color: "#fff",
            borderRadius: "12px",
          },
          success: {
            iconTheme: {
              primary: "#22c55e", // green-500
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444", // red-500
              secondary: "#fff",
            },
          },
        }}
      />
    </Router>
  );
}
