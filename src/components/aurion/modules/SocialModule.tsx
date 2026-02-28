// Social & Cloud Module
// Contacts, messages, calendar, cloud sync, social intelligence

import type { AurionStore } from '@/store/aurionStore';
import { Users, MessageSquare, Calendar, Cloud, Globe, Mail } from 'lucide-react';
import { toast } from 'sonner';

interface Props { store: AurionStore; }

const CONTACTS = [
  { name: 'Anna Petrova', role: 'Family', status: 'online', avatar: 'AP', color: 'oklch(0.72 0.18 162)' },
  { name: 'Dr. Ivanov', role: 'Doctor', status: 'offline', avatar: 'DI', color: 'oklch(0.72 0.18 200)' },
  { name: 'Mikhail Sokolov', role: 'Colleague', status: 'online', avatar: 'MS', color: 'oklch(0.78 0.16 80)' },
  { name: 'Elena Kozlova', role: 'Friend', status: 'away', avatar: 'EK', color: 'oklch(0.55 0.25 290)' },
];

const MESSAGES = [
  { from: 'Anna Petrova', text: 'Are you coming for dinner tonight?', time: '14:30', unread: true },
  { from: 'Dr. Ivanov', text: 'Your test results are ready', time: '13:15', unread: true },
  { from: 'Mikhail Sokolov', text: 'Meeting rescheduled to 16:00', time: '12:00', unread: false },
];

const CALENDAR = [
  { title: 'Team Standup', time: '09:00', type: 'work', color: 'oklch(0.72 0.18 200)' },
  { title: 'Dr. Ivanov Appointment', time: '11:30', type: 'health', color: 'oklch(0.65 0.22 15)' },
  { title: 'Lunch with Anna', time: '13:00', type: 'personal', color: 'oklch(0.72 0.18 162)' },
  { title: 'Project Review', time: '16:00', type: 'work', color: 'oklch(0.72 0.18 200)' },
];

