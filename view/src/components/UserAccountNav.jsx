/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useRef, useEffect, useContext } from "react";
import { FaBell, FaUserAlt, FaSignOutAlt, FaChevronDown } from "react-icons/fa";
import { ThemeContext } from "../../constants/ThemeContext";
import { CurrentUserContext } from "../../constants/currentUser";
import { apiUrl } from "../lib/apis";
import { toast, ToastContainer } from "react-toastify";

const UserNav = ({ currentBar }) => {
  const [showNotificationDropdown, setShowNotificationDropdown] =
    useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [hasNewNotifications, setHasNewNotifications] = useState(true);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { currentUser } = useContext(CurrentUserContext);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const notificationRef = useRef();
  const userRef = useRef();

  const handleConfirmLogout = () => {
    setIsLoggingOut(true);
    fetch(`${apiUrl}/logout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "Logged out") {
          localStorage.removeItem("token");
          window.location.href = "/";
        }
      })
      .catch(() => {
        toast.error("Can't logout!");
      })
      .finally(() => {
        setIsLoggingOut(false);
      });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotificationDropdown(false);
      }
      if (userRef.current && !userRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (currentUser) {
      setIsLoading(false);
    }
  }, [currentUser]);

  if (isLoggingOut) {
    return (
      <div className="flex justify-center h-16 items-center bg-gray-100 dark:bg-gray-800">
        <span className="text-gray-600 dark:text-gray-200">Signing out...</span>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-[200px] bg-gray-100 dark:bg-gray-800 p-6">
        <div className="max-w-2xl mx-auto bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8">
          <div className="text-center space-y-4">
            <div className="inline-block p-3 bg-green-100 dark:bg-green-900 rounded-full">
              <FaUserAlt className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              You are not signed in
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Please sign in or create an account to access this section
            </p>
          </div>
          
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/login" 
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors duration-200">
              Login
            </a>
            <a href="/signup"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-green-600 bg-green-100 hover:bg-green-200 transition-colors duration-200">
              Sign Up
            </a>
            <a href="/"
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
              Back to Home
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <ToastContainer />
      <header className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
        {/* Title */}
        <div className="flex-1">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            {currentBar}
          </h1>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-4">
          {/* Notification Icon */}
          <div className="relative" ref={notificationRef}>
            <button
              className="relative p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
              onClick={() => setShowNotificationDropdown(!showNotificationDropdown)}
            >
              <FaBell className="h-5 w-5" />
              {hasNewNotifications && (
                <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full" />
              )}
            </button>

            {/* Notification Dropdown */}
            <div
              className={`absolute right-0 mt-2 w-80 bg-white dark:bg-gray-700 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 transform transition-all duration-200 ${
                showNotificationDropdown
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-2 pointer-events-none"
              }`}
            >
              <div className="p-4 text-sm text-gray-600 dark:text-gray-300">
                No new notifications
              </div>
            </div>
          </div>

          {/* User Profile */}
          <div className="relative" ref={userRef}>
            <button
              className="flex items-center space-x-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
              onClick={() => setShowUserDropdown(!showUserDropdown)}
            >
              <img
                src={currentUser?.profilePicture || "/default-avatar.png"}
                alt="Profile"
                className="h-8 w-8 rounded-full object-cover"
                onError={(e) => {
                  e.target.src = "/default-avatar.png";
                }}
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                {currentUser?.username || "User"}
              </span>
              <FaChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            </button>

            {/* User Dropdown */}
            <div
              className={`absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 transform transition-all duration-200 ${
                showUserDropdown
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-2 pointer-events-none"
              }`}
            >
              <div className="p-2 space-y-1">
                {/* <button
                  onClick={toggleTheme}
                  className="w-full flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md transition-colors duration-200"
                >
                  <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
                </button> */}
                <button
                  onClick={handleConfirmLogout}
                  className="w-full flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors duration-200"
                >
                  <FaSignOutAlt className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};

export default UserNav;
