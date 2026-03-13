// components/WeeklyGradesCards.tsx

import { useNavigate } from "react-router-dom";
import { images } from "../../assets/images";
import { useMark } from "../../hooks/useMyMarks";
import type { Mark } from "../../types/mark";

const { triangle, circle } = images;

// rang (status bo‘yicha)
function getCardColor(status: string): string {
  if (status === "YASHIL")
    return "bg-gradient-to-tr from-[#115A14] to-[#34A839] text-white";

  if (status === "SARIQ")
    return "bg-gradient-to-tr from-[#cdbb00] to-[#9d9000] text-white";

  return "bg-gradient-to-tr from-[#d70000] to-[#830000] text-white";
}

// fon shakli
function getBg(status: string): string {
  return status === "YASHIL" ? triangle : circle;
}

// markStatus → o‘zbekcha label
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

// Oxirgi N kun sanalari
function getLastNDates(n: number): string[] {
  const dates: string[] = [];

  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);

    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");

    dates.push(`${day}.${month}`);
  }

  return dates;
}

export default function WeeklyGradesCards() {
  const navigate = useNavigate();

  const { marks, loading, error } = useMark({ page: 0, size: 7 });

  const last7 = marks.slice(0, 7);

  const dates = getLastNDates(last7.length || 7);

  return (
    <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
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
          className="text-xs font-semibold text-[#03906D] hover:underline"
        >
          Batafsil
        </button>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-4">
          {Array.from({ length: 7 }).map((_, i) => (
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

        /* Error */
        <div className="text-center py-6 text-red-500 text-sm">
          Xatolik yuz berdi
        </div>

      ) : last7.length === 0 ? (

        /* Empty */
        <div className="text-center py-6 text-gray-400 text-sm">
          Hozircha baholar yo'q
        </div>

      ) : (

        /* Cards */
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-4">
          {last7.map((mark: Mark, idx: number) => {

            const bg = getBg(mark.markCategoryStatus);

            return (
              <div
                key={mark.markId}
                className={`relative overflow-hidden flex flex-col items-center justify-center p-4 rounded-sm shadow-sm ${getCardColor(mark.markCategoryStatus)}`}
              >

                {/* background shapes */}
                <img className="absolute bottom-0 right-0" src={bg} alt="" />
                <img className="absolute -bottom-6 right-0" src={bg} alt="" />
                <img className="absolute -bottom-12 right-0" src={bg} alt="" />

                {/* sana */}
                <span className="text-[11px] font-medium opacity-80">
                  {dates[idx]}
                </span>

                {/* baho turi */}
                <span className="text-sm font-medium">
                  {getMarkStatusLabel(mark.markStatus)}
                </span>

                {/* ball */}
                <span className="mt-1 text-lg font-bold">
                  {mark.totalScore}
                </span>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}