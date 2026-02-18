import { useNavigate } from "react-router-dom";
import { images } from "../../assets/images";
import WeeklyGradesChart from "./WeeklyGradesChart";

const { triangle, circle } = images;

const weeklyGrades = [
  { day: "Monday", score: 8, bg: triangle },
  { day: "Tuesday", score: 6, bg: circle },
  { day: "Wednesday", score: 9, bg: triangle },
  { day: "Thursday", score: 7, bg: triangle },
  { day: "Friday", score: 5, bg: circle },
  { day: "Saturday", score: 10, bg: triangle },
  { day: "Sunday", score: 4, bg: circle },
];

function getCardColor(score: number) {
  if (score >= 7) return "bg-gradient-to-tr from-[#115A14] to-[#34A839] text-white";
  if (score >= 5) return "bg-gradient-to-tr from-[#cdbb00] to-[#9d9000] text-white";
  return "bg-gradient-to-tr from-[#d70000] to-[#830000] text-white";
}

export default function WeeklyGradesCards() {
  const navigate = useNavigate();

  return (
    <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.03] space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">Haftalik baholarim</h3>
          <p className="text-xs text-gray-500 font-medium">O'tgan haftaning baholari (0–10 ball)</p>
        </div>
        <button
          onClick={() => navigate("/my-grades")}
          className="text-xs font-medium text-blue-600 hover:underline"
        >
          Batafsil
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-7 gap-4">
        {weeklyGrades.map((item, idx) => (
          <div
            key={idx}
            className={`relative flex flex-col items-center justify-center p-4 rounded-sm shadow-sm ${getCardColor(item.score)}`}
          >
            <img className="absolute bottom-0 right-0" src={item.bg} alt={item.day} />
            <span className="text-sm font-medium">{item.day}</span>
            <span className="mt-2 text-lg font-bold">{item.score}</span>
          </div>
        ))}
      </div>

      {/* Chart */}
      <WeeklyGradesChart />
    </div>
  );
}
