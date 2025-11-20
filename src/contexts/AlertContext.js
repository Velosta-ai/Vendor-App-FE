import React, { createContext, useContext, useState } from 'react';

const AlertContext = createContext();

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within AlertProvider');
  }
  return context;
};

export const AlertProvider = ({ children }) => {
  const [alert, setAlert] = useState({
    visible: false,
    type: 'success', // 'success', 'error', 'warning', 'info'
    title: '',
    message: '',
    buttons: null,
  });

  const showAlert = ({ type = 'success', title, message, buttons }) => {
    setAlert({
      visible: true,
      type,
      title,
      message,
      buttons,
    });
  };

  const hideAlert = () => {
    setAlert((prev) => ({ ...prev, visible: false }));
  };

  // Helper methods for common alert types
  const showSuccess = (title, message, buttons) => {
    showAlert({ type: 'success', title, message, buttons });
  };

  const showError = (title, message, buttons) => {
    showAlert({ type: 'error', title, message, buttons });
  };

  const showWarning = (title, message, buttons) => {
    showAlert({ type: 'warning', title, message, buttons });
  };

  const showInfo = (title, message, buttons) => {
    showAlert({ type: 'info', title, message, buttons });
  };

  return (
    <AlertContext.Provider
      value={{
        alert,
        showAlert,
        hideAlert,
        showSuccess,
        showError,
        showWarning,
        showInfo,
      }}
    >
      {children}
    </AlertContext.Provider>
  );
};

