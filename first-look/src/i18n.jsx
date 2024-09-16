import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslations from './locales/en/translation.json'; // Adjust path as necessary
import frTranslations from './locales/fr/translation.json'; // Adjust path as necessary

i18n
  .use(initReactI18next) // Pass the i18n instance to react-i18next
  .init({
    resources: {
      en: {
        translation: enTranslations,
      },
      fr: {
        translation: frTranslations,
      },
    },
    lng: 'en', // Default language
    fallbackLng: 'en', // Fallback language
    interpolation: {
      escapeValue: false, // React already safely escapes
    },
  });

export default i18n;