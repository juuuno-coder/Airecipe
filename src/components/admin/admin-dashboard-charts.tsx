"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend
} from "recharts";

const COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981"];

export function AdminDashboardCharts({ dailyTrends, categoryStats }: { dailyTrends: any[], categoryStats: any[] }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      
      {/* 1. Daily Growth Chart */}
      <div className="p-6 rounded-3xl bg-slate-900/50 border border-white/5">
        <h3 className="text-lg font-semibold text-white mb-6">최근 30일 레시피 등록 추이</h3>
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dailyTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis 
                    dataKey="date" 
                    stroke="#64748b" 
                    fontSize={12} 
                    tickFormatter={(value) => value.slice(5)} // Show MM-DD
                />
                <YAxis stroke="#64748b" fontSize={12} allowDecimals={false}/>
                <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f1f5f9' }}
                    itemStyle={{ color: '#818cf8' }}
                />
                <Line 
                    type="monotone" 
                    dataKey="count" 
                    stroke="#6366f1" 
                    strokeWidth={3} 
                    dot={{ fill: '#6366f1', strokeWidth: 2 }}
                    activeDot={{ r: 6, fill: '#fff' }}
                />
            </LineChart>
            </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Category Distribution */}
      <div className="p-6 rounded-3xl bg-slate-900/50 border border-white/5">
        <h3 className="text-lg font-semibold text-white mb-6">카테고리별 분포</h3>
        <div className="h-[300px] w-full flex justify-center">
            <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Pie
                    data={categoryStats}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="count"
                    nameKey="category"
                    stroke="none"
                >
                    {categoryStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip 
                     contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f1f5f9' }}
                />
                <Legend />
            </PieChart>
            </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
