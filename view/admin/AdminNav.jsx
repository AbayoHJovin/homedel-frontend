/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  User,
  LogOut,
  ChevronDown,
  Settings,
  Search,
  X,
} from "lucide-react";

const AdminNav = ({ currentBar }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [hasNewNotifications] = useState(true);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const notificationRef = useRef();
  const userRef = useRef();

  // Mock notifications
  const notifications = [
    {
      id: 1,
      title: "New Order",
      message: "New order #1234 received",
      time: "2 minutes ago",
      isUnread: true,
    },
    {
      id: 2,
      title: "Stock Alert",
      message: "Product 'Nike Air Max' is low in stock",
      time: "1 hour ago",
      isUnread: false,
    },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
      if (userRef.current && !userRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-[100] bg-white dark:bg-gray-800 shadow-sm ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Title */}
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white truncate">
              {currentBar}
            </h1>
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center space-x-4">
            {/* Search Bar */}
            <div className="relative flex-1 md:flex-none max-w-xs">
              <motion.div
                initial={false}
                animate={{ width: isSearchOpen ? "100%" : "240px" }}
                transition={{ duration: 0.2 }}
                className="relative"
              >
                {/* <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Search className="h-5 w-5" />
                </span> */}
                <input
                  type="text"
                  placeholder="  Search..."
                  className="w-full bg-gray-100 outline-none border-none px-4 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-green-500 dark:text-white text-sm shadow-sm transition-all duration-150"
                  onFocus={() => setIsSearchOpen(true)}
                  onBlur={() => setIsSearchOpen(false)}
                  style={{ minWidth: 0 }}
                />
              </motion.div>
            </div>

            {/* Notifications */}
            <div className="relative" ref={notificationRef}>
              <button
                className="relative p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell className="h-6 w-6" />
                {hasNewNotifications && (
                  <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full" />
                )}
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-3 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
                  >
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          Notifications
                        </h3>
                        <button className="text-sm text-green-600 hover:text-green-700 dark:text-green-400">
                          Mark all as read
                        </button>
                      </div>
                      <div className="space-y-3">
                        {notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`p-3 rounded-lg transition-colors duration-200 ${
                              notification.isUnread
                                ? "bg-green-50 dark:bg-gray-700"
                                : "hover:bg-gray-50 dark:hover:bg-gray-700"
                            }`}
                          >
                            <div className="flex justify-between items-start">
                              <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                                {notification.title}
                              </h4>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {notification.time}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                              {notification.message}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* User Profile */}
            <div className="relative" ref={userRef}>
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center space-x-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
              >
                <img
                  className="h-8 w-8 rounded-full object-cover"
                  src="https://res.cloudinary.com/dpxldzsp3/image/upload/v1732786183/profile_pictures/xu78klci2sdxohxaf4ze.jpg"
                  alt="Admin"
                />
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    Jovin
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Administrator
                  </p>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              </button>

              <AnimatePresence>
                {showUserDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
                  >
                    <div className="p-2 space-y-1">
                      <button className="w-full flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors duration-200">
                        <User className="h-4 w-4 mr-3" />
                        Profile
                      </button>
                      <button className="w-full flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors duration-200">
                        <Settings className="h-4 w-4 mr-3" />
                        Settings
                      </button>
                      <button className="w-full flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors duration-200">
                        <LogOut className="h-4 w-4 mr-3" />
                        Logout
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminNav;
