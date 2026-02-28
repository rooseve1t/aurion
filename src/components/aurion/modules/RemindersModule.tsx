// Reminder Engine Module
// Create, prioritize, escalate, voice-create, analyze ignoring

import { useState } from 'react';
import type { AurionStore, Reminder } from '@/store/aurionStore';
import { Bell, Plus, Check, AlertTriangle, Clock, Mic } from 'lucide-react';
import { toast } from 'sonner';

interface Props { store: AurionStore; }

const PRIORITY_COLORS: Record<string, string> = {
  low: 'oklch(0.72 0.18 162)',
  medium: 'oklch(0.78 0.16 80)',
  high: 'oklch(0.65 0.22 15)',
  critical: 'oklch(0.75 0.22 15)',
};

const STATUS_COLORS: Record<string, string> = {
  pending: 'oklch(0.72 0.18 200)',
  active: 'oklch(0.78 0.16 80)',
  done: 'oklch(0.72 0.18 162)',
  ignored: 'oklch(0.45 0.04 220)',
};

export default function RemindersModule({ store }: Props) {
  const { state, completeReminder, addReminder } = store;
  const { reminders } = state;
  const [showForm, setShowForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState('');
  const [newPriority, setNewPriority] = useState<Reminder['priority']>('medium');

  const handleAdd = () => {
    if (!newTitle.trim() || !newTime) return;
    addReminder(newTitle.trim(), newTime, newPriority);
    setNewTitle('');
    setNewTime('');
    setShowForm(false);
    toast.success('Reminder created', { duration: 2000 });
  };

  const pending = reminders.filter(r => r.status === 'pending' || r.status === 'active');
  const done = reminders.filter(r => r.status === 'done');
  const ignored = reminders.filter(r => r.status === 'ignored');

  return (
    <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
          style={{ background: 'oklch(0.78 0.16 80 / 15%)', border: '2px solid oklch(0.78 0.16 80 / 50%)', boxShadow: '0 0 20px oklch(0.78 0.16 80 / 30%)' }}
        >
          <Bell size={18} style={{ color: 'oklch(0.85 0.16 80)' }} />
        </div>
        <div>
          <h2 className="text-lg font-bold tracking-widest" style={{ color: 'oklch(0.85 0.16 80)', fontFamily: 'Space Grotesk, sans-serif' }}>
            REMINDER ENGINE
          </h2>
          <p className="text-xs" style={{ color: 'oklch(0.45 0.04 220)', fontFamily: 'JetBrains Mono, monospace' }}>
            Priority · Escalation · Auto-reactivation · Voice Creation
          </p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs px-2 py-1 rounded" style={{ background: 'oklch(0.78 0.16 80 / 10%)', border: '1px solid oklch(0.78 0.16 80 / 30%)', color: 'oklch(0.78 0.16 80)', fontFamily: 'JetBrains Mono, monospace' }}>
            {pending.length} ACTIVE
          </span>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-all btn-glow-gold"
          >
            <Plus size={12} /> NEW
          </button>
        </div>
      </div>

      <div className="hud-divider" />

      {/* Add form */}
      {showForm && (
        <div
          className="aurion-panel rounded-lg p-4"
          style={{ borderColor: 'oklch(0.78 0.16 80 / 40%)' }}
        >
          <p className="text-[10px] tracking-widest mb-3" style={{ color: 'oklch(0.78 0.16 80)', fontFamily: 'JetBrains Mono, monospace' }}>CREATE REMINDER</p>
          <div className="flex gap-3 flex-wrap">
            <input
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              placeholder="Reminder title..."
              className="flex-1 min-w-40 px-3 py-2 rounded text-xs outline-none"
              style={{ background: 'oklch(0.07 0.01 240)', border: '1px solid oklch(0.22 0.04 220 / 40%)', color: 'oklch(0.75 0.04 200)', fontFamily: 'JetBrains Mono, monospace' }}
            />
            <input
              type="time"
              value={newTime}
              onChange={e => setNewTime(e.target.value)}
              className="px-3 py-2 rounded text-xs outline-none"
              style={{ background: 'oklch(0.07 0.01 240)', border: '1px solid oklch(0.22 0.04 220 / 40%)', color: 'oklch(0.75 0.04 200)', fontFamily: 'JetBrains Mono, monospace' }}
            />
            <select
              value={newPriority}
              onChange={e => setNewPriority(e.target.value as Reminder['priority'])}
              className="px-3 py-2 rounded text-xs outline-none"
              style={{ background: 'oklch(0.07 0.01 240)', border: '1px solid oklch(0.22 0.04 220 / 40%)', color: 'oklch(0.75 0.04 200)', fontFamily: 'JetBrains Mono, monospace' }}
            >
              <option value="low">LOW</option>
              <option value="medium">MEDIUM</option>
              <option value="high">HIGH</option>
              <option value="critical">CRITICAL</option>
            </select>
            <button
              onClick={handleAdd}
              className="flex items-center gap-1.5 px-4 py-2 rounded text-xs font-semibold transition-all btn-glow-emerald"
            >
              <Plus size={12} /> CREATE
            </button>
            <button
              onClick={() => toast.info('Voice reminder creation: say "Hey Aurion, remind me to..."', { duration: 3000 })}
              className="flex items-center gap-1.5 px-3 py-2 rounded text-xs transition-all btn-glow-gold"
            >
              <Mic size={12} /> VOICE
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-4">
        {/* Active reminders */}
        <div className="col-span-2 aurion-panel rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Clock size={13} style={{ color: 'oklch(0.78 0.16 80)' }} />
            <p className="text-[10px] tracking-widest" style={{ color: 'oklch(0.45 0.04 220)', fontFamily: 'JetBrains Mono, monospace' }}>ACTIVE REMINDERS</p>
          </div>
          <div className="flex flex-col gap-2">
            {reminders.map(reminder => (
              <div
                key={reminder.id}
                className="flex items-center gap-3 px-3 py-2.5 rounded transition-all"
                style={{
                  background: reminder.status === 'active' ? `${PRIORITY_COLORS[reminder.priority]}08` : 'oklch(0.07 0.01 240 / 60%)',
                  border: `1px solid ${PRIORITY_COLORS[reminder.priority]}25`,
                  borderLeft: `3px solid ${PRIORITY_COLORS[reminder.priority]}`,
                  opacity: reminder.status === 'done' ? 0.5 : 1,
                }}
              >
                {/* Priority indicator */}
                <div
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{
                    background: PRIORITY_COLORS[reminder.priority],
                    boxShadow: reminder.status === 'active' ? `0 0 6px ${PRIORITY_COLORS[reminder.priority]}` : 'none',
                    animation: reminder.status === 'active' && reminder.priority === 'critical' ? 'threat-pulse 1.5s ease-in-out infinite' : 'none',
                  }}
                />

                {/* Time */}
                <span className="text-[11px] shrink-0" style={{ color: 'oklch(0.45 0.04 220)', fontFamily: 'JetBrains Mono, monospace' }}>{reminder.time}</span>

                {/* Title */}
                <span className="text-xs flex-1" style={{ color: reminder.status === 'done' ? 'oklch(0.35 0.04 220)' : 'oklch(0.72 0.04 200)', textDecoration: reminder.status === 'done' ? 'line-through' : 'none' }}>
                  {reminder.title}
                </span>

                {/* Escalation count */}
                {reminder.escalations > 0 && (
                  <div className="flex items-center gap-1 shrink-0">
                    <AlertTriangle size={10} style={{ color: 'oklch(0.65 0.22 15)' }} />
                    <span className="text-[9px]" style={{ color: 'oklch(0.65 0.22 15)', fontFamily: 'JetBrains Mono, monospace' }}>×{reminder.escalations}</span>
                  </div>
                )}

                {/* Priority badge */}
                <span
                  className="text-[9px] px-1.5 py-0.5 rounded shrink-0"
                  style={{
                    background: `${PRIORITY_COLORS[reminder.priority]}15`,
                    color: PRIORITY_COLORS[reminder.priority],
                    fontFamily: 'JetBrains Mono, monospace',
                    border: `1px solid ${PRIORITY_COLORS[reminder.priority]}30`,
                  }}
                >
                  {reminder.priority.toUpperCase()}
                </span>

                {/* Status */}
                <span
                  className="text-[9px] px-1.5 py-0.5 rounded shrink-0"
                  style={{
                    background: `${STATUS_COLORS[reminder.status]}10`,
                    color: STATUS_COLORS[reminder.status],
                    fontFamily: 'JetBrains Mono, monospace',
                  }}
                >
                  {reminder.status.toUpperCase()}
                </span>

                {/* Complete button */}
                {reminder.status !== 'done' && (
                  <button
                    onClick={() => {
                      completeReminder(reminder.id);
                      toast.success(`Reminder completed: ${reminder.title}`, { duration: 1500 });
                    }}
                    className="w-6 h-6 rounded flex items-center justify-center shrink-0 transition-all"
                    style={{ background: 'oklch(0.72 0.18 162 / 10%)', border: '1px solid oklch(0.72 0.18 162 / 30%)', color: 'oklch(0.72 0.18 162)' }}
                  >
                    <Check size={11} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="flex flex-col gap-3">
          {/* Summary */}
          <div className="aurion-panel rounded-lg p-4">
            <p className="text-[10px] tracking-widest mb-3" style={{ color: 'oklch(0.45 0.04 220)', fontFamily: 'JetBrains Mono, monospace' }}>SUMMARY</p>
            <div className="flex flex-col gap-2">
              {[
                { label: 'Total', value: reminders.length, color: 'oklch(0.72 0.18 200)' },
                { label: 'Active', value: pending.length, color: 'oklch(0.78 0.16 80)' },
                { label: 'Completed', value: done.length, color: 'oklch(0.72 0.18 162)' },
                { label: 'Ignored', value: ignored.length, color: 'oklch(0.65 0.22 15)' },
              ].map(item => (
                <div key={item.label} className="flex justify-between py-1" style={{ borderBottom: '1px solid oklch(0.22 0.04 220 / 15%)' }}>
                  <span className="text-[11px]" style={{ color: 'oklch(0.55 0.04 220)' }}>{item.label}</span>
                  <span className="text-[11px] font-bold" style={{ color: item.color, fontFamily: 'JetBrains Mono, monospace' }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Ignore analysis */}
          <div className="aurion-panel rounded-lg p-4">
            <p className="text-[10px] tracking-widest mb-3" style={{ color: 'oklch(0.45 0.04 220)', fontFamily: 'JetBrains Mono, monospace' }}>IGNORE ANALYSIS</p>
            <div className="text-xs leading-relaxed" style={{ color: 'oklch(0.55 0.04 220)' }}>
              <p className="mb-2">Pattern detected: <span style={{ color: 'oklch(0.65 0.22 15)' }}>Medical reminders</span> ignored 67% of the time.</p>
              <p>Suggestion: <span style={{ color: 'oklch(0.72 0.18 162)' }}>Escalate with voice + visual alert</span></p>
            </div>
          </div>

          {/* Escalation rules */}
          <div className="aurion-panel rounded-lg p-4">
            <p className="text-[10px] tracking-widest mb-3" style={{ color: 'oklch(0.45 0.04 220)', fontFamily: 'JetBrains Mono, monospace' }}>ESCALATION RULES</p>
            <div className="flex flex-col gap-1.5 text-[10px]" style={{ color: 'oklch(0.45 0.04 220)' }}>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'oklch(0.78 0.16 80)' }} />
                <span>+15 min → Voice alert</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'oklch(0.65 0.22 15)' }} />
                <span>+30 min → Screen flash</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'oklch(0.75 0.22 15)' }} />
                <span>+60 min → Contact family</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
