// src/pages/Grades/Grades.tsx
import { useState } from "react";
import { Spin, Input } from "antd";
import {
  SearchOutlined,
  TeamOutlined,
  UserOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useGroups } from "../../hooks/useGroups";
import NotFoundData from "../OtherPage/NotFoundData";

const PRIMARY_COLOR = "#00A67D";

const getCategoryColor = (name?: string) => {
  if (!name) return "#6366f1";
  const colors = [
    "#00A67D", "#6366f1", "#f59e0b", "#ec4899",
    "#3b82f6", "#10b981", "#f97316", "#8b5cf6",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
};

const Grades = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const { groups, loading } = useGroups({
    name: searchTerm,
    page: 0,
    size: 100,
  });

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
          Baholar
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Guruhni tanlang va o'quvchilar baholarini ko'ring
        </p>
      </div>

      {/* Search */}
      <div className="mb-6 max-w-md">
        <Input
          prefix={<SearchOutlined className="text-gray-400" />}
          placeholder="Guruh nomi bo'yicha qidirish..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="large"
          className="rounded-xl"
          allowClear
        />
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center items-center py-32">
          <Spin size="large" />
        </div>
      ) : groups.length === 0 ? (
        <NotFoundData
          title="Guruhlar topilmadi"
          description="Hozircha hech qanday guruh mavjud emas"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {groups.map((group) => {
            const color = getCategoryColor(
              (group as any).categoryName || group.name
            );
            // ✅ startTime / endTime optional — (group as any) orqali xavfsiz o'qiymiz
            const startTime: string | undefined = (group as any).startTime;
            const endTime: string | undefined = (group as any).endTime;
            const teacherName: string | undefined = (group as any).teacherName;
            const categoryName: string | undefined = (group as any).categoryName;
            const studentCount: number | undefined = (group as any).studentCount;

            return (
              <div
                key={group.id}
                onClick={() => navigate(`/groups/${group.id}`)}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer border border-gray-100 dark:border-gray-700 overflow-hidden group"
              >
                {/* Card top color bar */}
                <div
                  className="h-2 w-full"
                  style={{ backgroundColor: color }}
                />

                <div className="p-5">
                  {/* Avatar + Name */}
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-lg font-bold flex-shrink-0 shadow-sm"
                      style={{ backgroundColor: color }}
                    >
                      {group.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-gray-900 dark:text-white text-base truncate group-hover:text-[#00A67D] transition-colors">
                        {group.name}
                      </h3>
                      {categoryName && (
                        <span
                          className="text-xs font-medium px-2 py-0.5 rounded-full text-white"
                          style={{ backgroundColor: color + "cc" }}
                        >
                          {categoryName}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Info rows */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <UserOutlined style={{ color: PRIMARY_COLOR }} />
                      <span className="truncate">
                        {teacherName || "O'qituvchi belgilanmagan"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <ClockCircleOutlined style={{ color: PRIMARY_COLOR }} />
                      {/* ✅ startTime / endTime mavjudligini tekshiramiz */}
                      <span>
                        {startTime && endTime
                          ? `${startTime} – ${endTime}`
                          : "Vaqt belgilanmagan"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <TeamOutlined style={{ color: PRIMARY_COLOR }} />
                      <span>{studentCount ?? 0} ta o'quvchi</span>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      Baholarni ko'rish
                    </span>
                    <span
                      className="text-xs font-semibold"
                      style={{ color: PRIMARY_COLOR }}
                    >
                      → Ochish
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Grades;