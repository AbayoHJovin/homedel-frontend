import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Import language resources
import en from "./locales/en";
import rw from "./locales/rw";

// Initialize i18next
i18n
  // Detect user language
  .use(LanguageDetector)
  // Pass the i18n instance to react-i18next
  .use(initReactI18next)
  // Initialize the configuration
  .init({
    debug: false, // Set to true during development to see console logs
    fallbackLng: "en",
    interpolation: {
      escapeValue: false, // React already escapes by default
    },
    resources: {
      en: { translation: en },
      rw: { translation: rw },
    },
    detection: {
      order: ["localStorage", "navigator"],
      lookupLocalStorage: "language",
      caches: ["localStorage"],
    },
  });

export default i18n;
