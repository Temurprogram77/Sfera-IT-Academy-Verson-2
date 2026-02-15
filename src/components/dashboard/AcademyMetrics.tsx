import { useTranslation } from "react-i18next";
import { UsergroupAddOutlined, BookOutlined, CalendarOutlined, DollarOutlined } from "@ant-design/icons";
import Badge from "../ui/badge/Badge";

export default function AcademyMetrics() {
  const { t } = useTranslation();

  const metrics = [
    {
      title: t("students"),
      value: "1,284",
      change: "+12%",
      color: "success",
      icon: <UsergroupAddOutlined style={{ fontSize: '24px', color: '#1AA753' }} />,
    },
    {
      title: t("courses"),
      value: "18",
      change: "+2",
      color: "success",
      icon: <BookOutlined style={{ fontSize: '24px', color: '#465FFF' }} />,
    },
    {
      title: t("todayLessons"),
      value: "32",
      change: "-3",
      color: "error",
      icon: <CalendarOutlined style={{ fontSize: '24px', color: '#D92D20' }} />,
    },
    {
      title: t("monthlyRevenue"),
      value: "$12,430",
      change: "+8%",
      color: "success",
      icon: <DollarOutlined style={{ fontSize: '24px', color: '#039855' }} />,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map((item, i) => (
        <div key={i} className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
            {item.icon}
          </div>

          <div className="flex items-end justify-between mt-5">
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {item.title}
              </span>
              <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                {item.value}
              </h4>
            </div>

            <Badge color={item.color}>{item.change}</Badge>
          </div>
        </div>
      ))}
    </div>
  );
}
