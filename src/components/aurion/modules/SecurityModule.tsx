// Security & Guardian Module
// Cameras, sensors, threat level, guardian mode, emergency protocol

import type { AurionStore } from '@/store/aurionStore';
import { Shield, Camera, AlertTriangle, Lock, Unlock, Eye, Radio, Phone, Siren } from 'lucide-react';
import { toast } from 'sonner';
import CameraFeed from '../visualizations/CameraFeed';

const SHIELD_IMG = 'https://private-us-east-1.manuscdn.com/sessionFile/HZpFjz3KBEkI6o0zTuvHp5/sandbox/I8TqSJZITSdaejtYqMNudI_1771798336237_na1fn_YXVyaW9uLXNlY3VyaXR5LXNoaWVsZA.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvSFpwRmp6M0tCRWtJNm8welR1dkhwNS9zYW5kYm94L0k4VHFTSlpJVFNkYWVqdFlxTU51ZElfMTc3MTc5ODMzNjIzN19uYTFmbl9ZWFZ5YVc5dUxYTmxZM1Z5YVhSNUxYTm9hV1ZzWkEucG5nP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLHdfMTkyMCxoXzE5MjAvZm9ybWF0LHdlYnAvcXVhbGl0eSxxXzgwIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=ZX~eZlkwdGvLQW-T4uqcShQiEU8j9c672WQNDQWXHJ3D0BH~1pWRug3sL9RDEIGl~LKPHJvDllMulrZIZ-uk3GGKJVTOQQ50k~10RPTUQENejPy~A1CVngGU9x-DcLKHozaIh9rY-9F4neWKAkkfgO8aioliAYtjUM-CiQS0c99yyXGz4SkZAI8LDM~I8EOa19MMiW2rmXimKi4JsB5lGfE80gJixFJ~AmpCVS54va7A81m3943Zyw6jddi2YCJ08axqhGCHKngh-DkziuBnB6LT~kaQft2-shXEr7nTTJqZUrcrNAX0kJHw1gmYZKoK8KqtjR10vdT29scEmZDe-w__';

interface Props { store: AurionStore; }

const THREAT_COLORS: Record<string, string> = {
  NONE: 'oklch(0.72 0.18 162)',
  LOW: 'oklch(0.78 0.16 80)',
  MEDIUM: 'oklch(0.72 0.18 60)',
  HIGH: 'oklch(0.65 0.22 15)',
  CRITICAL: 'oklch(0.65 0.22 15)',
};

