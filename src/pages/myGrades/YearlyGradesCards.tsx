// components/YearlyGradesCards.tsx

import { useNavigate } from "react-router-dom";
import { images } from "../../assets/images";
import { Bar } from "react-chartjs-2";
import "./ChartsConfig";
import { useMark } from "../../hooks/useMyMarks";
import type { Mark } from "../../types/mark";

const { triangle, circle } = images;

// Oylar nomi (index bo'yicha)
const MONTH_NAMES = [
  "Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun",
  "Iyul", "Avgust", "Sentabr", "Oktabr", "Noyabr", "Dekabr",
];

function getCardColor(status: string): string {
  if (status === "YASHIL")
    return "bg-gradient-to-tr from-[#115A14] to-[#34A839] text-white";
  if (status === "SARIQ")
    return "bg-gradient-to-tr from-[#cdbb00] to-[#9d9000] text-white";
  return "bg-gradient-to-tr from-[#d70000] to-[#830000] text-white";
}

function getBg(status: string): string {
  return status === "YASHIL" ? triangle : circle;
}

function getChartColor(status: string): string {
  if (status === "YASHIL") return "#228126";
  if (status === "SARIQ") return "#BDAD02";
  return "#B30100";
}

function getMarkStatusLabel(status: string): string {
  switch (status) {
    case "KUNLIK_BAHO": return "Kunlik";
    case "IMTIHON_BAHO": return "Imtihon";
    default: return status;
  }
}

// "2026-03-13" → oy nomini qaytaradi: "Mart"
function getMonthName(dateStr?: string): string {
  if (!dateStr) return "—";
  const monthIdx = parseInt(dateStr.split("-")[1], 10) - 1;
  return MONTH_NAMES[monthIdx] ?? "—";
}

// Oylar bo'yicha guruhlash va o'rtacha hisoblash
function groupByMonth(marks: Mark[]): { month: string; avgScore: number; status: string }[] {
  const map = new Map<string, { scores: number[]; statuses: string[] }>();

  marks.forEach((m) => {
    const key = getMonthName(m.markDate);
    if (!map.has(key)) map.set(key, { scores: [], statuses: [] });
    map.get(key)!.scores.push(m.totalScore);
    map.get(key)!.statuses.push(m.markCategoryStatus);
  });

  return Array.from(map.entries()).map(([month, { scores, statuses }]) => {
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
    // Ko'pinchi status
    const statusCount = statuses.reduce<Record<string, number>>((acc, s) => {
      acc[s] = (acc[s] || 0) + 1;
      return acc;
    }, {});
    const dominantStatus = Object.entries(statusCount).sort((a, b) => b[1] - a[1])[0][0];
    return { month, avgScore: Math.round(avg * 10) / 10, status: dominantStatus };
  });
}

export default function YearlyGradesCards() {
  const navigate = useNavigate();
  // Yillik: ko'p baho bo'lishi mumkin, size=200 yoki totalPage bilan ishlash
  const { marks, loading, error } = useMark({ page: 0, size: 200 });

  // Oylar bo'yicha guruhlab, o'rtacha olamiz
  const monthlyData = groupByMonth(marks);

  const chartData = {
    labels: monthlyData.map((m) => m.month),
    datasets: [
      {
        label: "O'rtacha baholar",
        data: monthlyData.map((m) => m.avgScore),
        backgroundColor: monthlyData.map((m) => getChartColor(m.status)),
        borderColor: "#ffffff",
        borderWidth: 1,
        borderRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      title: { display: true, text: "Yillik Baholar Statistikasi (oylik o'rtacha)" },
    },
    scales: {
      y: { beginAtZero: true, max: 5, ticks: { stepSize: 1 } },
    },
  };

  return (
    <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.03] space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">
            Yillik baholarim
          </h3>
          <p className="text-xs text-gray-500 font-medium">
            O'tgan yil baholari — oylik o'rtacha (0–5 ball)
          </p>
        </div>
        <button
          onClick={() => navigate("/my-grades")}
          className="text-xs font-medium text-[#03906D] hover:underline"
        >
          Batafsil
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col items-center justify-center p-4 rounded-sm bg-gray-100 dark:bg-gray-800 animate-pulse h-24"
            >
              <div className="h-2 w-10 bg-gray-300 dark:bg-gray-600 rounded mb-1" />
              <div className="h-3 w-14 bg-gray-300 dark:bg-gray-600 rounded mb-2" />
              <div className="h-5 w-8 bg-gray-300 dark:bg-gray-600 rounded" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-6 text-red-500 text-sm">Xatolik yuz berdi</div>
      ) : monthlyData.length === 0 ? (
        <div className="text-center py-6 text-gray-400 text-sm">Hozircha baholar yo'q</div>
      ) : (
        <>
          {/* Oylar bo'yicha cards (o'rtacha ball) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
            {monthlyData.map((item) => {
              const bg = getBg(item.status);
              return (
                <div
                  key={item.month}
                  className={`overflow-hidden relative flex flex-col items-center justify-center p-4 rounded-sm shadow-sm ${getCardColor(item.status)}`}
                >
                  <img className="w-[60%] absolute bottom-0 right-0" src={bg} alt="" />
                  <img className="w-[60%] absolute -bottom-5 right-0" src={bg} alt="" />
                  <img className="w-[60%] absolute -bottom-10 right-0" src={bg} alt="" />
                  <span className="text-sm font-medium">{item.month}</span>
                  <span className="mt-2 text-lg font-bold">{item.avgScore}</span>
                </div>
              );
            })}
          </div>

          {/* Yillik chart */}
          <Bar data={chartData} options={chartOptions} />
        </>
      )}
    </div>
  );
}