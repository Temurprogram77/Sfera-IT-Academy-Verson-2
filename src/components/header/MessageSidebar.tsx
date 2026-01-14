import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Segmented, ConfigProvider, theme as antdTheme } from "antd";
import { useState } from "react";
import IconButton from "../IconButton/IconButton";
import { useTheme } from "../../context/ThemeContext"; // sizning ThemeContext

type MessageSidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

type Message = {
  id: number;
  user: string;
  text: string;
  time: string;
  avatar: string;
  isRead: boolean;
};

export default function MessageSidebar({
  isOpen,
  onClose,
}: MessageSidebarProps) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { darkAlgorithm, defaultAlgorithm } = antdTheme;

  const [filter, setFilter] = useState<"all" | "read" | "unread">("all");

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      user: "Terry Franci",
      text: "Project – Nganter App  ",
      time: "5 min ago",
      avatar: "/images/user/user-02.jpg",
      isRead: false,
    },
    {
      id: 2,
      user: "John Smith",
      text: "Yangi komment qoldirdi",
      time: "10 min ago",
      avatar: "/images/user/user-03.jpg",
      isRead: true,
    },
    {
      id: 3,
      user: "Kimdir Smith",
      text: "He-he -way",
      time: "2 minut oldin",
      avatar: "/images/user/user-03.jpg",
      isRead: false,
    },
  ]);

  const markAsRead = (id: number) => {
    setMessages((prev) =>
      prev.map((msg) => (msg.id === id ? { ...msg, isRead: true } : msg))
    );
  };

  const filteredMessages = messages.filter((msg) => {
    if (filter === "read") return msg.isRead;
    if (filter === "unread") return !msg.isRead;
    return true;
  });

  return (
    <>
      {isOpen && (
        <div onClick={onClose} className="fixed inset-0 z-95 bg-black/40" />
      )}

      <ConfigProvider
        theme={{
          algorithm: theme === "dark" ? darkAlgorithm : defaultAlgorithm,
          token: {
            colorBgContainer: theme === "dark" ? "#111827" : "#ffffff",
            colorText: theme === "dark" ? "#e5e7eb" : "#111827",
            colorBorder: theme === "dark" ? "#374151" : "#e5e7eb",
            colorPrimary: theme === "dark" ? "#3b82f6" : "#1890ff",
          },
          components: {
            Segmented: {
              colorBg: theme === "dark" ? "#101828" : "#f3f4f6",
              colorText: theme === "dark" ? "#e5e7eb" : "#111827",
              colorBorder: theme === "dark" ? "#374151" : "#d1d5db",
              colorPrimary: theme === "dark" ? "##101828" : "#1890ff",
            },
          },
        }}
      >
        <aside
          className={`fixed top-0 right-0 z-[100] h-full w-[360px] bg-white dark:bg-gray-900 border-l shadow-xl dark:border-[#1d2939] transition-transform duration-300
          ${isOpen ? "translate-x-0" : "translate-x-full"}`}
        >
          <div className="flex items-center justify-between p-4 border-b dark:border-[#1d2939]">
            <h5 className="text-lg font-semibold dark:text-white">
              {t("notification")}
            </h5>
            <button onClick={onClose}>✕</button>
          </div>

          <div className="flex flex-col h-full">
            <div className="p-3">
              <div
                className={`p-3 ${
                  theme === "dark" ? "bg-gray-900" : "bg-white"
                } rounded-lg`}
              >
                <Segmented
                  block
                  value={filter}
                  onChange={(val) => setFilter(val as any)}
                  options={[
                    { label: "Hammasi", value: "all" },
                    { label: "O‘qilmagan", value: "unread" },
                    { label: "O‘qilgan", value: "read" },
                  ]}
                  className={`${
                    theme === "dark"
                      ? "bg-gray-800 text-gray-200 border-gray-700"
                      : "bg-gray-100 text-gray-900 border-gray-300"
                  }`}
                  style={{
                    backgroundColor: theme === "dark" ? "#1f2937" : "#f3f4f6",
                    borderColor: theme === "dark" ? "#374151" : "#d1d5db",
                    color: theme === "dark" ? "#e5e7eb" : "#111827",
                  }}
                />
              </div>
            </div>

            <ul className="flex-1 overflow-y-auto p-3 space-y-2">
              {filteredMessages.length === 0 && (
                <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                  Xozircha o'qilmagan xabarlar yo'q.
                </p>
              )}

              {filteredMessages.map((msg) => (
                <li
                  key={msg.id}
                  className={`flex gap-3 rounded-lg border p-3 dark:border-[#1d2939]
                  ${
                    msg.isRead
                      ? "bg-gray-50 dark:bg-gray-800 "
                      : "bg-blue-50 dark:bg-gray-800 border-blue-200"
                  }`}
                >
                  <img
                    src={msg.avatar}
                    alt={msg.user}
                    className="w-10 h-10 rounded-full"
                  />

                  <div className="flex-1">
                    <p className="text-sm dark:text-gray-200">
                      <span className="font-medium">{msg.user}</span> {msg.text}
                    </p>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {msg.time}
                    </span>

                    {!msg.isRead && (
                      <div className="mt-2">
                        <IconButton
                          text={"O‘qildi deb belgilash"}
                          onClick={() => markAsRead(msg.id)}
                        />
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>

            <div className="p-4 border-t dark:border-[#1d2939]">
              <Link
                to="/messages"
                onClick={onClose}
                className="block w-full text-center text-sm font-medium px-4 py-2 rounded-lg border hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {t("view_all_notifications")}
              </Link>
            </div>
          </div>
        </aside>
      </ConfigProvider>
    </>
  );
}
