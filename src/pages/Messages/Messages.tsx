import { useState } from "react";
import { Modal, Pagination, Spin, Popconfirm, Tag } from "antd";
import { DeleteOutlined, EyeOutlined, CheckOutlined } from "@ant-design/icons";
import {
  useAllNotifications,
  useDeleteNotification,
  useMarkAsRead,
  useMyNotifications,
  useNotificationById,
} from "../../hooks/useNotification";
import IconButton from "../../components/IconButton/IconButton";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { Notification } from "../../types/notification";

function NotificationDetailModal({
  id,
  open,
  onClose,
}: {
  id: number | null;
  open: boolean;
  onClose: () => void;
}) {
  const { notification, isLoading } = useNotificationById(id);
  const { mutate: markAsRead, isPending } = useMarkAsRead();

  const handleMarkAsRead = () => {
    if (!notification) return;
    markAsRead({ idList: [notification.id] }, { onSuccess: onClose });
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      title={
        <div className="flex items-center gap-2">
          <span>🔔</span>
          <span>Xabarnoma tafsiloti</span>
        </div>
      }
    >
      {isLoading ? (
        <div className="flex justify-center py-10">
          <Spin />
        </div>
      ) : notification ? (
        <div className="space-y-4 pt-2">
          <div>
            <Tag color={notification.read ? "green" : "orange"}>
              {notification.read ? "✓ O'qilgan" : "● O'qilmagan"}
            </Tag>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-3">
            <div>
              <p className="text-xs text-gray-400 mb-1">Sarlavha</p>
              <p className="font-semibold text-gray-800 dark:text-white">
                {notification.message}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Tavsif</p>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                {notification.description}
              </p>
            </div>
            <div className="flex gap-4 text-sm">
              {notification.studentId && (
                <div>
                  <p className="text-xs text-gray-400">Student ID</p>
                  <p className="font-medium text-gray-700 dark:text-gray-300">
                    #{notification.studentId}
                  </p>
                </div>
              )}
              {notification.parentId && (
                <div>
                  <p className="text-xs text-gray-400">Parent ID</p>
                  <p className="font-medium text-gray-700 dark:text-gray-300">
                    #{notification.parentId}
                  </p>
                </div>
              )}
            </div>
          </div>

          {!notification.read && (
            <div className="flex justify-end pt-2">
              <IconButton
                text={isPending ? "Saqlanmoqda..." : "O'qildi deb belgilash"}
                type="primary"
                icon={<CheckOutlined />}
                onClick={handleMarkAsRead}
                disabled={isPending}
              />
            </div>
          )}
        </div>
      ) : (
        <p className="text-center text-gray-400 py-6">Ma'lumot topilmadi</p>
      )}
    </Modal>
  );
}

