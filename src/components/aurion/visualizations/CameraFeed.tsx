import { useEffect, useState, useRef } from 'react';
import { Scan, AlertTriangle, User, Box } from 'lucide-react';

interface DetectedObject {
  id: string;
  label: string;
  confidence: number;
  x: number;
  y: number;
  w: number;
  h: number;
  type: 'person' | 'object' | 'threat';
}

interface Props {
  label: string;
  src: string; // Image URL for the feed background
  active: boolean;
}

export default function CameraFeed({ label, src, active }: Props) {
  const [objects, setObjects] = useState<DetectedObject[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Simulate object detection updates
  useEffect(() => {
    if (!active) return;

    const interval = setInterval(() => {
      // Randomly generate or update objects
      const count = Math.floor(Math.random() * 3); // 0-2 objects
      const newObjects: DetectedObject[] = [];

      for (let i = 0; i < count; i++) {
        newObjects.push({
          id: `obj-${Date.now()}-${i}`,
          label: Math.random() > 0.7 ? 'UNKNOWN' : 'PERSON',
          confidence: 0.85 + Math.random() * 0.14,
          x: 20 + Math.random() * 60, // %
          y: 20 + Math.random() * 60, // %
          w: 10 + Math.random() * 15, // %
          h: 20 + Math.random() * 20, // %
          type: Math.random() > 0.9 ? 'threat' : 'person',
        });
      }
      setObjects(newObjects);
    }, 3000);

    return () => clearInterval(interval);
  }, [active]);

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden bg-black border border-[oklch(0.22_0.04_220_/_40%)] group">
      {/* Feed Image (Simulated) */}
      <img 
        src={src} 
        alt={label} 
        className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-500"
        style={{ filter: 'grayscale(100%) contrast(1.2)' }}
      />
      
      {/* Scanlines Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_2px,3px_100%]" />
      
      {/* HUD Elements */}
      <div className="absolute top-2 left-2 flex items-center gap-2 z-20">
        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
        <span className="text-[10px] font-mono text-red-500 font-bold tracking-widest">REC</span>
        <span className="text-[10px] font-mono text-[oklch(0.65_0.04_220)]">{label}</span>
      </div>

      <div className="absolute bottom-2 right-2 text-[9px] font-mono text-[oklch(0.65_0.04_220)] z-20">
        {new Date().toLocaleTimeString()}
      </div>

      {/* Bounding Boxes */}
      {objects.map(obj => (
        <div
          key={obj.id}
          className="absolute border transition-all duration-500 z-20 flex flex-col"
          style={{
            left: `${obj.x}%`,
            top: `${obj.y}%`,
            width: `${obj.w}%`,
            height: `${obj.h}%`,
            borderColor: obj.type === 'threat' ? 'oklch(0.65 0.22 15)' : 'oklch(0.72 0.18 162)',
            borderWidth: '1px',
            boxShadow: obj.type === 'threat' ? '0 0 10px oklch(0.65 0.22 15 / 50%)' : 'none'
          }}
        >
          {/* Label Tag */}
          <div 
            className="absolute -top-4 left-0 px-1 py-0.5 text-[8px] font-mono font-bold flex items-center gap-1"
            style={{
              background: obj.type === 'threat' ? 'oklch(0.65 0.22 15)' : 'oklch(0.72 0.18 162)',
              color: 'black'
            }}
          >
            {obj.type === 'threat' ? <AlertTriangle size={8} /> : <User size={8} />}
            {obj.label} {(obj.confidence * 100).toFixed(0)}%
          </div>
          
          {/* Corner Markers */}
          <div className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2" style={{ borderColor: 'inherit' }} />
          <div className="absolute -top-1 -right-1 w-2 h-2 border-t-2 border-r-2" style={{ borderColor: 'inherit' }} />
          <div className="absolute -bottom-1 -left-1 w-2 h-2 border-b-2 border-l-2" style={{ borderColor: 'inherit' }} />
          <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2" style={{ borderColor: 'inherit' }} />
        </div>
      ))}

      {/* Center Reticle */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
        <Scan size={48} className="text-[oklch(0.72_0.18_162)]" />
      </div>
    </div>
  );
}