export default function SecurityModule({ store }: Props) {
  const { state, toggleGuardian, triggerEmergency } = store;
  const { guardianMode, cameraFeed, alarmArmed, threatLevel } = state;
  const threatColor = THREAT_COLORS[threatLevel];

  const sensors = state.smartHomeDevices.filter(d => d.type === 'sensor' || d.type === 'camera');
  const locks = state.smartHomeDevices.filter(d => d.type === 'lock');

  return (
    <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-full overflow-hidden shrink-0"
          style={{ boxShadow: `0 0 20px ${threatColor}50` }}
        >
          <img src={SHIELD_IMG} alt="Security" className="w-full h-full object-cover" />
        </div>
        <div>
          <h2 className="text-lg font-bold tracking-widest" style={{ color: threatColor, fontFamily: 'Space Grotesk, sans-serif', textShadow: `0 0 15px ${threatColor}40` }}>
            МОДУЛЬ ЗАЩИТНИК
          </h2>
          <p className="text-xs" style={{ color: 'oklch(0.45 0.04 220)', fontFamily: 'JetBrains Mono, monospace' }}>
            Интеллект безопасности · Обнаружение угроз · Экстренный протокол
          </p>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div
              className="w-2 h-2 rounded-full"
              style={{ background: threatColor, boxShadow: `0 0 6px ${threatColor}`, animation: threatLevel !== 'NONE' ? 'threat-pulse 1.5s ease-in-out infinite' : 'none' }}
            />
            <span className="text-xs font-semibold" style={{ color: threatColor, fontFamily: 'JetBrains Mono, monospace' }}>
              УГРОЗА: {threatLevel}
            </span>
          </div>
        </div>
      </div>

      <div className="hud-divider" />

      <div className="grid grid-cols-3 gap-4">
        {/* Guardian controls */}
        <div className="col-span-1 flex flex-col gap-3">
          {/* Guardian mode toggle */}
          <div
            className="aurion-panel rounded-lg p-4"
            style={{ borderColor: guardianMode ? 'oklch(0.72 0.18 162 / 40%)' : undefined }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Shield size={14} style={{ color: guardianMode ? 'oklch(0.72 0.18 162)' : 'oklch(0.45 0.04 220)' }} />
              <p className="text-[10px] tracking-widest" style={{ color: 'oklch(0.45 0.04 220)', fontFamily: 'JetBrains Mono, monospace' }}>РЕЖИМ ЗАЩИТНИКА</p>
            </div>
            <button
              onClick={() => {
                toggleGuardian();
                toast.success(guardianMode ? 'Режим Защитника деактивирован' : 'Режим Защитника активирован', { duration: 2000 });
              }}
              className="w-full py-3 rounded-lg font-semibold text-sm transition-all"
              style={{
                background: guardianMode ? 'oklch(0.72 0.18 162 / 20%)' : 'oklch(0.12 0.02 240)',
                border: `2px solid ${guardianMode ? 'oklch(0.72 0.18 162)' : 'oklch(0.22 0.04 220 / 40%)'}`,
                color: guardianMode ? 'oklch(0.78 0.18 162)' : 'oklch(0.45 0.04 220)',
                boxShadow: guardianMode ? '0 0 20px oklch(0.72 0.18 162 / 25%)' : 'none',
                fontFamily: 'JetBrains Mono, monospace',
              }}
            >
              {guardianMode ? '● АКТИВЕН' : '○ НЕАКТИВЕН'}
            </button>
            <p className="text-[10px] mt-2 text-center" style={{ color: 'oklch(0.35 0.04 220)' }}>
              {guardianMode ? 'Все датчики мониторят' : 'Нажмите для активации'}
            </p>
          </div>

          {/* Alarm status */}
          <div className="aurion-panel rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Radio size={13} style={{ color: 'oklch(0.78 0.16 80)' }} />
              <p className="text-[10px] tracking-widest" style={{ color: 'oklch(0.45 0.04 220)', fontFamily: 'JetBrains Mono, monospace' }}>СИСТЕМА СИГНАЛИЗАЦИИ</p>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{
                  background: alarmArmed ? 'oklch(0.72 0.18 162)' : 'oklch(0.65 0.22 15)',
                  boxShadow: `0 0 8px ${alarmArmed ? 'oklch(0.72 0.18 162)' : 'oklch(0.65 0.22 15)'}`,
                }}
              />
              <span className="text-sm font-semibold" style={{ color: alarmArmed ? 'oklch(0.72 0.18 162)' : 'oklch(0.65 0.22 15)', fontFamily: 'JetBrains Mono, monospace' }}>
                {alarmArmed ? 'ВООРУЖЕНА' : 'ОТКЛЮЧЕНА'}
              </span>
            </div>
          </div>

          {/* Locks */}
          <div className="aurion-panel rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Lock size={13} style={{ color: 'oklch(0.72 0.18 200)' }} />
              <p className="text-[10px] tracking-widest" style={{ color: 'oklch(0.45 0.04 220)', fontFamily: 'JetBrains Mono, monospace' }}>ДВЕРНЫЕ ЗАМКИ</p>
            </div>
            <div className="flex flex-col gap-2">
              {locks.map(lock => (
                <div key={lock.id} className="flex items-center gap-2 py-1.5" style={{ borderBottom: '1px solid oklch(0.22 0.04 220 / 20%)' }}>
                  {lock.status ? <Lock size={12} style={{ color: 'oklch(0.72 0.18 162)' }} /> : <Unlock size={12} style={{ color: 'oklch(0.65 0.22 15)' }} />}
                  <span className="text-xs flex-1" style={{ color: 'oklch(0.65 0.04 220)' }}>{lock.name}</span>
                  <span className="text-[10px]" style={{ color: lock.status ? 'oklch(0.72 0.18 162)' : 'oklch(0.65 0.22 15)', fontFamily: 'JetBrains Mono, monospace' }}>
                    {lock.status ? 'ЗАКРЫТО' : 'ОТКРЫТО'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Emergency button */}
          <button
            onClick={() => {
              triggerEmergency();
            }}
            className="w-full py-4 rounded-lg font-bold text-sm transition-all animate-threat"
            style={{
              background: 'oklch(0.65 0.22 15 / 15%)',
              border: '2px solid oklch(0.65 0.22 15)',
              color: 'oklch(0.75 0.22 15)',
              fontFamily: 'JetBrains Mono, monospace',
              letterSpacing: '0.1em',
            }}
          >
            <Siren size={16} className="inline mr-2" />
            ЭКСТРЕННЫЙ ПРОТОКОЛ
          </button>
        </div>

        {/* Camera feeds */}
        <div className="col-span-2 flex flex-col gap-4">
          <div className="aurion-panel rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Camera size={13} style={{ color: 'oklch(0.72 0.18 200)' }} />
              <p className="text-[10px] tracking-widest" style={{ color: 'oklch(0.45 0.04 220)', fontFamily: 'JetBrains Mono, monospace' }}>КАМЕРЫ</p>
              <span className="ml-auto text-[10px]" style={{ color: 'oklch(0.72 0.18 162)', fontFamily: 'JetBrains Mono, monospace' }}>● ЭФИР</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Главный вход', src: 'https://images.unsplash.com/photo-1558036117-15d82a90b9b1?w=800&q=80' },
                { label: 'Задний двор', src: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80' },
                { label: 'Гараж', src: 'https://images.unsplash.com/photo-1582582621959-48d27397dc69?w=800&q=80' },
                { label: 'Боковые ворота', src: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80' },
              ].map((cam, i) => (
                <div
                  key={cam.label}
                  className="rounded-lg overflow-hidden relative"
                  style={{ aspectRatio: '16/9', background: 'oklch(0.04 0.01 240)', border: '1px solid oklch(0.72 0.18 200 / 20%)' }}
                >
                  <CameraFeed label={cam.label} src={cam.src} active={guardianMode} />
                </div>
              ))}
            </div>
          </div>

          {/* Sensors */}
          <div className="aurion-panel rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Radio size={13} style={{ color: 'oklch(0.72 0.18 162)' }} />
              <p className="text-[10px] tracking-widest" style={{ color: 'oklch(0.45 0.04 220)', fontFamily: 'JetBrains Mono, monospace' }}>СЕТЬ ДАТЧИКОВ</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {sensors.map(sensor => (
                <div
                  key={sensor.id}
                  className="flex items-center gap-2 px-3 py-2 rounded"
                  style={{
                    background: 'oklch(0.07 0.01 240 / 60%)',
                    border: `1px solid ${sensor.status ? 'oklch(0.72 0.18 162 / 25%)' : 'oklch(0.65 0.22 15 / 25%)'}`,
                  }}
                >
                  <div
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{
                      background: sensor.status ? 'oklch(0.72 0.18 162)' : 'oklch(0.65 0.22 15)',
                      boxShadow: `0 0 4px ${sensor.status ? 'oklch(0.72 0.18 162)' : 'oklch(0.65 0.22 15)'}`,
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs truncate" style={{ color: 'oklch(0.65 0.04 220)' }}>{sensor.name}</p>
                    <p className="text-[9px]" style={{ color: 'oklch(0.35 0.04 220)', fontFamily: 'JetBrains Mono, monospace' }}>{sensor.room}</p>
                  </div>
                  <span className="text-[10px] shrink-0" style={{ color: sensor.status ? 'oklch(0.72 0.18 162)' : 'oklch(0.65 0.22 15)', fontFamily: 'JetBrains Mono, monospace' }}>
                    {sensor.status ? 'ОК' : 'ВЫКЛ'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Emergency contacts */}
          <div className="aurion-panel rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Phone size={13} style={{ color: 'oklch(0.65 0.22 15)' }} />
              <p className="text-[10px] tracking-widest" style={{ color: 'oklch(0.45 0.04 220)', fontFamily: 'JetBrains Mono, monospace' }}>ЭКСТРЕННЫЕ КОНТАКТЫ</p>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: 'ПОЛИЦИЯ', num: '102', color: 'oklch(0.55 0.22 250)' },
                { label: 'СКОРАЯ', num: '103', color: 'oklch(0.65 0.22 15)' },
                { label: 'ОХРАНА', num: 'ГБР', color: 'oklch(0.78 0.16 80)' },
                { label: 'СЕМЬЯ', num: 'ВЫЗОВ', color: 'oklch(0.72 0.18 162)' },
              ].map(c => (
                <button
                  key={c.label}
                  onClick={() => toast.error(`Вызов ${c.label}: ${c.num}`, { duration: 2000 })}
                  className="flex flex-col items-center gap-1 py-2 rounded transition-all"
                  style={{
                    background: `${c.color}10`,
                    border: `1px solid ${c.color}30`,
                    color: c.color,
                  }}
                >
                  <Phone size={14} />
                  <span className="text-[9px] font-bold" style={{ fontFamily: 'JetBrains Mono, monospace' }}>{c.label}</span>
                  <span className="text-[9px] opacity-70">{c.num}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
