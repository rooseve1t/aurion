// AURION OS — Emergency Overlay
// Full-screen emergency protocol activation with contact options

import type { AurionStore } from '@/store/aurionStore';
import { AlertTriangle, Phone, Shield, X } from 'lucide-react';
import { toast } from 'sonner';

interface Props { store: AurionStore; }

const CONTACTS = [
  { label: 'POLICE', number: '102', color: 'oklch(0.55 0.22 250)' },
  { label: 'AMBULANCE', number: '103', color: 'oklch(0.65 0.22 15)' },
  { label: 'SECURITY', number: 'GBR', color: 'oklch(0.78 0.16 80)' },
  { label: 'CLOSE CONTACT', number: 'FAMILY', color: 'oklch(0.72 0.18 162)' },
];

export default function EmergencyOverlay({ store }: Props) {
  const { dismissEmergency } = store;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        background: 'oklch(0.04 0.01 15 / 90%)',
        backdropFilter: 'blur(8px)',
      }}
    >
      {/* Animated border */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          border: '3px solid oklch(0.65 0.22 15)',
          animation: 'threat-pulse 1s ease-in-out infinite',
        }}
      />

      <div
        className="relative max-w-md w-full mx-4 rounded-lg p-6"
        style={{
          background: 'oklch(0.07 0.015 15 / 95%)',
          border: '2px solid oklch(0.65 0.22 15 / 80%)',
          boxShadow: '0 0 60px oklch(0.65 0.22 15 / 40%), 0 0 120px oklch(0.65 0.22 15 / 20%)',
        }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{
              background: 'oklch(0.65 0.22 15 / 20%)',
              border: '2px solid oklch(0.65 0.22 15)',
              animation: 'threat-pulse 1s ease-in-out infinite',
            }}
          >
            <AlertTriangle size={24} style={{ color: 'oklch(0.75 0.22 15)' }} />
          </div>
          <div>
            <h2
              className="text-xl font-bold tracking-widest"
              style={{
                color: 'oklch(0.75 0.22 15)',
                fontFamily: 'Space Grotesk, sans-serif',
                textShadow: '0 0 20px oklch(0.65 0.22 15 / 60%)',
              }}
            >
              EMERGENCY PROTOCOL
            </h2>
            <p
              className="text-xs tracking-widest"
              style={{ color: 'oklch(0.55 0.15 15)', fontFamily: 'JetBrains Mono, monospace' }}
            >
              CRITICAL THREAT LEVEL — SYSTEM ALERT ACTIVE
            </p>
          </div>
        </div>

        {/* Emergency contacts */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {CONTACTS.map(c => (
            <button
              key={c.label}
              onClick={() => {
                toast.error(`Calling ${c.label}: ${c.number}`, { duration: 3000 });
              }}
              className="flex items-center gap-2 p-3 rounded transition-all"
              style={{
                background: `${c.color}15`,
                border: `1px solid ${c.color}40`,
                color: c.color,
              }}
            >
              <Phone size={16} />
              <div className="text-left">
                <div className="text-xs font-bold" style={{ fontFamily: 'JetBrains Mono, monospace' }}>{c.label}</div>
                <div className="text-[10px] opacity-70">{c.number}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Status */}
        <div
          className="rounded p-3 mb-4"
          style={{
            background: 'oklch(0.65 0.22 15 / 10%)',
            border: '1px solid oklch(0.65 0.22 15 / 30%)',
          }}
        >
          <p className="text-xs" style={{ color: 'oklch(0.65 0.22 15)', fontFamily: 'JetBrains Mono, monospace' }}>
            ● All cameras recording<br />
            ● Location transmitted to emergency contacts<br />
            ● Guardian mode: MAXIMUM<br />
            ● All locks secured
          </p>
        </div>

        {/* Cancel */}
        <button
          onClick={() => {
            dismissEmergency();
            toast.success('Emergency protocol dismissed — System returning to NORMAL', { duration: 3000 });
          }}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded transition-all"
          style={{
            background: 'oklch(0.12 0.02 240)',
            border: '1px solid oklch(0.22 0.04 220 / 40%)',
            color: 'oklch(0.55 0.04 220)',
          }}
        >
          <Shield size={14} />
          <span className="text-xs font-medium" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
            DISMISS — FALSE ALARM
          </span>
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