function NotificationCard({
  notif,
  onView,
  onDelete,
  isDeleting,
  onMarkRead,
  isMarking,
}: {
  notif: Notification;
  isAdmin: boolean;
  onView: (id: number) => void;
  onDelete?: (id: number) => void;
  isDeleting?: boolean;
  onMarkRead: (id: number) => void;
  isMarking: boolean;
}) {
  return (
    <div
      className={`flex items-start gap-4 p-4 rounded-xl border transition-all hover:shadow-md cursor-pointer
        ${
          notif.read
            ? "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
            : "bg-blue-50 dark:bg-gray-800 border-blue-200 dark:border-blue-900/50"
        }`}
      onClick={() => onView(notif.id)}
    >
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-base
          ${notif.read ? "bg-gray-200 dark:bg-gray-700" : "bg-orange-400"}`}
      >
        🔔
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <p className="font-semibold text-gray-800 dark:text-white text-sm">
            {notif.message}
          </p>
          {!notif.read && (
            <span className="px-2 py-0.5 rounded-full bg-orange-100 text-orange-600 text-xs font-medium">
              Yangi
            </span>
          )}
          {notif.read && (
            <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-600 text-xs font-medium">
              ✓ O'qilgan
            </span>
          )}
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
          {notif.description}
        </p>
      </div>

      <div
        className="flex items-center gap-1 flex-shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => onView(notif.id)}
          className="p-2 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-500 transition-colors"
          title="Ko'rish"
        >
          <EyeOutlined />
        </button>

        {!notif.read && (
          <button
            onClick={() => onMarkRead(notif.id)}
            disabled={isMarking}
            className="p-2 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 text-green-500 transition-colors disabled:opacity-50"
            title="O'qildi deb belgilash"
          >
            <CheckOutlined />
          </button>
        )}

        {onDelete && (
          <Popconfirm
            title="O'chirishni tasdiqlaysizmi?"
            description="Bu xabarnoma o'chiriladi"
            onConfirm={() => onDelete(notif.id)}
            okText="Ha, o'chir"
            cancelText="Yo'q"
            okButtonProps={{ loading: isDeleting, danger: true }}
          >
            <button
              className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500 transition-colors"
              title="O'chirish"
            >
              <DeleteOutlined />
            </button>
          </Popconfirm>
        )}
      </div>
    </div>
  );
}

export default function Messages() {
  const [page, setPage] = useState(0);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const role = localStorage.getItem("user_role");
  const isAdmin = role === "ROLE_ADMIN" || role === "ROLE_SUPER_ADMIN";

  const {
    notifications: adminNotifs,
    pagination,
    isLoading: adminLoading,
  } = useAllNotifications({ page, size: 10 });

  const { notifications: myNotifs, isLoading: myLoading } =
    useMyNotifications();

  const { mutate: deleteNotif, isPending: isDeleting } =
    useDeleteNotification();
  const { mutate: markAsRead, isPending: isMarking } = useMarkAsRead();

  // ✅ Eng yangi xabarnomalar tepada chiqadi (id bo'yicha kamayish tartibida)
  const notifications = (isAdmin ? adminNotifs : myNotifs)
    .slice()
    .sort((a, b) => b.id - a.id);

  const isLoading = isAdmin ? adminLoading : myLoading;

  const openDetail = (id: number) => {
    setSelectedId(id);
    setModalOpen(true);
  };

  const handleMarkRead = (id: number) => {
    markAsRead({ idList: [id] });
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="p-4 max-w-7xl mx-auto bg-white dark:bg-gray-900 rounded-xl min-h-screen">
      <PageBreadcrumb pageTitle="Xabarnomalar" />

      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            {isAdmin ? "Barcha xabarnomalar" : "Mening xabarnomalarim"}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {isAdmin
              ? `Jami: ${pagination.totalElements} ta`
              : `Jami: ${notifications.length} ta`}
            {unreadCount > 0 && (
              <span className="ml-2 px-2 py-0.5 rounded-full bg-orange-100 text-orange-600 text-xs font-medium">
                {unreadCount} ta o'qilmagan
              </span>
            )}
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Spin size="large" />
        </div>
      ) : notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-400">
          <span className="text-5xl">🔔</span>
          <p>Xabarnomalar yo'q</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif) => (
            <NotificationCard
              key={notif.id}
              notif={notif}
              isAdmin={isAdmin}
              onView={openDetail}
              onDelete={(id) => deleteNotif(id)}
              isDeleting={isDeleting}
              onMarkRead={handleMarkRead}
              isMarking={isMarking}
            />
          ))}
        </div>
      )}

      {isAdmin && pagination.totalElements > 10 && (
        <div className="flex justify-center mt-8">
          <Pagination
            current={page + 1}
            pageSize={10}
            total={pagination.totalElements}
            onChange={(p) => setPage(p - 1)}
            showSizeChanger={false}
          />
        </div>
      )}

      <NotificationDetailModal
        id={selectedId}
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedId(null);
        }}
      />
    </div>
  );
}