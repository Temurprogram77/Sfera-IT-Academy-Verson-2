import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useSidebar } from "../context/SidebarContext";
import UserDropdown from "../components/header/UserDropdown";
import MessageSidebar from "../components/header/MessageSidebar";
import {
  BellOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
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
    if (isMessageSidebarOpen) return;

    if (window.innerWidth >= 1024) {
      toggleSidebar();
    } else {
      toggleMobileSidebar();
    }
  };

  useEffect(() => {
    if (isMessageSidebarOpen) {
      closeSidebar();
      closeMobileSidebar();
    }
  }, [isMessageSidebarOpen]);

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
      {isMessageSidebarOpen && (
        <div
          className="fixed inset-0 z-[90] bg-transparent"
          onClick={() => setIsMessageSidebarOpen(false)}
        />
      )}

      {/* HEADER */}
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
          </div>

          <div
            className={`${
              isApplicationMenuOpen ? "flex" : "hidden"
            } items-center justify-between w-full gap-4 px-5 py-4 lg:flex lg:justify-end lg:px-0`}
          >
            <div className="flex items-center gap-3">
              <ThemeToggleButton />
              <SelectLanguage />

              <button
                onClick={() => setIsMessageSidebarOpen(true)}
                className="relative flex items-center justify-center w-11 h-11 text-gray-500 bg-white border border-gray-200 rounded-full hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800"
              >
                <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-orange-400 animate-ping"></span>
                <BellOutlined />
              </button>
            </div>

            <UserDropdown />
          </div>
        </div>
      </header>

      <MessageSidebar
        isOpen={isMessageSidebarOpen}
        onClose={() => setIsMessageSidebarOpen(false)}
      />
    </>
  );
};

export default AppHeader;
