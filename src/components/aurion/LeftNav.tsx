// AURION OS — Left Navigation Rail
// Vertical nav with module icons, labels, and active state glow

import type { AurionStore, ModuleId } from '@/store/aurionStore';
import {
  Brain, Mic, Database, Shield, Home, Heart,
  Bell, User, Zap, Share2, Music, BarChart3,
  ChevronRight
} from 'lucide-react';

interface Props { store: AurionStore; }

const MODULES: Array<{
  id: ModuleId;
  label: string;
  icon: React.ComponentType<{ size?: number }>;
  color: string;
  shortLabel: string;
}> = [
  { id: 'core', label: 'AURION CORE', shortLabel: 'CORE', icon: Brain, color: 'oklch(0.72 0.18 200)' },
  { id: 'voice', label: 'JARVOICE', shortLabel: 'VOICE', icon: Mic, color: 'oklch(0.78 0.16 80)' },
  { id: 'memory', label: 'MEMORY', shortLabel: 'MEM', icon: Database, color: 'oklch(0.55 0.25 290)' },
  { id: 'security', label: 'GUARDIAN', shortLabel: 'SEC', icon: Shield, color: 'oklch(0.65 0.22 15)' },
  { id: 'smarthome', label: 'SMART HOME', shortLabel: 'HOME', icon: Home, color: 'oklch(0.72 0.18 162)' },
  { id: 'health', label: 'HEALTH AI', shortLabel: 'HLTH', icon: Heart, color: 'oklch(0.75 0.22 15)' },
  { id: 'reminders', label: 'REMINDERS', shortLabel: 'REM', icon: Bell, color: 'oklch(0.78 0.16 80)' },
  { id: 'twin', label: 'DIGITAL TWIN', shortLabel: 'TWIN', icon: User, color: 'oklch(0.72 0.18 200)' },
  { id: 'autonomy', label: 'AUTONOMY', shortLabel: 'AUTO', icon: Zap, color: 'oklch(0.85 0.16 80)' },
  { id: 'social', label: 'SOCIAL/CLOUD', shortLabel: 'SOCL', icon: Share2, color: 'oklch(0.72 0.18 200)' },
  { id: 'multimedia', label: 'MULTIMEDIA', shortLabel: 'MEDIA', icon: Music, color: 'oklch(0.55 0.25 290)' },
  { id: 'analytics', label: 'ANALYTICS', shortLabel: 'ANLYT', icon: BarChart3, color: 'oklch(0.72 0.18 162)' },
];

export default function LeftNav({ store }: Props) {
  const { state, setActiveModule } = store;

  return (
    <div
      className="flex flex-col shrink-0 overflow-y-auto overflow-x-hidden"
      style={{
        width: '72px',
        background: 'oklch(0.07 0.012 240 / 95%)',
        backdropFilter: 'blur(20px)',
        borderRight: '1px solid oklch(0.72 0.18 200 / 12%)',
      }}
    >
      {/* Nav items */}
      <div className="flex flex-col gap-0.5 p-1.5 flex-1">
        {MODULES.map(mod => {
          const Icon = mod.icon;
          const isActive = state.activeModule === mod.id;
          return (
            <button
              key={mod.id}
              onClick={() => setActiveModule(mod.id)}
              title={mod.label}
              className="flex flex-col items-center justify-center gap-1 py-2.5 px-1 rounded transition-all duration-200 relative group"
              style={{
                background: isActive ? `${mod.color}15` : 'transparent',
                border: `1px solid ${isActive ? `${mod.color}40` : 'transparent'}`,
                boxShadow: isActive ? `0 0 12px ${mod.color}15` : 'none',
              }}
            >
              {/* Active indicator */}
              {isActive && (
                <div
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 rounded-r"
                  style={{ background: mod.color, boxShadow: `0 0 6px ${mod.color}` }}
                />
              )}

              <span
                style={{
                  color: isActive ? mod.color : 'oklch(0.4 0.04 220)',
                  filter: isActive ? `drop-shadow(0 0 4px ${mod.color}80)` : 'none',
                  transition: 'all 0.2s',
                  display: 'flex',
                }}
              >
                <Icon size={16} />
              </span>
              <span
                className="text-[9px] font-semibold tracking-wider leading-none"
                style={{
                  color: isActive ? mod.color : 'oklch(0.35 0.04 220)',
                  fontFamily: 'JetBrains Mono, monospace',
                }}
              >
                {mod.shortLabel}
              </span>

              {/* Hover tooltip */}
              <div
                className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none z-50 transition-opacity duration-150"
                style={{
                  background: 'oklch(0.09 0.015 240 / 95%)',
                  border: `1px solid ${mod.color}40`,
                  color: mod.color,
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '10px',
                  letterSpacing: '0.05em',
                  boxShadow: `0 0 12px ${mod.color}20`,
                }}
              >
                {mod.label}
                <ChevronRight size={10} className="inline ml-1" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Bottom system info */}
      <div
        className="p-2 flex flex-col items-center gap-1"
        style={{ borderTop: '1px solid oklch(0.72 0.18 200 / 10%)' }}
      >
        <div
          className="w-2 h-2 rounded-full"
          style={{
            background: 'oklch(0.72 0.18 162)',
            boxShadow: '0 0 6px oklch(0.72 0.18 162 / 80%)',
          }}
        />
        <span
          className="text-[8px] text-center leading-tight"
          style={{ color: 'oklch(0.35 0.04 220)', fontFamily: 'JetBrains Mono, monospace' }}
        >
          ALL<br />SYS<br />OK
        </span>
      </div>
    </div>
  );
}
