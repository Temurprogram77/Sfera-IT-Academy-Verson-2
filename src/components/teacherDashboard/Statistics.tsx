import { useTranslation } from "react-i18next";
import {
  UsergroupAddOutlined,
  CalendarOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { Skeleton } from "antd";
import Badge from "../ui/badge/Badge";
import { useDashboardMetrics } from "../../hooks/useDashboard";

/* ============================= */
/* Metric Config Type */
/* ============================= */

type MetricKey = "countLesson" | "groupCount";

type MetricConfig = {
  titleKey: string;
  dataKey: MetricKey;
  icon: React.ReactNode;
  badgeColor: "success" | "warning" | "info";
  format: (v: number) => string;
};

/* ============================= */
/* Metric Configs */
/* ============================= */

const METRIC_CONFIGS: MetricConfig[] = [
  {
    titleKey: "students",
    dataKey: "countLesson",
    icon: <UsergroupAddOutlined style={{ fontSize: 24, color: "#1AA753" }} />,
    badgeColor: "success",
    format: (v) => v.toLocaleString(),
  },
  {
    titleKey: "groups",
    dataKey: "groupCount",
    icon: <TeamOutlined style={{ fontSize: 24, color: "#465FFF" }} />,
    badgeColor: "success",
    format: (v) => String(v),
  },
  {
    titleKey: "todayLessons",
    dataKey: "countLesson",
    icon: <CalendarOutlined style={{ fontSize: 24, color: "#F79009" }} />,
    badgeColor: "warning",
    format: (v) => String(v),
  },
];

/* ============================= */
/* Component */
/* ============================= */

export default function AcademyMetrics() {
  const { t } = useTranslation();
  const { metrics, loading } = useDashboardMetrics();

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {METRIC_CONFIGS.map((config, i) => {
        // ✅ Safe access
        const value =
          metrics && config.dataKey in metrics
            ? metrics[config.dataKey as keyof typeof metrics]
            : null;

        return (
          <div
            key={i}
            className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]"
          >
            <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
              {config.icon}
            </div>

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
                    {value != null ? config.format(value as number) : "—"}
                  </h4>
                )}
              </div>

              {!loading && value != null && (
                <Badge color={config.badgeColor}>
                  {config.format(value as number)}
                </Badge>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}