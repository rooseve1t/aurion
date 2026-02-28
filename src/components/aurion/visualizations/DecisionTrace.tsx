import { motion } from 'framer-motion';
import { Brain, Zap, Shield, Activity, Search, ArrowRight } from 'lucide-react';

interface DecisionTraceEntry {
  agentId: string;
  agentType: string;
  decisionLogic: string;
  dataUsed: any;
  actionTaken: string;
  timestamp: string;
}

interface Props {
  trace: DecisionTraceEntry[];
}

const AGENT_ICONS: Record<string, any> = {
  planner: Brain,
  execution: Zap,
  security: Shield,
  health: Activity,
  research: Search,
  orchestrator: Brain,
};

const AGENT_COLORS: Record<string, string> = {
  planner: 'oklch(0.55 0.25 290)',
  execution: 'oklch(0.72 0.18 162)',
  security: 'oklch(0.65 0.22 15)',
  health: 'oklch(0.72 0.18 162)',
  research: 'oklch(0.72 0.18 200)',
  orchestrator: 'oklch(0.85 0.18 200)',
};

export default function DecisionTrace({ trace }: Props) {
  if (!trace || trace.length === 0) return null;

  return (
    <div className="w-full flex flex-col gap-2 p-2">
      <div className="flex items-center gap-2 mb-1">
        <Brain size={12} className="text-[oklch(0.85_0.18_200)]" />
        <span className="text-[10px] font-mono tracking-widest text-[oklch(0.45_0.04_220)]">DECISION TRACE</span>
      </div>
      
      <div className="relative pl-4 border-l border-[oklch(0.22_0.04_220_/_30%)] flex flex-col gap-4">
        {trace.map((entry, i) => {
          const Icon = AGENT_ICONS[entry.agentType] || Brain;
          const color = AGENT_COLORS[entry.agentType] || 'oklch(0.75 0.04 200)';
          
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="relative"
            >
              {/* Node Dot */}
              <div 
                className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full border-2 border-[oklch(0.09_0.015_240)]"
                style={{ background: color }}
              />
              
              <div className="bg-[oklch(0.07_0.01_240_/_60%)] border border-[oklch(0.22_0.04_220_/_30%)] rounded p-2 text-xs">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <Icon size={10} style={{ color }} />
                    <span className="font-mono uppercase font-bold" style={{ color }}>{entry.agentType}</span>
                  </div>
                  <span className="text-[9px] font-mono text-[oklch(0.35_0.04_220)]">
                    {new Date(entry.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit' })}
                  </span>
                </div>
                
                <div className="text-[oklch(0.75_0.04_200)] mb-1 leading-tight">
                  {entry.decisionLogic}
                </div>
                
                {entry.actionTaken && (
                  <div className="flex items-center gap-1 text-[9px] text-[oklch(0.55_0.25_290)] font-mono mt-1 bg-[oklch(0.55_0.25_290_/_10%)] px-1.5 py-0.5 rounded w-fit">
                    <ArrowRight size={8} />
                    ACTION: {entry.actionTaken}
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
