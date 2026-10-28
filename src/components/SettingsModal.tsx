import React, { useState } from 'react';
import { 
  X, 
  Settings, 
  Key, 
  Database, 
  RefreshCw, 
  Trash2, 
  Check, 
  ShieldCheck, 
  Thermometer, 
  Moon, 
  Sun 
} from 'lucide-react';
import { TempUnit } from '../types/weather';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  tempUnit: TempUnit;
  onToggleTempUnit: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
  onResetFavorites: () => void;
  isDarkTheme: boolean;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  tempUnit,
  onToggleTempUnit,
  isDark,
  onToggleTheme,
  onResetFavorites,
  isDarkTheme,
}) => {
  const [openWeatherKey, setOpenWeatherKey] = useState(() => {
    return localStorage.getItem('weathernow_openweather_key') || '';
  });
  const [keySaved, setKeySaved] = useState(false);

  if (!isOpen) return null;

  const handleSaveKey = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('weathernow_openweather_key', openWeatherKey.trim());
    setKeySaved(true);
    setTimeout(() => setKeySaved(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
      <div
        className={`w-full max-w-lg rounded-3xl p-6 sm:p-8 border shadow-2xl transition-all relative ${
          isDarkTheme ? 'glass-panel border-white/10 text-white' : 'glass-panel-light border-slate-200 text-slate-800'
        }`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Close settings"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
          <Settings className="w-4 h-4" />
          <span>Application Settings</span>
        </div>
        <h3 className="text-2xl font-black tracking-tight mb-6">
          Preferences & Data Source
        </h3>

        <div className="space-y-6">
          {/* Unit Setting */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div>
              <div className="text-sm font-bold flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-indigo-400" />
                <span>Temperature Units</span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Switch between Celsius (°C, km/h) and Fahrenheit (°F, mph)
              </p>
            </div>
            <button
              onClick={onToggleTempUnit}
              className="px-4 py-2 rounded-xl font-extrabold text-xs tracking-wider bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md shadow-indigo-600/20"
            >
              Current: °{tempUnit}
            </button>
          </div>

          {/* Theme Setting */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div>
              <div className="text-sm font-bold flex items-center gap-2">
                {isDark ? <Moon className="w-4 h-4 text-indigo-400" /> : <Sun className="w-4 h-4 text-amber-400" />}
                <span>Interface Theme</span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Toggle between dark nebula night mode and frosted daylight mode
              </p>
            </div>
            <button
              onClick={onToggleTheme}
              className="px-4 py-2 rounded-xl font-bold text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 transition-all flex items-center gap-1.5"
            >
              {isDark ? <Moon className="w-3.5 h-3.5 text-indigo-300" /> : <Sun className="w-3.5 h-3.5 text-amber-300" />}
              <span>{isDark ? 'Dark Mode' : 'Light Mode'}</span>
            </button>
          </div>

          {/* Weather API Key Section */}
          <div className="pb-4 border-b border-white/10 space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold">
              <Key className="w-4 h-4 text-amber-400" />
              <span>Weather API Key (Optional)</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              By default, WeatherNow uses high-precision <strong>Open-Meteo</strong> with zero key required. If you have an OpenWeather API key, you can enter it below.
            </p>

            <form onSubmit={handleSaveKey} className="flex gap-2">
              <input
                type="password"
                value={openWeatherKey}
                onChange={(e) => setOpenWeatherKey(e.target.value)}
                placeholder="Enter OpenWeather API Key..."
                className={`flex-1 px-3.5 py-2 rounded-xl text-xs outline-none transition-all ${
                  isDarkTheme
                    ? 'bg-slate-800 border border-white/10 text-white placeholder-slate-500 focus:border-indigo-400'
                    : 'bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:border-indigo-500'
                }`}
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1 shrink-0"
              >
                {keySaved ? <Check className="w-4 h-4 text-emerald-300" /> : null}
                <span>{keySaved ? 'Saved' : 'Save Key'}</span>
              </button>
            </form>
          </div>

          {/* Reset Saved Data */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-bold flex items-center gap-2 text-rose-300">
                <Trash2 className="w-4 h-4 text-rose-400" />
                <span>Clear Favourites Cache</span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Erase saved cities and recent search history from localStorage
              </p>
            </div>
            <button
              onClick={() => {
                if (window.confirm('Reset all saved cities and preferences?')) {
                  onResetFavorites();
                  onClose();
                }
              }}
              className="px-3.5 py-2 rounded-xl font-bold text-xs bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 transition-all"
            >
              Reset Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
