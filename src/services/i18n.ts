import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "../assets/translation/en.json"
import ar from "../assets/translation/ar.json"
import { getFromLocalDB, LocalStorageKeys } from "../utils/localDB";

i18n
/*   .use(LanguageDetector)  // Detects the user's language
 */  .use(initReactI18next)  // Integrates with React
  .init({
    resources: {
      en: { translation: en },
      ar: { translation: ar },
    },
    lng: getFromLocalDB(LocalStorageKeys.AppLanguage),
    fallbackLng: 'en',  // Default language if user language is not found
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    react: {
      useSuspense: false,  // Set to false if you want to avoid suspense
    },
  });

export default i18n;