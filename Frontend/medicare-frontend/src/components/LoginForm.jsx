import { useState } from "react";
import { apiLogin } from "../services/api"; // adjust path

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Login form submitted"); 
    try {
      const data = await apiLogin({ email, password });
      console.log("Login response:", data); // debug 2

      if (data.success) {
  const userDetails = `
    🎉 Login Successful!

    Username: ${data.user?.username || "N/A"}
    Full Name: ${data.user?.fullname || "N/A"}
    Email: ${data.user?.email || "N/A"}
    Age: ${data.user?.age || "N/A"}
    Gender: ${data.user?.gender || "N/A"}
    Role: ${data.user?.role || "N/A"}
  `;

  alert(userDetails);

        if (data.accessToken) {
          localStorage.setItem("token", data.accessToken);
        }
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

      <button type="submit" className="form-btn">Login</button>
    </form>
  );
}
