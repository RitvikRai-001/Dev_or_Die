import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiLogin } from "../services/api";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Login form submitted");

    try {
      const data = await apiLogin({ email, password });
      console.log("Login response:", data);

      if (data.user) {
        alert("Login successful");

        if (data.accessToken) {
          localStorage.setItem("token", data.accessToken);
        }
        localStorage.setItem("user", JSON.stringify(data.user));

        navigate("/home");
      } else {
        alert(data.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Something went wrong while logging in");
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button type="submit" className="form-btn">
        Login
      </button>
    </form>
  );
}
