import React from 'react';
import { CatState } from '../types';

interface StatsBarProps {
  stats: CatState;
}

const Stat: React.FC<{ label: string; value: number; color: string }> = ({ label, value, color }) => (
  <div className="flex flex-col w-full gap-1">
    <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-gray-400">
      <span>{label}</span>
      <span>{Math.round(value)}%</span>
    </div>
    <div className="h-3 w-full bg-gray-800 rounded-full overflow-hidden border border-gray-700">
      <div 
        className={`h-full transition-all duration-500 ${color}`} 
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  </div>
);

const StatsBar: React.FC<StatsBarProps> = ({ stats }) => {
  return (
    <div className="flex flex-row gap-4 w-full max-w-md px-4 py-2 bg-gray-900/50 rounded-xl backdrop-blur-sm">
      <Stat label="Hunger" value={stats.hunger} color="bg-green-500" />
      <Stat label="Joy" value={stats.happiness} color="bg-yellow-500" />
      <Stat label="Energy" value={stats.energy} color="bg-blue-500" />
    </div>
  );
};

export default StatsBar;
