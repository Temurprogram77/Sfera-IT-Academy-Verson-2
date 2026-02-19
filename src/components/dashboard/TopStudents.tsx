import Lottie from "lottie-react";
import { images } from "../../assets/images";
import { useTopStudents } from "../../hooks/useTopStudents";
import { TopStudent } from "../../types/topStudents";
import { Spin } from "antd";

const { crown, lottie, person } = images;

const MEDAL_COLORS = [
  {
    ring: "ring-yellow-400",
    podiumBg: "bg-gradient-to-b from-yellow-400 to-yellow-500",
    podiumShadow: "shadow-yellow-300/60 dark:shadow-yellow-500/30",
    nameCls: "text-yellow-600 dark:text-yellow-400 text-lg font-black",
    scoreCls: "text-yellow-500 dark:text-yellow-300 font-black text-xl",
    height: "h-36",
    size: "w-28",
    numSize: "text-5xl",
    avatarSize: "w-28 h-28",
  },
  {
    ring: "ring-slate-400",
    podiumBg: "bg-gradient-to-b from-slate-300 to-slate-400",
    podiumShadow: "shadow-slate-300/50 dark:shadow-slate-500/20",
    nameCls: "text-slate-600 dark:text-slate-300 font-bold",
    scoreCls: "text-indigo-500 dark:text-indigo-400 font-bold text-base",
    height: "h-24",
    size: "w-24",
    numSize: "text-4xl",
    avatarSize: "w-24 h-24",
  },
  {
    ring: "ring-amber-600",
    podiumBg: "bg-gradient-to-b from-amber-600 to-amber-700",
    podiumShadow: "shadow-amber-400/40 dark:shadow-amber-600/20",
    nameCls: "text-amber-700 dark:text-amber-400 font-bold",
    scoreCls: "text-indigo-500 dark:text-indigo-400 font-bold text-base",
    height: "h-16",
    size: "w-24",
    numSize: "text-4xl",
    avatarSize: "w-24 h-24",
  },
];

// Podium order: 2nd, 1st, 3rd
const PODIUM_ORDER = [1, 0, 2];

function StudentAvatar({
  imageUrl,
  name,
  size,
}: {
  imageUrl: string;
  name: string;
  size: string;
}) {
  return imageUrl ? (
    <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
  ) : (
    <div className="w-full h-full bg-blue-500 flex items-center justify-center text-white font-bold text-xl">
      {name?.charAt(0).toUpperCase()}
    </div>
  );
}

function AvatarWithLottie({
  student,
  avatarSize,
  ring,
  isFirst,
}: {
  student: TopStudent;
  avatarSize: string;
  ring: string;
  isFirst: boolean;
}) {
  return (
    <div className={`relative ${avatarSize} flex-shrink-0`}>
      {isFirst && (
        <div className="absolute -top-9 left-1/2 -translate-x-1/2 w-14 h-14 z-20 pointer-events-none">
          <Lottie animationData={crown} loop />
        </div>
      )}

      <div
        className={`w-full h-full rounded-full ring-4 ${ring} ring-offset-2 ring-offset-white dark:ring-offset-gray-900 overflow-hidden shadow-lg relative z-10`}
      >
        <StudentAvatar
          imageUrl={student.imageUrl}
          name={student.studentName}
          size={avatarSize}
        />
      </div>

      <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 w-full pointer-events-none z-20">
        <Lottie animationData={lottie} loop />
      </div>
    </div>
  );
}

