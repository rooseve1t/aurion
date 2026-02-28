import React from 'react';
import { motion } from 'framer-motion';

interface CoreOrbProps {
  state: 'idle' | 'listening' | 'thinking' | 'speaking' | 'error';
  audioLevel?: number; // 0 to 1
}

const CoreOrb: React.FC<CoreOrbProps> = ({ state, audioLevel = 0 }) => {
  const getColors = () => {
    switch (state) {
      case 'listening': return ['#00f0ff', '#00aaff']; // Cyan
      case 'thinking': return ['#7000ff', '#aa00ff']; // Purple
      case 'speaking': return ['#00ffaa', '#00ff00']; // Green/Emerald
      case 'error': return ['#ff0055', '#ff0000']; // Red
      case 'idle':
      default: return ['#00f0ff', '#0055ff']; // Blue/Cyan
    }
  };

  const [primaryColor, secondaryColor] = getColors();

  return (
    <div className="relative flex items-center justify-center w-64 h-64">
      {/* Outer Glow */}
      <motion.div
        className="absolute w-full h-full rounded-full opacity-20 blur-3xl"
        animate={{
          scale: state === 'speaking' ? 1 + audioLevel * 0.5 : [1, 1.1, 1],
          backgroundColor: primaryColor,
        }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Core Orb */}
      <motion.div
        className="relative w-32 h-32 rounded-full backdrop-blur-md"
        style={{
          background: `radial-gradient(circle at 30% 30%, ${primaryColor}, ${secondaryColor})`,
          boxShadow: `0 0 30px ${primaryColor}80, inset 0 0 20px ${secondaryColor}`
        }}
        animate={{
          scale: state === 'listening' ? 1.1 : state === 'thinking' ? [1, 0.9, 1] : 1,
          rotate: state === 'thinking' ? 360 : 0,
        }}
        transition={{
          rotate: { duration: 2, repeat: Infinity, ease: "linear" },
          scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
        }}
      >
        {/* Inner Core Detail */}
        <div className="absolute inset-0 rounded-full border border-white/20 opacity-50" />
        <div className="absolute inset-2 rounded-full border border-white/10 opacity-30" />
      </motion.div>

      {/* Particles (Optional) */}
      {state === 'thinking' && (
        <motion.div
          className="absolute w-40 h-40 border border-dashed border-white/20 rounded-full"
          animate={{ rotate: -360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />
      )}
    </div>
  );
};

export default CoreOrb;
