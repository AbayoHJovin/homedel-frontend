/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Check, X } from "lucide-react";

const NotificationDropdown = ({ notifications, onMarkAsRead, onClearAll }) => {
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = notifications?.filter((n) => !n.isRead).length || 0;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
      >
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center bg-red-500 text-white text-xs rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50"
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Notifications
                </h3>
                {notifications?.length > 0 && (
                  <button
                    onClick={onClearAll}
                    className="text-sm text-green-600 hover:text-green-700"
                  >
                    Clear all
                  </button>
                )}
              </div>

              <div className="space-y-3">
                {notifications?.length > 0 ? (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 rounded-lg ${
                        !notification.isRead
                          ? "bg-green-50 dark:bg-gray-700"
                          : "hover:bg-gray-50 dark:hover:bg-gray-700"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                            {notification.title}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                            {notification.message}
                          </p>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {notification.time}
                          </span>
                        </div>
                        {!notification.isRead && (
                          <button
                            onClick={() => onMarkAsRead(notification.id)}
                            className="text-green-600 hover:text-green-700"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 dark:text-gray-400">
                    No notifications
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationDropdown;
