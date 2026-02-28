// Autonomy Layer Module
// Autonomy level, self-initiated actions, proactive suggestions, non-touch interaction

import type { AurionStore } from '@/store/aurionStore';
import { Zap, Brain, Eye, Cpu, TrendingUp, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

interface Props { store: AurionStore; }

export default function AutonomyModule({ store }: Props) {
  const { state, acceptSuggestion, setAutonomyLevel } = store;
  const { autonomySuggestions } = state;
  const autonomyLevel = state.autonomyLevel;

  const levels = [
    { id: 'passive', label: 'УРОВЕНЬ 0', desc: 'Только ответы на прямые запросы', value: 0 },
    { id: 'advisory', label: 'УРОВЕНЬ 1', desc: 'Предложения и рекомендации', value: 1 },
    { id: 'semi', label: 'УРОВЕНЬ 2', desc: 'Действия после уведомления', value: 2 },
    { id: 'full', label: 'УРОВЕНЬ 3', desc: 'Самостоятельные действия', value: 3 },
    { id: 'sovereign', label: 'УРОВЕНЬ 4', desc: 'Критические автономные протоколы', value: 4 },
  ];

  const currentLevel = levels.find(l => l.value === autonomyLevel) || levels[0];

  const nonTouchFeatures = [
    { label: 'Отслеживание взгляда', active: true, icon: <Eye size={14} /> },
    { label: 'Управление жестами', active: false, icon: <Zap size={14} /> },
    { label: 'Нейроинтерфейс', active: false, icon: <Brain size={14} /> },
    { label: 'Датчики приближения', active: true, icon: <Cpu size={14} /> },
  ];

  const selfInitiated = [
    { action: 'Термостат на 21°C (обнаружен стресс)', time: '14:30', outcome: 'успех' },
    { action: 'Уведомления отключены (режим фокуса)', time: '13:15', outcome: 'успех' },
    { action: 'Эскалация мед. напоминания', time: '12:00', outcome: 'успех' },
    { action: 'Входная дверь заблокирована', time: '09:05', outcome: 'успех' },
    { action: 'Предложение перенести встречу', time: '08:45', outcome: 'ожидание' },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
          style={{
            background: 'oklch(0.55 0.25 290 / 15%)',
            border: '2px solid oklch(0.55 0.25 290 / 50%)',
            boxShadow: '0 0 20px oklch(0.55 0.25 290 / 30%)',
          }}
        >
          <Zap size={18} style={{ color: 'oklch(0.78 0.25 290)' }} />
        </div>
        <div>
          <h2 className="text-lg font-bold tracking-widest" style={{ color: 'oklch(0.78 0.25 290)', fontFamily: 'Space Grotesk, sans-serif' }}>
            АВТОНОМНЫЙ СЛОЙ
          </h2>
          <p className="text-xs" style={{ color: 'oklch(0.45 0.04 220)', fontFamily: 'JetBrains Mono, monospace' }}>
            Самоинициация · Бесконтактный интерфейс · Проактивный интеллект
          </p>
        </div>
        <div className="ml-auto">
          <span
            className="text-xs px-2 py-1 rounded font-semibold"
            style={{
              background: 'oklch(0.55 0.25 290 / 15%)',
              border: '1px solid oklch(0.55 0.25 290 / 40%)',
              color: 'oklch(0.78 0.25 290)',
              fontFamily: 'JetBrains Mono, monospace',
            }}
          >
            {currentLevel.label}
          </span>
        </div>
      </div>

      <div className="hud-divider" />

      <div className="grid grid-cols-3 gap-4">
        {/* Autonomy level slider */}
        <div className="col-span-1 flex flex-col gap-3">
          <div className="aurion-panel rounded-lg p-4">
            <p className="text-[10px] tracking-widest mb-4" style={{ color: 'oklch(0.45 0.04 220)', fontFamily: 'JetBrains Mono, monospace' }}>УРОВЕНЬ АВТОНОМНОСТИ</p>
            <div className="flex flex-col gap-2">
              {levels.map(level => {
                const isActive = currentLevel.id === level.id;
                return (
                  <button
                    key={level.id}
                    onClick={() => {
                      setAutonomyLevel(level.value);
                      toast.success(`Уровень автономности: ${level.label}`, { duration: 2000 });
                    }}
                    className="flex items-center gap-3 px-3 py-2 rounded transition-all text-left"
                    style={{
                      background: isActive ? 'oklch(0.55 0.25 290 / 15%)' : 'oklch(0.07 0.01 240 / 60%)',
                      border: `1px solid ${isActive ? 'oklch(0.55 0.25 290 / 50%)' : 'oklch(0.22 0.04 220 / 20%)'}`,
                    }}
                  >
                    <div
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{
                        background: isActive ? 'oklch(0.78 0.25 290)' : 'oklch(0.25 0.04 220)',
                        boxShadow: isActive ? '0 0 6px oklch(0.55 0.25 290)' : 'none',
                      }}
                    />
                    <div>
                      <p className="text-[11px] font-semibold" style={{ color: isActive ? 'oklch(0.78 0.25 290)' : 'oklch(0.55 0.04 220)', fontFamily: 'JetBrains Mono, monospace' }}>{level.label}</p>
                      <p className="text-[9px]" style={{ color: 'oklch(0.35 0.04 220)' }}>{level.desc}</p>
                    </div>
                    {isActive && (
                      <span className="ml-auto text-[9px]" style={{ color: 'oklch(0.78 0.25 290)', fontFamily: 'JetBrains Mono, monospace' }}>АКТИВНО</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Non-touch interface */}
          <div className="aurion-panel rounded-lg p-4">
            <p className="text-[10px] tracking-widest mb-3" style={{ color: 'oklch(0.45 0.04 220)', fontFamily: 'JetBrains Mono, monospace' }}>БЕСКОНТАКТНЫЙ ИНТЕРФЕЙС</p>
            <div className="flex flex-col gap-2">
              {nonTouchFeatures.map(f => (
                <div key={f.label} className="flex items-center gap-2 py-1.5" style={{ borderBottom: '1px solid oklch(0.22 0.04 220 / 15%)' }}>
                  <span style={{ color: f.active ? 'oklch(0.72 0.18 162)' : 'oklch(0.35 0.04 220)' }}>{f.icon}</span>
                  <span className="text-[11px] flex-1" style={{ color: f.active ? 'oklch(0.65 0.04 220)' : 'oklch(0.35 0.04 220)' }}>{f.label}</span>
                  <span
                    className="text-[9px] px-1.5 py-0.5 rounded"
                    style={{
                      background: f.active ? 'oklch(0.72 0.18 162 / 15%)' : 'oklch(0.12 0.02 240)',
                      color: f.active ? 'oklch(0.72 0.18 162)' : 'oklch(0.35 0.04 220)',
                      fontFamily: 'JetBrains Mono, monospace',
                    }}
                  >
                    {f.active ? 'ВКЛ' : 'ВЫКЛ'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Self-initiated actions + suggestions */}
        <div className="col-span-2 flex flex-col gap-4">
          {/* Pending suggestions */}
          {autonomySuggestions.filter(s => s.accepted === null).length > 0 && (
            <div className="aurion-panel rounded-lg p-4" style={{ borderColor: 'oklch(0.55 0.25 290 / 40%)' }}>
              <div className="flex items-center gap-2 mb-3">
                <Brain size={13} style={{ color: 'oklch(0.55 0.25 290)' }} />
                <p className="text-[10px] tracking-widest" style={{ color: 'oklch(0.45 0.04 220)', fontFamily: 'JetBrains Mono, monospace' }}>ОЖИДАЮЩИЕ ПРЕДЛОЖЕНИЯ</p>
              </div>
              <div className="flex flex-col gap-2">
                {autonomySuggestions.filter(s => s.accepted === null).map(s => (
                  <div
                    key={s.id}
                    className="flex items-center gap-3 px-3 py-2.5 rounded"
                    style={{
                      background: 'oklch(0.55 0.25 290 / 8%)',
                      border: '1px solid oklch(0.55 0.25 290 / 25%)',
                    }}
                  >
                    <Zap size={12} style={{ color: 'oklch(0.78 0.25 290)', flexShrink: 0 }} />
                    <span className="text-xs flex-1" style={{ color: 'oklch(0.72 0.04 200)' }}>{s.text}</span>
                    <span
                      className="text-[9px] px-1.5 py-0.5 rounded shrink-0"
                      style={{
                        background: s.priority === 'high' ? 'oklch(0.65 0.22 15 / 15%)' : 'oklch(0.78 0.16 80 / 15%)',
                        color: s.priority === 'high' ? 'oklch(0.65 0.22 15)' : 'oklch(0.78 0.16 80)',
                        fontFamily: 'JetBrains Mono, monospace',
                      }}
                    >
                      {s.priority.toUpperCase()}
                    </span>
                    <button
                      onClick={() => { acceptSuggestion(s.id, true); toast.success('Предложение принято', { duration: 1500 }); }}
                      className="w-7 h-7 rounded flex items-center justify-center transition-all"
                      style={{ background: 'oklch(0.72 0.18 162 / 10%)', border: '1px solid oklch(0.72 0.18 162 / 30%)', color: 'oklch(0.72 0.18 162)' }}
                    >
                      <CheckCircle size={13} />
                    </button>
                    <button
                      onClick={() => { acceptSuggestion(s.id, false); toast.info('Предложение отклонено', { duration: 1500 }); }}
                      className="w-7 h-7 rounded flex items-center justify-center transition-all"
                      style={{ background: 'oklch(0.65 0.22 15 / 10%)', border: '1px solid oklch(0.65 0.22 15 / 30%)', color: 'oklch(0.65 0.22 15)' }}
                    >
                      <XCircle size={13} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Self-initiated log */}
          <div className="aurion-panel rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp size={13} style={{ color: 'oklch(0.72 0.18 162)' }} />
              <p className="text-[10px] tracking-widest" style={{ color: 'oklch(0.45 0.04 220)', fontFamily: 'JetBrains Mono, monospace' }}>САМОИНИЦИИРОВАННЫЕ ДЕЙСТВИЯ</p>
              <span className="ml-auto text-[10px]" style={{ color: 'oklch(0.72 0.18 162)', fontFamily: 'JetBrains Mono, monospace' }}>СЕГОДНЯ: {selfInitiated.length}</span>
            </div>
            <div className="flex flex-col gap-2">
              {selfInitiated.map((action, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 px-3 py-2 rounded"
                  style={{
                    background: 'oklch(0.07 0.01 240 / 60%)',
                    border: `1px solid ${action.outcome === 'успех' ? 'oklch(0.72 0.18 162 / 20%)' : 'oklch(0.78 0.16 80 / 20%)'}`,
                  }}
                >
                  <div
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ background: action.outcome === 'успех' ? 'oklch(0.72 0.18 162)' : 'oklch(0.78 0.16 80)' }}
                  />
                  <span className="text-xs flex-1" style={{ color: 'oklch(0.65 0.04 220)' }}>{action.action}</span>
                  <span className="text-[10px] shrink-0" style={{ color: 'oklch(0.35 0.04 220)', fontFamily: 'JetBrains Mono, monospace' }}>{action.time}</span>
                  <span
                    className="text-[9px] px-1.5 py-0.5 rounded shrink-0"
                    style={{
                      background: action.outcome === 'успех' ? 'oklch(0.72 0.18 162 / 10%)' : 'oklch(0.78 0.16 80 / 10%)',
                      color: action.outcome === 'успех' ? 'oklch(0.72 0.18 162)' : 'oklch(0.78 0.16 80)',
                      fontFamily: 'JetBrains Mono, monospace',
                    }}
                  >
                    {action.outcome.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'ДЕЙСТВИЙ СЕГОДНЯ', value: '12', color: 'oklch(0.55 0.25 290)' },
              { label: 'УСПЕШНОСТЬ', value: '94%', color: 'oklch(0.72 0.18 162)' },
              { label: 'СЭКОНОМЛЕНО ВРЕМЕНИ', value: '2.4ч', color: 'oklch(0.78 0.16 80)' },
            ].map(item => (
              <div key={item.label} className="metric-card text-center">
                <div className="text-2xl font-bold mb-1" style={{ color: item.color, fontFamily: 'JetBrains Mono, monospace' }}>{item.value}</div>
                <div className="text-[9px]" style={{ color: 'oklch(0.35 0.04 220)', fontFamily: 'JetBrains Mono, monospace' }}>{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
