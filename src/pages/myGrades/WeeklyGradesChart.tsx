// components/WeeklyGradesChart.tsx

import { Bar } from "react-chartjs-2";
import "./ChartsConfig";
import { useMark } from "../../hooks/useMyMarks";

// markCategoryStatus bo'yicha rang
function getColor(status: string): string {
  if (status === "YASHIL") return "#228126";
  if (status === "SARIQ") return "#BDAD02";
  return "#B30100"; // QIZIL
}

// markDate: "2026-03-13" → "13.03"
function formatDate(dateStr?: string): string {
  if (!dateStr) return "—";
  const [, month, day] = dateStr.split("-");
  return `${day}.${month}`;
}

export default function WeeklyGradesChart() {
  const { marks, loading } = useMark({ page: 0, size: 10 });

  const last7 = marks.slice(0, 7);

  if (loading) return null;
  if (last7.length === 0) return null;

  const data = {
    labels: last7.map((m) => formatDate(m.markDate)),
    datasets: [
      {
        label: "Baholar",
        data: last7.map((m) => m.totalScore),
        backgroundColor: last7.map((m) => getColor(m.markCategoryStatus)),
        borderColor: "#ffffff",
        borderWidth: 1,
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      title: {
        display: true,
        text: "Haftalik Baholar",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 5,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  return <Bar data={data} options={options} />;
}