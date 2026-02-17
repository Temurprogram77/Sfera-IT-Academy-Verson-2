import Chart from "react-apexcharts";

export default function StudentGradesChart() {
  const options: any = {
    chart: {
      toolbar: { show: false },
      dropShadow: {
        enabled: true,
        top: 3,
        left: 2,
        blur: 4,
        opacity: 0.1,
      },
    },
    // Kundalik.com dagi kabi yashil-sariq-qizil gradient effekti
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.45,
        opacityTo: 0.05,
        stops: [20, 100, 100],
        colorStops: [
          { offset: 0, color: "#22c55e", opacity: 0.4 }, // Yashil (Yaxshi)
          { offset: 50, color: "#eab308", opacity: 0.2 }, // Sariq (O'rta)
          { offset: 100, color: "#ef4444", opacity: 0.1 }, // Qizil (Past)
        ]
      },
    },
    colors: ["#22c55e"], // Asosiy chiziq rangi yashil
    stroke: {
      curve: "smooth",
      width: 3,
    },
    markers: {
      size: 5,
      colors: ["#ffffff"],
      strokeColors: "#22c55e",
      strokeWidth: 3,
      hover: { size: 7 },
    },
    grid: {
      show: true,
      borderColor: "#f1f1f1",
      strokeDashArray: 4,
    },
    xaxis: {
      categories: ["HTML", "CSS", "JS", "React", "API", "Git"],
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      min: 0,
      max: 100,
      tickAmount: 5,
      labels: {
        formatter: (val: number) => val.toFixed(0),
      },
    },
    tooltip: {
      y: {
        formatter: (val: number) => `${val} ball`,
      },
    },
  };

  const series = [
    {
      name: "Baho",
      data: [85, 78, 90, 72, 88, 95],
    },
  ];

  return (
    <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">
            Mening baholarim
          </h3>
          <p className="text-xs text-gray-500 font-medium">O'zlashtirish ko'rsatkichi</p>
        </div>
        <div className="flex gap-2">
          <span className="flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md">
            A'lo
          </span>
        </div>
      </div>

      <Chart options={options} series={series} type="area" height={300} />
    </div>
  );
}
