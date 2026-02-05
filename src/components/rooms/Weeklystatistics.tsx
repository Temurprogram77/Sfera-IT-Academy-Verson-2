import { Card } from 'antd'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { CHART_DATA } from  '../../constants/data'

export default function WeeklyStatistics() {
  return (
    <Card
      title={
        <div>
          <h2 className="text-xl font-bold text-slate-900">Weekly Statistics</h2>
          <p className="text-sm text-slate-500 mt-1">Busy and free hours across the week</p>
        </div>
      }
      className="shadow-sm"
    >
      <div className="flex gap-8 mb-6">
        <div>
          <p className="text-slate-600 text-sm">Total Busy Hours</p>
          <p className="text-3xl font-bold text-indigo-600 mt-1">17.0h</p>
        </div>
        <div>
          <p className="text-slate-600 text-sm">Total Free Hours</p>
          <p className="text-3xl font-bold text-green-500 mt-1">67.0h</p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={CHART_DATA}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip 
            contentStyle={{ backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1' }}
            formatter={(value) => `${value}h`}
          />
          <Legend />
          <Bar dataKey="busy" fill="#000000" name="Busy" />
          <Bar dataKey="free" fill="#1f2937" name="Free" />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  )
}