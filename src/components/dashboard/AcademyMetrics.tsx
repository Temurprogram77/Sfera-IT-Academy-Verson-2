import { useTranslation } from "react-i18next";
import {
  UsergroupAddOutlined,
  BookOutlined,
  CalendarOutlined,
  HomeOutlined,
  TeamOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import { Skeleton } from "antd";
import Badge from "../ui/badge/Badge";
import { useDashboardMetrics } from "../../hooks/useDashboard";

// ─── Metrika konfiguratsiyasi ─────────────────────────────────────────────────
// dataKey — IDashboardMetrics field nomi
const METRIC_CONFIGS = [
  {
    titleKey: "students",
    dataKey: "countStudents" as const,
    icon: <UsergroupAddOutlined style={{ fontSize: 24, color: "#1AA753" }} />,
    badgeColor: "success",
    format: (v: number) => v.toLocaleString(),
  },
  {
    titleKey: "groups",
    dataKey: "countGroups" as const,
    icon: <TeamOutlined style={{ fontSize: 24, color: "#465FFF" }} />,
    badgeColor: "success",
    format: (v: number) => String(v),
  },
  {
    titleKey: "rooms",
    dataKey: "countRooms" as const,
    icon: <HomeOutlined style={{ fontSize: 24, color: "#D92D20" }} />,
    badgeColor: "info",
    format: (v: number) => String(v),
  },
  {
    titleKey: "categories",
    dataKey: "countCategory" as const,
    icon: <AppstoreOutlined style={{ fontSize: 24, color: "#039855" }} />,
    badgeColor: "success",
    format: (v: number) => String(v),
  },
  {
    titleKey: "employees",
    dataKey: "countEmployees" as const,
    icon: <BookOutlined style={{ fontSize: 24, color: "#7B61FF" }} />,
    badgeColor: "info",
    format: (v: number) => String(v),
  },
  {
    titleKey: "todayLessons",
    dataKey: "countLessons" as const,
    icon: <CalendarOutlined style={{ fontSize: 24, color: "#F79009" }} />,
    badgeColor: "warning",
    format: (v: number) => String(v),
  },
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function AcademyMetrics() {
  const { t } = useTranslation();
  const { metrics, loading } = useDashboardMetrics();

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
      {METRIC_CONFIGS.map((config, i) => {
        const value = metrics ? metrics[config.dataKey] : null;

        return (
          <div
            key={i}
            className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]"
          >
            {/* Icon */}
            <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
              {config.icon}
            </div>

            {/* Value + label */}
            <div className="flex items-end justify-between mt-5">
              <div className="min-w-0 flex-1">
                <span className="text-sm text-gray-500 dark:text-gray-400 block truncate">
                  {t(config.titleKey)}
                </span>

                {loading ? (
                  <Skeleton.Input
                    active
                    size="small"
                    style={{ width: 60, marginTop: 8 }}
                  />
                ) : (
                  <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                    {value !== null && value !== undefined
                      ? config.format(value)
                      : "—"}
                  </h4>
                )}
              </div>

              {!loading && value !== null && (
                <Badge color={config.badgeColor}>
                  {config.format(value!)}
                </Badge>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}