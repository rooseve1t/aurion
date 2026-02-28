// AURION OS — Right Panel
// Live event stream + autonomy suggestions feed

import type { AurionStore } from '@/store/aurionStore';
import { Check, X, Zap, AlertTriangle, Info, CheckCircle, AlertCircle, Brain } from 'lucide-react';

interface Props { store: AurionStore; }

const EVENT_ICONS: Record<string, React.ComponentType<{ size?: number }>> = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  danger: AlertCircle,
  ai: Brain,
};

const EVENT_COLORS: Record<string, string> = {
  info: 'oklch(0.72 0.18 200)',
  success: 'oklch(0.72 0.18 162)',
  warning: 'oklch(0.78 0.16 80)',
  danger: 'oklch(0.65 0.22 15)',
  ai: 'oklch(0.55 0.25 290)',
};

const PRIORITY_COLORS: Record<string, string> = {
  low: 'oklch(0.72 0.18 162)',
  medium: 'oklch(0.78 0.16 80)',
  high: 'oklch(0.65 0.22 15)',
};

export default function RightPanel({ store }: Props) {
  const { state, acceptSuggestion } = store;
  const pendingSuggestions = state.autonomySuggestions.filter(s => s.accepted === null);

  return (
    <div
      className="flex flex-col shrink-0 overflow-hidden"
      style={{
        width: '280px',
        background: 'oklch(0.07 0.012 240 / 95%)',
        backdropFilter: 'blur(20px)',
        borderLeft: '1px solid oklch(0.72 0.18 200 / 12%)',
      }}
    >
      {/* Autonomy Suggestions */}
      {pendingSuggestions.length > 0 && (
        <div
          className="shrink-0"
          style={{ borderBottom: '1px solid oklch(0.72 0.18 200 / 12%)' }}
        >
          <div className="px-3 py-2 flex items-center gap-2">
            <Zap size={12} style={{ color: 'oklch(0.78 0.16 80)' }} />
            <span
              className="text-[10px] font-semibold tracking-widest"
              style={{ color: 'oklch(0.78 0.16 80)', fontFamily: 'JetBrains Mono, monospace' }}
            >
              AUTONOMY SUGGESTIONS
            </span>
            <span
              className="ml-auto text-[10px] px-1.5 py-0.5 rounded"
              style={{
                background: 'oklch(0.78 0.16 80 / 15%)',
                color: 'oklch(0.78 0.16 80)',
                fontFamily: 'JetBrains Mono, monospace',
              }}
            >
              {pendingSuggestions.length}
            </span>
          </div>
          <div className="px-2 pb-2 flex flex-col gap-1.5">
            {pendingSuggestions.slice(0, 3).map(s => (
              <div
                key={s.id}
                className="rounded p-2"
                style={{
                  background: 'oklch(0.09 0.015 240 / 80%)',
                  border: `1px solid ${PRIORITY_COLORS[s.priority]}25`,
                  borderLeft: `2px solid ${PRIORITY_COLORS[s.priority]}`,
                }}
              >
                <p className="text-[11px] leading-tight mb-2" style={{ color: 'oklch(0.75 0.04 200)' }}>
                  {s.text}
                </p>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => acceptSuggestion(s.id, true)}
                    className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium transition-all"
                    style={{
                      background: 'oklch(0.72 0.18 162 / 15%)',
                      border: '1px solid oklch(0.72 0.18 162 / 40%)',
                      color: 'oklch(0.78 0.18 162)',
                    }}
                  >
                    <Check size={9} /> Accept
                  </button>
                  <button
                    onClick={() => acceptSuggestion(s.id, false)}
                    className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium transition-all"
                    style={{
                      background: 'oklch(0.65 0.22 15 / 10%)',
                      border: '1px solid oklch(0.65 0.22 15 / 30%)',
                      color: 'oklch(0.65 0.22 15)',
                    }}
                  >
                    <X size={9} /> Dismiss
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Event Stream header */}
      <div
        className="px-3 py-2 flex items-center gap-2 shrink-0"
        style={{ borderBottom: '1px solid oklch(0.72 0.18 200 / 10%)' }}
      >
        <div
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: 'oklch(0.72 0.18 162)', boxShadow: '0 0 6px oklch(0.72 0.18 162 / 80%)' }}
        />
        <span
          className="text-[10px] font-semibold tracking-widest"
          style={{ color: 'oklch(0.55 0.04 220)', fontFamily: 'JetBrains Mono, monospace' }}
        >
          ACTIVITY STREAM
        </span>
        <span
          className="ml-auto text-[10px]"
          style={{ color: 'oklch(0.35 0.04 220)', fontFamily: 'JetBrains Mono, monospace' }}
        >
          LIVE
        </span>
      </div>

      {/* Event list */}
      <div className="flex-1 overflow-y-auto px-2 py-1.5 flex flex-col gap-1">
        {state.eventLog.map(event => {
          const Icon = EVENT_ICONS[event.type] || Info;
          const color = EVENT_COLORS[event.type] || EVENT_COLORS.info;
          return (
            <div
              key={event.id}
              className="event-item"
              style={{ borderLeftColor: `${color}60` }}
            >
              <span style={{ color, flexShrink: 0, marginTop: '1px' }}>
                <Icon size={11} />
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1 mb-0.5">
                  <span
                    className="text-[9px] font-semibold tracking-wider"
                    style={{ color: `${color}`, fontFamily: 'JetBrains Mono, monospace' }}
                  >
                    {event.module}
                  </span>
                  <span
                    className="text-[9px] ml-auto shrink-0"
                    style={{ color: 'oklch(0.35 0.04 220)', fontFamily: 'JetBrains Mono, monospace' }}
                  >
                    {event.timestamp}
                  </span>
                </div>
                <p
                  className="text-[11px] leading-tight"
                  style={{ color: 'oklch(0.65 0.04 220)' }}
                >
                  {event.message}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom status */}
      <div
        className="px-3 py-2 shrink-0"
        style={{ borderTop: '1px solid oklch(0.72 0.18 200 / 10%)' }}
      >
        <div className="flex items-center justify-between">
          <span
            className="text-[9px]"
            style={{ color: 'oklch(0.35 0.04 220)', fontFamily: 'JetBrains Mono, monospace' }}
          >
            {state.eventLog.length} EVENTS LOGGED
          </span>
          <span
            className="text-[9px]"
            style={{ color: 'oklch(0.72 0.18 162)', fontFamily: 'JetBrains Mono, monospace' }}
          >
            STREAM ACTIVE
          </span>
        </div>
      </div>
    </div>
  );
}
