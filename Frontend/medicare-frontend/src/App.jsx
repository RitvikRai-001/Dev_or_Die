// src/App.jsx
import { Routes, Route } from "react-router-dom";
import AuthPage from "./pages/AuthPage.jsx";
import Home from "./pages/Home.jsx";
import Profile from "./pages/Profile.jsx";
import "./styles/App.css";

export default function App() {
  return (
    <div className="app-wrapper">
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/home" element={<Home />} />  {/* keep lowercase */}
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </div>
  );
}
