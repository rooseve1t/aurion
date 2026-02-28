// Multimedia Core Module
// Media player, content library, streaming, AI recommendations

import { useState } from 'react';
import type { AurionStore } from '@/store/aurionStore';
import { Music, Play, Pause, SkipForward, SkipBack, Volume2, Film, Image, Radio } from 'lucide-react';
import { toast } from 'sonner';

interface Props { store: AurionStore; }

const TRACKS = [
  { title: 'Interstellar Main Theme', artist: 'Hans Zimmer', duration: '5:42', genre: 'Cinematic' },
  { title: 'Time', artist: 'Hans Zimmer', duration: '4:35', genre: 'Cinematic' },
  { title: 'Daft Punk — Fragments of Time', artist: 'Daft Punk', duration: '4:38', genre: 'Electronic' },
  { title: 'Blade Runner 2049', artist: 'Hans Zimmer & Benjamin Wallfisch', duration: '6:12', genre: 'Cinematic' },
  { title: 'Kavinsky — Nightcall', artist: 'Kavinsky', duration: '4:16', genre: 'Synthwave' },
];

const MEDIA_CATEGORIES = [
  { label: 'Music', icon: Music, count: 847, color: 'oklch(0.72 0.18 200)' },
  { label: 'Movies', icon: Film, count: 124, color: 'oklch(0.55 0.25 290)' },
  { label: 'Photos', icon: Image, count: 3241, color: 'oklch(0.72 0.18 162)' },
  { label: 'Podcasts', icon: Radio, count: 38, color: 'oklch(0.78 0.16 80)' },
];

