// AURION OS — Топ-бар
// Строка статуса системы с переключением режимов, время, уровень угроз и глобальные элементы управления

import { useState, useEffect } from 'react';
import type { AurionStore } from '@/store/aurionStore';
import { Shield, Zap, Moon, Focus, AlertTriangle, Activity, Cpu, Brain } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';
import { toast } from 'sonner';

const CORE_IMG = 'https://private-us-east-1.manuscdn.com/sessionFile/HZpFjz3KBEkI6o0zTuvHp5/sandbox/I8TqSJZITSdaejtYqMNudI-img-1_1771798325000_na1fn_YXVyaW9uLWNvcmUtb3Ji.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvSFpwRmp6M0tCRWtJNm8welR1dkhwNS9zYW5kYm94L0k4VHFTSlpJVFNkYWVqdFlxTU51ZEktaW1nLTFfMTc3MTc5ODMyNTAwMF9uYTFmbl9ZWFZ5YVc5dUxXTnZjbVV0YjNKaS5wbmc~eC1vc3MtcHJvY2Vzcz1pbWFnZS9yZXNpemUsd18xOTIwLGhfMTkyMC9mb3JtYXQsd2VicC9xdWFsaXR5LHFfODAiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3OTg3NjE2MDB9fX1dfQ__&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=M0vWQeSFzX9o0VL-etakkvbjaQ136a4AZ~C-WJ8oI5MzhyetKQq2~WJtKMsRhfCJhq0G2Zv7tvz2CBjVBbID~iW2rxN~3T2WtPlzOMy-Zk1GboumjSDt~gF7kjsUoXCY~qGMoCmh02y-Vf09gYxEIs9opoVf4O-IxN0K-YnQ03e~uQ~toRdJXi6FaZ6xY3R91VOZN1IM2GhGo0Ns4B3MKnFsOZkdF8nOJynhiOejq9YCQYO7R-aDjmAODb6LH4R56ZFpFnUdYs1kUryTxFRYNqFsgisbjKGRcewCxSYpK9QUa3dMxOlteR1AZ8IFt1VVWKj5RHp4dFO6kYKwCJq7eQ__';

interface Props { store: AurionStore; }

const MODES = [
  { id: 'NORMAL', label: 'ОБЫЧНЫЙ', icon: Activity, color: 'oklch(0.72 0.18 200)' },
  { id: 'GUARDIAN', label: 'ЗАЩИТА', icon: Shield, color: 'oklch(0.72 0.18 162)' },
  { id: 'FOCUS', label: 'ФОКУС', icon: Focus, color: 'oklch(0.78 0.16 80)' },
  { id: 'SLEEP', label: 'СОН', icon: Moon, color: 'oklch(0.55 0.25 290)' },
] as const;

const THREAT_COLORS: Record<string, string> = {
  NONE: 'oklch(0.72 0.18 162)',
  LOW: 'oklch(0.78 0.16 80)',
  MEDIUM: 'oklch(0.72 0.18 60)',
  HIGH: 'oklch(0.65 0.22 15)',
  CRITICAL: 'oklch(0.65 0.22 15)',
};

