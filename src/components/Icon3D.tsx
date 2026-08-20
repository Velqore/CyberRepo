import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface Icon3DProps {
  icon: LucideIcon;
  color?: 'cyan' | 'emerald' | 'purple' | 'amber' | 'blue' | 'rose' | 'slate';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  animate?: boolean;
}

const sizeConfig = {
  sm: { box: 'w-8 h-8 rounded-lg', icon: 'w-4 h-4', glow: 'blur-sm' },
  md: { box: 'w-11 h-11 rounded-xl', icon: 'w-5 h-5', glow: 'blur-md' },
  lg: { box: 'w-14 h-14 rounded-2xl', icon: 'w-7 h-7', glow: 'blur-lg' },
  xl: { box: 'w-20 h-20 rounded-3xl', icon: 'w-10 h-10', glow: 'blur-xl' },
};

const colorConfig = {
  cyan: {
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/40',
    text: 'text-cyan-400',
    glowBg: 'from-cyan-500/40 to-blue-500/40',
    shadow: 'shadow-[0_0_20px_rgba(34,211,238,0.3)]',
  },
  emerald: {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/40',
    text: 'text-emerald-400',
    glowBg: 'from-emerald-500/40 to-teal-500/40',
    shadow: 'shadow-[0_0_20px_rgba(16,185,129,0.3)]',
  },
  purple: {
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/40',
    text: 'text-purple-400',
    glowBg: 'from-purple-500/40 to-pink-500/40',
    shadow: 'shadow-[0_0_20px_rgba(168,85,247,0.3)]',
  },
  amber: {
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/40',
    text: 'text-amber-400',
    glowBg: 'from-amber-500/40 to-orange-500/40',
    shadow: 'shadow-[0_0_20px_rgba(245,158,11,0.3)]',
  },
  blue: {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/40',
    text: 'text-blue-400',
    glowBg: 'from-blue-500/40 to-indigo-500/40',
    shadow: 'shadow-[0_0_20px_rgba(59,130,246,0.3)]',
  },
  rose: {
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/40',
    text: 'text-rose-400',
    glowBg: 'from-rose-500/40 to-red-500/40',
    shadow: 'shadow-[0_0_20px_rgba(244,63,94,0.3)]',
  },
  slate: {
    bg: 'bg-slate-800/40',
    border: 'border-slate-700/60',
    text: 'text-slate-300',
    glowBg: 'from-slate-700/30 to-slate-800/30',
    shadow: 'shadow-[0_0_15px_rgba(148,163,184,0.15)]',
  },
};

export const Icon3D: React.FC<Icon3DProps> = ({
  icon: Icon,
  color = 'cyan',
  size = 'md',
  className = '',
  animate = true,
}) => {
  const s = sizeConfig[size];
  const c = colorConfig[color];

  return (
    <div className={`relative inline-flex items-center justify-center preserve-3d group ${className}`}>
      {/* 3D Pulsing Underglow */}
      <div
        className={`absolute inset-0 rounded-2xl bg-gradient-to-tr ${c.glowBg} opacity-50 ${s.glow} group-hover:opacity-100 transition-opacity duration-300 ${
          animate ? 'animate-pulse-slow' : ''
        }`}
        style={{ transform: 'translateZ(-10px)' }}
      />

      {/* Floating 3D Main Icon Container */}
      <div
        className={`relative ${s.box} ${c.bg} border ${c.border} flex items-center justify-center backdrop-blur-md ${c.shadow} icon-box-3d transition-transform duration-300 group-hover:scale-105`}
        style={{ transform: 'translateZ(15px)' }}
      >
        {/* Inner subtle specular light gradient */}
        <div className="absolute inset-0 rounded-[inherit] bg-gradient-to-b from-white/15 to-transparent pointer-events-none" />

        {/* Lucide Icon with 3D drop-shadow */}
        <Icon
          className={`${s.icon} ${c.text} transition-transform duration-300 group-hover:scale-110 drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] ${
            animate ? 'animate-float-slow' : ''
          }`}
        />
      </div>
    </div>
  );
};
