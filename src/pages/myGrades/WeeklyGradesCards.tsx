// components/WeeklyGradesCards.tsx

import { useNavigate } from "react-router-dom";
import { images } from "../../assets/images";
import WeeklyGradesChart from "./WeeklyGradesChart";
import { useMark } from "../../hooks/useMyMarks";
import type { Mark } from "../../types/mark";

const { triangle, circle } = images;

// 🔥 rang — backend status + score
function getCardColor(status: string, score: number): string {
  if (status === "YASHIL" || score >= 8)
    return "bg-gradient-to-tr from-[#115A14] to-[#34A839] text-white";
  if (status === "SARIQ" || score >= 5)
    return "bg-gradient-to-tr from-[#cdbb00] to-[#9d9000] text-white";
  return "bg-gradient-to-tr from-[#d70000] to-[#830000] text-white";
}

// 🔥 shakl
function getShape(score: number): string {
  return score >= 8 ? triangle : circle;
}

// markStatus label
function getMarkStatusLabel(status: string): string {
  switch (status) {
    case "KUNLIK_BAHO":
      return "Kunlik";
    case "IMTIHON_BAHO":
      return "Imtihon";
    default:
      return status;
  }
}

export default function WeeklyGradesCards() {
  const navigate = useNavigate();
  const { marks, isLoading, error } = useMark({ page: 0, size: 10 });

  return (
    <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.03] space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">
            Haftalik baholarim
          </h3>
          <p className="text-xs text-gray-500 font-medium">
            O'tgan haftaning baholari (0–10 ball)
          </p>
        </div>
        <button
          onClick={() => navigate("/my-grades")}
          className="text-xs font-medium text-[#03906D] hover:underline"
        >
          Batafsil
        </button>
      </div>

      {/* Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-7 gap-4">
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col items-center justify-center p-4 rounded-sm bg-gray-100 dark:bg-gray-800 animate-pulse h-24"
            >
              <div className="h-3 w-16 bg-gray-300 dark:bg-gray-600 rounded mb-2" />
              <div className="h-5 w-8 bg-gray-300 dark:bg-gray-600 rounded" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-6 text-red-500 text-sm">
          Xatolik yuz berdi
        </div>
      ) : marks.length === 0 ? (
        <div className="text-center py-6 text-gray-400 text-sm">
          Hozircha baholar yo'q
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-7 gap-4">
          {marks.map((mark: Mark) => {
            const shape = getShape(mark.totalScore);

            return (
              <div
                key={mark.markId}
                className={`overflow-hidden relative flex flex-col items-center justify-center p-4 rounded-sm shadow-sm ${getCardColor(
                  mark.markCategoryStatus,
                  mark.totalScore,
                )}`}
              >
                {/* 🔥 shakl */}
                <img className="absolute bottom-0 right-0" src={shape} alt="" />
                <img
                  className="absolute -bottom-6 right-0"
                  src={shape}
                  alt=""
                />
                <img
                  className="absolute -bottom-12 right-0"
                  src={shape}
                  alt=""
                />

                <span className="text-sm font-medium">
                  {getMarkStatusLabel(mark.markStatus)}
                </span>
                <span className="mt-2 text-lg font-bold">
                  {mark.totalScore}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Chart */}
      <WeeklyGradesChart />
    </div>
  );
}