export default function TopBar({ store }: Props) {
  const { state, setSystemMode } = store;
  const i18n = useI18n();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const threatColor = THREAT_COLORS[state.threatLevel] || THREAT_COLORS.NONE;
  const threatLabel = i18n[`threat_${state.threatLevel.toLowerCase()}` as keyof typeof i18n] || state.threatLevel;

  return (
    <div
      className="flex items-center px-4 h-12 shrink-0 gap-4"
      style={{
        background: 'oklch(0.07 0.012 240 / 95%)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid oklch(0.72 0.18 200 / 15%)',
        boxShadow: '0 1px 20px oklch(0.72 0.18 200 / 5%)',
      }}
    >
      {/* Логотип */}
      <div className="flex items-center gap-2 shrink-0">
        <div className="w-7 h-7 rounded-full overflow-hidden" style={{ boxShadow: '0 0 10px oklch(0.72 0.18 200 / 50%)' }}>
          <img src={CORE_IMG} alt="AURION" className="w-full h-full object-cover" />
        </div>
        <span
          className="text-sm font-bold tracking-[0.15em]"
          style={{ color: 'oklch(0.85 0.18 200)', textShadow: '0 0 10px oklch(0.72 0.18 200 / 50%)', fontFamily: 'Space Grotesk, sans-serif' }}
        >
          {i18n.app_title}
        </span>
        <span
          className="text-[10px] tracking-widest px-1.5 py-0.5 rounded"
          style={{
            color: 'oklch(0.55 0.04 220)',
            background: 'oklch(0.12 0.02 240)',
            border: '1px solid oklch(0.22 0.04 220 / 40%)',
            fontFamily: 'JetBrains Mono, monospace',
          }}
        >
          {i18n.app_version}
        </span>
      </div>

      {/* Разделитель */}
      <div className="w-px h-6 shrink-0" style={{ background: 'oklch(0.72 0.18 200 / 20%)' }} />

      {/* Переключатель режимов */}
      <div className="flex items-center gap-1">
        {MODES.map(mode => {
          const Icon = mode.icon;
          const isActive = state.systemMode === mode.id;
          return (
            <button
              key={mode.id}
              onClick={() => {
                setSystemMode(mode.id as any);
                toast.success(`${i18n.mode_normal === mode.label ? i18n.mode_normal : mode.label}`, { duration: 2000 });
              }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-all duration-200"
              style={{
                background: isActive ? `${mode.color}18` : 'transparent',
                border: `1px solid ${isActive ? `${mode.color}50` : 'transparent'}`,
                color: isActive ? mode.color : 'oklch(0.45 0.04 220)',
                boxShadow: isActive ? `0 0 10px ${mode.color}20` : 'none',
                fontFamily: 'JetBrains Mono, monospace',
                letterSpacing: '0.05em',
              }}
            >
              <Icon size={11} />
              {mode.label}
            </button>
          );
        })}
      </div>

      {/* Пространство */}
      <div className="flex-1" />

      {/* Полоса живых метрик */}
      <div className="flex items-center gap-4">
        <MetricChip icon={<Cpu size={11} />} label={i18n.ai_load} value={`${Math.round(state.metrics.aiLoad)}%`} color="oklch(0.72 0.18 200)" />
        <MetricChip icon={<Brain size={11} />} label={i18n.system_integrity} value={`${Math.round(state.metrics.systemIntegrity)}%`} color="oklch(0.72 0.18 162)" />
        <MetricChip icon={<AlertTriangle size={11} />} label={i18n.risk_score} value={`${Math.round(state.metrics.riskScore)}`} color={threatColor} />
        <MetricChip icon={<Zap size={11} />} label={i18n.confidence} value={`${Math.round(state.metrics.confidenceScore)}%`} color="oklch(0.78 0.16 80)" />
      </div>

      {/* Разделитель */}
      <div className="w-px h-6 shrink-0" style={{ background: 'oklch(0.72 0.18 200 / 20%)' }} />

      {/* Уровень угроз */}
      <div className="flex items-center gap-1.5 shrink-0">
        <div
          className="w-2 h-2 rounded-full"
          style={{
            background: threatColor,
            boxShadow: `0 0 6px ${threatColor}`,
            animation: state.threatLevel !== 'NONE' ? 'threat-pulse 1.5s ease-in-out infinite' : 'none',
          }}
        />
        <span
          className="text-[10px] font-semibold tracking-widest"
          style={{ color: threatColor, fontFamily: 'JetBrains Mono, monospace' }}
        >
          {i18n.threat_level}: {threatLabel}
        </span>
      </div>

      {/* Разделитель */}
      <div className="w-px h-6 shrink-0" style={{ background: 'oklch(0.72 0.18 200 / 20%)' }} />

      {/* Часы */}
      <div className="shrink-0 text-right">
        <div
          className="text-sm font-semibold"
          style={{ color: 'oklch(0.85 0.18 200)', fontFamily: 'JetBrains Mono, monospace', textShadow: '0 0 8px oklch(0.72 0.18 200 / 40%)' }}
        >
          {time.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
        </div>
        <div
          className="text-[10px]"
          style={{ color: 'oklch(0.45 0.04 220)', fontFamily: 'JetBrains Mono, monospace' }}
        >
          {time.toLocaleDateString('ru-RU', { weekday: 'short', month: 'short', day: 'numeric' })}
        </div>
      </div>
    </div>
  );
}

function MetricChip({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span style={{ color: `${color}` }}>{icon}</span>
      <span className="text-[10px]" style={{ color: 'oklch(0.45 0.04 220)', fontFamily: 'JetBrains Mono, monospace' }}>{label}</span>
      <span className="text-[11px] font-semibold" style={{ color, fontFamily: 'JetBrains Mono, monospace' }}>{value}</span>
    </div>
  );
}
