// Digital Twin Module
// User digital model: productivity, stress, risk tolerance, behavioral patterns

import type { AurionStore } from '@/store/aurionStore';
import { User, TrendingUp, TrendingDown, Activity, Brain, Heart, Zap } from 'lucide-react';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

const TWIN_IMG = 'https://private-us-east-1.manuscdn.com/sessionFile/HZpFjz3KBEkI6o0zTuvHp5/sandbox/I8TqSJZITSdaejtYqMNudI_1771798336238_na1fn_YXVyaW9uLWRpZ2l0YWwtdHdpbg.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvSFpwRmp6M0tCRWtJNm8welR1dkhwNS9zYW5kYm94L0k4VHFTSlpJVFNkYWVqdFlxTU51ZElfMTc3MTc5ODMzNjIzOF9uYTFmbl9ZWFZ5YVc5dUxXUnBaMmwwWVd3dGRIZHBiZy5wbmc~eC1vc3MtcHJvY2Vzcz1pbWFnZS9yZXNpemUsd18xOTIwLGhfMTkyMC9mb3JtYXQsd2VicC9xdWFsaXR5LHFfODAiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3OTg3NjE2MDB9fX1dfQ__&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=r7c7jIKZYS75Dox6~4dLLj5lu~lXp1Hgo20LCfY2X88VUFpFMFbY8FnA2SBqi2tkFFRP5C84ENr70-MIv8ROR6~RBP~hxd7eDBSXHiDfkI--S47v9S8pfExJckG05Uoy75TPM03YoHyqhtdlaejJf6qM7nLgUyA3JQbCl5KagfSG7SVXFv5Ob8Izk3XTJmj7H~Lty8J5En1bBiHp5lv6wtm-YZADvhZzU32coAI2F7JXhkOYn3VvXvHn3IAO-TuG0Qur~FfYFlzmODhp1AxqwPZ5HgnKuXILjJgStFzZ6t8dxyTxHEe8EhR6mEQIP7oiMdry6fK3Gt~6TyDB~R08eg__';

interface Props { store: AurionStore; }

const productivityData = Array.from({ length: 24 }, (_, i) => ({
  h: `${i}:00`,
  p: i < 7 ? 10 : i < 9 ? 40 : i < 12 ? 90 : i < 14 ? 70 : i < 16 ? 60 : i < 18 ? 75 : i < 20 ? 50 : 20,
}));

