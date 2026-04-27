import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      "home": "Home",
      "services": "Services",
      "booking": "Book Now",
      "about": "About",
      "contact": "Contact",
      "hero_title": "Premium Grooming Experience",
      "hero_subtitle": "Elevating your style with precision and luxury.",
      "book_appointment": "Book Appointment"
    }
  }
};

// Temporarily override console.log to suppress the Locize promotion message
const originalLog = console.log;
console.log = (...args) => {
  if (args[0] && typeof args[0] === 'string' && args[0].includes('locize')) return;
  originalLog(...args);
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false
    }
  });

// Restore original console.log
console.log = originalLog;

export default i18n;
