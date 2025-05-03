import React, { useState, useRef, useEffect } from "react";
import { Globe } from "lucide-react";
import { useLanguageContext } from "../context/LanguageProvider";

const LanguageSelector = ({ asMenuItem = true, className = "" }) => {
  const { currentLanguage, changeLanguage, getAvailableLanguages, t } =
    useLanguageContext();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const languages = getAvailableLanguages();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Get current language display
  const getCurrentLanguageDisplay = () => {
    const lang = languages.find((lang) => lang.code === currentLanguage);
    return lang
      ? t(
          `settings.language.languages.${
            lang.code === "en" ? "english" : "kinyarwanda"
          }`
        )
      : "English";
  };

  if (!asMenuItem) {
    // Render as a select dropdown for settings page
    return (
      <div className={className}>
        <label
          htmlFor="language-select"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          {t("settings.language.selectLanguage")}
        </label>
        <select
          id="language-select"
          value={currentLanguage}
          onChange={(e) => changeLanguage(e.target.value)}
          className="w-full rounded-md border border-gray-300 dark:border-gray-700 py-2 px-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          {languages.map((language) => (
            <option key={language.code} value={language.code}>
              {t(
                `settings.language.languages.${
                  language.code === "en" ? "english" : "kinyarwanda"
                }`
              )}
            </option>
          ))}
        </select>
      </div>
    );
  }

  // Default: render as a dropdown button for navigation
  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Globe className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:inline">
          {getCurrentLanguageDisplay()}
        </span>
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
          <div className="p-2">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => {
                  changeLanguage(language.code);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm rounded-md transition-colors ${
                  currentLanguage === language.code
                    ? "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400"
                    : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                {t(
                  `settings.language.languages.${
                    language.code === "en" ? "english" : "kinyarwanda"
                  }`
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
