import { Routes, Route } from "react-router-dom";
import AuthPage from "./pages/AuthPage.jsx";
import "./styles/App.css";
import Home from "./pages/Home.jsx";
import Profile from "./pages/Profile.jsx";

function App() {
  return (
    <div className="app-wrapper">
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </div>
  );
}

export default App;
