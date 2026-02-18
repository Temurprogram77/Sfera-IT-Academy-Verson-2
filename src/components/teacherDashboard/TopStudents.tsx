import { images } from "../../assets/images";
const { crown, medal1, medal2, medal3 } = images;

const topStudents = [
  { name: "Ali", score: 98 },
  { name: "Sardor", score: 96 },
  { name: "Madina", score: 95 },
  { name: "Javohir", score: 94 },
  { name: "Aziza", score: 92 },
];

function RankIcon({ index }: { index: number }) {
  if (index === 0)
    return <img src={medal1} alt="1st" className="w-7 h-7 object-contain" />;

  if (index === 1)
    return <img src={medal2} alt="2nd" className="w-7 h-7 object-contain" />;

  if (index === 2)
    return <img src={medal3} alt="3rd" className="w-7 h-7 object-contain" />;

  return (
    <div className="w-6 h-6 flex items-center justify-center text-sm font-semibold text-gray-500">
      {index + 1}
    </div>
  );
}

export default function TopStudents() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
      <h2 className="text-lg font-semibold mb-5 uppercase tracking-wider dark:text-white">TOP 5 o‘quvchilar</h2>

      <div className="space-y-4">
        {topStudents.map((student, index) => (
          <div
            key={student.name}
            className="relative flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-900"
          >
            {index === 0 && (
              <img
                src={crown}
                alt="crown"
                className="absolute -top-3 -left-2 w-8 h-8 rotate-[-25deg] drop-shadow-sm"
              />
            )}

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 flex items-center justify-center">
                <RankIcon index={index} />
              </div>

              <span className={`font-medium ${index === 0 ? "text-yellow-600 dark:text-yellow-500" : ""}`}>
                {student.name}
              </span>
            </div>

            <span className={`font-semibold ${index === 0 ? "text-yellow-600" : "text-indigo-600"}`}>
              {student.score}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
