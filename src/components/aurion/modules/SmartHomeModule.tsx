// Smart Home Module
// Lights, temperature, locks, cameras, energy, presets, automation rules

import type { AurionStore } from '@/store/aurionStore';
import { Home, Lightbulb, Thermometer, Lock, Camera, Zap, Sun, Moon, Briefcase, Focus, Map } from 'lucide-react';
import { toast } from 'sonner';
import FloorPlan from '../visualizations/FloorPlan';

interface Props { store: AurionStore; }

const PRESET_CONFIG = [
  { id: 'home', label: 'ДОМА', icon: Home, color: 'oklch(0.72 0.18 162)' },
  { id: 'away', label: 'ВНЕ ДОМА', icon: Briefcase, color: 'oklch(0.78 0.16 80)' },
  { id: 'night', label: 'НОЧЬ', icon: Moon, color: 'oklch(0.55 0.25 290)' },
  { id: 'focus', label: 'ФОКУС', icon: Focus, color: 'oklch(0.72 0.18 200)' },
] as const;

export default function SmartHomeModule({ store }: Props) {
  const { state, toggleDevice, setDeviceValue, setPreset } = store;
  const { smartHomeDevices, activePreset } = state;

  const lights = smartHomeDevices.filter(d => d.type === 'light');
  const thermostat = smartHomeDevices.find(d => d.type === 'thermostat');
  const locks = smartHomeDevices.filter(d => d.type === 'lock');
  const cameras = smartHomeDevices.filter(d => d.type === 'camera');

  const activeLights = lights.filter(l => l.status).length;
  const allLocked = locks.every(l => l.status);

  return (
    <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
          style={{ background: 'oklch(0.72 0.18 162 / 15%)', border: '2px solid oklch(0.72 0.18 162 / 50%)', boxShadow: '0 0 20px oklch(0.72 0.18 162 / 30%)' }}
        >
          <Home size={18} style={{ color: 'oklch(0.78 0.18 162)' }} />
        </div>
        <div>
          <h2 className="text-lg font-bold tracking-widest" style={{ color: 'oklch(0.78 0.18 162)', fontFamily: 'Space Grotesk, sans-serif' }}>
            УМНЫЙ ДОМ
          </h2>
          <p className="text-xs" style={{ color: 'oklch(0.45 0.04 220)', fontFamily: 'JetBrains Mono, monospace' }}>
            {activeLights} ламп · {thermostat?.value}°C · {allLocked ? 'Все закрыто' : 'Дверь открыта'}
          </p>
        </div>
        <div className="ml-auto">
          <span className="text-xs px-2 py-1 rounded" style={{ background: 'oklch(0.72 0.18 162 / 10%)', border: '1px solid oklch(0.72 0.18 162 / 30%)', color: 'oklch(0.72 0.18 162)', fontFamily: 'JetBrains Mono, monospace' }}>
            {smartHomeDevices.filter(d => d.status).length}/{smartHomeDevices.length} ОНЛАЙН
          </span>
        </div>
      </div>

      <div className="hud-divider" />

      {/* Presets */}
      <div className="aurion-panel rounded-lg p-4">
        <p className="text-[10px] tracking-widest mb-3" style={{ color: 'oklch(0.45 0.04 220)', fontFamily: 'JetBrains Mono, monospace' }}>СЦЕНАРИИ</p>
        <div className="grid grid-cols-4 gap-2">
          {PRESET_CONFIG.map(preset => {
            const Icon = preset.icon;
            const isActive = activePreset === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => {
                  setPreset(preset.id);
                  toast.success(`Сценарий: ${preset.label} активирован`, { duration: 2000 });
                }}
                className="flex flex-col items-center gap-2 py-3 rounded-lg transition-all"
                style={{
                  background: isActive ? `${preset.color}18` : 'oklch(0.09 0.015 240 / 60%)',
                  border: `2px solid ${isActive ? preset.color : 'oklch(0.22 0.04 220 / 30%)'}`,
                  boxShadow: isActive ? `0 0 16px ${preset.color}25` : 'none',
                }}
              >
                <Icon size={20} style={{ color: isActive ? preset.color : 'oklch(0.45 0.04 220)' }} />
                <span className="text-[10px] font-semibold" style={{ color: isActive ? preset.color : 'oklch(0.45 0.04 220)', fontFamily: 'JetBrains Mono, monospace' }}>
                  {preset.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Lights */}
        <div className="aurion-panel rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb size={13} style={{ color: 'oklch(0.78 0.16 80)' }} />
            <p className="text-[10px] tracking-widest" style={{ color: 'oklch(0.45 0.04 220)', fontFamily: 'JetBrains Mono, monospace' }}>ОСВЕЩЕНИЕ</p>
            <span className="ml-auto text-[10px]" style={{ color: 'oklch(0.78 0.16 80)', fontFamily: 'JetBrains Mono, monospace' }}>{activeLights}/{lights.length}</span>
          </div>
          <div className="flex flex-col gap-3">
            {lights.map(light => (
              <div key={light.id}>
                <div className="flex items-center gap-2 mb-1">
                  <button
                    onClick={() => toggleDevice(light.id)}
                    className="w-8 h-4 rounded-full relative transition-all shrink-0"
                    style={{
                      background: light.status ? 'oklch(0.78 0.16 80 / 40%)' : 'oklch(0.12 0.02 240)',
                      border: `1px solid ${light.status ? 'oklch(0.78 0.16 80)' : 'oklch(0.22 0.04 220 / 40%)'}`,
                    }}
                  >
                    <div
                      className="absolute top-0.5 w-3 h-3 rounded-full transition-all"
                      style={{
                        left: light.status ? 'calc(100% - 14px)' : '2px',
                        background: light.status ? 'oklch(0.85 0.16 80)' : 'oklch(0.35 0.04 220)',
                        boxShadow: light.status ? '0 0 6px oklch(0.78 0.16 80)' : 'none',
                      }}
                    />
                  </button>
                  <span className="text-xs flex-1" style={{ color: light.status ? 'oklch(0.75 0.04 200)' : 'oklch(0.45 0.04 220)' }}>{light.name}</span>
                  <span className="text-[10px]" style={{ color: 'oklch(0.45 0.04 220)', fontFamily: 'JetBrains Mono, monospace' }}>{light.value}%</span>
                </div>
                {light.status && (
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={light.value ?? 50}
                    onChange={e => setDeviceValue(light.id, Number(e.target.value))}
                    className="w-full h-1 rounded-full appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(90deg, oklch(0.78 0.16 80) ${light.value}%, oklch(0.12 0.02 240) ${light.value}%)`,
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Floor Plan */}
        <div className="aurion-panel rounded-lg p-4 flex flex-col">
          <div className="flex items-center gap-2 mb-3">
            <Map size={13} style={{ color: 'oklch(0.72 0.18 162)' }} />
            <p className="text-[10px] tracking-widest" style={{ color: 'oklch(0.45 0.04 220)', fontFamily: 'JetBrains Mono, monospace' }}>ПЛАН ПОМЕЩЕНИЯ</p>
          </div>
          <div className="flex-1 relative">
            <FloorPlan devices={smartHomeDevices} />
          </div>
        </div>

        {/* Climate + locks */}
        <div className="flex flex-col gap-3">
          {/* Thermostat */}
          <div className="aurion-panel rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Thermometer size={13} style={{ color: 'oklch(0.65 0.22 15)' }} />
              <p className="text-[10px] tracking-widest" style={{ color: 'oklch(0.45 0.04 220)', fontFamily: 'JetBrains Mono, monospace' }}>КЛИМАТ</p>
            </div>
            {thermostat && (
              <div className="flex flex-col items-center gap-3">
                <div
                  className="text-4xl font-bold"
                  style={{ color: 'oklch(0.65 0.22 15)', fontFamily: 'JetBrains Mono, monospace', textShadow: '0 0 15px oklch(0.65 0.22 15 / 40%)' }}
                >
                  {thermostat.value}°C
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setDeviceValue(thermostat.id, Math.max(16, (thermostat.value ?? 22) - 1))}
                    className="w-8 h-8 rounded flex items-center justify-center text-lg font-bold transition-all btn-glow-cyan"
                  >
                    −
                  </button>
                  <button
                    onClick={() => setDeviceValue(thermostat.id, Math.min(30, (thermostat.value ?? 22) + 1))}
                    className="w-8 h-8 rounded flex items-center justify-center text-lg font-bold transition-all btn-glow-rose"
                  >
                    +
                  </button>
                </div>
                <div className="flex gap-2 text-[10px]" style={{ color: 'oklch(0.45 0.04 220)' }}>
                  <span>Цель: {thermostat.value}°C</span>
                  <span>·</span>
                  <span>На улице: 8°C</span>
                </div>
              </div>
            )}
          </div>

          {/* Locks */}
          <div className="aurion-panel rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Lock size={13} style={{ color: 'oklch(0.72 0.18 200)' }} />
              <p className="text-[10px] tracking-widest" style={{ color: 'oklch(0.45 0.04 220)', fontFamily: 'JetBrains Mono, monospace' }}>ЗАМКИ</p>
            </div>
            <div className="flex flex-col gap-2">
              {locks.map(lock => (
                <div key={lock.id} className="flex items-center gap-2">
                  <span className="text-xs flex-1" style={{ color: 'oklch(0.65 0.04 220)' }}>{lock.name}</span>
                  <button
                    onClick={() => {
                      toggleDevice(lock.id);
                      toast.info(`${lock.name}: ${lock.status ? 'Открыто' : 'Закрыто'}`, { duration: 1500 });
                    }}
                    className="px-3 py-1 rounded text-[10px] font-semibold transition-all"
                    style={{
                      background: lock.status ? 'oklch(0.72 0.18 162 / 15%)' : 'oklch(0.65 0.22 15 / 15%)',
                      border: `1px solid ${lock.status ? 'oklch(0.72 0.18 162 / 40%)' : 'oklch(0.65 0.22 15 / 40%)'}`,
                      color: lock.status ? 'oklch(0.72 0.18 162)' : 'oklch(0.65 0.22 15)',
                      fontFamily: 'JetBrains Mono, monospace',
                    }}
                  >
                    {lock.status ? '🔒 ЗАКРЫТО' : '🔓 ОТКРЫТО'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Energy */}
          <div className="aurion-panel rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Zap size={13} style={{ color: 'oklch(0.78 0.16 80)' }} />
              <p className="text-[10px] tracking-widest" style={{ color: 'oklch(0.45 0.04 220)', fontFamily: 'JetBrains Mono, monospace' }}>ЭНЕРГИЯ</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Текущее', value: '1.8 кВт', color: 'oklch(0.72 0.18 200)' },
                { label: 'Сегодня', value: '12.4 кВт·ч', color: 'oklch(0.78 0.16 80)' },
                { label: 'Солнце', value: '3.2 кВт', color: 'oklch(0.72 0.18 162)' },
                { label: 'Экономия', value: '23%', color: 'oklch(0.72 0.18 162)' },
              ].map(item => (
                <div key={item.label} className="text-center py-1">
                  <div className="text-sm font-bold" style={{ color: item.color, fontFamily: 'JetBrains Mono, monospace' }}>{item.value}</div>
                  <div className="text-[9px]" style={{ color: 'oklch(0.35 0.04 220)' }}>{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
