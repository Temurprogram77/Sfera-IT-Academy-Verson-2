import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { XOutlined } from "@ant-design/icons";

type MessageSidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function MessageSidebar({
  isOpen,
  onClose,
}: MessageSidebarProps) {
  const { t } = useTranslation();

  return (
    <>
      {isOpen && (
        <div onClick={onClose} className="fixed inset-0 z-95 bg-black/40" />
      )}
      <aside
        className={`fixed top-0 right-0  z-[100] h-full w-[360px] bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 shadow-xl transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700">
          <h5 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            {t("notification")}
          </h5>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-200"
          >
            <XOutlined />
          </button>
        </div>

        <div className="flex flex-col h-full">
          <ul className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
            <li className="flex gap-3 rounded-lg border border-gray-100 p-3 hover:bg-gray-100 dark:border-gray-800 dark:hover:bg-white/5">
              <img
                src="/images/user/user-02.jpg"
                alt="User"
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <span className="font-medium">Terry Franci</span> requests
                  permission to change{" "}
                  <span className="font-medium">Project – Nganter App</span>
                </p>
                <span className="text-xs text-gray-500">5 min ago</span>
              </div>
            </li>
          </ul>
          <div className="p-4 border-t border-gray-100 dark:border-gray-700">
            <Link
              to="/messages"
              onClick={onClose}
              className="block w-full text-center text-sm font-medium px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
            >
              {t("view_all_notifications")}
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
