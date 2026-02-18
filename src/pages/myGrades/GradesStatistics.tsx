import { Bar } from "react-chartjs-2";

const GradesStatistics = () => {
  const data = {
    labels: ["Hafta 1", "Hafta 2", "Hafta 3", "Hafta 4"],
    datasets: [
      {
        label: "Baholar",
        data: [7, 9, 6, 8],
        backgroundColor: "#34A839",
      },
    ],
  };

  return (
    <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
      <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Statistika</h3>
      <Bar data={data} />
    </div>
  );
};

export default GradesStatistics;