export default function TwinModule({ store }: Props) {
  const { state } = store;
  const twin = state.digitalTwin;

  const radarData = [
    { subject: 'Продуктивность', A: twin.productivityIndex },
    { subject: 'Стрессоуст.', A: 100 - twin.stressIndex },
    { subject: 'Риск', A: twin.riskTolerance },
    { subject: 'Здоровье', A: twin.healthScore },
    { subject: 'Фокус', A: 72 },
    { subject: 'Социум', A: 65 },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full overflow-hidden shrink-0" style={{ boxShadow: '0 0 20px oklch(0.72 0.18 200 / 50%)' }}>
          <img src={TWIN_IMG} alt="Digital Twin" className="w-full h-full object-cover" />
        </div>
        <div>
          <h2 className="text-lg font-bold tracking-widest" style={{ color: 'oklch(0.85 0.18 200)', fontFamily: 'Space Grotesk, sans-serif' }}>
            ЦИФРОВОЙ ДВОЙНИК
          </h2>
          <p className="text-xs" style={{ color: 'oklch(0.45 0.04 220)', fontFamily: 'JetBrains Mono, monospace' }}>
            Модель пользователя · Паттерны поведения · Принятие решений
          </p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs px-2 py-1 rounded" style={{ background: 'oklch(0.72 0.18 200 / 10%)', border: '1px solid oklch(0.72 0.18 200 / 30%)', color: 'oklch(0.72 0.18 200)', fontFamily: 'JetBrains Mono, monospace' }}>
            СИНХРОНИЗАЦИЯ
          </span>
        </div>
      </div>

      <div className="hud-divider" />

      <div className="grid grid-cols-3 gap-4">
        {/* Twin image + key metrics */}
        <div className="col-span-1 flex flex-col gap-3">
          <div className="aurion-panel rounded-lg overflow-hidden" style={{ height: '200px' }}>
            <img src={TWIN_IMG} alt="Digital Twin" className="w-full h-full object-cover object-top" style={{ opacity: 0.85 }} />
          </div>

          {/* Key attributes */}
          <div className="aurion-panel rounded-lg p-3 flex flex-col gap-2">
            {[
              { label: 'Паттерн', value: twin.behavioralPattern, color: 'oklch(0.72 0.18 200)' },
              { label: 'Решения', value: twin.decisionTendency, color: 'oklch(0.78 0.16 80)' },
              { label: 'Эмоции', value: twin.emotionalBaseline, color: 'oklch(0.72 0.18 162)' },
            ].map(item => (
              <div key={item.label} className="flex justify-between items-center py-1" style={{ borderBottom: '1px solid oklch(0.22 0.04 220 / 20%)' }}>
                <span className="text-[10px]" style={{ color: 'oklch(0.45 0.04 220)', fontFamily: 'JetBrains Mono, monospace' }}>{item.label}</span>
                <span className="text-[10px] font-medium" style={{ color: item.color }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Radar chart */}
        <div className="col-span-1 aurion-panel rounded-lg p-4">
          <p className="text-[10px] tracking-widest mb-2" style={{ color: 'oklch(0.45 0.04 220)', fontFamily: 'JetBrains Mono, monospace' }}>ПРОФИЛЬ ДВОЙНИКА</p>
          <div style={{ height: 200 }}>
            <ResponsiveContainer>
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                <PolarGrid stroke="oklch(0.22 0.04 220 / 40%)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: 'oklch(0.45 0.04 220)', fontSize: 9, fontFamily: 'JetBrains Mono, monospace' }} />
                <Radar name="Twin" dataKey="A" stroke="oklch(0.72 0.18 200)" fill="oklch(0.72 0.18 200)" fillOpacity={0.15} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {[
              { label: 'ПРОДУКТИВНОСТЬ', value: twin.productivityIndex, icon: <TrendingUp size={11} />, color: 'oklch(0.72 0.18 162)' },
              { label: 'ИНДЕКС СТРЕССА', value: twin.stressIndex, icon: <TrendingDown size={11} />, color: twin.stressIndex > 50 ? 'oklch(0.65 0.22 15)' : 'oklch(0.72 0.18 162)' },
              { label: 'ТОЛЕРАНТ. К РИСКУ', value: twin.riskTolerance, icon: <Zap size={11} />, color: 'oklch(0.78 0.16 80)' },
              { label: 'ИНДЕКС ЗДОРОВЬЯ', value: twin.healthScore, icon: <Heart size={11} />, color: 'oklch(0.72 0.18 162)' },
            ].map(item => (
              <div key={item.label} className="metric-card text-center py-2">
                <div className="flex justify-center mb-1" style={{ color: item.color }}>{item.icon}</div>
                <div className="text-lg font-bold" style={{ color: item.color, fontFamily: 'JetBrains Mono, monospace' }}>{item.value}</div>
                <div className="text-[8px]" style={{ color: 'oklch(0.35 0.04 220)', fontFamily: 'JetBrains Mono, monospace' }}>{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Productivity timeline */}
        <div className="col-span-1 flex flex-col gap-3">
          <div className="aurion-panel rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Activity size={13} style={{ color: 'oklch(0.72 0.18 162)' }} />
              <p className="text-[10px] tracking-widest" style={{ color: 'oklch(0.45 0.04 220)', fontFamily: 'JetBrains Mono, monospace' }}>ПРОДУКТИВНОСТЬ / ДЕНЬ</p>
            </div>
            <div style={{ height: 120 }}>
              <ResponsiveContainer>
                <AreaChart data={productivityData}>
                  <defs>
                    <linearGradient id="prodGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="oklch(0.72 0.18 162)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="oklch(0.72 0.18 162)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="h" hide />
                  <YAxis domain={[0, 100]} hide />
                  <Tooltip
                    contentStyle={{ background: 'oklch(0.09 0.015 240)', border: '1px solid oklch(0.72 0.18 162 / 30%)', borderRadius: '6px', fontSize: '10px', color: 'oklch(0.85 0.18 200)' }}
                    formatter={(v: number) => [`${Math.round(v)}%`, 'Продуктивность']}
                  />
                  <Area type="monotone" dataKey="p" stroke="oklch(0.72 0.18 162)" strokeWidth={2} fill="url(#prodGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="aurion-panel rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Brain size={13} style={{ color: 'oklch(0.55 0.25 290)' }} />
              <p className="text-[10px] tracking-widest" style={{ color: 'oklch(0.45 0.04 220)', fontFamily: 'JetBrains Mono, monospace' }}>ВЛИЯНИЕ ДВОЙНИКА</p>
            </div>
            <div className="flex flex-col gap-2 text-xs" style={{ color: 'oklch(0.55 0.04 220)' }}>
              {[
                'Механизм решений обновлен данными о стрессе',
                'Слой автономии скорректировал предложения',
                'Система памяти пометила 3 события',
                'Толерантность к риску пересчитана',
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2">
                  <div className="w-1 h-1 rounded-full mt-1.5 shrink-0" style={{ background: 'oklch(0.55 0.25 290)' }} />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
