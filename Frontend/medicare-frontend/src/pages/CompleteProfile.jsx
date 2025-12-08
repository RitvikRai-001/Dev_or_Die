import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/complete-profile.css";
import TopNav from "../components/TopNav";
import { apiUpdateProfile } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function CompleteProfile() {
  const navigate = useNavigate();
  const { loginSuccess } = useAuth();

  // ✅ Get username from stored user object (not "username" key)
  const stored = localStorage.getItem("user");
  let username = "User";

  const initialUser = stored ? JSON.parse(stored) : null;
  if (initialUser) {
    username = initialUser.fullname || initialUser.username || "User";
  }

  const [form, setForm] = useState({
    age: "",
    gender: "",
    height: "",
    weight: "",
    conditions: "",
    allergies: "",
  });

  // ✅ Prefill from backend user (if any values already exist)
  useEffect(() => {
    if (initialUser) {
      setForm((prev) => ({
        ...prev,
        age: initialUser.age || "",
        gender: initialUser.gender || "",
        height: initialUser.height || "",
        weight: initialUser.weight || "",
        conditions: initialUser.conditions || "",
        allergies: initialUser.allergies || "",
      }));
    }
  }, []); // run once

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await apiUpdateProfile(form);

if (res.success) {
  // update both localStorage AND context
  console.log("Updated user from /user/profile =", res.user);

  localStorage.setItem("user", JSON.stringify(res.user));
  loginSuccess(res.user);  // 👈 very important

  alert("Profile completed successfully!");
  navigate("/home");
} else {
  alert(res.message || "Could not complete profile");
}

    } catch (err) {
      console.error("Complete profile error:", err);
      alert("Something went wrong while completing profile.");
    }
  };

  return (
    <div className="cp-wrapper">


      <div className="cp-page">
        <div className="cp-container card">
          <h2 className="cp-title">Complete your profile</h2>
          <p className="cp-subtitle">
            We need a few more health details to personalize your care experience.
          </p>

          <h3 className="cp-section-title">Essential health details</h3>

          <form className="cp-form" onSubmit={handleSubmit}>
            {/* AGE + GENDER */}
            <div className="cp-row">
              <div className="cp-field">
                <label>Age</label>
                <input
                  type="number"
                  name="age"
                  className="cp-input"
                  placeholder="Enter age"
                  min="1"
                  value={form.age}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="cp-field">
                <label>Gender</label>
                <select
                  name="gender"
                  className="cp-input"
                  value={form.gender}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer_not_to_say">Prefer not to say</option>
                </select>
              </div>
            </div>

            {/* HEIGHT + WEIGHT */}
            <div className="cp-row">
              <div className="cp-field">
                <label>Height (cm)</label>
                <input
                  type="number"
                  name="height"
                  className="cp-input"
                  placeholder="e.g., 170"
                  min="1"
                  value={form.height}
                  onChange={handleChange}
                />
              </div>

              <div className="cp-field">
                <label>Weight (kg)</label>
                <input
                  type="number"
                  name="weight"
                  className="cp-input"
                  placeholder="e.g., 65"
                  min="1"
                  value={form.weight}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* CONDITIONS */}
            <div className="cp-field-wide">
              <label>Medical Conditions</label>
              <textarea
                name="conditions"
                className="cp-input cp-textarea"
                placeholder="List any medical conditions"
                value={form.conditions}
                onChange={handleChange}
              />
            </div>

            {/* ALLERGIES */}
            <div className="cp-field-wide">
              <label>Allergies</label>
              <textarea
                name="allergies"
                className="cp-input cp-textarea"
                placeholder="List allergies if any"
                value={form.allergies}
                onChange={handleChange}
              />
            </div>

            <button className="cp-submit-btn" type="submit">
              Save Profile
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
