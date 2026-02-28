
import React from 'react';
import { Activity, Brain, Shield, Search, Calendar } from 'lucide-react';

interface Agent {
  id: string;
  type: string;
  name: string;
  status: 'idle' | 'active' | 'processing' | 'error';
  efficiency: number;
}

const AgentIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'planner': return <Calendar size={14} className="text-glow-cyan" />;
    case 'research': return <Search size={14} className="text-glow-violet" />;
    case 'execution': return <Activity size={14} className="text-glow-emerald" />;
    case 'health': return <HeartIcon />;
    case 'security': return <Shield size={14} className="text-glow-rose" />;
    default: return <Brain size={14} className="text-white/50" />;
  }
};

const HeartIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F472B6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
  </svg>
);

export const AgentStatusPanel = ({ agents }: { agents: Agent[] }) => {
  return (
    <div className="flex flex-col gap-2 h-full">
      <div className="flex items-center justify-between border-b border-white/5 pb-2">
        <h4 className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Мультиагентная Система</h4>
        <div className="flex items-center gap-1">
          <div className="status-dot online animate-pulse" />
          <span className="text-[9px] text-glow-emerald font-mono-data">ОНЛАЙН</span>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2">
        {agents.map(agent => (
          <div key={agent.id} className="p-2 rounded bg-white/[0.02] border border-white/5 hover:border-cyan-500/20 transition-all group">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <AgentIcon type={agent.type} />
                <span className="text-[10px] font-bold text-white/80">{agent.name}</span>
              </div>
              <span className={`text-[8px] uppercase font-mono-data px-1.5 py-0.5 rounded ${
                agent.status === 'processing' ? 'bg-cyan-500/20 text-glow-cyan animate-pulse' :
                agent.status === 'active' ? 'bg-emerald-500/20 text-glow-emerald' :
                'bg-white/5 text-white/30'
              }`}>
                {agent.status === 'processing' ? 'В РАБОТЕ' : agent.status === 'active' ? 'АКТИВЕН' : agent.status === 'idle' ? 'ОЖИДАНИЕ' : agent.status}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-cyan-500/50 transition-all duration-1000" 
                  style={{ width: `${agent.efficiency}%` }}
                />
              </div>
              <span className="text-[8px] font-mono-data text-white/30">{Math.round(agent.efficiency)}% ЭФФ</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
