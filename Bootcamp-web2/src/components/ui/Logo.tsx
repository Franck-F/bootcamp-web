import React from 'react';
import { Zap } from 'lucide-react';

interface LogoProps {
  className?: string;
  showText?: boolean;
  variant?: 'default' | 'white' | 'dark';
}

export function Logo({ className = '', showText = true, variant = 'default' }: LogoProps) {
  const textColor = variant === 'white' ? 'text-white' : 
                   variant === 'dark' ? 'text-gray-900' : 'text-gray-900';
  
  const iconColor = variant === 'white' ? 'text-white' : 'text-black';

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className={`${iconColor} relative`}>
        <Zap className="h-8 w-8" fill="currentColor" />
        <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full blur-sm opacity-30"></div>
      </div>
      {showText && (
        <span className={`text-2xl font-bold ${textColor} tracking-tight`}>
          Stride<span className="text-black">Style</span>
        </span>
      )}
    </div>
  );
}