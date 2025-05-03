import React, { createContext, useContext } from "react";
import useLanguage from "../hooks/useLanguage";

// Create the language context
const LanguageContext = createContext();

/**
 * Language Provider component to wrap the application
 * @param {Object} props - Component props
 * @returns {JSX.Element} Provider component
 */
export const LanguageProvider = ({ children }) => {
  // Use the language hook to get language utilities
  const languageUtils = useLanguage();

  return (
    <LanguageContext.Provider value={languageUtils}>
      {children}
    </LanguageContext.Provider>
  );
};

/**
 * Custom hook to use the language context
 * @returns {Object} Language utilities
 */
export const useLanguageContext = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error(
      "useLanguageContext must be used within a LanguageProvider"
    );
  }
  return context;
};
