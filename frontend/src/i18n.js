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

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
