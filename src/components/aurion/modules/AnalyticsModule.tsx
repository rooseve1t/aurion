// System Analytics Module
// Full system dashboard: usage, performance, AI efficiency, SaaS metrics, ROI

import type { AurionStore } from '@/store/aurionStore';
import { BarChart2, TrendingUp, Cpu, Clock, DollarSign, Activity } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, CartesianGrid
} from 'recharts';

interface Props { store: AurionStore; }

const weeklyData = [
  { day: 'Mon', commands: 52, autonomy: 8, health: 92 },
  { day: 'Tue', commands: 67, autonomy: 12, health: 88 },
  { day: 'Wed', commands: 45, autonomy: 6, health: 94 },
  { day: 'Thu', commands: 78, autonomy: 15, health: 87 },
  { day: 'Fri', commands: 91, autonomy: 18, health: 90 },
  { day: 'Sat', commands: 34, autonomy: 5, health: 96 },
  { day: 'Sun', commands: 28, autonomy: 4, health: 98 },
];

const moduleUsage = [
  { name: 'Core', value: 28, color: 'oklch(0.72 0.18 200)' },
  { name: 'Voice', value: 22, color: 'oklch(0.78 0.16 80)' },
  { name: 'Security', value: 18, color: 'oklch(0.65 0.22 15)' },
  { name: 'Health', value: 12, color: 'oklch(0.72 0.18 162)' },
  { name: 'Smart Home', value: 10, color: 'oklch(0.55 0.25 290)' },
  { name: 'Other', value: 10, color: 'oklch(0.45 0.04 220)' },
];

const performanceData = Array.from({ length: 30 }, (_, i) => ({
  d: i + 1,
  cpu: 20 + Math.sin(i * 0.3) * 15 + Math.random() * 10,
  memory: 45 + Math.sin(i * 0.2) * 10 + Math.random() * 8,
  latency: 80 + Math.sin(i * 0.4) * 20 + Math.random() * 15,
}));

