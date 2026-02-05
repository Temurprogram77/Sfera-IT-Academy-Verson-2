import { Badge } from 'antd'

export default function Header() {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Chat-GPT</h1>
        <p className="text-slate-600 mt-1">Room Schedule & Statistics</p>
      </div>
      <Badge count={10} style={{ backgroundColor: '#6366f1' }} />
    </div>
  )
}