import React, { useState } from "react";
import WeeklyGradesCards from "./WeeklyGradesCards";
import MonthlyGradesCards from "./MonthlyGradesCards";
import YearlyGradesCards from "./YearlyGradesCards";

const MyGrades = () => {
  const [view, setView] = useState<"weekly" | "monthly" | "yearly">("weekly");

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            Mening baholarim
          </h2>
          <p className="text-sm text-gray-500">
            Haftalik, oylik va yillik baholarni kuzatish
          </p>
        </div>

        <div className="flex gap-2">
          <button
            className={`px-4 py-2 rounded-full font-medium ${
              view === "weekly"
                ? "bg-[#03906D] text-white"
                : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-white"
            }`}
            onClick={() => setView("weekly")}
          >
            Haftalik
          </button>
          <button
            className={`px-4 py-2 rounded-full font-medium ${
              view === "monthly"
                ? "bg-[#03906D] text-white"
                : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-white"
            }`}
            onClick={() => setView("monthly")}
          >
            Oylik
          </button>
          <button
            className={`px-4 py-2 rounded-full font-medium ${
              view === "yearly"
                ? "bg-[#03906D] text-white"
                : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-white"
            }`}
            onClick={() => setView("yearly")}
          >
            Yillik
          </button>
        </div>
      </div>

      {/* Cards + Charts */}
      {view === "weekly" && <WeeklyGradesCards />}
      {view === "monthly" && <MonthlyGradesCards />}
      {view === "yearly" && <YearlyGradesCards />}
    </div>
  );
};

export default MyGrades;
