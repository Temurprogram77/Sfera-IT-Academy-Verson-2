import React from "react";
import { useProfile } from "../../hooks/useProfile";

export default function StudentInfoCard() {
  const { user, loading, error } = useProfile();

  if (loading) return <p>Yuklanmoqda...</p>;
  if (error) return <p>Xatolik yuz berdi: {error}</p>;
  if (!user) return null; // user bo'lmasa hech narsa chiqmasin

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
      <h2 className="text-lg font-semibold mb-5">Mening kursim</h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
        {user.fullName && (
          <Info label="Ism" value={truncateText(user.fullName, 20)} />
        )}
        {user.teacherName && (
          <Info label="O'qituvchi" value={truncateText(user.teacherName, 20)} />
        )}
        {user.groupName && <Info label="Guruh" value={user.groupName} />}
        {user.roomName && <Info label="Xona" value={user.roomName} />}
        {user.lessonCount && (
          <Info label="Haftasiga dars" value={`${user.lessonCount} ta`} />
        )}
      </div>
    </div>
  );
}

// Matnni kesish funksiyasi
function truncateText(text: string, maxLength: number) {
  if (text.length > maxLength) {
    return text.slice(0, maxLength) + "...";
  }
  return text;
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-semibold text-gray-800 dark:text-white">{value}</p>
    </div>
  );
}
