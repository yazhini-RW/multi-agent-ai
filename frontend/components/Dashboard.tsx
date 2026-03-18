'use client'
import { useEffect, useState } from 'react'
import { getStats, getQueryLogs } from '@/lib/api'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { MessageSquare, Clock, FileText, Bot } from 'lucide-react'

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444']

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null)
  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, logsData] = await Promise.all([getStats(), getQueryLogs()])
        setStats(statsData)
        setLogs(logsData)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-gray-400">Loading dashboard...</p>
    </div>
  )

  const agentData = stats?.agent_usage
    ? Object.entries(stats.agent_usage).map(([name, count]) => ({ name, count }))
    : []

  const responseTimeData = logs.slice(0, 10).map((log, i) => ({
    name: `Q${i + 1}`,
    time: log.response_time
  }))

  return (
    <div className="p-8 overflow-y-auto">
      <h2 className="text-2xl font-bold text-white mb-2">Analytics Dashboard</h2>
      <p className="text-gray-400 mb-8">Real-time insights on agent activity</p>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-gray-800 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <MessageSquare size={20} className="text-blue-400" />
            <span className="text-gray-400 text-sm">Total Queries</span>
          </div>
          <p className="text-3xl font-bold text-white">{stats?.total_queries || 0}</p>
        </div>
        <div className="bg-gray-800 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <Clock size={20} className="text-green-400" />
            <span className="text-gray-400 text-sm">Avg Response Time</span>
          </div>
          <p className="text-3xl font-bold text-white">{stats?.avg_response_time || 0}s</p>
        </div>
        <div className="bg-gray-800 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <FileText size={20} className="text-yellow-400" />
            <span className="text-gray-400 text-sm">Documents Uploaded</span>
          </div>
          <p className="text-3xl font-bold text-white">{stats?.total_documents || 0}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-800 rounded-2xl p-5">
          <h3 className="text-white font-semibold mb-4">Agent Usage</h3>
          {agentData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={agentData} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
                  {agentData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-sm text-center mt-16">No data yet</p>
          )}
        </div>

        <div className="bg-gray-800 rounded-2xl p-5">
          <h3 className="text-white font-semibold mb-4">Response Times</h3>
          {responseTimeData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={responseTimeData}>
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Bar dataKey="time" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-sm text-center mt-16">No data yet</p>
          )}
        </div>
      </div>

      {/* Query Logs */}
      <div className="bg-gray-800 rounded-2xl p-5">
        <h3 className="text-white font-semibold mb-4">Recent Queries</h3>
        {logs.length > 0 ? (
          <div className="space-y-3">
            {logs.map((log, i) => (
              <div key={i} className="border border-gray-700 rounded-xl p-3">
                <p className="text-white text-sm font-medium">{log.question}</p>
                <div className="flex gap-3 mt-1">
                  <span className="text-gray-500 text-xs">{log.agents_used}</span>
                  <span className="text-gray-500 text-xs">{log.response_time}s</span>
                  <span className="text-gray-500 text-xs">{log.created_at}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No queries yet. Start chatting!</p>
        )}
      </div>
    </div>
  )
}