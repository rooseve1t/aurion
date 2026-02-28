// Memory System Module
// Short-term, Long-term, Episodic memory, Emotional tagging, Daily summary

import { useState, useEffect } from 'react';
import type { AurionStore } from '@/store/aurionStore';
import { Database, Clock, Archive, Heart, Star, BookOpen, Network } from 'lucide-react';
import KnowledgeGraph from '../visualizations/KnowledgeGraph';

const NEURAL_IMG = 'https://private-us-east-1.manuscdn.com/sessionFile/HZpFjz3KBEkI6o0zTuvHp5/sandbox/I8TqSJZITSdaejtYqMNudI-img-4_1771798331000_na1fn_YXVyaW9uLW5ldXJhbC1uZXR3b3Jr.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvSFpwRmp6M0tCRWtJNm8welR1dkhwNS9zYW5kYm94L0k4VHFTSlpJVFNkYWVqdFlxTU51ZEktaW1nLTRfMTc3MTc5ODMzMTAwMF9uYTFmbl9ZWFZ5YVc5dUxXNWxkWEpoYkMxdVpYUjNiM0pyLnBuZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSx3XzE5MjAsaF8xOTIwL2Zvcm1hdCx3ZWJwL3F1YWxpdHkscV84MCIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=RDQSMpaBh1DR-vi4cX650qnt573gvRzOCtXRYYA1uPlxmZam1U2N5vFbjAmIjM-J7laq42A8-X9ZCTwJFtd9SCtvn4Z69mZBiFJ3SIaeoxx8l5Leb88ATgaN~KGqsilj~mhxM72mjvZqnabL-g4Ezl6hr3WLSURUxnpcCIkTEeMAxqAIue-9mh2aEYaz43zuXKindy41ooEXp-3M6UZHDUPNG3bA5NssfQ2rnFzMMNnNQqpLXisWImmFfSsvpPRKjlhxhu1SAtO7Mt9fW8tYAQtx3ZLr6dzsPEQFYCBpsChuvCsz0bqXaNWlUF8pFPGJHJmhQbSpO~spvPeMuQVEmQ__';

interface Props { store: AurionStore; }

const EMOTION_COLORS: Record<string, string> = {
  positive: 'oklch(0.72 0.18 162)',
  neutral: 'oklch(0.55 0.04 220)',
  negative: 'oklch(0.65 0.22 15)',
  critical: 'oklch(0.78 0.16 80)',
};

const TYPE_COLORS: Record<string, string> = {
  short: 'oklch(0.72 0.18 200)',
  long: 'oklch(0.55 0.25 290)',
  episodic: 'oklch(0.78 0.16 80)',
};

