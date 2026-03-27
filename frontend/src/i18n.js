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
  },
  fi: {
    translation: {
      "home": "Koti",
      "services": "Palvelut",
      "booking": "Varaa Nyt",
      "about": "Tietoa",
      "contact": "Yhteystiedot",
      "hero_title": "Ensiluokkainen Grooming-Kokemus",
      "hero_subtitle": "Nosta tyylisi uudelle tasolle tarkkuudella ja luksuksella.",
      "book_appointment": "Varaa Aika"
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
