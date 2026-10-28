import React, { useState } from 'react';
import { 
  CalendarDays, 
  Droplets, 
  Wind, 
  SunMedium, 
  Sunrise, 
  Sunset, 
  MapPin, 
  ChevronRight 
} from 'lucide-react';
import { TempUnit, WeatherData, DailyForecastItem } from '../types/weather';
import { WeatherIcon } from './WeatherIcon';
import { 
  formatLocalDate, 
  formatLocalTime, 
  formatTemperature, 
  formatWindSpeed, 
  getUvIndexInfo 
} from '../utils/weatherUtils';

interface DailyForecastPageProps {
  weather: WeatherData;
  tempUnit: TempUnit;
  isDark: boolean;
}

export const DailyForecastPage: React.FC<DailyForecastPageProps> = ({
  weather,
  tempUnit,
  isDark,
}) => {
  const { daily, city } = weather;
  const [selectedDay, setSelectedDay] = useState<DailyForecastItem>(daily[0] || {} as DailyForecastItem);

  // Compute absolute min and max across all 7 days for relative temperature bars
  const minAll = Math.min(...daily.map((d) => d.temperatureMin));
  const maxAll = Math.max(...daily.map((d) => d.temperatureMax));
  const tempRange = Math.max(1, maxAll - minAll);

  const uvInfo = getUvIndexInfo(selectedDay.uvIndexMax ?? 0);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-sm font-bold uppercase tracking-wider">
            <CalendarDays className="w-4 h-4" />
            <span>7-Day Extended Forecast</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
            Weather Outlook for {city.name}
          </h2>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
          <MapPin className="w-3.5 h-3.5 text-indigo-400" />
          <span>{city.name}, {city.country}</span>
        </div>
      </div>

      {/* Main 7-Day Grid / Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 7 Days List (2 Columns on large screens) */}
        <div className="lg:col-span-2 space-y-3">
          {daily.map((day) => {
            const isSelected = selectedDay.date === day.date;
            // Bar calculation
            const leftPercent = Math.max(0, Math.min(100, ((day.temperatureMin - minAll) / tempRange) * 100));
            const widthPercent = Math.max(12, Math.min(100, ((day.temperatureMax - day.temperatureMin) / tempRange) * 100));

            return (
              <button
                key={day.date}
                type="button"
                onClick={() => setSelectedDay(day)}
                className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group cursor-pointer ${
                  isSelected
                    ? isDark
                      ? 'bg-indigo-950/60 border-indigo-500/60 shadow-lg shadow-indigo-950/40 ring-1 ring-indigo-500/40'
                      : 'bg-indigo-50/90 border-indigo-400 shadow-md ring-1 ring-indigo-400/40'
                    : isDark
                    ? 'glass-card hover:bg-slate-800/60 border-white/5'
                    : 'glass-card-light hover:bg-white border-slate-200'
                }`}
              >
                {/* Day name & date */}
                <div className="flex items-center gap-3 sm:w-44">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center p-2 shrink-0 ${
                      isSelected
                        ? 'bg-indigo-600/30'
                        : isDark
                        ? 'bg-white/5'
                        : 'bg-slate-100'
                    }`}
                  >
                    <WeatherIcon name={day.condition.iconName} className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm sm:text-base leading-tight">
                      {day.dayOfWeek}
                    </h4>
                    <p className="text-xs text-slate-400">
                      {formatLocalDate(day.date, city.timezone)}
                    </p>
                  </div>
                </div>

                {/* Condition label & rain probability */}
                <div className="flex items-center gap-4 sm:w-48">
                  <div className="text-xs text-slate-300 font-medium">
                    {day.condition.label}
                  </div>
                  {day.precipitationProbabilityMax > 0 && (
                    <div className="flex items-center gap-1 text-xs text-sky-400 font-semibold">
                      <Droplets className="w-3.5 h-3.5" />
                      <span>{day.precipitationProbabilityMax}%</span>
                    </div>
                  )}
                </div>

                {/* Min / Max Temp & Graphic Range Bar */}
                <div className="flex items-center gap-3 w-full sm:w-56">
                  <span className="text-xs font-semibold text-slate-400 w-10 text-right">
                    {formatTemperature(day.temperatureMin, tempUnit)}
                  </span>

                  {/* Gradient Temp Range Bar */}
                  <div className="relative flex-1 h-2 bg-slate-700/40 rounded-full overflow-hidden">
                    <div
                      className="absolute top-0 bottom-0 rounded-full bg-gradient-to-r from-sky-400 via-amber-400 to-rose-400"
                      style={{
                        left: `${leftPercent}%`,
                        width: `${widthPercent}%`,
                      }}
                    />
                  </div>

                  <span className="text-xs font-extrabold text-slate-100 dark:text-white w-10">
                    {formatTemperature(day.temperatureMax, tempUnit)}
                  </span>

                  <ChevronRight
                    className={`w-4 h-4 text-slate-400 transition-transform ${
                      isSelected ? 'rotate-90 text-indigo-400' : 'group-hover:translate-x-0.5'
                    }`}
                  />
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Day Deep Dive Card */}
        <div className="lg:col-span-1">
          <div
            className={`sticky top-24 p-6 rounded-3xl border shadow-2xl transition-all ${
              isDark ? 'glass-panel border-white/10' : 'glass-panel-light border-white/70'
            }`}
          >
            <div className="text-center pb-6 border-b border-white/10">
              <span className="text-xs uppercase font-extrabold tracking-wider text-indigo-400">
                Detailed Outlook
              </span>
              <h3 className="text-2xl font-black mt-1">
                {selectedDay.dayOfWeek}
              </h3>
              <p className="text-xs text-slate-400">
                {formatLocalDate(selectedDay.date, city.timezone)}
              </p>

              <div className="my-5 flex flex-col items-center">
                <div className="w-20 h-20 rounded-2xl bg-indigo-600/10 flex items-center justify-center p-3 mb-2">
                  <WeatherIcon name={selectedDay.condition.iconName} className="w-14 h-14" />
                </div>
                <span className="text-lg font-bold">
                  {selectedDay.condition.label}
                </span>
                <div className="mt-2 text-2xl font-extrabold flex items-center gap-2">
                  <span className="text-amber-300">
                    {formatTemperature(selectedDay.temperatureMax, tempUnit)}
                  </span>
                  <span className="text-slate-400 font-normal">/</span>
                  <span className="text-sky-300">
                    {formatTemperature(selectedDay.temperatureMin, tempUnit)}
                  </span>
                </div>
              </div>
            </div>

            {/* Metrics Breakdown for the day */}
            <div className="space-y-4 pt-6">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-slate-400">
                  <Droplets className="w-4 h-4 text-sky-400" />
                  <span>Rain Chance</span>
                </span>
                <span className="font-bold text-sky-400">
                  {selectedDay.precipitationProbabilityMax}%
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-slate-400">
                  <Wind className="w-4 h-4 text-teal-400" />
                  <span>Max Wind</span>
                </span>
                <span className="font-bold">
                  {formatWindSpeed(selectedDay.windSpeedMax, tempUnit)}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-slate-400">
                  <SunMedium className="w-4 h-4 text-amber-400" />
                  <span>Max UV Index</span>
                </span>
                <span className={`font-bold ${uvInfo.color}`}>
                  {selectedDay.uvIndexMax} ({uvInfo.level})
                </span>
              </div>

              {selectedDay.sunrise && (
                <div className="flex items-center justify-between text-sm pt-2 border-t border-white/5">
                  <span className="flex items-center gap-2 text-slate-400">
                    <Sunrise className="w-4 h-4 text-amber-400" />
                    <span>Sunrise</span>
                  </span>
                  <span className="font-semibold font-mono text-xs">
                    {formatLocalTime(selectedDay.sunrise, city.timezone)}
                  </span>
                </div>
              )}

              {selectedDay.sunset && (
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-slate-400">
                    <Sunset className="w-4 h-4 text-indigo-400" />
                    <span>Sunset</span>
                  </span>
                  <span className="font-semibold font-mono text-xs">
                    {formatLocalTime(selectedDay.sunset, city.timezone)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
