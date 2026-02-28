import React from 'react';
import { motion } from 'framer-motion';

interface DataRingsProps {
  active: boolean;
  color?: string;
  speed?: number;
}

const DataRings: React.FC<DataRingsProps> = ({ active, color = '#00f0ff', speed = 1 }) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {/* Outer Ring */}
      <motion.div
        className="absolute w-[400px] h-[400px] border border-dashed border-opacity-20 rounded-full"
        style={{ borderColor: color }}
        animate={{ rotate: active ? 360 : 0 }}
        transition={{ duration: 20 / speed, repeat: Infinity, ease: "linear" }}
      />

      {/* Middle Ring */}
      <motion.div
        className="absolute w-[300px] h-[300px] border border-opacity-30 rounded-full"
        style={{ borderColor: color }}
        animate={{ rotate: active ? -360 : 0 }}
        transition={{ duration: 15 / speed, repeat: Infinity, ease: "linear" }}
      />

      {/* Inner Ring */}
      <motion.div
        className="absolute w-[200px] h-[200px] border border-dotted border-opacity-40 rounded-full"
        style={{ borderColor: color }}
        animate={{ rotate: active ? 360 : 0 }}
        transition={{ duration: 10 / speed, repeat: Infinity, ease: "linear" }}
      />

      {/* Data Points (Simulated) */}
      {active && (
        <>
          <motion.div
            className="absolute w-2 h-2 bg-white rounded-full"
            style={{ top: '20%', left: '50%' }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
          />
          <motion.div
            className="absolute w-2 h-2 bg-white rounded-full"
            style={{ bottom: '30%', right: '30%' }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 3, repeat: Infinity, delay: 1 }}
          />
        </>
      )}
    </div>
  );
};

export default DataRings;
