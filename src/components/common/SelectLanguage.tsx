import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { Language } from "../../icons";

export default function SelectLanguage() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  // i18n.language bilan state-ni moslashtiramiz
  const [currentLang, setCurrentLang] = useState<"uz" | "uz_cy">(
    i18n.language === "uz_cy" ? "uz_cy" : "uz"
  );

  const toggleDropdown = () => setIsOpen(!isOpen);
  const closeDropdown = () => setIsOpen(false);

  const changeLanguage = (lang: "uz" | "uz_cy") => {
    setCurrentLang(lang); // dropdown-da tanlangan tilni ko'rsatadi
    i18n.changeLanguage(lang); // i18n bilan tilni o'zgartiradi
    console.log("Tanlangan til:", lang); // <-- bu yerga qo'shildi
    closeDropdown();
  };

  useEffect(() => {
    setCurrentLang(i18n.language === "uz_cy" ? "uz_cy" : "uz");
  }, [i18n.language]);

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="relative flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full h-11 w-11 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
      >
        <Language />
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute right-0 mt-3 w-[220px] rounded-2xl border border-gray-200 bg-white p-2 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark"
      >
        <h5 className="px-3 py-2 text-sm font-semibold text-gray-800 dark:text-gray-200">
          Tilni tanlang
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

          {/* Krillcha O'zbek */}
          <li>
            <DropdownItem
              onItemClick={() => changeLanguage("uz_cy")}
              className={`flex items-center gap-3 rounded-lg px-4 py-2 hover:bg-gray-100 dark:hover:bg-white/5 ${
                currentLang === "uz_cy" ? "bg-gray-100 dark:bg-white/10" : ""
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
