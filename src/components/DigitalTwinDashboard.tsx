
import React from 'react';
import { Brain, Zap, Moon, Activity, Focus } from 'lucide-react';

interface DigitalTwin {
  productivityScore: number;
  stabilityScore: number;
  cognitiveLoadScore: number;
  sleepQuality: number;
  focusPeaks: string[];
}

export const DigitalTwinDashboard = ({ data }: { data: DigitalTwin }) => {
  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex items-center justify-between border-b border-white/5 pb-2">
        <h4 className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Анализ Цифрового Двойника</h4>
        <div className="flex items-center gap-1">
          <Brain size={12} className="text-glow-violet" />
          <span className="text-[9px] text-glow-violet font-mono-data">СИНХРОНИЗИРОВАНО</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 rounded bg-white/[0.02] border border-white/5 flex flex-col items-center justify-center gap-2">
          <div className="relative w-16 h-16 flex items-center justify-center">
            <svg className="absolute inset-0 w-full h-full transform -rotate-90">
              <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" className="text-white/5" fill="none" />
              <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" className="text-cyan-500" fill="none" strokeDasharray="175.9" strokeDashoffset={175.9 - (175.9 * data.productivityScore) / 100} />
            </svg>
            <span className="text-xl font-bold font-mono-data">{data.productivityScore}</span>
          </div>
          <span className="text-[8px] uppercase tracking-widest text-white/30">Продуктивность</span>
        </div>

        <div className="p-3 rounded bg-white/[0.02] border border-white/5 flex flex-col items-center justify-center gap-2">
          <div className="relative w-16 h-16 flex items-center justify-center">
            <svg className="absolute inset-0 w-full h-full transform -rotate-90">
              <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" className="text-white/5" fill="none" />
              <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" className="text-emerald-500" fill="none" strokeDasharray="175.9" strokeDashoffset={175.9 - (175.9 * data.stabilityScore) / 100} />
            </svg>
            <span className="text-xl font-bold font-mono-data">{data.stabilityScore}</span>
          </div>
          <span className="text-[8px] uppercase tracking-widest text-white/30">Стабильность</span>
        </div>

        <div className="p-3 rounded bg-white/[0.02] border border-white/5 flex flex-col items-center justify-center gap-2">
          <div className="relative w-16 h-16 flex items-center justify-center">
            <svg className="absolute inset-0 w-full h-full transform -rotate-90">
              <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" className="text-white/5" fill="none" />
              <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" className="text-amber-500" fill="none" strokeDasharray="175.9" strokeDashoffset={175.9 - (175.9 * data.cognitiveLoadScore) / 100} />
            </svg>
            <span className="text-xl font-bold font-mono-data">{data.cognitiveLoadScore}</span>
          </div>
          <span className="text-[8px] uppercase tracking-widest text-white/30">Когнитивная Нагрузка</span>
        </div>

        <div className="p-3 rounded bg-white/[0.02] border border-white/5 flex flex-col items-center justify-center gap-2">
          <div className="relative w-16 h-16 flex items-center justify-center">
            <svg className="absolute inset-0 w-full h-full transform -rotate-90">
              <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" className="text-white/5" fill="none" />
              <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" className="text-purple-500" fill="none" strokeDasharray="175.9" strokeDashoffset={175.9 - (175.9 * data.sleepQuality) / 100} />
            </svg>
            <span className="text-xl font-bold font-mono-data">{data.sleepQuality}%</span>
          </div>
          <span className="text-[8px] uppercase tracking-widest text-white/30">Качество Сна</span>
        </div>
      </div>

      <div className="flex-1 bg-black/20 rounded border border-white/5 p-3">
        <h5 className="text-[9px] uppercase tracking-widest text-white/40 mb-2">Прогнозируемые Пики Концентрации</h5>
        <div className="flex justify-between items-end h-16 gap-1">
          {['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00'].map((time, i) => {
            const isPeak = data.focusPeaks.some(p => p.startsWith(time.substring(0, 2)));
            const height = isPeak ? '80%' : `${20 + Math.random() * 30}%`;
            return (
              <div key={time} className="flex flex-col items-center gap-1 flex-1">
                <div 
                  className={`w-full rounded-t transition-all duration-500 ${isPeak ? 'bg-cyan-500 shadow-[0_0_10px_rgba(0,187,195,0.5)]' : 'bg-white/10'}`} 
                  style={{ height }} 
                />
                <span className="text-[7px] font-mono-data text-white/30">{time}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
