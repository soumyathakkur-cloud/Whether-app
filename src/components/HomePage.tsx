import React from 'react';
import { 
  Heart, 
  Droplets, 
  Wind, 
  Gauge, 
  SunMedium, 
  ArrowRight, 
  CalendarDays, 
  Clock, 
  MapPin, 
  Compass
} from 'lucide-react';
import { PageId, TempUnit, WeatherData } from '../types/weather';
import { WeatherIcon } from './WeatherIcon';
import { 
  formatLocalDate, 
  formatLocalTime, 
  formatPressure, 
  formatTemperature, 
  formatWindSpeed, 
  getUvIndexInfo, 
  getWindDirectionLabel 
} from '../utils/weatherUtils';

interface HomePageProps {
  weather: WeatherData;
  tempUnit: TempUnit;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onNavigate: (page: PageId) => void;
  isDark: boolean;
}

export const HomePage: React.FC<HomePageProps> = ({
  weather,
  tempUnit,
  isFavorite,
  onToggleFavorite,
  onNavigate,
  isDark,
}) => {
  const { current, daily, hourly, city } = weather;
  const todayDaily = daily[0];
  const uvInfo = getUvIndexInfo(todayDaily?.uvIndexMax ?? 2);
  const windDirLabel = getWindDirectionLabel(current.windDirection);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-fadeIn">
      {/* Primary Hero Weather Card */}
      <div
        className={`relative overflow-hidden rounded-3xl p-6 sm:p-8 md:p-10 transition-all duration-300 shadow-2xl border ${
          isDark
            ? 'glass-panel shadow-indigo-950/40 border-white/10'
            : 'glass-panel-light shadow-indigo-200/50 border-white/70'
        }`}
      >
        {/* Subtle background glow circle behind hero */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/10 blur-3xl pointer-events-none" />

        {/* Top Header: City info + Live Date & Time + Favorite Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-indigo-400" />
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                {city.name}
              </h2>
              <span className="text-sm font-semibold opacity-75">
                {city.admin1 ? `${city.admin1}, ` : ''}{city.country}
              </span>
            </div>

            <div className="flex items-center gap-3 mt-1.5 text-xs sm:text-sm text-slate-400 font-medium">
              <span>{formatLocalDate(new Date(), city.timezone)}</span>
              <span>·</span>
              <span className="flex items-center gap-1 text-indigo-300 font-mono">
                <Clock className="w-3.5 h-3.5" />
                {formatLocalTime(new Date(), city.timezone)}
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={onToggleFavorite}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all border ${
                isFavorite
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 hover:bg-rose-500/30 shadow-sm'
                  : isDark
                  ? 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border-white/10'
                  : 'bg-white/80 hover:bg-white text-slate-700 border-slate-300'
              }`}
              title={isFavorite ? 'Remove from Favourite Cities' : 'Save to Favourite Cities'}
              aria-label={isFavorite ? 'Remove from Favourite Cities' : 'Save to Favourite Cities'}
            >
              <Heart
                className={`w-4 h-4 ${
                  isFavorite ? 'fill-rose-500 text-rose-500 animate-pulse' : 'text-slate-400'
                }`}
              />
              <span>{isFavorite ? 'Saved to Favourites' : 'Add to Favourites'}</span>
            </button>
          </div>
        </div>

        {/* Center: Hero Temperature + Condition + Large Weather Icon */}
        <div className="py-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <div className="flex items-baseline gap-4">
              <span className={`text-6xl sm:text-7xl md:text-8xl font-black tracking-tighter bg-clip-text text-transparent ${
                isDark
                  ? 'bg-gradient-to-br from-white via-slate-100 to-indigo-200'
                  : 'bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-900'
              }`}>
                {formatTemperature(current.temperature, tempUnit)}
              </span>
              <div className="space-y-1">
                <div className={`text-sm sm:text-base font-bold ${isDark ? 'text-indigo-300' : 'text-indigo-600'}`}>
                  Feels like {formatTemperature(current.apparentTemperature, tempUnit)}
                </div>
                {todayDaily && (
                  <div className={`text-xs sm:text-sm font-medium flex items-center gap-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    <span className={isDark ? 'text-amber-300' : 'text-amber-600 font-bold'}>H: {formatTemperature(todayDaily.temperatureMax, tempUnit)}</span>
                    <span>·</span>
                    <span className={isDark ? 'text-sky-300' : 'text-sky-600 font-bold'}>L: {formatTemperature(todayDaily.temperatureMin, tempUnit)}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <WeatherIcon name={current.condition.iconName} className="w-8 h-8" />
              <span className="text-xl sm:text-2xl font-bold tracking-tight">
                {current.condition.label}
              </span>
            </div>

            <p className={`text-sm max-w-md leading-relaxed ${isDark ? 'text-slate-300/80' : 'text-slate-600'}`}>
              Today in {city.name}: Expect high temperatures reaching {todayDaily ? formatTemperature(todayDaily.temperatureMax, tempUnit) : 'mild levels'} with wind around {formatWindSpeed(current.windSpeed, tempUnit)}.
            </p>
          </div>

          {/* Decorative Weather Visual Badge */}
          <div className="flex justify-center md:justify-end">
            <div className={`relative group p-6 rounded-3xl border backdrop-blur-md shadow-inner flex flex-col items-center justify-center text-center w-full max-w-xs ${
              isDark
                ? 'bg-gradient-to-tr from-white/5 to-white/10 border-white/10'
                : 'bg-white/70 border-white/80 shadow-slate-200/50'
            }`}>
              <div className="w-28 h-28 flex items-center justify-center relative">
                <div className="absolute inset-0 bg-indigo-500/20 blur-2xl rounded-full" />
                <WeatherIcon name={current.condition.iconName} className="w-24 h-24" />
              </div>
              <span className={`mt-3 font-bold text-sm tracking-wide ${isDark ? 'text-indigo-200' : 'text-indigo-900'}`}>
                Current Condition
              </span>
              <span className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Updated moments ago
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Hero Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-6 border-t border-white/10">
          {/* Humidity */}
          <div
            className={`p-3.5 sm:p-4 rounded-2xl border transition-all ${
              isDark ? 'glass-card border-white/5' : 'glass-card-light border-slate-200'
            }`}
          >
            <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold mb-1">
              <Droplets className="w-4 h-4 text-sky-400" />
              <span>Humidity</span>
            </div>
            <div className="text-xl sm:text-2xl font-extrabold">{current.relativeHumidity}%</div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              {current.relativeHumidity > 70 ? 'High moisture' : 'Comfortable'}
            </div>
          </div>

          {/* Wind Speed */}
          <div
            className={`p-3.5 sm:p-4 rounded-2xl border transition-all ${
              isDark ? 'glass-card border-white/5' : 'glass-card-light border-slate-200'
            }`}
          >
            <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold mb-1">
              <Wind className="w-4 h-4 text-teal-400" />
              <span>Wind Speed</span>
            </div>
            <div className="text-xl sm:text-2xl font-extrabold">
              {formatWindSpeed(current.windSpeed, tempUnit)}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
              <Compass className="w-3 h-3 text-indigo-400" />
              <span>{windDirLabel} ({current.windDirection}°)</span>
            </div>
          </div>

          {/* Atmospheric Pressure */}
          <div
            className={`p-3.5 sm:p-4 rounded-2xl border transition-all ${
              isDark ? 'glass-card border-white/5' : 'glass-card-light border-slate-200'
            }`}
          >
            <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold mb-1">
              <Gauge className="w-4 h-4 text-purple-400" />
              <span>Pressure</span>
            </div>
            <div className="text-xl sm:text-2xl font-extrabold">
              {formatPressure(current.surfacePressure, tempUnit)}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              {current.surfacePressure >= 1013 ? 'High pressure' : 'Normal / Low'}
            </div>
          </div>

          {/* UV Index */}
          <div
            className={`p-3.5 sm:p-4 rounded-2xl border transition-all ${
              isDark ? 'glass-card border-white/5' : 'glass-card-light border-slate-200'
            }`}
          >
            <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold mb-1">
              <SunMedium className="w-4 h-4 text-amber-400" />
              <span>UV Index</span>
            </div>
            <div className="text-xl sm:text-2xl font-extrabold">
              {todayDaily?.uvIndexMax ?? 0}
            </div>
            <div className={`text-[11px] font-semibold mt-0.5 ${uvInfo.color}`}>
              {uvInfo.level}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Previews Row (Hourly Snapshot & 7-Day Preview) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Hours Preview */}
        <div
          className={`p-6 rounded-3xl border transition-all shadow-xl ${
            isDark ? 'glass-panel border-white/10' : 'glass-panel-light border-white/70'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-400" />
              <h3 className="font-bold text-base tracking-tight">Next Hours</h3>
            </div>
            <button
              onClick={() => onNavigate('hourly')}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              <span>View 24h</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
            {hourly.slice(0, 5).map((item, idx) => (
              <div
                key={item.time}
                className={`p-3 rounded-2xl text-center flex flex-col items-center justify-between border ${
                  idx === 0
                    ? 'bg-indigo-600/20 border-indigo-500/40'
                    : isDark
                    ? 'bg-slate-800/40 border-white/5'
                    : 'bg-white/60 border-slate-200'
                }`}
              >
                <span className="text-xs font-semibold text-slate-400">
                  {item.formattedTime}
                </span>
                <div className="my-2">
                  <WeatherIcon name={item.condition.iconName} className="w-6 h-6" />
                </div>
                <span className="text-sm font-bold">
                  {formatTemperature(item.temperature, tempUnit)}
                </span>
                {item.precipitationProbability > 0 && (
                  <span className="text-[10px] text-sky-400 font-semibold mt-0.5">
                    {item.precipitationProbability}%
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 7-Day Quick Outlook Preview */}
        <div
          className={`p-6 rounded-3xl border transition-all shadow-xl ${
            isDark ? 'glass-panel border-white/10' : 'glass-panel-light border-white/70'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-purple-400" />
              <h3 className="font-bold text-base tracking-tight">Weekly Outlook</h3>
            </div>
            <button
              onClick={() => onNavigate('forecast')}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              <span>View 7 Days</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {daily.slice(0, 4).map((day) => (
              <div
                key={day.date}
                className={`p-2.5 px-3.5 rounded-2xl flex items-center justify-between border ${
                  isDark ? 'bg-slate-800/40 border-white/5' : 'bg-white/60 border-slate-200'
                }`}
              >
                <div className="flex items-center gap-3 w-28">
                  <span className="text-xs font-bold text-slate-300">
                    {day.dayOfWeek}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <WeatherIcon name={day.condition.iconName} className="w-5 h-5" />
                  <span className="text-xs text-slate-400 hidden sm:inline truncate max-w-[120px]">
                    {day.condition.label}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs font-bold">
                  <span className="text-slate-200">
                    {formatTemperature(day.temperatureMax, tempUnit)}
                  </span>
                  <span className="text-slate-400 font-normal">
                    {formatTemperature(day.temperatureMin, tempUnit)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
