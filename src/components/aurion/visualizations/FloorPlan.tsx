import { useEffect, useState } from 'react';
import type { SmartHomeDevice } from '@/store/aurionStore';

interface Props {
  devices: SmartHomeDevice[];
}

export default function FloorPlan({ devices }: Props) {
  const [activeRoom, setActiveRoom] = useState<string | null>(null);

  // Simple futuristic floor plan SVG paths
  const rooms = [
    { id: 'living', name: 'Living Room', path: 'M50,50 L250,50 L250,200 L50,200 Z', x: 150, y: 125 },
    { id: 'kitchen', name: 'Kitchen', path: 'M250,50 L400,50 L400,150 L250,150 Z', x: 325, y: 100 },
    { id: 'bedroom', name: 'Bedroom', path: 'M50,200 L200,200 L200,350 L50,350 Z', x: 125, y: 275 },
    { id: 'office', name: 'Office', path: 'M200,200 L350,200 L350,350 L200,350 Z', x: 275, y: 275 },
    { id: 'bath', name: 'Bath', path: 'M350,200 L400,200 L400,300 L350,300 Z', x: 375, y: 250 },
  ];

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <svg width="450" height="400" viewBox="0 0 450 400">
        <defs>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        
        {/* Rooms */}
        {rooms.map(room => {
          const roomDevices = devices.filter(d => d.id.toLowerCase().includes(room.id));
          const isActive = roomDevices.some(d => d.status);
          
          return (
            <g 
              key={room.id} 
              onClick={() => setActiveRoom(room.id)}
              className="cursor-pointer transition-all duration-300"
              style={{ opacity: activeRoom && activeRoom !== room.id ? 0.4 : 1 }}
            >
              <path
                d={room.path}
                fill={isActive ? 'oklch(0.72 0.18 162 / 10%)' : 'oklch(0.09 0.015 240 / 40%)'}
                stroke={isActive ? 'oklch(0.72 0.18 162)' : 'oklch(0.22 0.04 220)'}
                strokeWidth="2"
                filter={isActive ? 'url(#glow)' : ''}
              />
              <text
                x={room.x}
                y={room.y}
                textAnchor="middle"
                fill={isActive ? 'oklch(0.72 0.18 162)' : 'oklch(0.35 0.04 220)'}
                fontSize="10"
                fontFamily="JetBrains Mono, monospace"
                style={{ pointerEvents: 'none' }}
              >
                {room.name.toUpperCase()}
              </text>
            </g>
          );
        })}

        {/* Devices */}
        {devices.map((device, i) => {
          // Map device to room roughly based on ID/Name
          const room = rooms.find(r => device.id.toLowerCase().includes(r.id)) || rooms[0];
          // Random offset within room for demo
          const offsetX = (Math.random() - 0.5) * 40;
          const offsetY = (Math.random() - 0.5) * 40;
          
          const x = room.x + offsetX;
          const y = room.y + offsetY;

          return (
            <circle
              key={device.id}
              cx={x}
              cy={y}
              r={device.type === 'light' ? 4 : 3}
              fill={device.status ? 'oklch(0.78 0.16 80)' : 'oklch(0.22 0.04 220)'}
              stroke="oklch(0.09 0.015 240)"
              strokeWidth="1"
              className="transition-all duration-500"
            >
              <title>{device.name}</title>
            </circle>
          );
        })}
      </svg>
      
      {activeRoom && (
        <div className="absolute bottom-2 right-2 bg-[oklch(0.09_0.015_240_/_90%)] border border-[oklch(0.72_0.18_162_/_30%)] p-2 rounded text-xs">
          <div className="font-bold text-[oklch(0.72_0.18_162)] mb-1">{rooms.find(r => r.id === activeRoom)?.name}</div>
          {devices.filter(d => d.id.toLowerCase().includes(activeRoom)).map(d => (
            <div key={d.id} className="flex justify-between gap-4 text-[9px] text-[oklch(0.65_0.04_220)]">
              <span>{d.name}</span>
              <span className={d.status ? 'text-[oklch(0.78_0.16_80)]' : ''}>{d.status ? 'ON' : 'OFF'}</span>
            </div>
          ))}
          <button 
            onClick={(e) => { e.stopPropagation(); setActiveRoom(null); }}
            className="mt-2 w-full text-center text-[9px] text-[oklch(0.45_0.04_220)] hover:text-white"
          >
            CLOSE
          </button>
        </div>
      )}
    </div>
  );
}
