/* eslint-disable react/prop-types */
import { createContext, useEffect, useState } from "react";
import { apiUrl } from "../src/lib/apis";
import Loader2 from "../src/components/loader2";

export const CurrentUserContext = createContext();

const CurrentUser = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAnAdmin, setIsAnAdmin] = useState(false);

  const fetchCurrentUser = async (token) => {
    try {
      const response = await fetch(`${apiUrl}/currentUser`, {
        method: "GET",
        headers: { token },
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        setCurrentUser(data.user);
        setIsAnAdmin(data.isAdmin);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error fetching current user:", error);
      return false;
    }
  };

  const initializeUser = async () => {
    setIsLoading(true);
    try {
      // Check for existing session
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      const storedUser =
        localStorage.getItem("user") || sessionStorage.getItem("user");

      if (token && storedUser) {
        // Try to verify token with backend
        const isValid = await fetchCurrentUser(token);

        if (!isValid) {
          // Clear invalid session
          clearUserSession();
        }
      } else {
        // No existing session
        clearUserSession();
      }
    } catch (error) {
      console.error("Session initialization error:", error);
      clearUserSession();
    } finally {
      setIsLoading(false);
    }
  };

  const clearUserSession = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("isAdmin");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    setCurrentUser(null);
    setIsAnAdmin(false);
  };

  const updateUserSession = (userData, token, isAdmin, rememberMe) => {
    // Update context
    setCurrentUser(userData);
    setIsAnAdmin(isAdmin);

    // Update storage
    if (rememberMe) {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));
      if (isAdmin) localStorage.setItem("isAdmin", "true");
    } else {
      sessionStorage.setItem("token", token);
      sessionStorage.setItem("user", JSON.stringify(userData));
    }
  };

  useEffect(() => {
    initializeUser();
  }, []);

  const logout = async () => {
    try {
      // Clear all storage
      clearUserSession();

      // Clear cookies by calling logout endpoint
      await fetch(`${apiUrl}/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (isLoading) {
    return <Loader2 />;
  }

  return (
    <CurrentUserContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        isAnAdmin,
        setIsAnAdmin,
        logout,
        isLoading,
        updateUserSession,
        fetchCurrentUser,
      }}
    >
      {children}
    </CurrentUserContext.Provider>
  );
};

export default CurrentUser;