export default function AnalyticsModule({ store }: Props) {
  const { state } = store;
  const m = state.metrics;

  return (
    <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
          style={{ background: 'oklch(0.55 0.25 290 / 15%)', border: '2px solid oklch(0.55 0.25 290 / 50%)', boxShadow: '0 0 20px oklch(0.55 0.25 290 / 30%)' }}
        >
          <BarChart2 size={18} style={{ color: 'oklch(0.78 0.25 290)' }} />
        </div>
        <div>
          <h2 className="text-lg font-bold tracking-widest" style={{ color: 'oklch(0.78 0.25 290)', fontFamily: 'Space Grotesk, sans-serif' }}>
            SYSTEM ANALYTICS
          </h2>
          <p className="text-xs" style={{ color: 'oklch(0.45 0.04 220)', fontFamily: 'JetBrains Mono, monospace' }}>
            Performance · Usage · AI Efficiency · SaaS Metrics · ROI
          </p>
        </div>
        <div className="ml-auto">
          <span className="text-xs px-2 py-1 rounded" style={{ background: 'oklch(0.55 0.25 290 / 10%)', border: '1px solid oklch(0.55 0.25 290 / 30%)', color: 'oklch(0.78 0.25 290)', fontFamily: 'JetBrains Mono, monospace' }}>
            LIVE DASHBOARD
          </span>
        </div>
      </div>

      <div className="hud-divider" />

      {/* KPI row */}
      <div className="grid grid-cols-5 gap-3">
        {[
          { label: 'UPTIME', value: '99.8%', icon: <Activity size={14} />, color: 'oklch(0.72 0.18 162)', sub: '30 days' },
          { label: 'COMMANDS', value: '395', icon: <Cpu size={14} />, color: 'oklch(0.72 0.18 200)', sub: 'this week' },
          { label: 'AI ACTIONS', value: '68', icon: <TrendingUp size={14} />, color: 'oklch(0.55 0.25 290)', sub: 'autonomous' },
          { label: 'TIME SAVED', value: '14.2h', icon: <Clock size={14} />, color: 'oklch(0.78 0.16 80)', sub: 'this week' },
          { label: 'EFFICIENCY', value: '94%', icon: <DollarSign size={14} />, color: 'oklch(0.72 0.18 162)', sub: 'AI score' },
        ].map(kpi => (
          <div key={kpi.label} className="metric-card text-center">
            <div className="flex justify-center mb-2" style={{ color: kpi.color }}>{kpi.icon}</div>
            <div className="text-xl font-bold mb-0.5" style={{ color: kpi.color, fontFamily: 'JetBrains Mono, monospace' }}>{kpi.value}</div>
            <div className="text-[9px] mb-0.5" style={{ color: 'oklch(0.35 0.04 220)', fontFamily: 'JetBrains Mono, monospace' }}>{kpi.label}</div>
            <div className="text-[9px]" style={{ color: 'oklch(0.25 0.04 220)' }}>{kpi.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Weekly activity */}
        <div className="col-span-2 aurion-panel rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <BarChart2 size={13} style={{ color: 'oklch(0.55 0.25 290)' }} />
            <p className="text-[10px] tracking-widest" style={{ color: 'oklch(0.45 0.04 220)', fontFamily: 'JetBrains Mono, monospace' }}>WEEKLY ACTIVITY</p>
          </div>
          <div style={{ height: 160 }}>
            <ResponsiveContainer>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.15 0.02 240)" />
                <XAxis dataKey="day" tick={{ fill: 'oklch(0.35 0.04 220)', fontSize: 10, fontFamily: 'JetBrains Mono, monospace' }} />
                <YAxis hide />
                <Tooltip
                  contentStyle={{ background: 'oklch(0.09 0.015 240)', border: '1px solid oklch(0.55 0.25 290 / 30%)', borderRadius: '6px', fontSize: '10px', color: 'oklch(0.85 0.18 200)' }}
                />
                <Bar dataKey="commands" fill="oklch(0.72 0.18 200)" radius={[2, 2, 0, 0]} />
                <Bar dataKey="autonomy" fill="oklch(0.55 0.25 290)" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex gap-4 mt-2">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ background: 'oklch(0.72 0.18 200)' }} />
              <span className="text-[10px]" style={{ color: 'oklch(0.45 0.04 220)' }}>Commands</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ background: 'oklch(0.55 0.25 290)' }} />
              <span className="text-[10px]" style={{ color: 'oklch(0.45 0.04 220)' }}>Autonomous Actions</span>
            </div>
          </div>
        </div>

        {/* Module usage pie */}
        <div className="aurion-panel rounded-lg p-4">
          <p className="text-[10px] tracking-widest mb-3" style={{ color: 'oklch(0.45 0.04 220)', fontFamily: 'JetBrains Mono, monospace' }}>MODULE USAGE</p>
          <div style={{ height: 140 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={moduleUsage} dataKey="value" cx="50%" cy="50%" innerRadius={35} outerRadius={60} strokeWidth={0}>
                  {moduleUsage.map((entry, i) => (
                    <Cell key={i} fill={entry.color} opacity={0.85} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: 'oklch(0.09 0.015 240)', border: '1px solid oklch(0.55 0.25 290 / 30%)', borderRadius: '6px', fontSize: '10px', color: 'oklch(0.85 0.18 200)' }}
                  formatter={(v: number, name: string) => [`${v}%`, name]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-col gap-1 mt-1">
            {moduleUsage.slice(0, 4).map(m => (
              <div key={m.name} className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: m.color }} />
                <span className="text-[9px] flex-1" style={{ color: 'oklch(0.45 0.04 220)' }}>{m.name}</span>
                <span className="text-[9px]" style={{ color: m.color, fontFamily: 'JetBrains Mono, monospace' }}>{m.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance chart */}
      <div className="aurion-panel rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <Activity size={13} style={{ color: 'oklch(0.72 0.18 162)' }} />
          <p className="text-[10px] tracking-widest" style={{ color: 'oklch(0.45 0.04 220)', fontFamily: 'JetBrains Mono, monospace' }}>SYSTEM PERFORMANCE — 30 DAYS</p>
        </div>
        <div style={{ height: 120 }}>
          <ResponsiveContainer>
            <LineChart data={performanceData}>
              <XAxis dataKey="d" hide />
              <YAxis domain={[0, 120]} hide />
              <Tooltip
                contentStyle={{ background: 'oklch(0.09 0.015 240)', border: '1px solid oklch(0.72 0.18 162 / 30%)', borderRadius: '6px', fontSize: '10px', color: 'oklch(0.85 0.18 200)' }}
                formatter={(v: number, name: string) => [`${Math.round(v)}${name === 'latency' ? 'ms' : '%'}`, name]}
              />
              <Line type="monotone" dataKey="cpu" stroke="oklch(0.72 0.18 200)" strokeWidth={1.5} dot={false} />
              <Line type="monotone" dataKey="memory" stroke="oklch(0.55 0.25 290)" strokeWidth={1.5} dot={false} />
              <Line type="monotone" dataKey="latency" stroke="oklch(0.78 0.16 80)" strokeWidth={1.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="flex gap-4 mt-2">
          {[
            { label: 'CPU', color: 'oklch(0.72 0.18 200)' },
            { label: 'Memory', color: 'oklch(0.55 0.25 290)' },
            { label: 'Latency (ms)', color: 'oklch(0.78 0.16 80)' },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ background: item.color }} />
              <span className="text-[10px]" style={{ color: 'oklch(0.45 0.04 220)' }}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* SaaS metrics */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'PLAN', value: 'ENTERPRISE', color: 'oklch(0.78 0.16 80)' },
          { label: 'API CALLS', value: '12,847', color: 'oklch(0.72 0.18 200)' },
          { label: 'STORAGE', value: '24.8 GB', color: 'oklch(0.55 0.25 290)' },
          { label: 'INTEGRATIONS', value: '14 active', color: 'oklch(0.72 0.18 162)' },
        ].map(item => (
          <div key={item.label} className="metric-card text-center py-3">
            <div className="text-sm font-bold mb-1" style={{ color: item.color, fontFamily: 'JetBrains Mono, monospace' }}>{item.value}</div>
            <div className="text-[9px]" style={{ color: 'oklch(0.35 0.04 220)', fontFamily: 'JetBrains Mono, monospace' }}>{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
