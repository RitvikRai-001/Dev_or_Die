import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/complete-profile.css";
import { apiUpdateProfile } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function CompleteProfile() {
  const navigate = useNavigate();
  const { loginSuccess } = useAuth();

  const stored = localStorage.getItem("user");
  const initialUser = stored ? JSON.parse(stored) : null;

  const [role, setRole] = useState("");


  const [form, setForm] = useState({
    age: "",
    gender: "",

    // Ranger fields
    height: "",
    weight: "",
    conditions: "",
    allergies: "",

    // Doctor fields
    specialization: "",
    licenseNumber: "",
    experience: "",
  });

  // Prefill existing data
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
        specialization: initialUser.specialization || "",
        licenseNumber: initialUser.licenseNumber || "",
        experience: initialUser.experience || "",
      }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!role) {
      alert("Please select your role");
      return;
    }

    try {
      const payload = {
        role,
        ...form,
      };

      const res = await apiUpdateProfile(payload);

if (res.success) {
  const updatedUser = res.user;

  console.log("Redirecting with role:", updatedUser.role);

  // ✅ store updated user ONCE
  localStorage.setItem("user", JSON.stringify(updatedUser));

  // ✅ update auth context ONCE
  loginSuccess(updatedUser);

  // ✅ role-based redirect
  if (updatedUser.role === "doctor") {
    navigate("/doctor/home", { replace: true });
  } else {
    navigate("/home", { replace: true });
  }
}
 else {
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
            We need a few more details to personalize your experience.
          </p>

          {/* ROLE SELECTOR */}
          <h3 className="cp-section-title">Select your role</h3>

          <div className="cp-row">
            <div className="cp-field">
              <label>Role</label>
              <select
                className="cp-input"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              >
                <option value="">Choose role</option>
                <option value="ranger">Ranger</option>
                <option value="doctor">Doctor</option>
              </select>
            </div>
          </div>

          <h3 className="cp-section-title">Essential details</h3>

          <form className="cp-form" onSubmit={handleSubmit}>
            {/* AGE + GENDER */}
            <div className="cp-row">
              <div className="cp-field">
                <label>Age</label>
                <input
                  type="number"
                  name="age"
                  className="cp-input"
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
                </select>
              </div>
            </div>

            {/* RANGER FIELDS */}
            {role === "ranger" && (
              <>
                <div className="cp-row">
                  <div className="cp-field">
                    <label>Height (cm)</label>
                    <input
                      type="number"
                      name="height"
                      className="cp-input"
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
                      value={form.weight}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="cp-field-wide">
                  <label>Medical Conditions</label>
                  <textarea
                    name="conditions"
                    className="cp-input cp-textarea"
                    value={form.conditions}
                    onChange={handleChange}
                  />
                </div>

                <div className="cp-field-wide">
                  <label>Allergies</label>
                  <textarea
                    name="allergies"
                    className="cp-input cp-textarea"
                    value={form.allergies}
                    onChange={handleChange}
                  />
                </div>
              </>
            )}

            {/* DOCTOR FIELDS */}
            {role === "doctor" && (
              <>
                <div className="cp-row">
                  <div className="cp-field">
                    <label>Specialization</label>
                    <input
                      type="text"
                      name="specialization"
                      className="cp-input"
                      value={form.specialization}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="cp-field">
                    <label>Experience (years)</label>
                    <input
                      type="number"
                      name="experience"
                      className="cp-input"
                      value={form.experience}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="cp-field-wide">
                  <label>License Number</label>
                  <input
                    type="text"
                    name="licenseNumber"
                    className="cp-input"
                    value={form.licenseNumber}
                    onChange={handleChange}
                    required
                  />
                </div>
              </>
            )}

            <button className="cp-submit-btn" type="submit">
              Save Profile
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
