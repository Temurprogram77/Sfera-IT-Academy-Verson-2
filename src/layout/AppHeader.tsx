import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useSidebar } from "../context/SidebarContext";
import UserDropdown from "../components/header/UserDropdown";
import MessageSidebar from "../components/header/MessageSidebar";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { ThemeToggleButton } from "../components/common/ThemeToggleButton";
import SelectLanguage from "../components/common/SelectLanguage";

const AppHeader: React.FC = () => {
  const [isApplicationMenuOpen, setApplicationMenuOpen] = useState(false);
  const [isMessageSidebarOpen, setIsMessageSidebarOpen] = useState(false);

  const {
    isMobileOpen,
    toggleSidebar,
    toggleMobileSidebar,
    closeSidebar,
    closeMobileSidebar,
  } = useSidebar();

  const handleToggle = () => {
    // 🔒 Notification ochiq bo‘lsa — ochilmaydi
    if (isMessageSidebarOpen) return;

    if (window.innerWidth >= 1024) {
      toggleSidebar();
    } else {
      toggleMobileSidebar();
    }
  };

  // 🔥 Notification ochilganda sidebarlarni majburan yopish
  useEffect(() => {
    if (isMessageSidebarOpen) {
      closeSidebar();
      closeMobileSidebar();
    }
  }, [isMessageSidebarOpen]);

  const toggleApplicationMenu = () => {
    setApplicationMenuOpen(!isApplicationMenuOpen);
  };

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-50 flex w-full bg-white border-b border-gray-200 dark:border-gray-800 dark:bg-gray-900">
        <div className="flex flex-col items-center justify-between grow lg:flex-row lg:px-6">
          {/* LEFT */}
          <div className="flex items-center justify-between w-full gap-2 px-3 py-3 sm:gap-4 lg:justify-normal lg:px-0 lg:py-4">
            <button
              className="flex items-center justify-center w-10 h-10 text-gray-500 border border-gray-200 rounded-lg dark:border-gray-800 dark:text-gray-400"
              onClick={handleToggle}
            >
              {isMobileOpen ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
            </button>

            <Link to="/" className="lg:hidden">
              <img
                className="dark:hidden w-[100px]"
                src="/images/logo.png"
                alt="Logo"
              />
              <img
                className="hidden dark:block w-[100px]"
                src="/images/logo2.png"
                alt="Logo Dark"
              />
            </Link>

            <button
              onClick={toggleApplicationMenu}
              className="flex items-center justify-center w-10 h-10 text-gray-700 rounded-lg hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 lg:hidden"
            >
              ⋮
            </button>
          </div>

          {/* RIGHT */}
          <div
            className={`${
              isApplicationMenuOpen ? "flex" : "hidden"
            } items-center justify-between w-full gap-4 px-5 py-4 lg:flex lg:justify-end lg:px-0`}
          >
            <div className="flex items-center gap-3">
              <ThemeToggleButton />
              <SelectLanguage />

              {/* Notification Button */}
              <button
                onClick={() => setIsMessageSidebarOpen(true)}
                className="relative flex items-center justify-center w-11 h-11 text-gray-500 bg-white border border-gray-200 rounded-full hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800"
              >
                <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-orange-400 animate-ping"></span>
                <svg
                  className="fill-current"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M10.75 2.29248C10.75 1.87827 10.4143 1.54248 10 1.54248C9.58583 1.54248 9.25004 1.87827 9.25004 2.29248V2.83613C6.08266 3.20733 3.62504 5.9004 3.62504 9.16748V14.4591H3.33337C2.91916 14.4591 2.58337 14.7949 2.58337 15.2091C2.58337 15.6234 2.91916 15.9591 3.33337 15.9591H16.6667C17.0809 15.9591 17.4167 15.6234 17.4167 15.2091C17.4167 14.7949 17.0809 14.4591 16.6667 14.4591H16.375V9.16748C16.375 5.9004 13.9174 3.20733 10.75 2.83613V2.29248Z"
                  />
                </svg>
              </button>
            </div>

            <UserDropdown />
          </div>
        </div>
      </header>

      {/* MESSAGE SIDEBAR */}
      <MessageSidebar
        isOpen={isMessageSidebarOpen}
        onClose={() => setIsMessageSidebarOpen(false)}
      />
    </>
  );
};

export default AppHeader;