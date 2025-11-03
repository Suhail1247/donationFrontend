import React, { createContext, useState, useEffect, useContext } from "react";
import { loginUser, registerUser } from "../Api/connect";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (err) {
        console.error("Failed to load user from localStorage", err);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (formData) => {
    const response = await loginUser(formData);
    if (response.status && response.user) {
      const fullUser = { ...response.user, token: response.token };
      setUser(fullUser);
      localStorage.setItem("user", JSON.stringify(fullUser));
      localStorage.setItem("token", response.token);
      return response;
    } else {
      throw new Error(response.message || "Login failed");
    }
  };

  const register = async (formData) => {
    const response = await registerUser(formData);
    return response;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
