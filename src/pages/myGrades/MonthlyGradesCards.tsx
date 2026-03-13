// components/MonthlyGradesCards.tsx

import { useNavigate } from "react-router-dom";
import { images } from "../../assets/images";
import { Bar } from "react-chartjs-2";
import "./ChartsConfig";
import { useMark } from "../../hooks/useMyMarks";
import type { Mark } from "../../types/mark";

const { triangle, circle } = images;

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

function formatDate(dateStr?: string): string {
  if (!dateStr) return "—";
  const [, month, day] = dateStr.split("-");
  return `${day}.${month}`;
}

export default function MonthlyGradesCards() {
  const navigate = useNavigate();
  const { marks, loading, error } = useMark({ page: 0, size: 30 });

  const chartData = {
    labels: marks.map((m) => formatDate(m.markDate)),
    datasets: [
      {
        label: "Baholar",
        data: marks.map((m) => m.totalScore),
        backgroundColor: marks.map((m) => getChartColor(m.markCategoryStatus)),
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
      title: { display: true, text: "Oylik Baholar Statistikasi" },
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
            Oylik baholarim
          </h3>
          <p className="text-xs text-gray-500 font-medium">
            O'tgan oyning baholari (0–5 ball)
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
      ) : marks.length === 0 ? (
        <div className="text-center py-6 text-gray-400 text-sm">Hozircha baholar yo'q</div>
      ) : (
        <>
          {/* Cards — responsive grid, oyda ~4 hafta bo'lishi mumkin */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
            {marks.map((mark: Mark) => {
              const bg = getBg(mark.markCategoryStatus);
              return (
                <div
                  key={mark.markId}
                  className={`relative overflow-hidden flex flex-col items-center justify-center p-4 rounded-sm shadow-sm ${getCardColor(mark.markCategoryStatus)}`}
                >
                  <img className="w-[60%] absolute bottom-0 right-0" src={bg} alt="" />
                  <img className="w-[60%] absolute -bottom-5 right-0" src={bg} alt="" />
                  <img className="w-[60%] absolute -bottom-10 right-0" src={bg} alt="" />
                  <span className="text-[11px] font-medium opacity-80">{formatDate(mark.markDate)}</span>
                  <span className="text-sm font-medium">{getMarkStatusLabel(mark.markStatus)}</span>
                  <span className="mt-1 text-lg font-bold">{mark.totalScore}</span>
                </div>
              );
            })}
          </div>

          {/* Oylik chart */}
          <Bar data={chartData} options={chartOptions} />
        </>
      )}
    </div>
  );
}