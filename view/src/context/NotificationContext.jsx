import { createContext, useContext, useReducer, useEffect } from "react";
import { toast } from "react-hot-toast";

const NotificationContext = createContext();

const notificationReducer = (state, action) => {
  switch (action.type) {
    case "ADD_NOTIFICATION":
      return {
        ...state,
        notifications: [action.payload, ...state.notifications],
      };
    case "MARK_AS_READ":
      return {
        ...state,
        notifications: state.notifications.map((notification) =>
          notification.id === action.payload
            ? { ...notification, isRead: true }
            : notification
        ),
      };
    case "CLEAR_ALL":
      return {
        ...state,
        notifications: [],
      };
    default:
      return state;
  }
};

export function NotificationProvider({ children }) {
  const [state, dispatch] = useReducer(notificationReducer, {
    notifications: [],
  });

  const addNotification = (notification) => {
    dispatch({
      type: "ADD_NOTIFICATION",
      payload: {
        id: Date.now(),
        isRead: false,
        timestamp: new Date(),
        ...notification,
      },
    });
    toast.success(notification.message);
  };

  return (
    <NotificationContext.Provider value={{ state, dispatch, addNotification }}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => useContext(NotificationContext);
