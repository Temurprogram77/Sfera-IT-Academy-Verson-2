import { Bar } from "react-chartjs-2";
import "./ChartsConfig";

const weeklyGrades = [
  { day: "Monday", score: 8 },
  { day: "Tuesday", score: 6 },
  { day: "Wednesday", score: 9 },
  { day: "Thursday", score: 7 },
  { day: "Friday", score: 5 },
  { day: "Saturday", score: 10 },
  { day: "Sunday", score: 4 },
];

// 🔥 rang aniqlovchi funksiya
const getColor = (score: number) => {
  if (score >= 8) return "#228126"; // yashil
  if (score >= 5) return "#BDAD02"; // sariq
  return "#B30100"; // qizil
};

const data = {
  labels: weeklyGrades.map((g) => g.day),
  datasets: [
    {
      label: "Baholar",
      data: weeklyGrades.map((g) => g.score),

      // 🔥 har bir bar uchun rang
      backgroundColor: weeklyGrades.map((g) => getColor(g.score)),

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
      max: 10,
      ticks: {
        stepSize: 1,
      },
    },
  },
};

export default function WeeklyGradesChart() {
  return <Bar data={data} options={options} />;
}
