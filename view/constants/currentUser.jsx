/* eslint-disable react/prop-types */
import { createContext, useEffect, useState } from "react";
import { apiUrl } from "../src/lib/apis";
import Loader2 from "../src/components/loader2";

export const CurrentUserContext = createContext();

const CurrentUser = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnAdmin, setIsAnAdmin] = useState(null);

  useEffect(() => {
    const initializeUser = async () => {
      setIsLoading(true);
      try {
        // Check for existing session
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        const storedUser = localStorage.getItem("user") || sessionStorage.getItem("user");
        // const storedIsAdmin = localStorage.getItem("isAdmin") === "true";

        if (token && storedUser) {
          // Verify token with backend
          const response = await fetch(`${apiUrl}/currentUser`, {
            method: "GET",
            headers: { token },
            credentials: 'include'
          });

          const data = await response.json();

          if (response.ok) {
            setCurrentUser(data.user);
            setIsAnAdmin(data.isAdmin);
          } else {
            // Clear invalid session
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            localStorage.removeItem("isAdmin");
            sessionStorage.removeItem("token");
            sessionStorage.removeItem("user");
            setCurrentUser(null);
            setIsAnAdmin(false);
          }
        } else {
          // No existing session
          setCurrentUser(null);
          setIsAnAdmin(false);
        }
      } catch (error) {
        console.error("Session initialization error:", error);
        setCurrentUser(null);
        setIsAnAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    initializeUser();
  }, []);

  const logout = () => {
    // Clear all storage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("isAdmin");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    
    // Clear context
    setCurrentUser(null);
    setIsAnAdmin(false);

    // Clear cookies by calling logout endpoint
    fetch(`${apiUrl}/logout`, {
      method: "POST",
      credentials: 'include'
    }).catch(console.error);
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
        isLoading 
      }}
    >
      {children}
    </CurrentUserContext.Provider>
  );
};

export default CurrentUser;
