const student = {
  name: "Temurbek",
  group: "Frontend N1",
  teacher: "Abdulloh Xasanov",
  room: "Room 3",
  lessonsPerWeek: 3,
};

export default function StudentInfoCard() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
      <h2 className="text-lg font-semibold mb-5">Mening kursim</h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Info label="Ism" value={student.name} />
        <Info label="Guruh" value={student.group} />
        <Info label="O‘qituvchi" value={student.teacher} />
        <Info label="Xona" value={student.room} />
        <Info label="Haftasiga dars" value={`${student.lessonsPerWeek} ta`} />
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-semibold text-gray-800 dark:text-white">{value}</p>
    </div>
  );
}
