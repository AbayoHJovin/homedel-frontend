import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import i18n from "../i18n";

/**
 * Custom hook for managing language preferences
 * @returns {Object} Language utilities
 */
const useLanguage = () => {
  const { t } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language || "en");

  useEffect(() => {
    // Initialize language from localStorage or use browser default
    const savedLanguage = localStorage.getItem("language");
    if (savedLanguage) {
      changeLanguage(savedLanguage);
    }
  }, []);

  /**
   * Change the application language
   * @param {string} language - Language code ('en' or 'rw')
   */
  const changeLanguage = (language) => {
    i18n.changeLanguage(language);
    localStorage.setItem("language", language);
    setCurrentLanguage(language);
  };

  /**
   * Get the display name of the current language
   * @returns {string} Language display name
   */
  const getLanguageName = () => {
    const names = {
      en: "English",
      rw: "Kinyarwanda",
    };
    return names[currentLanguage] || "English";
  };

  /**
   * Get all available languages
   * @returns {Array} Available languages with code and name
   */
  const getAvailableLanguages = () => [
    { code: "en", name: "English" },
    { code: "rw", name: "Kinyarwanda" },
  ];

  return {
    t,
    currentLanguage,
    changeLanguage,
    getLanguageName,
    getAvailableLanguages,
  };
};

export default useLanguage;
