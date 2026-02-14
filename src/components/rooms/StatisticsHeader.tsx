interface StatisticsHeaderProps {
  title?: string;
  description?: string;
}

export const StatisticsHeader = ({
  title = "Haftaviy Vaqt Statistikasi",
  description = "Band va bo'sh vaqtlarning tahlili",
}: StatisticsHeaderProps) => {
  return (
    <div>
      <h1 className="text-3xl font-bold flex items-center gap-3">
        {title}
      </h1>
      <p className="text-gray-500 mt-2">{description}</p>
    </div>
  );
};