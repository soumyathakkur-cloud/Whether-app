import React from 'react';
import { CloudSun, Heart } from 'lucide-react';
import { PageId } from '../types/weather';

interface FooterProps {
  onNavigate: (page: PageId) => void;
  isDark: boolean;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, isDark }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full mt-auto pt-12 pb-8 px-4 sm:px-6 lg:px-8 border-t border-white/10 z-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-400">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-sky-400 flex items-center justify-center text-amber-300">
            <CloudSun className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-sm tracking-tight text-slate-200">
              WeatherNow
            </span>
            <p className="text-[11px] text-slate-400">
              Smart Weather Forecast & Meteorological Analytics
            </p>
          </div>
        </div>

        {/* Navigation Quick Links */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 font-medium">
          <button
            onClick={() => onNavigate('home')}
            className="hover:text-indigo-400 transition-colors"
          >
            Home
          </button>
          <button
            onClick={() => onNavigate('forecast')}
            className="hover:text-indigo-400 transition-colors"
          >
            7-Day Forecast
          </button>
          <button
            onClick={() => onNavigate('hourly')}
            className="hover:text-indigo-400 transition-colors"
          >
            Hourly
          </button>
          <button
            onClick={() => onNavigate('details')}
            className="hover:text-indigo-400 transition-colors"
          >
            Weather Details
          </button>
          <button
            onClick={() => onNavigate('favorites')}
            className="hover:text-indigo-400 transition-colors"
          >
            Saved Cities
          </button>
          <button
            onClick={() => onNavigate('about')}
            className="hover:text-indigo-400 transition-colors"
          >
            About & Contact
          </button>
        </div>

        {/* Data Attribution & Copyright */}
        <div className="text-center md:text-right space-y-0.5">
          <p>© {currentYear} WeatherNow. All rights reserved.</p>
          <p className="text-[10px] text-slate-400">
            Live meteorological data via Open-Meteo & WMO models.
          </p>
        </div>
      </div>
    </footer>
  );
};
