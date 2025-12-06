const API_BASE = "http://localhost:5000/api"; // backend URL + /api

export async function apiLogin({ email, password }) {
  const res = await fetch(`${API_BASE}/user/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // send cookies if backend sets them
    body: JSON.stringify({ email, password }),
  });

  return res.json();
}
