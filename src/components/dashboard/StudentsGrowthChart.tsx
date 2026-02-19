import Chart from "react-apexcharts";
import { useTranslation } from "react-i18next";
import { ApexOptions } from "apexcharts"; // 1. Import the options type

export default function StudentsGrowthChart() {
  const { t } = useTranslation();

  // 2. Explicitly type the options object
  const options: ApexOptions = {
    chart: {
      toolbar: { show: false },
      // Optional: helpful to define font family for consistency
      fontFamily: 'inherit',
    },
    colors: ["#1AA753"],
    stroke: {
      curve: "smooth", // Now TypeScript knows this is the valid literal "smooth"
      width: 3
    },
    xaxis: {
      categories: [
        "Yan", "Fev", "Mar", "Apr", "May", "Iyun",
        "Iyul", "Avg", "Sen", "Okt", "Noy", "Dek"
      ],
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    // Adding grid and markers for a cleaner look (optional)
    grid: {
      borderColor: "#f1f1f1",
      strokeDashArray: 4,
    },
    markers: {
      size: 4,
      colors: ["#1AA753"],
      strokeColors: "#fff",
      strokeWidth: 2,
    }
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
      <Chart
        options={options}
        series={series}
        type="line"
        height={280}
      />
    </div>
  );
}