export default function MultimediaModule({ store }: Props) {
  const [playing, setPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [volume, setVolume] = useState(70);

  return (
    <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
          style={{ background: 'oklch(0.72 0.18 200 / 15%)', border: '2px solid oklch(0.72 0.18 200 / 50%)', boxShadow: '0 0 20px oklch(0.72 0.18 200 / 30%)' }}
        >
          <Music size={18} style={{ color: 'oklch(0.78 0.18 200)' }} />
        </div>
        <div>
          <h2 className="text-lg font-bold tracking-widest" style={{ color: 'oklch(0.78 0.18 200)', fontFamily: 'Space Grotesk, sans-serif' }}>
            MULTIMEDIA CORE
          </h2>
          <p className="text-xs" style={{ color: 'oklch(0.45 0.04 220)', fontFamily: 'JetBrains Mono, monospace' }}>
            Music · Video · Photos · Podcasts · AI Recommendations
          </p>
        </div>
      </div>

      <div className="hud-divider" />

      <div className="grid grid-cols-3 gap-4">
        {/* Player */}
        <div className="col-span-2 flex flex-col gap-4">
          {/* Now playing */}
          <div
            className="aurion-panel rounded-lg p-5"
            style={{ borderColor: playing ? 'oklch(0.72 0.18 200 / 40%)' : undefined }}
          >
            <p className="text-[10px] tracking-widest mb-4" style={{ color: 'oklch(0.45 0.04 220)', fontFamily: 'JetBrains Mono, monospace' }}>NOW PLAYING</p>
            <div className="flex items-center gap-4 mb-4">
              {/* Album art placeholder */}
              <div
                className="w-16 h-16 rounded-lg flex items-center justify-center shrink-0"
                style={{
                  background: `linear-gradient(135deg, oklch(0.12 0.04 240) 0%, oklch(0.08 0.03 260) 100%)`,
                  border: '1px solid oklch(0.72 0.18 200 / 30%)',
                  boxShadow: playing ? '0 0 20px oklch(0.72 0.18 200 / 25%)' : 'none',
                  animation: playing ? 'orb-pulse 3s ease-in-out infinite' : 'none',
                }}
              >
                <Music size={24} style={{ color: 'oklch(0.72 0.18 200 / 60%)' }} />
              </div>
              <div>
                <p className="text-base font-semibold mb-1" style={{ color: 'oklch(0.85 0.04 200)', fontFamily: 'Space Grotesk, sans-serif' }}>
                  {TRACKS[currentTrack].title}
                </p>
                <p className="text-xs mb-1" style={{ color: 'oklch(0.55 0.04 220)' }}>{TRACKS[currentTrack].artist}</p>
                <span
                  className="text-[9px] px-1.5 py-0.5 rounded"
                  style={{ background: 'oklch(0.72 0.18 200 / 10%)', color: 'oklch(0.72 0.18 200)', fontFamily: 'JetBrains Mono, monospace' }}
                >
                  {TRACKS[currentTrack].genre}
                </span>
              </div>
              <div className="ml-auto text-right">
                <p className="text-xs" style={{ color: 'oklch(0.45 0.04 220)', fontFamily: 'JetBrains Mono, monospace' }}>{TRACKS[currentTrack].duration}</p>
              </div>
            </div>

            {/* Progress bar */}
            <div className="h-1 rounded-full overflow-hidden mb-4" style={{ background: 'oklch(0.12 0.02 240)' }}>
              <div
                className="h-full rounded-full transition-all"
                style={{ width: playing ? '35%' : '0%', background: 'oklch(0.72 0.18 200)', boxShadow: '0 0 6px oklch(0.72 0.18 200 / 50%)', transition: 'width 0.5s' }}
              />
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => setCurrentTrack(t => Math.max(0, t - 1))}
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all"
                style={{ background: 'oklch(0.09 0.015 240)', border: '1px solid oklch(0.22 0.04 220 / 40%)', color: 'oklch(0.55 0.04 220)' }}
              >
                <SkipBack size={16} />
              </button>
              <button
                onClick={() => setPlaying(p => !p)}
                className="w-14 h-14 rounded-full flex items-center justify-center transition-all"
                style={{
                  background: playing ? 'oklch(0.72 0.18 200 / 20%)' : 'oklch(0.72 0.18 200 / 10%)',
                  border: `2px solid ${playing ? 'oklch(0.72 0.18 200)' : 'oklch(0.72 0.18 200 / 40%)'}`,
                  color: 'oklch(0.78 0.18 200)',
                  boxShadow: playing ? '0 0 20px oklch(0.72 0.18 200 / 30%)' : 'none',
                }}
              >
                {playing ? <Pause size={20} /> : <Play size={20} />}
              </button>
              <button
                onClick={() => setCurrentTrack(t => Math.min(TRACKS.length - 1, t + 1))}
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all"
                style={{ background: 'oklch(0.09 0.015 240)', border: '1px solid oklch(0.22 0.04 220 / 40%)', color: 'oklch(0.55 0.04 220)' }}
              >
                <SkipForward size={16} />
              </button>
            </div>

            {/* Volume */}
            <div className="flex items-center gap-3 mt-4">
              <Volume2 size={13} style={{ color: 'oklch(0.45 0.04 220)' }} />
              <input
                type="range"
                min={0}
                max={100}
                value={volume}
                onChange={e => setVolume(Number(e.target.value))}
                className="flex-1 h-1 rounded-full appearance-none cursor-pointer"
                style={{ background: `linear-gradient(90deg, oklch(0.72 0.18 200) ${volume}%, oklch(0.12 0.02 240) ${volume}%)` }}
              />
              <span className="text-[10px] w-8 text-right" style={{ color: 'oklch(0.45 0.04 220)', fontFamily: 'JetBrains Mono, monospace' }}>{volume}%</span>
            </div>
          </div>

          {/* Playlist */}
          <div className="aurion-panel rounded-lg p-4">
            <p className="text-[10px] tracking-widest mb-3" style={{ color: 'oklch(0.45 0.04 220)', fontFamily: 'JetBrains Mono, monospace' }}>QUEUE</p>
            <div className="flex flex-col gap-1">
              {TRACKS.map((track, i) => (
                <button
                  key={i}
                  onClick={() => { setCurrentTrack(i); setPlaying(true); }}
                  className="flex items-center gap-3 px-3 py-2 rounded text-left transition-all"
                  style={{
                    background: i === currentTrack ? 'oklch(0.72 0.18 200 / 10%)' : 'transparent',
                    border: `1px solid ${i === currentTrack ? 'oklch(0.72 0.18 200 / 30%)' : 'transparent'}`,
                  }}
                >
                  <span className="text-[10px] w-4 text-center shrink-0" style={{ color: i === currentTrack ? 'oklch(0.72 0.18 200)' : 'oklch(0.35 0.04 220)', fontFamily: 'JetBrains Mono, monospace' }}>
                    {i === currentTrack && playing ? '▶' : i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs truncate" style={{ color: i === currentTrack ? 'oklch(0.85 0.04 200)' : 'oklch(0.65 0.04 220)' }}>{track.title}</p>
                    <p className="text-[9px]" style={{ color: 'oklch(0.35 0.04 220)' }}>{track.artist}</p>
                  </div>
                  <span className="text-[10px] shrink-0" style={{ color: 'oklch(0.35 0.04 220)', fontFamily: 'JetBrains Mono, monospace' }}>{track.duration}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Library + AI picks */}
        <div className="flex flex-col gap-4">
          {/* Categories */}
          <div className="aurion-panel rounded-lg p-4">
            <p className="text-[10px] tracking-widest mb-3" style={{ color: 'oklch(0.45 0.04 220)', fontFamily: 'JetBrains Mono, monospace' }}>LIBRARY</p>
            <div className="grid grid-cols-2 gap-2">
              {MEDIA_CATEGORIES.map(cat => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.label}
                    onClick={() => toast.info(`Opening ${cat.label} library`, { duration: 1500 })}
                    className="flex flex-col items-center gap-2 py-3 rounded transition-all"
                    style={{ background: `${cat.color}08`, border: `1px solid ${cat.color}20` }}
                  >
                    <Icon size={18} style={{ color: cat.color }} />
                    <span className="text-[10px] font-medium" style={{ color: cat.color, fontFamily: 'JetBrains Mono, monospace' }}>{cat.label}</span>
                    <span className="text-[9px]" style={{ color: 'oklch(0.35 0.04 220)' }}>{cat.count.toLocaleString()}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* AI recommendations */}
          <div className="aurion-panel rounded-lg p-4">
            <p className="text-[10px] tracking-widest mb-3" style={{ color: 'oklch(0.45 0.04 220)', fontFamily: 'JetBrains Mono, monospace' }}>AI PICKS FOR YOU</p>
            <div className="flex flex-col gap-2">
              {[
                { title: 'Tron: Legacy OST', reason: 'Matches current mood', color: 'oklch(0.72 0.18 200)' },
                { title: 'Ambient Focus Mix', reason: 'Work session detected', color: 'oklch(0.72 0.18 162)' },
                { title: 'Synthwave Essentials', reason: 'Based on history', color: 'oklch(0.55 0.25 290)' },
              ].map((rec, i) => (
                <button
                  key={i}
                  onClick={() => toast.success(`Playing: ${rec.title}`, { duration: 2000 })}
                  className="flex items-center gap-2 p-2 rounded text-left transition-all"
                  style={{ background: `${rec.color}06`, border: `1px solid ${rec.color}20` }}
                >
                  <Play size={12} style={{ color: rec.color, flexShrink: 0 }} />
                  <div>
                    <p className="text-[11px]" style={{ color: 'oklch(0.65 0.04 220)' }}>{rec.title}</p>
                    <p className="text-[9px]" style={{ color: 'oklch(0.35 0.04 220)' }}>{rec.reason}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
