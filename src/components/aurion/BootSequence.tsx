// AURION OS — Boot Sequence Component
// Анимированный экран загрузки с прогрессом и сообщениями инициализации

import { useEffect, useState } from 'react';
import { useI18n } from '@/contexts/I18nContext';

const CORE_IMG = 'https://private-us-east-1.manuscdn.com/sessionFile/HZpFjz3KBEkI6o0zTuvHp5/sandbox/I8TqSJZITSdaejtYqMNudI-img-1_1771798325000_na1fn_YXVyaW9uLWNvcmUtb3Ji.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvSFpwRmp6M0tCRWtJNm8welR1dkhwNS9zYW5kYm94L0k4VHFTSlpJVFNkYWVqdFlxTU51ZEktaW1nLTFfMTc3MTc5ODMyNTAwMF9uYTFmbl9ZWFZ5YVc5dUxXTnZjbVV0YjNKaS5wbmc~eC1vc3MtcHJvY2Vzcz1pbWFnZS9yZXNpemUsd18xOTIwLGhfMTkyMC9mb3JtYXQsd2VicC9xdWFsaXR5LHFfODAiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3OTg3NjE2MDB9fX1dfQ__&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=M0vWQeSFzX9o0VL-etakkvbjaQ136a4AZ~C-WJ8oI5MzhyetKQq2~WJtKMsRhfCJhq0G2Zv7tvz2CBjVBbID~iW2rxN~3T2WtPlzOMy-Zk1GboumjSDt~gF7kjsUoXCY~qGMoCmh02y-Vf09gYxEIs9opoVf4O-IxN0K-YnQ03e~uQ~toRdJXi6FaZ6xY3R91VOZN1IM2GhGo0Ns4B3MKnFsOZkdF8nOJynhiOejq9YCQYO7R-aDjmAODb6LH4R56ZFpFnUdYs1kUryTxFRYNqFsgisbjKGRcewCxSYpK9QUa3dMxOlteR1AZ8IFt1VVWKj5RHp4dFO6kYKwCJq7eQ__';

const BOOT_MESSAGES = [
  'Инициализация AURION CORE...',
  'Загрузка двигателя решений...',
  'Калибровка модуля оценки рисков...',
  'Активация нейросетевого интерфейса JarVoice...',
  'Загрузка систем памяти...',
  'Подключение слоя умного дома...',
  'Инициализация интеллекта здоровья...',
  'Активация модуля Guardian...',
  'Загрузка цифрового двойника...',
  'Синхронизация слоя автономии...',
  'Все системы в норме. AURION OS готов.',
];

interface Props {
  progress: number;
}

export default function BootSequence({ progress }: Props) {
  const i18n = useI18n();
  const [displayProgress, setDisplayProgress] = useState(0);

  useEffect(() => {
    setDisplayProgress(progress);
  }, [progress]);

  const msgIndex = Math.min(
    Math.floor((displayProgress / 100) * BOOT_MESSAGES.length),
    BOOT_MESSAGES.length - 1
  );

  const modules = [
    i18n.module_core,
    i18n.module_voice,
    i18n.module_memory,
    i18n.module_security,
    i18n.module_smarthome,
    i18n.module_health,
    i18n.module_twin,
    i18n.module_autonomy,
  ];

  return (
    <div
      className="h-screen w-screen flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: 'oklch(0.04 0.01 250)',
        backgroundImage: 'radial-gradient(ellipse 60% 60% at 50% 50%, oklch(0.55 0.22 250 / 12%) 0%, transparent 70%)',
      }}
    >
      {/* Orb */}
      <div className="relative mb-10">
        <div
          className="w-40 h-40 rounded-full overflow-hidden animate-orb-pulse"
          style={{ boxShadow: '0 0 60px oklch(0.72 0.18 200 / 50%), 0 0 120px oklch(0.72 0.18 200 / 25%)' }}
        >
          <img src={CORE_IMG} alt="AURION Core" className="w-full h-full object-cover" />
        </div>
        {/* Orbit rings */}
        <div
          className="absolute inset-0 rounded-full animate-ring-1"
          style={{
            border: '1px solid oklch(0.72 0.18 200 / 40%)',
            transform: 'rotateX(70deg)',
            boxShadow: '0 0 8px oklch(0.72 0.18 200 / 20%)',
          }}
        />
        <div
          className="absolute inset-[-8px] rounded-full animate-ring-2"
          style={{
            border: '1px solid oklch(0.85 0.18 200 / 25%)',
            transform: 'rotateX(50deg) rotateY(20deg)',
          }}
        />
      </div>

      {/* Title */}
      <div className="text-center mb-8">
        <h1
          className="text-5xl font-bold tracking-[0.3em] mb-2"
          style={{
            fontFamily: 'Space Grotesk, sans-serif',
            color: 'oklch(0.85 0.18 200)',
            textShadow: '0 0 30px oklch(0.72 0.18 200 / 60%)',
          }}
        >
          {i18n.app_title}
        </h1>
        <p
          className="text-xs tracking-[0.4em] uppercase"
          style={{ color: 'oklch(0.55 0.04 220)', fontFamily: 'JetBrains Mono, monospace' }}
        >
          {i18n.app_subtitle} {i18n.app_version}
        </p>
      </div>

      {/* Progress bar */}
      <div className="w-80 mb-4">
        <div
          className="h-[2px] rounded-full overflow-hidden"
          style={{ background: 'oklch(0.22 0.04 220 / 40%)' }}
        >
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${displayProgress}%`,
              background: 'linear-gradient(90deg, oklch(0.55 0.22 250), oklch(0.85 0.18 200))',
              boxShadow: '0 0 8px oklch(0.72 0.18 200 / 60%)',
            }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span
            className="text-xs"
            style={{ color: 'oklch(0.55 0.04 220)', fontFamily: 'JetBrains Mono, monospace' }}
          >
            {BOOT_MESSAGES[msgIndex]}
          </span>
          <span
            className="text-xs"
            style={{ color: 'oklch(0.72 0.18 200)', fontFamily: 'JetBrains Mono, monospace' }}
          >
            {Math.round(displayProgress)}%
          </span>
        </div>
      </div>

      {/* Module status grid */}
      <div className="grid grid-cols-4 gap-2 mt-4">
        {modules.map((mod, i) => {
          const loaded = displayProgress > (i + 1) * 11;
          return (
            <div
              key={i}
              className="flex items-center gap-1.5 px-2 py-1 rounded"
              style={{
                background: loaded ? 'oklch(0.72 0.18 200 / 8%)' : 'oklch(0.09 0.015 240 / 50%)',
                border: `1px solid ${loaded ? 'oklch(0.72 0.18 200 / 30%)' : 'oklch(0.22 0.04 220 / 30%)'}`,
              }}
            >
              <div
                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{
                  background: loaded ? 'oklch(0.72 0.18 162)' : 'oklch(0.35 0.04 220)',
                  boxShadow: loaded ? '0 0 4px oklch(0.72 0.18 162 / 80%)' : 'none',
                }}
              />
              <span
                className="text-[10px] font-medium"
                style={{
                  color: loaded ? 'oklch(0.75 0.04 200)' : 'oklch(0.35 0.04 220)',
                  fontFamily: 'JetBrains Mono, monospace',
                }}
              >
                {mod}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
