interface StatCardProps {
  stat: {
    label: string
    value: string
    subtitle: string
    bgColor: string
    textColor: string
  }
}

export default function StatCard({ stat }: StatCardProps) {
  return (
    <div className={`${stat.bgColor} p-4 dark:bg-[#1d2939] rounded-lg`}>
      <p className="text-slate-600 dark:text-white text-sm">{stat.label}</p>
      <p className={`text-3xl font-bold ${stat.textColor} mt-2`}>{stat.value}</p>
      <p className="text-xs text-slate-500 mt-2">{stat.subtitle}</p>
    </div>
  )
}