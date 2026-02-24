// pages/Attendance/AttendancePage.tsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Spin, Input, Empty } from "antd";
import {
  SearchOutlined,
  TeamOutlined,
  UserOutlined,
  ClockCircleOutlined,
  RightOutlined,
  WifiOutlined,
} from "@ant-design/icons";
import { useAllGroups } from "../../hooks/useGroups";

const PRIMARY_COLOR = "#00A67D";

const getColor = (name: string) => {
  const colors = [
    "#00A67D", "#6366f1", "#f59e0b", "#ec4899",
    "#3b82f6", "#10b981", "#f97316", "#8b5cf6",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++)
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
};

export default function AttendancePage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const { groups, loading } = useAllGroups();

  const filtered = groups.filter(
    (g) =>
      g.name.toLowerCase().includes(search.toLowerCase()) ||
      (g.teacherName || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
            <WifiOutlined style={{ color: PRIMARY_COLOR }} />
            Davomat
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Davomatni belgilash uchun guruhni tanlang
          </p>
        </div>

        {/* Search */}
        <div className="mb-6 max-w-md">
          <Input
            prefix={<SearchOutlined className="text-gray-400" />}
            placeholder="Guruh yoki o'qituvchi bo'yicha qidirish..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="large"
            className="rounded-xl"
            allowClear
          />
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-32">
            <Spin size="large" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex justify-center py-20">
            <Empty description="Guruhlar topilmadi" />
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-400 dark:text-gray-500 mb-4">
              {filtered.length} ta guruh
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filtered.map((group) => {
                const color = getColor(group.name);
                return (
                  <div
                    key={group.id}
                    onClick={() => navigate(`/attendance/${group.id}`)}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer border border-gray-100 dark:border-gray-700 overflow-hidden group"
                  >
                    {/* Color bar */}
                    <div className="h-1.5 w-full" style={{ backgroundColor: color }} />

                    <div className="p-5">
                      {/* Top */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className="w-11 h-11 rounded-xl flex items-center justify-center text-white text-lg font-bold flex-shrink-0"
                            style={{ backgroundColor: color }}
                          >
                            {group.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-bold text-gray-900 dark:text-white text-sm truncate group-hover:text-[#00A67D] transition-colors">
                              {group.name}
                            </h3>
                            {group.categoryName && (
                              <span
                                className="text-xs px-2 py-0.5 rounded-full text-white font-medium"
                                style={{ backgroundColor: color + "bb" }}
                              >
                                {group.categoryName}
                              </span>
                            )}
                          </div>
                        </div>
                        <RightOutlined
                          className="text-gray-300 group-hover:text-[#00A67D] transition-colors flex-shrink-0 mt-1"
                          style={{ fontSize: 12 }}
                        />
                      </div>

                      {/* Info */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                          <UserOutlined style={{ color: PRIMARY_COLOR }} />
                          <span className="truncate">
                            {group.teacherName || "Belgilanmagan"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                          <TeamOutlined style={{ color: PRIMARY_COLOR }} />
                          <span>{group.studentCount ?? 0} ta o'quvchi</span>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                        <span className="text-xs text-gray-400">Davomatni ko'rish</span>
                        <span
                          className="text-xs font-semibold"
                          style={{ color: PRIMARY_COLOR }}
                        >
                          Ochish →
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}