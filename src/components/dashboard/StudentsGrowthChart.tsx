import Chart from "react-apexcharts";
import { useTranslation } from "react-i18next";

export default function StudentsGrowthChart() {
  const { t } = useTranslation();

  const options = {
    chart: { toolbar: { show: false } },
    colors: ["#1AA753"],
    stroke: { curve: "smooth", width: 3 },
    xaxis: {
      categories: ["Yan", "Fev", "Mar", "Apr", "May", "Iyun", "Iyul", "Avg", "Sen", "Okt", "Noy", "Dek"],
    },
  };

  const series = [
    {
      name: t("students"),
      data: [120, 150, 210, 280, 350, 420, 500, 610, 720, 860, 1000, 1284],
    },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
      <h3 className="text-lg font-semibold mb-4">{t("studentsGrowth")}</h3>
      <Chart options={options} series={series} type="line" height={280} />
    </div>
  );
}
