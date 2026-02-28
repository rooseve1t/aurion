
import React from 'react';
import { Activity, Cpu, Database, Network } from 'lucide-react';

interface Metrics {
  cpuUsage: number;
  ramUsage: number;
  networkLatency: number;
  activeThreads: number;
}

export const SystemMonitor = ({ metrics }: { metrics: Metrics }) => {
  return (
    <div className="flex flex-col gap-3 h-full">
      <div className="flex items-center justify-between border-b border-white/5 pb-2">
        <h4 className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Системный Интеллект</h4>
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-[9px] text-blue-500/80 font-mono">МОНИТОРИНГ</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="p-2 rounded bg-white/[0.02] border border-white/5 flex flex-col items-center justify-center gap-1">
          <Cpu size={16} className="text-blue-400" />
          <span className="text-xl font-bold font-mono">{metrics.cpuUsage}%</span>
          <span className="text-[8px] uppercase tracking-widest text-white/30">Нагрузка ЦП</span>
        </div>
        <div className="p-2 rounded bg-white/[0.02] border border-white/5 flex flex-col items-center justify-center gap-1">
          <Database size={16} className="text-purple-400" />
          <span className="text-xl font-bold font-mono">{metrics.ramUsage}%</span>
          <span className="text-[8px] uppercase tracking-widest text-white/30">Использование ОЗУ</span>
        </div>
        <div className="p-2 rounded bg-white/[0.02] border border-white/5 flex flex-col items-center justify-center gap-1">
          <Network size={16} className="text-green-400" />
          <span className="text-xl font-bold font-mono">{metrics.networkLatency}ms</span>
          <span className="text-[8px] uppercase tracking-widest text-white/30">Задержка</span>
        </div>
        <div className="p-2 rounded bg-white/[0.02] border border-white/5 flex flex-col items-center justify-center gap-1">
          <Activity size={16} className="text-orange-400" />
          <span className="text-xl font-bold font-mono">{metrics.activeThreads}</span>
          <span className="text-[8px] uppercase tracking-widest text-white/30">Потоки</span>
        </div>
      </div>

      <div className="flex-1 bg-black/20 rounded border border-white/5 p-2 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          <div className="w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
        </div>
        <div className="relative z-10 flex flex-col h-full justify-between">
          <div className="flex justify-between text-[8px] font-mono text-white/30">
            <span>СЕТЬ_ВХОД: 12.4 MB/s</span>
            <span>СЕТЬ_ВЫХОД: 4.2 MB/s</span>
          </div>
          <div className="flex justify-between text-[8px] font-mono text-white/30">
            <span>ДИСК_ЧТЕНИЕ: 45 MB/s</span>
            <span>ДИСК_ЗАПИСЬ: 12 MB/s</span>
          </div>
          <div className="mt-auto h-8 flex items-end gap-0.5">
            {Array.from({ length: 20 }).map((_, i) => (
              <div 
                key={i} 
                className="flex-1 bg-blue-500/20 hover:bg-blue-500/40 transition-all duration-300" 
                style={{ height: `${Math.random() * 100}%` }} 
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
