import { useNavigate } from "react-router-dom";
import { images } from "../../assets/images";
import { Bar } from "react-chartjs-2";
import "./ChartsConfig";

const { triangle, circle } = images;

const monthlyGrades = [
  { week: "Hafta 1", score: 8, group: "Fullstack 1", course: "React", teacher: "Ali aka" },
  { week: "Hafta 2", score: 6, group: "Fullstack 1", course: "Node.js", teacher: "Sardor aka" },
  { week: "Hafta 3", score: 9, group: "Fullstack 1", course: "JavaScript", teacher: "Madina opa" },
  { week: "Hafta 4", score: 7, group: "Fullstack 1", course: "HTML/CSS", teacher: "Aziza opa" },
];

// 🔥 rang
function getCardColor(score: number) {
  if (score >= 8) return "bg-gradient-to-tr from-[#115A14] to-[#34A839] text-white";
  if (score >= 5) return "bg-gradient-to-tr from-[#cdbb00] to-[#9d9000] text-white";
  return "bg-gradient-to-tr from-[#d70000] to-[#830000] text-white";
}

// 🔥 shakl
function getShape(score: number) {
  return score >= 8 ? triangle : circle;
}

// 🔥 chart rang
function getChartColor(score: number) {
  if (score >= 8) return "#228126";
  if (score >= 5) return "#BDAD02";
  return "#B30100";
}

export default function MonthlyGradesCards() {
  const navigate = useNavigate();

  const data = {
    labels: monthlyGrades.map((g) => g.week),
    datasets: [
      {
        label: "Baholar",
        data: monthlyGrades.map((g) => g.score),
        backgroundColor: monthlyGrades.map((g) => getChartColor(g.score)),
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      title: { display: true, text: "Oylik Baholar" },
    },
    scales: { y: { beginAtZero: true, max: 10 } },
  };

  return (
    <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.03] space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">
            Oylik baholarim
          </h3>
          <p className="text-xs text-gray-500 font-medium">
            O‘tgan oy baholari (0–10 ball)
          </p>
        </div>
        <button
          onClick={() => navigate("/my-grades")}
          className="text-xs font-medium text-blue-600 hover:underline"
        >
          Batafsil
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {monthlyGrades.map((item, idx) => {
          const shape = getShape(item.score);

          return (
            <div
              key={idx}
              className={`overflow-hidden relative flex flex-col items-center justify-center p-4 rounded-sm shadow-sm ${getCardColor(
                item.score
              )}`}
            >
              {/* 🔥 shakl */}
              <img className="w-[60%] absolute bottom-0 right-0" src={shape} />
              <img className="w-[60%] absolute -bottom-10 right-0" src={shape} />
              <img className="w-[60%] absolute -bottom-20 right-0" src={shape} />

              <span className="text-sm font-medium">{item.week}</span>
              <span className="mt-2 text-lg font-bold">{item.score}</span>

              <p className="text-xs text-white/80 mt-1 text-center">
                {item.group} - {item.course} ({item.teacher})
              </p>
            </div>
          );
        })}
      </div>

      <Bar data={data} options={options} />
    </div>
  );
}
