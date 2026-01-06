import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import kr from "./locales/kr/kr.json";
import uz from "./locales/uz/uz.json";

// localStorage'dan tilni oling
const savedLang = (localStorage.getItem("lang") as "uz" | "kr") || "uz";

i18n
  .use(initReactI18next)
  .init({
    resources: {
      kr: { translation: kr },
      uz: { translation: uz },
    },
    lng: savedLang,           // <- localStorage qiymatidan boshlash
    fallbackLng: "kr",
    interpolation: { escapeValue: false },
  });

export default i18n;
