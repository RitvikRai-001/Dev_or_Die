import { createContext, useContext, useEffect, useState } from "react";
import { apiGetCurrentUser } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);

  // On first load, ask backend: "who am I?"
  useEffect(() => {
    async function loadUser() {
      try {
        const res = await apiGetCurrentUser(); // calls /user/me with cookies

        if (res && res.user) {
          setUser(res.user);
          localStorage.setItem("user", JSON.stringify(res.user));
        } else {
          setUser(null);
          localStorage.removeItem("user");
        }
      } catch (err) {
        console.error("Error loading current user:", err);
        setUser(null);
        localStorage.removeItem("user");
      } finally {
        setInitialLoading(false);
      }
    }

    loadUser();
  }, []);

  const loginSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    // optionally call backend /logout to clear cookies
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        initialLoading,
        loginSuccess,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
