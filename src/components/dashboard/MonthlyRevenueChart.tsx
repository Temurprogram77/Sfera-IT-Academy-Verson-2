import Chart from "react-apexcharts";
import { useTranslation } from "react-i18next";

export default function MonthlyRevenueChart() {
  const { t } = useTranslation();

  const options = {
    chart: { toolbar: { show: false } },
    colors: ["#465FFF"],
    stroke: { curve: "smooth", width: 3 },
    xaxis: {
      categories: ["Yan", "Fev", "Mar", "Apr", "May", "Iyun", "Iyul", "Avg", "Sen", "Okt", "Noy", "Dek"],
    },
  };

  const series = [
    {
      name: t("revenue"),
      data: [3200, 4100, 3800, 5200, 6100, 7200, 6800, 7600, 8200, 9100, 10400, 12430],
    },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
      <h3 className="text-lg font-semibold mb-4">{t("monthlyRevenue")}</h3>
      <Chart options={options} series={series} type="area" height={280} />
    </div>
  );
}
