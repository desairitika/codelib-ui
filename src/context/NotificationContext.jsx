import React, { createContext, useContext, useCallback, useState } from "react";
import PropTypes from "prop-types";

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within NotificationProvider");
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((message, type = "info", duration = 3000) => {
    const id = Date.now();
    const notification = { id, message, type };

    setNotifications((prev) => [...prev, notification]);

    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }

    return id;
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const notify = {
    success: (message, duration) => addNotification(message, "success", duration),
    error: (message, duration) => addNotification(message, "error", duration),
    warning: (message, duration) => addNotification(message, "warning", duration),
    info: (message, duration) => addNotification(message, "info", duration),
  };

  const value = {
    notifications,
    addNotification,
    removeNotification,
    notify,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

NotificationProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
