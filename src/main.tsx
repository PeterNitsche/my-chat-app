import React from "react";
import ReactDOM from "react-dom/client";
import ParticipationApp from "./participation-frontend/App.tsx";
import OrganizerApp from "./organizer-frontend/App.tsx";

import "./index.css";

const App = window.location.pathname.startsWith("/participation")
  ? ParticipationApp
  : OrganizerApp;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
