import { useNavigate } from "react-router-dom";
import { images } from "../../assets/images";
import { Bar } from "react-chartjs-2";
import "./ChartsConfig";

const { triangle, circle, star } = images;

const yearlyGrades = [
  { month: "Yanvar", score: 7, bg: triangle },
  { month: "Fevral", score: 8, bg: circle },
  { month: "Mart", score: 6, bg: star },
  { month: "Aprel", score: 9, bg: triangle },
  { month: "May", score: 5, bg: circle },
  { month: "Iyun", score: 10, bg: star },
  { month: "Iyul", score: 7, bg: triangle },
  { month: "Avgust", score: 8, bg: circle },
  { month: "Sentabr", score: 9, bg: star },
  { month: "Oktabr", score: 6, bg: triangle },
  { month: "Noyabr", score: 8, bg: circle },
  { month: "Dekabr", score: 7, bg: star },
];

function getCardColor(score: number) {
  if (score >= 7) return "bg-gradient-to-tr from-[#115A14] to-[#34A839] text-white";
  if (score >= 5) return "bg-gradient-to-tr from-[#cdbb00] to-[#9d9000] text-white";
  return "bg-gradient-to-tr from-[#d70000] to-[#830000] text-white";
}

export default function YearlyGradesCards() {
  const navigate = useNavigate();

  const data = {
    labels: yearlyGrades.map(g => g.month),
    datasets: [
      {
        label: 'Baholar',
        data: yearlyGrades.map(g => g.score),
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
      title: { display: true, text: 'Yillik Baholar' }
    },
    scales: { y: { beginAtZero: true, max: 10 } }
  };

  return (
    <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.03] space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">Yillik baholarim</h3>
          <p className="text-xs text-gray-500 font-medium">O‘tgan yil baholari (0–10 ball)</p>
        </div>
        <button
          onClick={() => navigate("/my-grades")}
          className="text-xs font-medium text-blue-600 hover:underline"
        >
          Batafsil
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-6 gap-4">
        {yearlyGrades.map((item, idx) => (
          <div
            key={idx}
            className={`relative flex flex-col items-center justify-center p-4 rounded-sm shadow-sm ${getCardColor(item.score)}`}
          >
            <img className="absolute bottom-0 right-0" src={item.bg} alt={item.month} />
            <span className="text-sm font-medium">{item.month}</span>
            <span className="mt-2 text-lg font-bold">{item.score}</span>
          </div>
        ))}
      </div>

      <Bar key={Math.random()} data={data} options={options} />
    </div>
  );
}
