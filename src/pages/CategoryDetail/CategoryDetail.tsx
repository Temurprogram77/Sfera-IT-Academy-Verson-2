import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Spin, Empty } from "antd";
import {
  ClockCircleOutlined,
  QuestionCircleOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { useCategoryDetail } from "../../hooks/useCategoryDetail";
import AppBreadcrumb from "../../components/common/AppBreadcrumb";

const CategoryDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { category, loading } = useCategoryDetail(id);
  const [expanded, setExpanded] = useState(false);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <Spin size="large" />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="py-24">
        <Empty description="Kategoriya topilmadi" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <AppBreadcrumb
        items={[
          { title: "Dashboard", path: "/" },
          { title: "Kategoriyalar", path: "/categories" },
          { title: category?.name || "Detail" },
        ]}
      />
      <div className="max-w-7xl mx-auto bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm dark:shadow-black/30 overflow-hidden transition-colors">
        {/* ── Image ── */}
        {category.imgUrl ? (
          <div className="w-full h-[260px] bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden">
            <img
              src={category.imgUrl}
              alt={category.name}
              className="h-full w-full object-contain p-6"
              onError={(e) =>
                ((e.target as HTMLImageElement).style.display = "none")
              }
            />
          </div>
        ) : (
          <div className="w-full h-[120px] bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-5xl">
            📚
          </div>
        )}

        {/* ── Content ── */}
        <div className="p-8">
          {/* Title */}
          <div className="flex items-center gap-3 mb-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {category.name}
            </h1>
          </div>

          {/* Description */}
          {category.description && (
            <div className="flex gap-3 items-start mb-6 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/40">
              <FileTextOutlined className="text-blue-500 text-lg mt-1" />

              <div>
                <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300 m-0">
                  {expanded || category.description.length <= 400
                    ? category.description
                    : category.description.slice(0, 400) + "..."}
                </p>

                {category.description.length > 400 && (
                  <button
                    onClick={() => setExpanded(!expanded)}
                    className="text-blue-500 text-xs mt-2 hover:underline"
                  >
                    {expanded ? "Yopish" : "Ko‘proq ko‘rish"}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <StatCard
              icon={<ClockCircleOutlined className="text-xl text-purple-500" />}
              label="Davomiylik"
              value={`${category.duration} oy`}
            />

            <StatCard
              icon={
                <QuestionCircleOutlined className="text-xl text-amber-500" />
              }
              label="Savol limiti"
              value={`${category.questionLimit} ta`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value }) => {
  return (
    <div className="flex items-center gap-4 p-5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/40 transition-all hover:shadow-md">
      <div className="w-12 h-12 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
        {icon}
      </div>
      <div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{label}</p>
        <p className="text-lg font-bold text-gray-900 dark:text-white">
          {value}
        </p>
      </div>
    </div>
  );
};

export default CategoryDetail;
