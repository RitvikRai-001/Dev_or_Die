// src/pages/Auth.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import SignupForm from "../components/SignupForm";
import "../styles/auth.css";
import { GoogleLogin } from "@react-oauth/google";
import { apiGoogleLogin,apiGetCapsules,apiGetCurrentUser } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Auth() {
  const [activeTab, setActiveTab] = useState("login");
  const navigate = useNavigate();
  const { loginSuccess } = useAuth();

  const handleGoogleSuccess = async (credentialResponse) => {
  try {
    const idToken = credentialResponse.credential; // ID token from Google
    console.log("Google ID Token:", idToken);

    const data = await apiGoogleLogin(idToken);
    console.log("Backend Google response:", data);

    if (!data.user) {
      alert(data.message || "Google login failed");
      return;
    }

    // Save tokens (if you're using them later)
    localStorage.setItem("accessToken", data.accessToken || "");
    localStorage.setItem("refreshToken", data.refreshToken || "");

    // ⭐ NOW ask backend: "who am I?", using the cookie/session that was just set
    let finalUser = data.user;

    try {
      const me = await apiGetCurrentUser(); // GET /user/me
      if (me && me.user) {
        finalUser = me.user;
      }
    } catch (e) {
      console.error("Error fetching /user/me after Google login:", e);
      // fall back to data.user
    }

    // Store the final user everywhere
    localStorage.setItem("user", JSON.stringify(finalUser));
    loginSuccess(finalUser); // update AuthContext

    const isGoogle = finalUser.provider === "google";
const complete = Boolean(finalUser.isProfileComplete);

// 🔥 ROLE + PROFILE aware routing
if (isGoogle && !complete) {
  navigate("/complete-profile", { replace: true });
} else if (finalUser.role === "doctor") {
  navigate("/doctor/home", { replace: true });
} else {
  navigate("/home", { replace: true });
}

  } catch (err) {
    console.error(err);
    alert("Google login error");
  }
};


  const handleGoogleError = () => {
    console.error("Google login failed");
    alert("Google login failed, please try again");
  };

  return (
    <div className="page-wrapper">
      <div className="left">
        <div className="left-inner">
          <div className="logo">🧬</div>

          <h1 className="left-title">Ranger Health</h1>

          <p className="left-sub">
            A unified digital healthcare platform for patients and doctors.
          </p>

          <p className="left-desc">
            Manage appointments, access medical records, track health, and
            communicate effectively — all from one secure, modern interface.
          </p>

          <div className="left-features">
            <p className="lf">👤 Role-based login for Patients & Doctors</p>
            <p className="lf">📅 Smart appointment scheduling</p>
            <p className="lf">🔔 Real-time updates & notifications</p>
            <p className="lf">☁️ Secure cloud record storage</p>
          </div>
        </div>
      </div>

      <div className="right-section">
        <div className="auth-card">
          <h2 className="auth-title">
            {activeTab === "login" ? "Welcome Back" : "Create Account"}
          </h2>
          <p className="auth-sub">
            {activeTab === "login"
              ? "Login to continue to Ranger Health"
              : "Sign up to get started"}
          </p>

          <div className="tab-row">
            <div
              className={`tab-indicator ${
                activeTab === "login" ? "login" : "signup"
              }`}
            ></div>

            <button
              className={`tab-item ${
                activeTab === "login" ? "active" : ""
              }`}
              onClick={() => setActiveTab("login")}
            >
              Login
            </button>

            <button
              className={`tab-item ${
                activeTab === "signup" ? "active" : ""
              }`}
              onClick={() => setActiveTab("signup")}
            >
              Sign Up
            </button>
          </div>

          {activeTab === "login" ? (
            <LoginForm />
          ) : (
            <SignupForm onSignupSuccess={() => setActiveTab("login")} />
          )}

          {/* Divider */}
          <div className="or-divider">
            <span className="line" />
            <span className="text">or</span>
            <span className="line" />
          </div>

          {/* Google Login Button */}
          <div className="google-btn-wrapper">
            <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError} />
          </div>
        </div>
      </div>
    </div>
  );
}
