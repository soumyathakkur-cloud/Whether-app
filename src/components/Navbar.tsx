import React from 'react';
import { 
  CloudSun, 
  Home, 
  CalendarDays, 
  Clock, 
  SlidersHorizontal, 
  Heart, 
  Info, 
  Sun, 
  Moon, 
  Settings 
} from 'lucide-react';
import { PageId, TempUnit } from '../types/weather';

interface NavbarProps {
  currentPage: PageId;
  onSelectPage: (page: PageId) => void;
  tempUnit: TempUnit;
  onToggleTempUnit: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
  favoritesCount: number;
  onOpenSettings: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onSelectPage,
  tempUnit,
  onToggleTempUnit,
  isDark,
  onToggleTheme,
  favoritesCount,
  onOpenSettings,
}) => {
  const navItems: { id: PageId; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'home', label: 'Home', icon: <Home className="w-4 h-4" /> },
    { id: 'forecast', label: '7-Day Forecast', icon: <CalendarDays className="w-4 h-4" /> },
    { id: 'hourly', label: 'Hourly', icon: <Clock className="w-4 h-4" /> },
    { id: 'details', label: 'Details', icon: <SlidersHorizontal className="w-4 h-4" /> },
    { id: 'favorites', label: 'Favourites', icon: <Heart className="w-4 h-4" />, badge: favoritesCount },
    { id: 'about', label: 'About Us', icon: <Info className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 w-full px-4 sm:px-6 lg:px-8 pt-4 pb-2">
      <div
        className={`max-w-7xl mx-auto rounded-2xl transition-all duration-300 px-4 py-3 sm:px-6 flex items-center justify-between gap-4 shadow-xl ${
          isDark
            ? 'glass-panel shadow-black/20'
            : 'glass-panel-light shadow-indigo-100/50'
        }`}
      >
        {/* Brand Logo */}
        <button
          onClick={() => onSelectPage('home')}
          className="flex items-center gap-3 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-xl"
          aria-label="WeatherNow Home"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-sky-400 p-0.5 shadow-md shadow-indigo-500/25 flex items-center justify-center group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-900/40 rounded-[10px] flex items-center justify-center backdrop-blur-sm">
              <CloudSun className="w-6 h-6 text-amber-300 drop-shadow-[0_0_8px_rgba(252,211,77,0.6)]" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-300 bg-clip-text text-transparent">
                WeatherNow
              </span>
              <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-widest text-indigo-400/80 px-1.5 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20">
                Live
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
              Smart Weather Forecast
            </p>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-800/30 dark:bg-slate-900/40 p-1 rounded-xl border border-white/5">
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectPage(item.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all relative ${
                  isActive
                    ? isDark
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                    : isDark
                    ? 'text-slate-300 hover:text-white hover:bg-white/5'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-indigo-500/20 text-indigo-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Quick Action Controls */}
        <div className="flex items-center gap-2">
          {/* Unit Switcher (°C / °F) */}
          <button
            onClick={onToggleTempUnit}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs tracking-wider transition-all border flex items-center gap-1 ${
              isDark
                ? 'bg-slate-800/70 border-white/10 text-slate-200 hover:border-indigo-400 hover:text-white'
                : 'bg-white/80 border-slate-300/80 text-slate-700 hover:border-indigo-500 hover:text-indigo-600'
            }`}
            title="Toggle Temperature Unit (°C / °F)"
            aria-label="Toggle Temperature Unit"
          >
            <span className={tempUnit === 'C' ? 'text-indigo-400 font-extrabold' : 'opacity-60'}>°C</span>
            <span className="opacity-40">/</span>
            <span className={tempUnit === 'F' ? 'text-indigo-400 font-extrabold' : 'opacity-60'}>°F</span>
          </button>

          {/* Theme Switcher (Light / Dark) */}
          <button
            onClick={onToggleTheme}
            className={`p-2 rounded-xl border transition-all ${
              isDark
                ? 'bg-slate-800/70 border-white/10 text-amber-300 hover:bg-slate-700'
                : 'bg-white/80 border-slate-300/80 text-indigo-600 hover:bg-slate-50'
            }`}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle Light / Dark Mode"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Settings / API Modal Trigger */}
          <button
            onClick={onOpenSettings}
            className={`p-2 rounded-xl border transition-all ${
              isDark
                ? 'bg-slate-800/70 border-white/10 text-slate-300 hover:text-white hover:bg-slate-700'
                : 'bg-white/80 border-slate-300/80 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
            title="Settings & Data Sources"
            aria-label="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile Horizontal Navigation Bar */}
      <div className="lg:hidden mt-2 overflow-x-auto pb-1 no-scrollbar">
        <div className="flex items-center gap-1.5 min-w-max px-1">
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectPage(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                  isActive
                    ? 'bg-indigo-600 border-indigo-500 text-white shadow-sm shadow-indigo-600/40'
                    : isDark
                    ? 'bg-slate-900/60 border-white/10 text-slate-300 hover:bg-slate-800'
                    : 'bg-white/80 border-slate-200 text-slate-700 hover:bg-white'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`ml-1 px-1.5 py-0.2 rounded-full text-[9px] font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-indigo-500/20 text-indigo-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
