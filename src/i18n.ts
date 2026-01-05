import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import uz from "./locales/uz/uz.json";
import kr from "./locales/kr/kr.json";

i18n
  .use(initReactI18next)
  .init({
    resources: {
      uz: { translation: uz },
      kr: { translation: kr }
    },
    lng: "uz", // default til
    fallbackLng: "uz",
    interpolation: { escapeValue: false }
  });

export default i18n;
