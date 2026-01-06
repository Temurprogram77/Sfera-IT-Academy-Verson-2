import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";

type Lang = "uz" | "kr";

export default function SelectLanguage() {
  const { t, i18n } = useTranslation();
  const savedLang = (localStorage.getItem("lang") as Lang) || "uz";
  const [currentLang, setCurrentLang] = useState<Lang>(savedLang);
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);
  const closeDropdown = () => setIsOpen(false);

  const changeLanguage = async (lang: Lang) => {
    await i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);
    setCurrentLang(lang);
    closeDropdown();
  };

  useEffect(() => {
    if (i18n.language.startsWith("kr")) setCurrentLang("kr");
    else setCurrentLang("uz");
  }, [i18n.language]);

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="relative flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full h-11 w-11 hover:bg-gray-100  hover:text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white "
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 512 512"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
        >
          <title>Language Icon</title>
          <path d="M478.33,433.6l-90-218a22,22,0,0,0-40.67,0l-90,218a22,22,0,1,0,40.67,16.79L316.66,406H419.33l18.33,44.39A22,22,0,0,0,458,464a22,22,0,0,0,20.32-30.4ZM334.83,362,368,281.65,401.17,362Z" />
          <path d="M267.84,342.92a22,22,0,0,0-4.89-30.7c-.2-.15-15-11.13-36.49-34.73,39.65-53.68,62.11-114.75,71.27-143.49H330a22,22,0,0,0,0-44H214V70a22,22,0,0,0-44,0V90H54a22,22,0,0,0,0,44H251.25c-9.52,26.95-27.05,69.5-53.79,108.36-31.41-41.68-43.08-68.65-43.17-68.87a22,22,0,0,0-40.58,17c.58,1.38,14.55,34.23,52.86,83.93.92,1.19,1.83,2.35,2.74,3.51-39.24,44.35-77.74,71.86-93.85,80.74a22,22,0,1,0,21.07,38.63c2.16-1.18,48.6-26.89,101.63-85.59,22.52,24.08,38,35.44,38.93,36.1a22,22,0,0,0,30.75-4.9Z" />
        </svg>
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute right-0 mt-3 w-[220px] rounded-2xl border border-gray-200 bg-white p-2 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark"
      >
        <h5 className="px-3 py-2 text-sm font-semibold text-gray-800 dark:text-gray-200">
          {t("select_language")}
        </h5>

        <ul className="flex flex-col">
          <li>
            <DropdownItem
              onItemClick={() => changeLanguage("uz")}
              className={`flex items-center gap-3 rounded-lg px-4 py-2 hover:bg-gray-100 dark:hover:bg-white/5 ${
                currentLang === "uz" ? "bg-gray-100 dark:bg-white/10" : ""
              }`}
            >
              <span className="text-sm text-gray-800 dark:text-gray-200">
                🇺🇿 O‘zbek (Lotin)
              </span>
            </DropdownItem>
          </li>

          <li>
            <DropdownItem
              onItemClick={() => changeLanguage("kr")}
              className={`flex items-center gap-3 rounded-lg px-4 py-2 hover:bg-gray-100 dark:hover:bg-white/5 ${
                currentLang === "kr" ? "bg-gray-100 dark:bg-white/10" : ""
              }`}
            >
              <span className="text-sm text-gray-800 dark:text-gray-200">
                🇺🇿 Ўзбек (Кирилл)
              </span>
            </DropdownItem>
          </li>
        </ul>
      </Dropdown>
    </div>
  );
}
