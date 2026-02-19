import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Segmented, Spin } from "antd";
import { useState } from "react";
import { CheckOutlined, BellOutlined } from "@ant-design/icons";
import { useTheme } from "../../context/ThemeContext";
import { useMarkAsRead, useMyNotifications } from "../../hooks/useNotification";
import { Notification } from "../../types/notification";

type MessageSidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function MessageSidebar({
  isOpen,
  onClose,
}: MessageSidebarProps) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [filter, setFilter] = useState<"all" | "read" | "unread">("all");

  const { notifications, isLoading } = useMyNotifications();
  const { mutate: markAsRead, isPending: isMarking } = useMarkAsRead();

  // ✅ Backend dan kelgan data — oxirgi 10 ta (id desc bo'yicha sort)
  const sorted = [...notifications].sort((a, b) => b.id - a.id).slice(0, 10);

  const filtered = sorted.filter((n) => {
    if (filter === "read") return n.read;
    if (filter === "unread") return !n.read;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkRead = (id: number) => {
    // ✅ PUT /notification/read — { idList: [id] }
    markAsRead({ idList: [id] });
  };

  return (
    <>
      {isOpen && (
        <div onClick={onClose} className="fixed inset-0 z-95 bg-black/40" />
      )}

      <aside
        className={`fixed top-0 right-0 z-[100] h-screen w-[380px] bg-white dark:bg-gray-900 border-l shadow-2xl dark:border-[#1d2939] transition-transform duration-300
          ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b dark:border-[#1d2939]">
          <div className="flex items-center gap-2">
            <BellOutlined className="text-orange-400 text-lg" />
            <h5 className="text-base font-semibold dark:text-white">
              {t("notification")}
            </h5>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-orange-400 text-white text-xs font-bold">
                {unreadCount}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-col" style={{ height: "calc(100vh - 65px)" }}>
          {/* Filter */}
          <div className="px-4 py-3 border-b dark:border-[#1d2939]">
            <Segmented
              block
              value={filter}
              onChange={(val) => setFilter(val as "all" | "read" | "unread")}
              options={[
                { label: "Hammasi", value: "all" },
                {
                  label: `O'qilmagan${unreadCount > 0 ? ` (${unreadCount})` : ""}`,
                  value: "unread",
                },
                { label: "O'qilgan", value: "read" },
              ]}
              style={{
                backgroundColor: theme === "dark" ? "#1f2937" : "#f3f4f6",
                color: theme === "dark" ? "#e5e7eb" : "#111827",
              }}
            />
          </div>

          {/* List */}
          <ul className="flex-1 overflow-y-auto p-3 space-y-2">
            {isLoading && (
              <div className="flex justify-center items-center py-16">
                <Spin size="default" />
              </div>
            )}

            {!isLoading && filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 gap-3 text-gray-400">
                <BellOutlined style={{ fontSize: 36 }} />
                <p className="text-sm">
                  {filter === "unread"
                    ? "O'qilmagan xabarnomalar yo'q"
                    : filter === "read"
                      ? "O'qilgan xabarnomalar yo'q"
                      : "Xabarnomalar yo'q"}
                </p>
              </div>
            )}

            {!isLoading &&
              filtered.map((notif: Notification) => (
                <li
                  key={notif.id}
                  className={`rounded-xl border p-3 transition-all
                    ${
                      notif.read
                        ? "bg-gray-50 dark:bg-gray-800/60 border-gray-200 dark:border-gray-700"
                        : "bg-blue-50 dark:bg-gray-800 border-blue-200 dark:border-blue-900/60"
                    }`}
                >
                  <div className="flex gap-3">
                    {/* Icon */}
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-sm
                        ${
                          notif.read
                            ? "bg-gray-200 dark:bg-gray-600"
                            : "bg-orange-400"
                        }`}
                    >
                      🔔
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* Title + badge */}
                      <div className="flex items-start justify-between gap-1 mb-1">
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-100 leading-snug">
                          {notif.message}
                        </p>
                        {notif.read ? (
                          <span className="flex-shrink-0 text-green-500 text-xs font-medium flex items-center gap-0.5">
                            <CheckOutlined />
                          </span>
                        ) : (
                          <span className="flex-shrink-0 w-2 h-2 rounded-full bg-orange-400 mt-1" />
                        )}
                      </div>

                      {/* Description */}
                      <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                        {notif.description}
                      </p>

                      {/* ✅ O'qilmagan bo'lsa button chiqadi */}
                      {!notif.read && (
                        <button
                          disabled={isMarking}
                          onClick={() => handleMarkRead(notif.id)}
                          className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-green-600 dark:text-green-400 hover:text-green-700 disabled:opacity-40 transition-colors"
                        >
                          <CheckOutlined />
                          O'qildi deb belgilash
                        </button>
                      )}

                      {/* ✅ O'qilgan bo'lsa yashil text */}
                      {notif.read && (
                        <p className="mt-1.5 text-xs text-green-500 dark:text-green-400 font-medium flex items-center gap-1">
                          <CheckOutlined />
                          O'qilgan
                        </p>
                      )}
                    </div>
                  </div>
                </li>
              ))}
          </ul>

          {/* Footer */}
          <div className="px-4 py-3 border-t dark:border-[#1d2939]">
            <Link
              to="/messages"
              onClick={onClose}
              className="flex items-center justify-center w-full text-sm font-medium px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 dark:text-gray-300 transition-colors"
            >
              Barchasini ko'rish →
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
