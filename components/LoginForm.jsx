import { useState } from "react";

export default function LoginForm() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    return (
        <form className="form">
            <input 
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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
            <button
                type="button"
                className="google-btn"
                onClick={() => alert("Google Login coming soon!")}
            >
                <img
                    src="https://developers.google.com/identity/images/g-logo.png"
                    alt="Google"
                    className="google-icon"
                />
                Login in with Google
            </button>
        </form>
    );
}