export default function SocialModule({ store }: Props) {
  return (
    <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
          style={{ background: 'oklch(0.72 0.18 200 / 15%)', border: '2px solid oklch(0.72 0.18 200 / 50%)', boxShadow: '0 0 20px oklch(0.72 0.18 200 / 30%)' }}
        >
          <Users size={18} style={{ color: 'oklch(0.78 0.18 200)' }} />
        </div>
        <div>
          <h2 className="text-lg font-bold tracking-widest" style={{ color: 'oklch(0.78 0.18 200)', fontFamily: 'Space Grotesk, sans-serif' }}>
            SOCIAL & CLOUD
          </h2>
          <p className="text-xs" style={{ color: 'oklch(0.45 0.04 220)', fontFamily: 'JetBrains Mono, monospace' }}>
            Contacts · Messages · Calendar · Cloud Sync
          </p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Cloud size={14} style={{ color: 'oklch(0.72 0.18 162)' }} />
          <span className="text-xs" style={{ color: 'oklch(0.72 0.18 162)', fontFamily: 'JetBrains Mono, monospace' }}>SYNCED</span>
        </div>
      </div>

      <div className="hud-divider" />

      <div className="grid grid-cols-3 gap-4">
        {/* Contacts */}
        <div className="aurion-panel rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Users size={13} style={{ color: 'oklch(0.72 0.18 200)' }} />
            <p className="text-[10px] tracking-widest" style={{ color: 'oklch(0.45 0.04 220)', fontFamily: 'JetBrains Mono, monospace' }}>CONTACTS</p>
          </div>
          <div className="flex flex-col gap-2">
            {CONTACTS.map(c => (
              <div key={c.name} className="flex items-center gap-2 py-1.5" style={{ borderBottom: '1px solid oklch(0.22 0.04 220 / 15%)' }}>
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
                  style={{ background: `${c.color}20`, border: `1px solid ${c.color}40`, color: c.color, fontFamily: 'JetBrains Mono, monospace' }}
                >
                  {c.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs truncate" style={{ color: 'oklch(0.72 0.04 200)' }}>{c.name}</p>
                  <p className="text-[9px]" style={{ color: 'oklch(0.35 0.04 220)' }}>{c.role}</p>
                </div>
                <div
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{
                    background: c.status === 'online' ? 'oklch(0.72 0.18 162)' : c.status === 'away' ? 'oklch(0.78 0.16 80)' : 'oklch(0.35 0.04 220)',
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Messages */}
        <div className="aurion-panel rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <MessageSquare size={13} style={{ color: 'oklch(0.78 0.16 80)' }} />
            <p className="text-[10px] tracking-widest" style={{ color: 'oklch(0.45 0.04 220)', fontFamily: 'JetBrains Mono, monospace' }}>MESSAGES</p>
            <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded" style={{ background: 'oklch(0.65 0.22 15 / 20%)', color: 'oklch(0.65 0.22 15)', fontFamily: 'JetBrains Mono, monospace' }}>
              {MESSAGES.filter(m => m.unread).length} NEW
            </span>
          </div>
          <div className="flex flex-col gap-2">
            {MESSAGES.map((msg, i) => (
              <button
                key={i}
                onClick={() => toast.info(`Opening message from ${msg.from}`, { duration: 2000 })}
                className="flex items-start gap-2 p-2 rounded text-left transition-all"
                style={{
                  background: msg.unread ? 'oklch(0.78 0.16 80 / 6%)' : 'oklch(0.07 0.01 240 / 40%)',
                  border: `1px solid ${msg.unread ? 'oklch(0.78 0.16 80 / 25%)' : 'oklch(0.22 0.04 220 / 15%)'}`,
                }}
              >
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[11px] font-medium" style={{ color: 'oklch(0.72 0.04 200)' }}>{msg.from}</span>
                    <span className="text-[9px] ml-auto" style={{ color: 'oklch(0.35 0.04 220)', fontFamily: 'JetBrains Mono, monospace' }}>{msg.time}</span>
                    {msg.unread && <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'oklch(0.78 0.16 80)' }} />}
                  </div>
                  <p className="text-[10px] leading-tight" style={{ color: 'oklch(0.55 0.04 220)' }}>{msg.text}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Calendar */}
        <div className="aurion-panel rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Calendar size={13} style={{ color: 'oklch(0.72 0.18 162)' }} />
            <p className="text-[10px] tracking-widest" style={{ color: 'oklch(0.45 0.04 220)', fontFamily: 'JetBrains Mono, monospace' }}>TODAY'S CALENDAR</p>
          </div>
          <div className="flex flex-col gap-2">
            {CALENDAR.map((event, i) => (
              <div
                key={i}
                className="flex items-center gap-2 px-2 py-2 rounded"
                style={{
                  background: `${event.color}08`,
                  border: `1px solid ${event.color}25`,
                  borderLeft: `3px solid ${event.color}`,
                }}
              >
                <span className="text-[10px] shrink-0" style={{ color: 'oklch(0.45 0.04 220)', fontFamily: 'JetBrains Mono, monospace' }}>{event.time}</span>
                <span className="text-xs flex-1" style={{ color: 'oklch(0.65 0.04 220)' }}>{event.title}</span>
                <span
                  className="text-[9px] px-1 py-0.5 rounded shrink-0"
                  style={{ background: `${event.color}15`, color: event.color, fontFamily: 'JetBrains Mono, monospace' }}
                >
                  {event.type}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cloud sync status */}
      <div className="aurion-panel rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <Globe size={13} style={{ color: 'oklch(0.72 0.18 200)' }} />
          <p className="text-[10px] tracking-widest" style={{ color: 'oklch(0.45 0.04 220)', fontFamily: 'JetBrains Mono, monospace' }}>CLOUD SYNC STATUS</p>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: 'Google Drive', status: 'synced', size: '2.4 GB', color: 'oklch(0.72 0.18 162)' },
            { label: 'iCloud', status: 'synced', size: '8.1 GB', color: 'oklch(0.72 0.18 200)' },
            { label: 'Dropbox', status: 'syncing', size: '1.2 GB', color: 'oklch(0.78 0.16 80)' },
            { label: 'AURION Cloud', status: 'synced', size: '512 MB', color: 'oklch(0.55 0.25 290)' },
          ].map(c => (
            <div key={c.label} className="text-center py-2 px-3 rounded" style={{ background: `${c.color}08`, border: `1px solid ${c.color}20` }}>
              <Cloud size={16} style={{ color: c.color, margin: '0 auto 4px' }} />
              <p className="text-[10px] font-medium" style={{ color: 'oklch(0.65 0.04 220)' }}>{c.label}</p>
              <p className="text-[9px]" style={{ color: c.color, fontFamily: 'JetBrains Mono, monospace' }}>{c.status}</p>
              <p className="text-[9px]" style={{ color: 'oklch(0.35 0.04 220)' }}>{c.size}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