function PodiumCard({
  student,
  medalIndex,
  rank,
}: {
  student: TopStudent;
  medalIndex: number;
  rank: number;
}) {
  const m = MEDAL_COLORS[medalIndex];
  const isFirst = medalIndex === 0;

  // Faqat ism (birinchi so'z)
  const firstName = student.studentName?.split(" ").slice(0, 1).join(" ");

  return (
    <div
      className={`flex flex-col items-center ${isFirst ? "z-10" : ""}`}
      style={{ marginTop: isFirst ? 0 : 24 }}
    >
      <AvatarWithLottie
        student={student}
        avatarSize={m.avatarSize}
        ring={m.ring}
        isFirst={isFirst}
      />

      <div className="mt-7 text-center">
        <p className={m.nameCls}>{firstName}</p>
        <p className={m.scoreCls}>{student.percent}%</p>
      </div>

      <div
        className={`${m.size} ${m.height} ${m.podiumBg} rounded-t-2xl flex items-center justify-center shadow-xl ${m.podiumShadow} mt-3 relative overflow-hidden`}
      >
        <div className="absolute top-0 left-0 right-0 h-1/3 bg-white/20 rounded-t-2xl" />
        <span className={`${m.numSize} font-black text-white drop-shadow-lg`}>
          {rank}
        </span>
      </div>
    </div>
  );
}

export default function TopStudents() {
  const { students, loading, error } = useTopStudents();

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center py-20 text-red-500">
        {error}
      </div>
    );
  }

  if (!students.length) {
    return (
      <div className="flex justify-center items-center py-20 text-gray-400">
        Ma'lumot topilmadi
      </div>
    );
  }

  // Top 3 podium uchun, qolganlar list uchun
  const podiumStudents = students.slice(0, 3);
  const otherStudents = students.slice(3);

  // PODIUM_ORDER: [1, 0, 2] → 2nd, 1st, 3rd
  // Faqat mavjud studentlar uchun
  const podiumOrder = PODIUM_ORDER.filter((i) => podiumStudents[i]);

  return (
    <div className="w-full max-w-7xl mx-auto rounded-3xl border border-gray-100 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900/60">
      {/* Header */}
      <h2 className="text-2xl font-black text-gray-800 dark:text-white mb-2 text-center tracking-widest uppercase">
        Top{" "}
        <span className="bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
          O'quvchilar
        </span>
      </h2>
      <p className="text-center text-sm text-gray-400 dark:text-gray-500 mb-12">
        Eng yaxshi natija ko'rsatgan o'quvchilar 🏆
      </p>

      {/* Podium */}
      <div className="flex items-end justify-center gap-6 sm:gap-10 mb-16 px-4">
        {podiumOrder.map((studentIndex) => (
          <PodiumCard
            key={podiumStudents[studentIndex].studentId}
            student={podiumStudents[studentIndex]}
            medalIndex={studentIndex}
            rank={studentIndex + 1}
          />
        ))}
      </div>

      {/* Divider */}
      {otherStudents.length > 0 && (
        <>
          <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent mb-6" />

          {/* 4th+ place list */}
          <div className="flex flex-col gap-3">
            {otherStudents.map((student, index) => {
              const rank = index + 4;
              return (
                <div
                  key={student.studentId}
                  className="flex items-center gap-5 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/40 border border-transparent hover:border-indigo-200 dark:hover:border-indigo-900 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/10 transition-all duration-200 cursor-pointer group"
                >
                  <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-sm font-black text-gray-500 dark:text-gray-400 flex-shrink-0 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/50 transition-colors">
                    {rank}
                  </div>

                  <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-gray-200 dark:ring-gray-700 flex-shrink-0">
                    <StudentAvatar
                      imageUrl={student.imageUrl}
                      name={student.studentName}
                      size="w-10 h-10"
                    />
                  </div>

                  <span className="flex-1 font-semibold text-gray-700 dark:text-gray-300 text-base">
                    {student.studentName}
                  </span>

                  <div className="hidden sm:block flex-1 max-w-xs">
                    <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full"
                        style={{ width: `${student.percent}%` }}
                      />
                    </div>
                  </div>

                  <span className="font-black text-indigo-500 dark:text-indigo-400 text-lg min-w-[52px] text-right">
                    {student.percent}%
                  </span>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}