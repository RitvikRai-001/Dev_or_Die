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

export async function apiSignup({
  username,
  fullname,
  email,
  password,
  age,
  gender,
  role,
}) {
  const res = await fetch(`${API_BASE}/user/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      username,
      fullname,
      email,
      password,
      age,
      gender,
      role,
    }),
  });

  return res.json();
}

export async function apiCreateCapsule(capsuleData) {
  const res = await fetch(`${API_BASE}/capsule`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", 
    body: JSON.stringify(capsuleData),
  });

  return res.json();
}
export async function apiGetCurrentUser() {
  const res = await fetch(`${API_BASE}/user/me`, {
    method: "GET",
    credentials: "include",  
  });
  return res.json();
}

export async function apiGetCapsules() {
  const res = await fetch(`${API_BASE}/capsule`, {
    method: "GET",
    credentials: "include",
  });

  return res.json();
}
export async function apiUpdateProfile(profileData) {
  const res = await fetch(`${API_BASE}/user/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(profileData),
  });

  return res.json();
}


export async function apiGoogleLogin(idToken) {
  const res = await fetch(`${API_BASE}/auth/google`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // keep same pattern as others if you later set cookies
    body: JSON.stringify({ idToken }),
  });

  return res.json();
}
export async function apiLogout() {
  const res = await fetch(`${API_BASE}/user/logout`, {
    method: "POST",
    credentials: "include",  // send cookies so backend can clear them
  });

  return res.json();
}





// --------------------------------------------------
// MARK DOSE AS TAKEN (frontend → backend)
// --------------------------------------------------
export async function apiMarkDoseTaken(capsuleId, scheduledTime) {
  const res = await fetch(`${API_BASE}/doseLog/take/${capsuleId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ scheduledTime }),
  });

  return res.json();
}

// --------------------------------------------------
// GET DOSE LOGS (timeline)
// --------------------------------------------------
export async function apiGetDoseLogs() {
  const res = await fetch(`${API_BASE}/doseLog/timeline`, {
    method: "GET",
    credentials: "include",
  });

  return res.json();
}

// --------------------------------------------------
// GET ADHERENCE STATS (% taken vs missed)
// --------------------------------------------------
export async function apiGetAdherence(days = 30) {
  const res = await fetch(`${API_BASE}/doseLog/adherence?days=${days}`, {
    method: "GET",
    credentials: "include",
  });

  return res.json();
}




