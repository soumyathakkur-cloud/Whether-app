import React from 'react';
import { WeatherConditionType } from '../types/weather';

interface WeatherBackgroundProps {
  conditionType?: WeatherConditionType;
  isDark: boolean;
  children: React.ReactNode;
}

export const WeatherBackground: React.FC<WeatherBackgroundProps> = ({
  conditionType = 'partly-cloudy',
  isDark,
  children,
}) => {
  const isRain = conditionType === 'rain' || conditionType === 'heavy-rain' || conditionType === 'drizzle' || conditionType === 'thunderstorm';
  const isSnow = conditionType === 'snow' || conditionType === 'sleet';
  const isSunny = conditionType === 'clear-day';
  const isStorm = conditionType === 'thunderstorm';
  const isNight = conditionType === 'clear-night';

  return (
    <div
      className={`relative min-h-screen w-full transition-colors duration-700 overflow-x-hidden ${
        isDark
          ? 'bg-slate-950 text-slate-100'
          : 'bg-slate-100 text-slate-800'
      }`}
    >
      {/* Dynamic Ambient Background Gradients */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {isDark ? (
          <>
            {/* Deep Cosmic/Atmospheric Base */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(79,70,229,0.25),rgba(255,255,255,0))]" />
            
            {/* Glowing Nebula Orbs matching weather state */}
            <div
              className={`absolute -top-32 -left-32 w-96 h-96 rounded-full blur-[120px] opacity-40 transition-all duration-1000 ${
                isSunny
                  ? 'bg-amber-500/30'
                  : isStorm
                  ? 'bg-purple-600/40'
                  : isRain
                  ? 'bg-blue-600/35'
                  : 'bg-indigo-600/30'
              }`}
            />
            <div
              className={`absolute top-1/4 -right-32 w-96 h-96 rounded-full blur-[140px] opacity-35 transition-all duration-1000 ${
                isStorm
                  ? 'bg-indigo-700/40'
                  : isNight
                  ? 'bg-indigo-900/45'
                  : 'bg-purple-600/25'
              }`}
            />
            <div className="absolute -bottom-24 left-1/3 w-80 h-80 rounded-full blur-[100px] opacity-25 bg-blue-700/30" />
          </>
        ) : (
          <>
            {/* Light Mode Soft Atmospheric Gradients */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-100/90 via-indigo-50/70 to-purple-100/80" />
            <div
              className={`absolute -top-24 -left-24 w-96 h-96 rounded-full blur-[90px] opacity-50 transition-all duration-1000 ${
                isSunny
                  ? 'bg-amber-300/60'
                  : isStorm
                  ? 'bg-indigo-300/60'
                  : 'bg-sky-300/50'
              }`}
            />
            <div className="absolute top-1/3 -right-20 w-80 h-80 rounded-full blur-[100px] opacity-40 bg-purple-200/60" />
            <div className="absolute -bottom-20 left-1/4 w-80 h-80 rounded-full blur-[90px] opacity-35 bg-blue-200/50" />
          </>
        )}

        {/* Rain Particle Effects */}
        {isRain && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
            {Array.from({ length: 32 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-[1.5px] bg-gradient-to-b from-blue-300/0 via-blue-300/60 to-blue-200/90 rounded-full animate-rain"
                style={{
                  height: `${24 + (i % 5) * 12}px`,
                  left: `${(i * 3.1) % 100}%`,
                  top: `-${20 + (i % 6) * 10}px`,
                  animationDuration: `${0.9 + (i % 4) * 0.25}s`,
                  animationDelay: `${(i * 0.12) % 1.5}s`,
                }}
              />
            ))}
          </div>
        )}

        {/* Snow Particle Effects */}
        {isSnow && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-60">
            {Array.from({ length: 28 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-white/80 rounded-full blur-[0.5px] animate-snow"
                style={{
                  left: `${(i * 3.5) % 100}%`,
                  top: `-${15 + (i % 4) * 10}px`,
                  animationDuration: `${3.5 + (i % 5) * 0.8}s`,
                  animationDelay: `${(i * 0.2) % 3}s`,
                }}
              />
            ))}
          </div>
        )}

        {/* Night Stars Subtle Twinkle */}
        {isNight && isDark && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-50">
            {Array.from({ length: 24 }).map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-white animate-pulse"
                style={{
                  width: `${(i % 3) + 1.5}px`,
                  height: `${(i % 3) + 1.5}px`,
                  left: `${(i * 4.3 + 7) % 96}%`,
                  top: `${(i * 3.9 + 5) % 85}%`,
                  animationDuration: `${2 + (i % 3)}s`,
                  animationDelay: `${(i * 0.3) % 2}s`,
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Content wrapper */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {children}
      </div>
    </div>
  );
};
