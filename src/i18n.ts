import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enAdmin from './locales/en/admin.json';
import esAdmin from './locales/es/admin.json';
import { DEFAULT_LANGUAGE, STORAGE_KEYS } from './lib/constants';

declare module 'i18next' {
  interface CustomTypeOptions {
    returnNull: false;
  }
}

export const resources = {
  en: {
    admin: enAdmin,
  },
  es: {
    admin: esAdmin,
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: DEFAULT_LANGUAGE,
    fallbackLng: DEFAULT_LANGUAGE,
    interpolation: {
      escapeValue: false,
    },
    returnNull: false,
  });

// Store the selected language in localStorage
i18n.on('languageChanged', (lng) => {
  localStorage.setItem(STORAGE_KEYS.LANGUAGE, lng);
});

// Initialize with stored language or default to Spanish
const storedLang = localStorage.getItem(STORAGE_KEYS.LANGUAGE);
if (storedLang) {
  i18n.changeLanguage(storedLang);
}

export default i18n;
