import { useState } from "react";
import LoginForm from "../components/LoginForm";
import SignupForm from "../components/SignupForm";
import "../styles/auth.css";

export default function Auth() {
    const [activeTab, setActiveTab] = useState("login");

    return (
        <div className="page-wrapper">

            <div className="left">
                <div className="left-inner">

                    <div className="logo">
                        🧬
                    </div>

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
                            ? "Login to continue to Medicare"
                            : "Sign up to get started"}
                    </p>

                    <div className="tab-row">
                        <div
                            className={`tab-indicator ${activeTab === "login" ? "login" : "signup"}`}
                        ></div>

                        <button
                            className={`tab-item ${activeTab === "login" ? "active" : ""}`}
                            onClick={() => setActiveTab("login")}
                        >
                            Login
                        </button>

                        <button
                            className={`tab-item ${activeTab === "signup" ? "active" : ""}`}
                            onClick={() => setActiveTab("signup")}
                        >
                            Sign Up
                        </button>
                    </div>

                    {activeTab === "login" ? <LoginForm /> : <SignupForm />}
                </div>
            </div>
        </div>
    );
}
