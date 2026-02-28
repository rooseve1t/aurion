// Health Intelligence Module
// Heart rate, sleep, stress, activity, health index, risk model, recommendations

import type { AurionStore } from '@/store/aurionStore';
import { Heart, Moon, Activity, Zap, TrendingUp, AlertTriangle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

interface Props { store: AurionStore; }

const heartRateData = Array.from({ length: 24 }, (_, i) => ({
  h: `${i}:00`,
  hr: 60 + Math.sin(i * 0.5) * 15 + Math.random() * 8,
}));

const sleepData = [
  { stage: 'Бодрств.', duration: 0.5, color: 'oklch(0.78 0.16 80)' },
  { stage: 'Легкий', duration: 2.5, color: 'oklch(0.55 0.25 290)' },
  { stage: 'Глубокий', duration: 1.8, color: 'oklch(0.72 0.18 200)' },
  { stage: 'БДГ', duration: 1.7, color: 'oklch(0.72 0.18 162)' },
];

export default function HealthModule({ store }: Props) {
  const { state } = store;
  const health = state.healthData;

  return (
    <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
          style={{ background: 'oklch(0.65 0.22 15 / 15%)', border: '2px solid oklch(0.65 0.22 15 / 50%)', boxShadow: '0 0 20px oklch(0.65 0.22 15 / 30%)' }}
        >
          <Heart size={18} style={{ color: 'oklch(0.75 0.22 15)' }} />
        </div>
        <div>
          <h2 className="text-lg font-bold tracking-widest" style={{ color: 'oklch(0.75 0.22 15)', fontFamily: 'Space Grotesk, sans-serif' }}>
            ИНТЕЛЛЕКТ ЗДОРОВЬЯ
          </h2>
          <p className="text-xs" style={{ color: 'oklch(0.45 0.04 220)', fontFamily: 'JetBrains Mono, monospace' }}>
            Биометрия · Сон · Стресс · Активность · Модель рисков
          </p>
        </div>
        <div className="ml-auto">
          <div
            className="text-2xl font-bold px-3 py-1 rounded"
            style={{
              color: health.healthIndex > 75 ? 'oklch(0.72 0.18 162)' : health.healthIndex > 50 ? 'oklch(0.78 0.16 80)' : 'oklch(0.65 0.22 15)',
              background: 'oklch(0.72 0.18 162 / 10%)',
              border: '1px solid oklch(0.72 0.18 162 / 30%)',
              fontFamily: 'JetBrains Mono, monospace',
            }}
          >
            {health.healthIndex}<span className="text-sm opacity-60">/100</span>
          </div>
        </div>
      </div>

      <div className="hud-divider" />

      {/* Key metrics */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'ПУЛЬС', value: health.heartRate, unit: 'УД/МИН', icon: <Heart size={16} />, color: 'oklch(0.65 0.22 15)', status: health.heartRate > 100 ? 'ВЫСОКИЙ' : health.heartRate < 50 ? 'НИЗКИЙ' : 'НОРМА' },
          { label: 'ОЦЕНКА СНА', value: health.sleepScore, unit: '/100', icon: <Moon size={16} />, color: 'oklch(0.55 0.25 290)', status: health.sleepScore > 70 ? 'ХОРОШО' : 'ПЛОХО' },
          { label: 'УРОВЕНЬ СТРЕССА', value: health.stressLevel, unit: '/100', icon: <Zap size={16} />, color: health.stressLevel > 60 ? 'oklch(0.65 0.22 15)' : 'oklch(0.78 0.16 80)', status: health.stressLevel > 60 ? 'ВЫСОКИЙ' : 'НИЗКИЙ' },
          { label: 'АКТИВНОСТЬ', value: health.activityLevel, unit: '%', icon: <Activity size={16} />, color: 'oklch(0.72 0.18 162)', status: health.activityLevel > 50 ? 'АКТИВНО' : 'НИЗКО' },
        ].map(item => (
          <div key={item.label} className="metric-card text-center">
            <div className="flex justify-center mb-2" style={{ color: item.color }}>{item.icon}</div>
            <div className="text-2xl font-bold mb-1" style={{ color: item.color, fontFamily: 'JetBrains Mono, monospace' }}>
              {item.value}<span className="text-xs opacity-60">{item.unit}</span>
            </div>
            <div className="text-[9px] mb-1" style={{ color: 'oklch(0.35 0.04 220)', fontFamily: 'JetBrains Mono, monospace' }}>{item.label}</div>
            <span
              className="text-[9px] px-1.5 py-0.5 rounded"
              style={{
                background: `${item.color}15`,
                border: `1px solid ${item.color}30`,
                color: item.color,
                fontFamily: 'JetBrains Mono, monospace',
              }}
            >
              {item.status}
            </span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Heart rate chart */}
        <div className="aurion-panel rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Heart size={13} style={{ color: 'oklch(0.65 0.22 15)' }} />
            <p className="text-[10px] tracking-widest" style={{ color: 'oklch(0.45 0.04 220)', fontFamily: 'JetBrains Mono, monospace' }}>ПУЛЬС / 24Ч</p>
            <span className="ml-auto text-[11px] font-semibold" style={{ color: 'oklch(0.65 0.22 15)', fontFamily: 'JetBrains Mono, monospace' }}>{health.heartRate} УД/МИН</span>
          </div>
          <div style={{ height: 120 }}>
            <ResponsiveContainer>
              <LineChart data={heartRateData}>
                <XAxis dataKey="h" hide />
                <YAxis domain={[40, 120]} hide />
                <Tooltip
                  contentStyle={{ background: 'oklch(0.09 0.015 240)', border: '1px solid oklch(0.65 0.22 15 / 30%)', borderRadius: '6px', fontSize: '10px', color: 'oklch(0.85 0.18 200)' }}
                  formatter={(v: number) => [`${Math.round(v)} УД/МИН`, 'Пульс']}
                />
                <Line type="monotone" dataKey="hr" stroke="oklch(0.65 0.22 15)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sleep analysis */}
        <div className="aurion-panel rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Moon size={13} style={{ color: 'oklch(0.55 0.25 290)' }} />
            <p className="text-[10px] tracking-widest" style={{ color: 'oklch(0.45 0.04 220)', fontFamily: 'JetBrains Mono, monospace' }}>АНАЛИЗ СНА</p>
            <span className="ml-auto text-[11px]" style={{ color: 'oklch(0.55 0.25 290)', fontFamily: 'JetBrains Mono, monospace' }}>6.5ч всего</span>
          </div>
          {/* Sleep stages bar */}
          <div className="flex h-8 rounded-lg overflow-hidden mb-3">
            {sleepData.map(stage => (
              <div
                key={stage.stage}
                style={{
                  flex: stage.duration,
                  background: stage.color,
                  opacity: 0.8,
                }}
              />
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2">
            {sleepData.map(stage => (
              <div key={stage.stage} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full shrink-0" style={{ background: stage.color }} />
                <span className="text-[10px]" style={{ color: 'oklch(0.55 0.04 220)' }}>{stage.stage}</span>
                <span className="text-[10px] ml-auto" style={{ color: stage.color, fontFamily: 'JetBrains Mono, monospace' }}>{stage.duration}ч</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Health risk model */}
        <div className="aurion-panel rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={13} style={{ color: 'oklch(0.78 0.16 80)' }} />
            <p className="text-[10px] tracking-widest" style={{ color: 'oklch(0.45 0.04 220)', fontFamily: 'JetBrains Mono, monospace' }}>МОДЕЛЬ РИСКОВ</p>
          </div>
          <div className="flex flex-col gap-2">
            {[
              { label: 'Сердечно-сосудистые', risk: 12, color: 'oklch(0.72 0.18 162)' },
              { label: 'Стресс', risk: 28, color: 'oklch(0.78 0.16 80)' },
              { label: 'Дефицит сна', risk: 18, color: 'oklch(0.55 0.25 290)' },
              { label: 'Малоподвижность', risk: 35, color: 'oklch(0.65 0.22 15)' },
            ].map(item => (
              <div key={item.label}>
                <div className="flex justify-between mb-1">
                  <span className="text-[10px]" style={{ color: 'oklch(0.55 0.04 220)' }}>{item.label}</span>
                  <span className="text-[10px]" style={{ color: item.color, fontFamily: 'JetBrains Mono, monospace' }}>{item.risk}%</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'oklch(0.12 0.02 240)' }}>
                  <div className="h-full rounded-full" style={{ width: `${item.risk}%`, background: item.color, boxShadow: `0 0 4px ${item.color}50` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI recommendations */}
        <div className="aurion-panel rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={13} style={{ color: 'oklch(0.72 0.18 162)' }} />
            <p className="text-[10px] tracking-widest" style={{ color: 'oklch(0.45 0.04 220)', fontFamily: 'JetBrains Mono, monospace' }}>ИИ РЕКОМЕНДАЦИИ</p>
          </div>
          <div className="flex flex-col gap-2">
            {[
              { text: 'Сделайте 10-мин прогулку — превышено время сидения', priority: 'high', color: 'oklch(0.65 0.22 15)' },
              { text: 'Напоминание о воде — 2ч с последнего приема', priority: 'medium', color: 'oklch(0.78 0.16 80)' },
              { text: 'График сна: цель 23:00 сегодня', priority: 'medium', color: 'oklch(0.78 0.16 80)' },
              { text: 'Показатели стресса в норме — хороший прогресс', priority: 'low', color: 'oklch(0.72 0.18 162)' },
            ].map((rec, i) => (
              <div
                key={i}
                className="flex items-start gap-2 px-2 py-1.5 rounded"
                style={{ background: `${rec.color}08`, border: `1px solid ${rec.color}20`, borderLeft: `2px solid ${rec.color}` }}
              >
                <div className="w-1.5 h-1.5 rounded-full mt-1 shrink-0" style={{ background: rec.color }} />
                <p className="text-[11px] leading-tight" style={{ color: 'oklch(0.65 0.04 220)' }}>{rec.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
