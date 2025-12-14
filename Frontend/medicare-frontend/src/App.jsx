// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "./pages/AuthPage.jsx";
import Home from "./pages/Home.jsx";
import Profile from "./pages/Profile.jsx";
import CompleteProfile from "./pages/CompleteProfile.jsx";
import DoctorHome from "./pages/DoctorHome.jsx"


import ProtectedRoute from "./components/ProtectedRoute.jsx";
import DoctorRoute from "./components/DoctorRoute.jsx";

import "./styles/App.css";




export default function App() {
  return (
    <div className="app-wrapper">
      <Routes>
        {/* Public auth page */}
        <Route path="/" element={<AuthPage />} />

        {/* Protected pages */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
                <Route
          path="/complete-profile"
          element={
            <ProtectedRoute>
              <CompleteProfile />
            </ProtectedRoute>
          }
        />
        {/* Doctor Protected Route */}
        <Route
          path="/doctor/home"
          element={
            <DoctorRoute>
              <DoctorHome />
            </DoctorRoute>
          }
        />



        {/* Fallback: any unknown route → auth */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