export default function MemoryModule({ store }: Props) {
  const { state } = store;
  const { memories } = state;
  const [graphData, setGraphData] = useState<any>(null);

  useEffect(() => {
    fetch('/api/graph')
      .then(res => res.json())
      .then(data => setGraphData(data))
      .catch(err => console.error("Failed to fetch graph:", err));
  }, []);

  const shortTerm = memories.filter(m => m.type === 'short');
  const longTerm = memories.filter(m => m.type === 'long');
  const episodic = memories.filter(m => m.type === 'episodic');

  return (
    <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full overflow-hidden shrink-0" style={{ boxShadow: '0 0 20px oklch(0.55 0.25 290 / 50%)' }}>
          <img src={NEURAL_IMG} alt="Memory" className="w-full h-full object-cover" />
        </div>
        <div>
          <h2 className="text-lg font-bold tracking-widest" style={{ color: 'oklch(0.78 0.25 290)', fontFamily: 'Space Grotesk, sans-serif', textShadow: '0 0 15px oklch(0.55 0.25 290 / 40%)' }}>
            MEMORY SYSTEM
          </h2>
          <p className="text-xs" style={{ color: 'oklch(0.45 0.04 220)', fontFamily: 'JetBrains Mono, monospace' }}>
            Short-term · Long-term · Episodic · Knowledge Index
          </p>
        </div>
        <div className="ml-auto">
          <span className="text-xs px-2 py-1 rounded" style={{ background: 'oklch(0.55 0.25 290 / 15%)', border: '1px solid oklch(0.55 0.25 290 / 30%)', color: 'oklch(0.78 0.25 290)', fontFamily: 'JetBrains Mono, monospace' }}>
            {memories.length} ENTRIES
          </span>
        </div>
      </div>

      <div className="hud-divider" />

      {/* Memory stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'SHORT-TERM', count: shortTerm.length, max: 10, color: 'oklch(0.72 0.18 200)', icon: <Clock size={14} /> },
          { label: 'LONG-TERM', count: longTerm.length, max: 100, color: 'oklch(0.55 0.25 290)', icon: <Archive size={14} /> },
          { label: 'EPISODIC', count: episodic.length, max: 50, color: 'oklch(0.78 0.16 80)', icon: <BookOpen size={14} /> },
          { label: 'KNOWLEDGE', count: graphData?.nodes?.length || 0, max: 500, color: 'oklch(0.72 0.18 162)', icon: <Network size={14} /> },
        ].map(item => (
          <div key={item.label} className="metric-card text-center">
            <div className="flex justify-center mb-2" style={{ color: item.color }}>{item.icon}</div>
            <div className="text-2xl font-bold mb-1" style={{ color: item.color, fontFamily: 'JetBrains Mono, monospace' }}>{item.count}</div>
            <div className="text-[9px] mb-2" style={{ color: 'oklch(0.35 0.04 220)', fontFamily: 'JetBrains Mono, monospace' }}>{item.label}</div>
            <div className="h-1 rounded-full overflow-hidden" style={{ background: 'oklch(0.12 0.02 240)' }}>
              <div className="h-full rounded-full" style={{ width: `${Math.min(100, (item.count / item.max) * 100)}%`, background: item.color }} />
            </div>
          </div>
        ))}
      </div>

      {/* Knowledge Graph Visualization */}
      <div className="aurion-panel rounded-lg p-4 h-80 flex flex-col">
        <div className="flex items-center gap-2 mb-3">
          <Network size={13} style={{ color: 'oklch(0.55 0.25 290)' }} />
          <p className="text-[10px] tracking-widest" style={{ color: 'oklch(0.45 0.04 220)', fontFamily: 'JetBrains Mono, monospace' }}>KNOWLEDGE GRAPH VISUALIZATION</p>
        </div>
        <div className="flex-1 w-full h-full">
          {graphData ? (
            <KnowledgeGraph data={graphData} width={600} height={280} />
          ) : (
            <div className="flex items-center justify-center h-full text-xs text-[oklch(0.45_0.04_220)] font-mono animate-pulse">
              Loading Neural Map...
            </div>
          )}
        </div>
      </div>

      {/* Memory entries */}
      <div className="grid grid-cols-2 gap-4">
        <div className="aurion-panel rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Database size={13} style={{ color: 'oklch(0.55 0.25 290)' }} />
            <p className="text-[10px] tracking-widest" style={{ color: 'oklch(0.45 0.04 220)', fontFamily: 'JetBrains Mono, monospace' }}>MEMORY ENTRIES</p>
          </div>
          <div className="flex flex-col gap-2">
            {memories.map(mem => (
              <div
                key={mem.id}
                className="px-3 py-2 rounded"
                style={{
                  background: 'oklch(0.07 0.01 240 / 60%)',
                  border: `1px solid ${TYPE_COLORS[mem.type]}25`,
                  borderLeft: `2px solid ${TYPE_COLORS[mem.type]}`,
                }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="text-[9px] px-1.5 py-0.5 rounded"
                    style={{
                      background: `${TYPE_COLORS[mem.type]}15`,
                      color: TYPE_COLORS[mem.type],
                      fontFamily: 'JetBrains Mono, monospace',
                    }}
                  >
                    {mem.type.toUpperCase()}
                  </span>
                  {mem.emotionalTag && (
                    <span style={{ color: EMOTION_COLORS[mem.emotionalTag] }}>
                      <Heart size={9} />
                    </span>
                  )}
                  <span className="text-[9px] ml-auto" style={{ color: 'oklch(0.35 0.04 220)', fontFamily: 'JetBrains Mono, monospace' }}>{mem.timestamp}</span>
                </div>
                <p className="text-[11px] leading-tight" style={{ color: 'oklch(0.65 0.04 220)' }}>{mem.content}</p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-[9px]" style={{ color: 'oklch(0.35 0.04 220)' }}>Importance:</span>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 10 }, (_, i) => (
                      <div
                        key={i}
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: i < mem.importance ? TYPE_COLORS[mem.type] : 'oklch(0.12 0.02 240)' }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {/* Daily summary */}
          <div className="aurion-panel rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen size={13} style={{ color: 'oklch(0.72 0.18 162)' }} />
              <p className="text-[10px] tracking-widest" style={{ color: 'oklch(0.45 0.04 220)', fontFamily: 'JetBrains Mono, monospace' }}>DAILY SUMMARY</p>
            </div>
            <div
              className="p-3 rounded text-xs leading-relaxed"
              style={{ background: 'oklch(0.07 0.01 240 / 60%)', border: '1px solid oklch(0.72 0.18 162 / 20%)', color: 'oklch(0.65 0.04 220)' }}
            >
              <p className="mb-2"><span style={{ color: 'oklch(0.72 0.18 162)' }}>Today's Summary:</span> 47 events indexed across all modules. Productivity peak at 09:00–12:00. Stress spike during 15:00 meeting — resolved. 1 missed reminder (Dr. Petrov). Smart home auto-adjusted 3 times. No security incidents.</p>
              <p style={{ color: 'oklch(0.45 0.04 220)', fontFamily: 'JetBrains Mono, monospace', fontSize: '10px' }}>Generated: 14:00 · Next: 22:00</p>
            </div>
          </div>

          {/* Emotional tagging */}
          <div className="aurion-panel rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Heart size={13} style={{ color: 'oklch(0.65 0.22 15)' }} />
              <p className="text-[10px] tracking-widest" style={{ color: 'oklch(0.45 0.04 220)', fontFamily: 'JetBrains Mono, monospace' }}>EMOTIONAL TAGGING</p>
            </div>
            {[
              { tag: 'POSITIVE', count: 18, color: 'oklch(0.72 0.18 162)' },
              { tag: 'NEUTRAL', count: 22, color: 'oklch(0.55 0.04 220)' },
              { tag: 'NEGATIVE', count: 5, color: 'oklch(0.65 0.22 15)' },
              { tag: 'CRITICAL', count: 2, color: 'oklch(0.78 0.16 80)' },
            ].map(item => (
              <div key={item.tag} className="flex items-center gap-2 py-1.5" style={{ borderBottom: '1px solid oklch(0.22 0.04 220 / 15%)' }}>
                <div className="w-2 h-2 rounded-full shrink-0" style={{ background: item.color }} />
                <span className="text-[10px]" style={{ color: 'oklch(0.55 0.04 220)', fontFamily: 'JetBrains Mono, monospace' }}>{item.tag}</span>
                <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: 'oklch(0.12 0.02 240)' }}>
                  <div className="h-full rounded-full" style={{ width: `${(item.count / 47) * 100}%`, background: item.color }} />
                </div>
                <span className="text-[10px] shrink-0" style={{ color: item.color, fontFamily: 'JetBrains Mono, monospace' }}>{item.count}</span>
              </div>
            ))}
          </div>

          {/* Knowledge index */}
          <div className="aurion-panel rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Star size={13} style={{ color: 'oklch(0.78 0.16 80)' }} />
              <p className="text-[10px] tracking-widest" style={{ color: 'oklch(0.45 0.04 220)', fontFamily: 'JetBrains Mono, monospace' }}>KNOWLEDGE INDEX</p>
            </div>
            {[
              { label: 'User Preferences', count: 84 },
              { label: 'Behavioral Patterns', count: 63 },
              { label: 'Environmental Data', count: 57 },
              { label: 'Health Records', count: 43 },
            ].map(item => (
              <div key={item.label} className="flex justify-between py-1" style={{ borderBottom: '1px solid oklch(0.22 0.04 220 / 15%)' }}>
                <span className="text-[10px]" style={{ color: 'oklch(0.55 0.04 220)' }}>{item.label}</span>
                <span className="text-[10px]" style={{ color: 'oklch(0.78 0.16 80)', fontFamily: 'JetBrains Mono, monospace' }}>{item.count} entries</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
