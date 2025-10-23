import { createContext, useState, useEffect, useContext } from "react";
import { loginUser, registerUser } from "../Api/connect";
const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const login = async (formData) => {
    try {
      
      const response = await loginUser(formData);
console.log('here',response);

      if (response.status && response.user) {
        // Store user in state only
        setUser({
          ...response.user,
          token: response.token,
          monthlyDonations: [],
        });
        localStorage.setItem("user", JSON.stringify(response.user));
        localStorage.setItem("token", response.token);
      
        return response
      } else {
        throw new Error(response.data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };


  const register = async (formData) => {
    try {
      const respose = await registerUser(formData);

      return respose; // let Register page decide what to do next
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};
