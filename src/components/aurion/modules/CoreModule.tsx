// AURION CORE Module
// AI Orchestrator, Decision Engine, Confidence Scoring, Risk Engine, Adaptive Learning

import { useState, useEffect } from 'react';
import type { AurionStore } from '@/store/aurionStore';
import { Brain, Zap, Shield, Activity, TrendingUp, AlertTriangle, RefreshCw, Target } from 'lucide-react';
import { RadialBarChart, RadialBar, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import CoreOrb from '@/components/CoreOrb';
import DataRings from '@/components/DataRings';

interface Props { store: AurionStore; }

function generateHistory(base: number, count = 20) {
  return Array.from({ length: count }, (_, i) => ({
    t: i,
    v: Math.max(5, Math.min(100, base + (Math.random() - 0.5) * 20)),
  }));
}

export default function CoreModule({ store }: Props) {
  const { state, updateMetrics } = store;
  const m = state.metrics;

  const [aiHistory, setAiHistory] = useState(() => generateHistory(m.aiLoad));
  
  // Filter AI decisions from event log
  const decisionLog = state.eventLog
    .filter(e => e.type === 'ai' || e.module === 'CORE' || e.module === 'AUTONOMY')
    .slice(0, 8);

  useEffect(() => {
    const t = setInterval(() => {
      setAiHistory(prev => [
        ...prev.slice(1),
        { t: prev[prev.length - 1].t + 1, v: Math.max(5, Math.min(100, m.aiLoad + (Math.random() - 0.5) * 15)) },
      ]);
    }, 2000);
    return () => clearInterval(t);
  }, [m.aiLoad]);

  const radialData = [
    { name: 'Нагрузка', value: m.aiLoad, fill: 'oklch(0.72 0.18 200)' },
    { name: 'Уверенность', value: m.confidenceScore, fill: 'oklch(0.78 0.16 80)' },
    { name: 'Целостность', value: m.systemIntegrity, fill: 'oklch(0.72 0.18 162)' },
  ];

  // Determine Orb State
  let orbState: 'idle' | 'listening' | 'thinking' | 'speaking' | 'error' = 'idle';
  if (state.systemMode === 'EMERGENCY') orbState = 'error';
  else if (m.aiLoad > 80) orbState = 'thinking';
  else if (state.voice.isListening) orbState = 'listening';
  else if (state.voice.isSpeaking) orbState = 'speaking';

  return (
    <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
      {/* Module header */}
      <div className="flex items-center gap-3">
        <div className="relative w-16 h-16 flex items-center justify-center">
           <div className="absolute inset-0 scale-50">
             <DataRings active={true} speed={0.5} color={orbState === 'error' ? '#ff0055' : '#00f0ff'} />
           </div>
           <div className="scale-25">
             <CoreOrb state={orbState} audioLevel={Math.random()} />
           </div>
        </div>
        <div>
          <h2
            className="text-lg font-bold tracking-widest"
            style={{ color: 'oklch(0.85 0.18 200)', fontFamily: 'Space Grotesk, sans-serif', textShadow: '0 0 15px oklch(0.72 0.18 200 / 40%)' }}
          >
            ЯДРО AURION
          </h2>
          <p className="text-xs" style={{ color: 'oklch(0.45 0.04 220)', fontFamily: 'JetBrains Mono, monospace' }}>
            Оркестратор · Движок Решений · Анализ Рисков
          </p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <div className={`status-dot ${state.systemMode === 'EMERGENCY' ? 'danger' : 'online'}`} />
          <span className="text-xs" style={{ color: state.systemMode === 'EMERGENCY' ? 'oklch(0.65 0.22 15)' : 'oklch(0.72 0.18 162)', fontFamily: 'JetBrains Mono, monospace' }}>
            {state.systemMode === 'EMERGENCY' ? 'КРИТИЧЕСКИЙ СБОЙ' : 'ОНЛАЙН'}
          </span>
        </div>
      </div>

      <div className="hud-divider" />

      {/* Main grid */}
      <div className="grid grid-cols-3 gap-4">
        {/* Radial metrics */}
        <div className="col-span-1 aurion-panel rounded-lg p-4 flex flex-col items-center">
          <p className="text-[10px] tracking-widest mb-2" style={{ color: 'oklch(0.45 0.04 220)', fontFamily: 'JetBrains Mono, monospace' }}>ПОКАЗАТЕЛИ ЯДРА</p>
          <div style={{ width: '100%', height: 160 }}>
            <ResponsiveContainer>
              <RadialBarChart cx="50%" cy="50%" innerRadius="30%" outerRadius="90%" data={radialData} startAngle={90} endAngle={-270}>
                <RadialBar dataKey="value" cornerRadius={4} background={{ fill: 'oklch(0.12 0.02 240)' }} />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-col gap-1 w-full mt-1">
            {[
              { label: 'НАГРУЗКА', value: m.aiLoad, color: 'oklch(0.72 0.18 200)' },
              { label: 'УВЕРЕННОСТЬ', value: m.confidenceScore, color: 'oklch(0.78 0.16 80)' },
              { label: 'ЦЕЛОСТНОСТЬ', value: m.systemIntegrity, color: 'oklch(0.72 0.18 162)' },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full shrink-0" style={{ background: item.color }} />
                <span className="text-[10px]" style={{ color: 'oklch(0.45 0.04 220)', fontFamily: 'JetBrains Mono, monospace' }}>{item.label}</span>
                <span className="text-[11px] font-semibold ml-auto" style={{ color: item.color, fontFamily: 'JetBrains Mono, monospace' }}>{Math.round(item.value)}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Load chart */}
        <div className="col-span-2 aurion-panel rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Activity size={13} style={{ color: 'oklch(0.72 0.18 200)' }} />
            <p className="text-[10px] tracking-widest" style={{ color: 'oklch(0.45 0.04 220)', fontFamily: 'JetBrains Mono, monospace' }}>НАГРУЗКА ИИ — РЕАЛТАЙМ</p>
            <span className="ml-auto text-[11px] font-semibold" style={{ color: 'oklch(0.72 0.18 200)', fontFamily: 'JetBrains Mono, monospace' }}>{Math.round(m.aiLoad)}%</span>
          </div>
          <div style={{ height: 120 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={aiHistory}>
                <defs>
                  <linearGradient id="aiGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="oklch(0.72 0.18 200)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="oklch(0.72 0.18 200)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="t" hide />
                <YAxis domain={[0, 100]} hide />
                <Tooltip
                  contentStyle={{ background: 'oklch(0.09 0.015 240)', border: '1px solid oklch(0.72 0.18 200 / 30%)', borderRadius: '6px', fontSize: '11px', color: 'oklch(0.85 0.18 200)' }}
                  formatter={(v: number) => [`${Math.round(v)}%`, 'Нагрузка']}
                />
                <Area type="monotone" dataKey="v" stroke="oklch(0.72 0.18 200)" strokeWidth={2} fill="url(#aiGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Sub-metrics */}
          <div className="grid grid-cols-3 gap-2 mt-3">
            {[
              { icon: <Shield size={12} />, label: 'РИСК', value: Math.round(m.riskScore), unit: '/100', color: m.riskScore > 50 ? 'oklch(0.65 0.22 15)' : 'oklch(0.72 0.18 162)' },
              { icon: <Brain size={12} />, label: 'АВТОНОМИЯ', value: Math.round(m.autonomyLevel), unit: '%', color: 'oklch(0.55 0.25 290)' },
              { icon: <TrendingUp size={12} />, label: 'ПАМЯТЬ', value: Math.round(m.memoryUsage), unit: '%', color: 'oklch(0.78 0.16 80)' },
            ].map(item => (
              <div key={item.label} className="metric-card text-center">
                <div className="flex justify-center mb-1" style={{ color: item.color }}>{item.icon}</div>
                <div className="text-[10px] mb-1" style={{ color: 'oklch(0.35 0.04 220)', fontFamily: 'JetBrains Mono, monospace' }}>{item.label}</div>
                <div className="text-lg font-bold" style={{ color: item.color, fontFamily: 'JetBrains Mono, monospace' }}>
                  {item.value}<span className="text-xs opacity-60">{item.unit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Decision Engine Log */}
      <div className="aurion-panel rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <Target size={13} style={{ color: 'oklch(0.78 0.16 80)' }} />
          <p className="text-[10px] tracking-widest" style={{ color: 'oklch(0.45 0.04 220)', fontFamily: 'JetBrains Mono, monospace' }}>ЛОГ ДВИЖКА РЕШЕНИЙ</p>
          <button
            onClick={() => updateMetrics({ confidenceScore: Math.min(100, m.confidenceScore + 2) })}
            className="ml-auto flex items-center gap-1 px-2 py-1 rounded text-[10px] transition-all btn-glow-cyan"
          >
            <RefreshCw size={10} /> ПЕРЕСЧИТАТЬ
          </button>
        </div>
        <div className="flex flex-col gap-1.5">
          {decisionLog.map(d => (
            <div
              key={d.id}
              className="flex items-center gap-3 px-3 py-2 rounded"
              style={{ background: 'oklch(0.07 0.01 240 / 60%)', border: '1px solid oklch(0.22 0.04 220 / 30%)' }}
            >
              <span className="text-[10px] shrink-0" style={{ color: 'oklch(0.35 0.04 220)', fontFamily: 'JetBrains Mono, monospace' }}>{d.timestamp}</span>
              <span className="text-xs flex-1 truncate" style={{ color: 'oklch(0.65 0.04 220)' }}>{d.message}</span>
              <div className="flex items-center gap-1">
                <div
                  className="h-1 rounded-full"
                  style={{
                    width: `30px`,
                    background: 'oklch(0.78 0.16 80)',
                  }}
                />
                <span className="text-[10px]" style={{ color: 'oklch(0.55 0.04 220)', fontFamily: 'JetBrains Mono, monospace' }}>{Math.floor(Math.random() * 20 + 80)}%</span>
              </div>
              <span
                className="text-[10px] px-1.5 py-0.5 rounded shrink-0"
                style={{
                  background: 'oklch(0.72 0.18 162 / 15%)',
                  color: 'oklch(0.72 0.18 162)',
                  fontFamily: 'JetBrains Mono, monospace',
                  border: '1px solid oklch(0.72 0.18 162 / 30%)',
                }}
              >
                {d.module}
              </span>
            </div>
          ))}
          {decisionLog.length === 0 && (
            <div className="text-center py-4 text-xs opacity-50 font-mono">Нет активных решений</div>
          )}
        </div>
      </div>

      {/* Behavior modeling */}
      <div className="grid grid-cols-2 gap-4">
        <div className="aurion-panel rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Zap size={13} style={{ color: 'oklch(0.55 0.25 290)' }} />
            <p className="text-[10px] tracking-widest" style={{ color: 'oklch(0.45 0.04 220)', fontFamily: 'JetBrains Mono, monospace' }}>АДАПТИВНОЕ ОБУЧЕНИЕ</p>
          </div>
          <div className="flex flex-col gap-2">
            {[
              { label: 'Распознавание паттернов', value: 87 },
              { label: 'Поведенческое моделирование', value: 74 },
              { label: 'Осознание контекста', value: 91 },
              { label: 'Точность прогнозов', value: 82 },
            ].map(item => (
              <div key={item.label}>
                <div className="flex justify-between mb-1">
                  <span className="text-[10px]" style={{ color: 'oklch(0.55 0.04 220)' }}>{item.label}</span>
                  <span className="text-[10px]" style={{ color: 'oklch(0.55 0.25 290)', fontFamily: 'JetBrains Mono, monospace' }}>{item.value}%</span>
                </div>
                <div className="h-1 rounded-full overflow-hidden" style={{ background: 'oklch(0.12 0.02 240)' }}>
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${item.value}%`, background: 'oklch(0.55 0.25 290)', boxShadow: '0 0 6px oklch(0.55 0.25 290 / 50%)' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="aurion-panel rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={13} style={{ color: 'oklch(0.65 0.22 15)' }} />
            <p className="text-[10px] tracking-widest" style={{ color: 'oklch(0.45 0.04 220)', fontFamily: 'JetBrains Mono, monospace' }}>ДВИЖОК РИСКОВ</p>
          </div>
          <div className="flex flex-col gap-2">
            {[
              { label: 'Физическая безопасность', risk: 8, color: 'oklch(0.72 0.18 162)' },
              { label: 'Цифровые угрозы', risk: 15, color: 'oklch(0.72 0.18 162)' },
              { label: 'Риски здоровья', risk: 22, color: 'oklch(0.78 0.16 80)' },
              { label: 'Окружающая среда', risk: 5, color: 'oklch(0.72 0.18 162)' },
            ].map(item => (
              <div key={item.label}>
                <div className="flex justify-between mb-1">
                  <span className="text-[10px]" style={{ color: 'oklch(0.55 0.04 220)' }}>{item.label}</span>
                  <span className="text-[10px]" style={{ color: item.color, fontFamily: 'JetBrains Mono, monospace' }}>{item.risk}/100</span>
                </div>
                <div className="h-1 rounded-full overflow-hidden" style={{ background: 'oklch(0.12 0.02 240)' }}>
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${item.risk}%`, background: item.color, boxShadow: `0 0 6px ${item.color}50` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
