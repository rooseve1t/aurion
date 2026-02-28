// JarVoice Module — Voice Core
// Wake word, STT simulation, TTS, dialogue memory, intent classification

import { useState, useRef, useEffect } from 'react';
import type { AurionStore } from '@/store/aurionStore';
import { Mic, MicOff, Volume2, Send, Brain, Zap, MessageSquare, Waves } from 'lucide-react';
import { toast } from 'sonner';
import { useI18n } from '@/contexts/I18nContext';
import DecisionTrace from '../visualizations/DecisionTrace';

interface Props { store: AurionStore; }

const QUICK_COMMANDS = [
  'Покажи статус системы', 'Проверь безопасность', 'Отчет о здоровье',
  'Статус умного дома', 'Какие у меня напоминания?', 'Активируй режим защиты',
];

export default function VoiceModule({ store }: Props) {
  const { state, toggleVoice, sendVoiceCommand } = store;
  const { voice } = state;
  const [input, setInput] = useState('');
  const [waveform, setWaveform] = useState<number[]>(Array(32).fill(4));
  const historyRef = useRef<HTMLDivElement>(null);
  const t = useI18n();

  useEffect(() => {
    if (historyRef.current) {
      historyRef.current.scrollTop = historyRef.current.scrollHeight;
    }
  }, [voice.history]);

  useEffect(() => {
    if (!voice.isListening) {
      setWaveform(Array(32).fill(4));
      return;
    }
    const t = setInterval(() => {
      setWaveform(Array(32).fill(0).map(() => Math.random() * 40 + 4));
    }, 80);
    return () => clearInterval(t);
  }, [voice.isListening]);

  const handleSend = () => {
    if (!input.trim()) return;
    sendVoiceCommand(input.trim());
    setInput('');
  };

  const handleVoiceToggle = () => {
    toggleVoice();
    if (!voice.isListening) {
      toast.info('JarVoice слушает...', { duration: 2000 });
      // Simulate voice recognition after 3s
      setTimeout(() => {
        sendVoiceCommand('Покажи статус системы');
        toast.success('JarVoice: Команда распознана', { duration: 2000 });
      }, 3000);
    }
  };

  const INTENT_CLASSES = [
    { label: 'ЗАПРОС', value: 45, color: 'oklch(0.72 0.18 200)' },
    { label: 'КОМАНДА', value: 30, color: 'oklch(0.78 0.16 80)' },
    { label: 'АЛЕРТ', value: 15, color: 'oklch(0.65 0.22 15)' },
    { label: 'СОЦИУМ', value: 10, color: 'oklch(0.72 0.18 162)' },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
          style={{
            background: voice.isListening ? 'oklch(0.78 0.16 80 / 20%)' : 'oklch(0.09 0.015 240)',
            border: `2px solid ${voice.isListening ? 'oklch(0.78 0.16 80)' : 'oklch(0.22 0.04 220 / 40%)'}`,
            boxShadow: voice.isListening ? '0 0 20px oklch(0.78 0.16 80 / 40%)' : 'none',
            animation: voice.isListening ? 'orb-pulse 2s ease-in-out infinite' : 'none',
          }}
        >
          <Mic size={18} style={{ color: voice.isListening ? 'oklch(0.85 0.16 80)' : 'oklch(0.45 0.04 220)' }} />
        </div>
        <div>
          <h2 className="text-lg font-bold tracking-widest" style={{ color: 'oklch(0.85 0.16 80)', fontFamily: 'Space Grotesk, sans-serif', textShadow: '0 0 15px oklch(0.78 0.16 80 / 40%)' }}>
            JARVOICE
          </h2>
          <p className="text-xs" style={{ color: 'oklch(0.45 0.04 220)', fontFamily: 'JetBrains Mono, monospace' }}>
            Нейросетевой голосовой интерфейс · Активно
          </p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <div className="status-dot online" />
          <span className="text-xs" style={{ color: 'oklch(0.72 0.18 162)', fontFamily: 'JetBrains Mono, monospace' }}>ПОТОК СОЗНАНИЯ</span>
        </div>
      </div>

      <div className="hud-divider" />

      <div className="grid grid-cols-3 gap-4">
        {/* Voice interface */}
        <div className="col-span-2 flex flex-col gap-4">
          {/* Waveform + mic button */}
          <div
            className="aurion-panel rounded-lg p-4 flex flex-col items-center gap-4"
            style={{ borderColor: voice.isListening ? 'oklch(0.78 0.16 80 / 40%)' : undefined }}
          >
            {/* Waveform */}
            <div className="flex items-center gap-0.5 h-12 w-full">
              {waveform.map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-full transition-all duration-75"
                  style={{
                    height: `${h}px`,
                    background: voice.isListening
                      ? `oklch(0.78 0.16 80 / ${0.4 + (h / 44) * 0.6})`
                      : 'oklch(0.22 0.04 220 / 40%)',
                    boxShadow: voice.isListening ? `0 0 4px oklch(0.78 0.16 80 / 40%)` : 'none',
                  }}
                />
              ))}
            </div>

            {/* Status text */}
            <p
              className="text-sm font-medium tracking-widest"
              style={{
                color: voice.isListening ? 'oklch(0.85 0.16 80)' : 'oklch(0.45 0.04 220)',
                fontFamily: 'JetBrains Mono, monospace',
              }}
            >
              {voice.isListening ? 'АНАЛИЗ АУДИОПОТОКА...' : voice.isProcessing ? 'ОБРАБОТКА...' : voice.isSpeaking ? 'ГОВОРЮ...' : 'ОЖИДАНИЕ — СКАЖИТЕ "ПРИВЕТ AURION"'}
            </p>

            {/* Mic button */}
            <button
              onClick={handleVoiceToggle}
              className="w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300"
              style={{
                background: voice.isListening ? 'oklch(0.78 0.16 80 / 25%)' : 'oklch(0.12 0.02 240)',
                border: `2px solid ${voice.isListening ? 'oklch(0.78 0.16 80)' : 'oklch(0.22 0.04 220 / 50%)'}`,
                boxShadow: voice.isListening ? '0 0 30px oklch(0.78 0.16 80 / 40%)' : 'none',
              }}
            >
              {voice.isListening
                ? <MicOff size={24} style={{ color: 'oklch(0.85 0.16 80)' }} />
                : <Mic size={24} style={{ color: 'oklch(0.55 0.04 220)' }} />
              }
            </button>

            {/* Quick commands */}
            <div className="flex flex-wrap gap-1.5 justify-center">
              {QUICK_COMMANDS.map(cmd => (
                <button
                  key={cmd}
                  onClick={() => sendVoiceCommand(cmd)}
                  className="px-2.5 py-1 rounded text-[11px] transition-all"
                  style={{
                    background: 'oklch(0.78 0.16 80 / 8%)',
                    border: '1px solid oklch(0.78 0.16 80 / 25%)',
                    color: 'oklch(0.65 0.12 80)',
                  }}
                >
                  {cmd}
                </button>
              ))}
            </div>
          </div>

          {/* Dialogue history */}
          <div className="aurion-panel rounded-lg p-4 flex flex-col" style={{ height: '260px' }}>
            <div className="flex items-center gap-2 mb-3 shrink-0">
              <MessageSquare size={13} style={{ color: 'oklch(0.78 0.16 80)' }} />
              <p className="text-[10px] tracking-widest" style={{ color: 'oklch(0.45 0.04 220)', fontFamily: 'JetBrains Mono, monospace' }}>ИСТОРИЯ ДИАЛОГА</p>
              <div className="ml-auto flex items-center gap-1">
                <Waves size={10} style={{ color: 'oklch(0.55 0.25 290)' }} />
                <span className="text-[9px]" style={{ color: 'oklch(0.55 0.25 290)', fontFamily: 'JetBrains Mono, monospace' }}>КОНТЕКСТ АКТИВЕН</span>
              </div>
            </div>
            <div ref={historyRef} className="flex-1 overflow-y-auto flex flex-col gap-2 pr-1">
              {voice.history.map((msg, i) => (
                <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-[9px] font-bold"
                    style={{
                      background: msg.role === 'jarvoice' ? 'oklch(0.78 0.16 80 / 20%)' : 'oklch(0.72 0.18 200 / 20%)',
                      border: `1px solid ${msg.role === 'jarvoice' ? 'oklch(0.78 0.16 80 / 40%)' : 'oklch(0.72 0.18 200 / 40%)'}`,
                      color: msg.role === 'jarvoice' ? 'oklch(0.78 0.16 80)' : 'oklch(0.72 0.18 200)',
                      fontFamily: 'JetBrains Mono, monospace',
                    }}
                  >
                    {msg.role === 'jarvoice' ? 'JV' : 'U'}
                  </div>
                  <div
                    className="max-w-[80%] px-3 py-2 rounded-lg text-xs leading-relaxed"
                    style={{
                      background: msg.role === 'jarvoice' ? 'oklch(0.78 0.16 80 / 8%)' : 'oklch(0.72 0.18 200 / 8%)',
                      border: `1px solid ${msg.role === 'jarvoice' ? 'oklch(0.78 0.16 80 / 20%)' : 'oklch(0.72 0.18 200 / 20%)'}`,
                      color: 'oklch(0.75 0.04 200)',
                    }}
                  >
                    {msg.text}
                    <span className="block text-[9px] mt-1 opacity-50" style={{ fontFamily: 'JetBrains Mono, monospace' }}>{msg.time}</span>
                  </div>
                </div>
              ))}
            </div>
            {/* Text input */}
            <div className="flex gap-2 mt-3 shrink-0">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Введите команду..."
                className="flex-1 px-3 py-2 rounded text-xs outline-none"
                style={{
                  background: 'oklch(0.07 0.01 240)',
                  border: '1px solid oklch(0.22 0.04 220 / 40%)',
                  color: 'oklch(0.75 0.04 200)',
                  fontFamily: 'JetBrains Mono, monospace',
                }}
              />
              <button
                onClick={handleSend}
                className="px-3 py-2 rounded transition-all btn-glow-gold"
              >
                <Send size={13} />
              </button>
            </div>
          </div>
        </div>

        {/* Right stats */}
        <div className="flex flex-col gap-4">
          {/* Intent classification */}
          <div className="aurion-panel rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Brain size={13} style={{ color: 'oklch(0.55 0.25 290)' }} />
              <p className="text-[10px] tracking-widest" style={{ color: 'oklch(0.45 0.04 220)', fontFamily: 'JetBrains Mono, monospace' }}>КЛАСС НАМЕРЕНИЙ</p>
            </div>
            <div className="flex flex-col gap-2">
              {INTENT_CLASSES.map(ic => (
                <div key={ic.label}>
                  <div className="flex justify-between mb-1">
                    <span className="text-[10px]" style={{ color: 'oklch(0.55 0.04 220)', fontFamily: 'JetBrains Mono, monospace' }}>{ic.label}</span>
                    <span className="text-[10px]" style={{ color: ic.color, fontFamily: 'JetBrains Mono, monospace' }}>{ic.value}%</span>
                  </div>
                  <div className="h-1 rounded-full overflow-hidden" style={{ background: 'oklch(0.12 0.02 240)' }}>
                    <div className="h-full rounded-full" style={{ width: `${ic.value}%`, background: ic.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Decision Trace or Voice Stats */}
          <div className="aurion-panel rounded-lg p-4 min-h-[180px]">
            {state.latestDecisionTrace && state.latestDecisionTrace.length > 0 ? (
              <DecisionTrace trace={state.latestDecisionTrace} />
            ) : (
              <>
                <div className="flex items-center gap-2 mb-3">
                  <Volume2 size={13} style={{ color: 'oklch(0.72 0.18 200)' }} />
                  <p className="text-[10px] tracking-widest" style={{ color: 'oklch(0.45 0.04 220)', fontFamily: 'JetBrains Mono, monospace' }}>СТАТИСТИКА ГОЛОСА</p>
                </div>
                {[
                  { label: 'Команд сегодня', value: '47', color: 'oklch(0.72 0.18 200)' },
                  { label: 'Точность', value: '96%', color: 'oklch(0.72 0.18 162)' },
                  { label: 'Ср. отклик', value: '0.8с', color: 'oklch(0.78 0.16 80)' },
                  { label: 'Самоинициировано', value: '12', color: 'oklch(0.55 0.25 290)' },
                ].map(s => (
                  <div key={s.label} className="flex justify-between py-1.5" style={{ borderBottom: '1px solid oklch(0.22 0.04 220 / 20%)' }}>
                    <span className="text-[11px]" style={{ color: 'oklch(0.55 0.04 220)' }}>{s.label}</span>
                    <span className="text-[11px] font-semibold" style={{ color: s.color, fontFamily: 'JetBrains Mono, monospace' }}>{s.value}</span>
                  </div>
                ))}
              </>
            )}
          </div>

          {/* Self-initiated */}
          <div className="aurion-panel rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Zap size={13} style={{ color: 'oklch(0.78 0.16 80)' }} />
              <p className="text-[10px] tracking-widest" style={{ color: 'oklch(0.45 0.04 220)', fontFamily: 'JetBrains Mono, monospace' }}>САМОИНИЦИИРОВАНО</p>
            </div>
            <div className="flex flex-col gap-1.5">
              {[
                { text: '"Доброе утро, ваша встреча в 9:00 начнется через 15 мин"', time: '08:45' },
                { text: '"Обнаружен стресс — рекомендую перерыв"', time: '14:30' },
                { text: '"Движение у входной двери"', time: '14:22' },
              ].map((item, i) => (
                <div key={i} className="px-2 py-1.5 rounded" style={{ background: 'oklch(0.78 0.16 80 / 6%)', border: '1px solid oklch(0.78 0.16 80 / 15%)' }}>
                  <p className="text-[10px] leading-tight" style={{ color: 'oklch(0.65 0.08 200)' }}>{item.text}</p>
                  <p className="text-[9px] mt-0.5" style={{ color: 'oklch(0.35 0.04 220)', fontFamily: 'JetBrains Mono, monospace' }}>{item.time}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
