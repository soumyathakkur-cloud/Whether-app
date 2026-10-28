import React, { useState } from 'react';
import { 
  Clock, 
  Droplets, 
  Wind, 
  Thermometer, 
  Eye, 
  SunMedium, 
  ChevronLeft, 
  ChevronRight,
  MapPin
} from 'lucide-react';
import { TempUnit, WeatherData, HourlyForecastItem } from '../types/weather';
import { WeatherIcon } from './WeatherIcon';
import { 
  formatPressure, 
  formatTemperature, 
  formatVisibility, 
  formatWindSpeed, 
  getUvIndexInfo 
} from '../utils/weatherUtils';

interface HourlyForecastPageProps {
  weather: WeatherData;
  tempUnit: TempUnit;
  isDark: boolean;
}

export const HourlyForecastPage: React.FC<HourlyForecastPageProps> = ({
  weather,
  tempUnit,
  isDark,
}) => {
  const { hourly, city } = weather;
  const [selectedHour, setSelectedHour] = useState<HourlyForecastItem>(hourly[0] || {} as HourlyForecastItem);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  const uvInfo = getUvIndexInfo(selectedHour.uvIndex ?? 0);

  // Find min and max temperature across the 24 hours for precipitation and temp visualization
  const minTemp = Math.min(...hourly.map((h) => h.temperature));
  const maxTemp = Math.max(...hourly.map((h) => h.temperature));
  const tempRange = Math.max(1, maxTemp - minTemp);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 animate-fadeIn">
      {/* Page Header with scroll controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-sm font-bold uppercase tracking-wider">
            <Clock className="w-4 h-4" />
            <span>Hourly Forecast</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
            24-Hour Timeline for {city.name}
          </h2>
        </div>

        {/* Scroll action buttons */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mr-2">
            <MapPin className="w-3.5 h-3.5 text-indigo-400" />
            <span>{city.name}</span>
          </div>
          <button
            onClick={scrollLeft}
            className={`p-2 rounded-xl border transition-colors ${
              isDark ? 'bg-slate-800/80 hover:bg-slate-700 border-white/10' : 'bg-white hover:bg-slate-100 border-slate-200'
            }`}
            aria-label="Scroll hourly backwards"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={scrollRight}
            className={`p-2 rounded-xl border transition-colors ${
              isDark ? 'bg-slate-800/80 hover:bg-slate-700 border-white/10' : 'bg-white hover:bg-slate-100 border-slate-200'
            }`}
            aria-label="Scroll hourly forward"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Scrolling Hourly Cards */}
      <div
        ref={scrollContainerRef}
        className="flex gap-3 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scroll-smooth no-scrollbar"
        tabIndex={0}
        aria-label="Hourly timeline horizontal scroll"
      >
        {hourly.map((item, index) => {
          const isSelected = selectedHour.time === item.time;
          const tempRatio = (item.temperature - minTemp) / tempRange;
          const barHeightPx = Math.round(18 + tempRatio * 32);

          return (
            <button
              key={item.time}
              type="button"
              onClick={() => setSelectedHour(item)}
              className={`shrink-0 w-28 sm:w-32 snap-start p-4 rounded-2xl border text-center flex flex-col items-center justify-between transition-all duration-200 cursor-pointer ${
                isSelected
                  ? isDark
                    ? 'bg-indigo-600/30 border-indigo-400 shadow-lg shadow-indigo-600/30 ring-2 ring-indigo-400/50 scale-[1.02]'
                    : 'bg-indigo-100/90 border-indigo-500 shadow-md ring-2 ring-indigo-500/40 scale-[1.02]'
                  : isDark
                  ? 'glass-card hover:bg-slate-800/60 border-white/5'
                  : 'glass-card-light hover:bg-white border-slate-200'
              }`}
            >
              {/* Time */}
              <div className="text-xs font-bold text-slate-300">
                {item.formattedTime}
              </div>

              {/* Weather Icon */}
              <div className="my-3">
                <WeatherIcon name={item.condition.iconName} className="w-7 h-7" />
              </div>

              {/* Temperature */}
              <div className="text-lg font-black tracking-tight">
                {formatTemperature(item.temperature, tempUnit)}
              </div>

              {/* Dynamic visual indicator pillar */}
              <div className="w-full my-2.5 flex flex-col items-center justify-end h-14">
                <div
                  className="w-2.5 rounded-full bg-gradient-to-t from-indigo-500 to-sky-400 opacity-80"
                  style={{ height: `${barHeightPx}px` }}
                />
              </div>

              {/* Rain Probability Pill */}
              <div className="min-h-5 flex items-center justify-center">
                {item.precipitationProbability > 0 ? (
                  <span className="text-[11px] font-bold text-sky-400 flex items-center gap-0.5">
                    <Droplets className="w-3 h-3" />
                    <span>{item.precipitationProbability}%</span>
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-500 font-medium">0%</span>
                )}
              </div>

              {/* Wind Speed */}
              <div className="text-[10px] text-slate-400 mt-1">
                {formatWindSpeed(item.windSpeed, tempUnit)}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Hour Detailed Inspector */}
      <div
        className={`p-6 sm:p-8 rounded-3xl border shadow-xl transition-all ${
          isDark ? 'glass-panel border-white/10' : 'glass-panel-light border-white/70'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/10 gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 flex items-center justify-center p-2.5">
              <WeatherIcon name={selectedHour.condition?.iconName || 'Sun'} className="w-9 h-9" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-extrabold tracking-wider text-indigo-400">
                  Hour Inspector
                </span>
                <span className="text-xs text-slate-400">·</span>
                <span className="text-xs font-semibold text-slate-300">
                  {selectedHour.formattedTime}
                </span>
              </div>
              <h3 className="text-2xl font-black mt-0.5">
                {selectedHour.condition?.label}
              </h3>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <div className={`text-4xl font-black bg-clip-text text-transparent ${
              isDark
                ? 'bg-gradient-to-r from-white via-indigo-100 to-sky-200'
                : 'bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900'
            }`}>
              {formatTemperature(selectedHour.temperature ?? 0, tempUnit)}
            </div>
            <div className={`text-xs font-semibold mt-0.5 ${isDark ? 'text-indigo-300' : 'text-indigo-600'}`}>
              Feels like {formatTemperature(selectedHour.apparentTemperature ?? 0, tempUnit)}
            </div>
          </div>
        </div>

        {/* 4 Details Grid for the selected hour */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
          <div
            className={`p-4 rounded-2xl border ${
              isDark ? 'glass-card border-white/5' : 'glass-card-light border-slate-200'
            }`}
          >
            <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold mb-1">
              <Droplets className="w-4 h-4 text-sky-400" />
              <span>Rain Probability</span>
            </div>
            <div className="text-xl font-extrabold text-sky-400">
              {selectedHour.precipitationProbability}%
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Volume: {selectedHour.precipitation ?? 0} mm
            </div>
          </div>

          <div
            className={`p-4 rounded-2xl border ${
              isDark ? 'glass-card border-white/5' : 'glass-card-light border-slate-200'
            }`}
          >
            <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold mb-1">
              <Wind className="w-4 h-4 text-teal-400" />
              <span>Wind Speed</span>
            </div>
            <div className="text-xl font-extrabold">
              {formatWindSpeed(selectedHour.windSpeed ?? 0, tempUnit)}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Steady breeze
            </div>
          </div>

          <div
            className={`p-4 rounded-2xl border ${
              isDark ? 'glass-card border-white/5' : 'glass-card-light border-slate-200'
            }`}
          >
            <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold mb-1">
              <SunMedium className="w-4 h-4 text-amber-400" />
              <span>UV Index</span>
            </div>
            <div className="text-xl font-extrabold">
              {selectedHour.uvIndex ?? 0}
            </div>
            <div className={`text-[11px] font-semibold mt-0.5 ${uvInfo.color}`}>
              {uvInfo.level}
            </div>
          </div>

          <div
            className={`p-4 rounded-2xl border ${
              isDark ? 'glass-card border-white/5' : 'glass-card-light border-slate-200'
            }`}
          >
            <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold mb-1">
              <Eye className="w-4 h-4 text-indigo-400" />
              <span>Visibility</span>
            </div>
            <div className="text-xl font-extrabold">
              {formatVisibility(selectedHour.visibility ?? 10000, tempUnit)}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Clear sight
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
