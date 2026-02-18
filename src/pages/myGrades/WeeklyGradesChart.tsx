import { Bar } from 'react-chartjs-2';
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

const data = {
  labels: weeklyGrades.map(g => g.day),
  datasets: [
    {
      label: 'Baholar',
      data: weeklyGrades.map(g => g.score),
      backgroundColor: 'rgba(54, 162, 235, 0.5)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1,
    }
  ]
};

const options = {
  responsive: true,
  plugins: {
    legend: { position: 'top' as const },
    title: { display: true, text: 'Haftalik Baholar' }
  },
  scales: {
    y: { beginAtZero: true, max: 10 }
  }
};

export default function WeeklyGradesChart() {
  return <Bar key={Math.random()} data={data} options={options} />;
}
