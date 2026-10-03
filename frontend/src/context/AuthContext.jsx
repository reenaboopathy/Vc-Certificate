import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("vc_user");
      const token = localStorage.getItem("vc_token");
      if (storedUser && token) setUser(JSON.parse(storedUser));
      else {
        localStorage.removeItem("vc_user");
        localStorage.removeItem("vc_token");
      }
    } catch {
      localStorage.removeItem("vc_user");
      localStorage.removeItem("vc_token");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const result = await api.post("/auth/login", { email, password });
    setUser(result.user);
    localStorage.setItem("vc_user", JSON.stringify(result.user));
    localStorage.setItem("vc_token", result.token);
    return result;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("vc_user");
    localStorage.removeItem("vc_token");
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: Boolean(user), isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
