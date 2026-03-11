'use client';

import { useEffect } from 'react';
import { cn } from '@/lib/utils';

interface ShineBorderProps {
  children: React.ReactNode;
  className?: string;
  color?: string | string[];
  borderWidth?: number;
  duration?: number;
  borderRadius?: number;
}

// Inject the keyframe once into the document head
function useShineKeyframe() {
  useEffect(() => {
    const styleId = 'shine-border-keyframe';
    if (document.getElementById(styleId)) return;

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      @keyframes shine-rotate {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
  }, []);
}

export function ShineBorder({
  children,
  className,
  color = ['#f97316', '#ef4444', '#dc2626'],
  borderWidth = 2,
  duration = 3,
  borderRadius = 12,
}: ShineBorderProps) {
  useShineKeyframe();

  const gradient = Array.isArray(color)
    ? `conic-gradient(from 0deg, transparent 0%, ${color.join(', ')}, transparent 100%)`
    : color;

  return (
    <div
      className={cn('relative overflow-hidden', className)}
      style={{ borderRadius: `${borderRadius}px` }}
    >
      {/* Shine border */}
      <div
        className="absolute inset-[-2px] z-0"
        style={{
          background: gradient,
          borderRadius: `${borderRadius + 2}px`,
          animation: `shine-rotate ${duration}s linear infinite`,
        }}
      />
      {/* Inner content */}
      <div
        className="relative z-10 h-full w-full bg-white dark:bg-gray-950"
        style={{
          borderRadius: `${borderRadius - 1}px`,
          margin: `${borderWidth}px`,
          width: `calc(100% - ${borderWidth * 2}px)`,
        }}
      >
        {children}
      </div>
    </div>
  );
}
