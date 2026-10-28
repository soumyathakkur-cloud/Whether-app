import React from 'react';
import { 
  SlidersHorizontal, 
  Droplets, 
  Wind, 
  Compass, 
  Eye, 
  Gauge, 
  SunMedium, 
  Sunrise, 
  Sunset, 
  Activity, 
  MapPin, 
  Clock 
} from 'lucide-react';
import { TempUnit, WeatherData } from '../types/weather';
import { 
  formatPressure, 
  formatTemperature, 
  formatVisibility, 
  formatWindSpeed, 
  formatLocalTime, 
  getUvIndexInfo, 
  getWindDirectionLabel 
} from '../utils/weatherUtils';

interface WeatherDetailsPageProps {
  weather: WeatherData;
  tempUnit: TempUnit;
  isDark: boolean;
}

export const WeatherDetailsPage: React.FC<WeatherDetailsPageProps> = ({
  weather,
  tempUnit,
  isDark,
}) => {
  const { current, daily, airQuality, city } = weather;
  const todayDaily = daily[0];
  const uvInfo = getUvIndexInfo(todayDaily?.uvIndexMax ?? 2);
  const windDirLabel = getWindDirectionLabel(current.windDirection);

  // Approximate dew point using Magnus-Tetens formula: Td ≈ T - ((100 - RH)/5)
  const dewPointC = current.temperature - ((100 - current.relativeHumidity) / 5);

  // Calculate daylight duration if sunrise and sunset exist
  let daylightStr = '12h 00m';
  if (todayDaily?.sunrise && todayDaily?.sunset) {
    const rise = new Date(todayDaily.sunrise).getTime();
    const set = new Date(todayDaily.sunset).getTime();
    if (!isNaN(rise) && !isNaN(set) && set > rise) {
      const diffMs = set - rise;
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      daylightStr = `${hours}h ${mins}m`;
    }
  }

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-sm font-bold uppercase tracking-wider">
            <SlidersHorizontal className="w-4 h-4" />
            <span>Atmospheric Diagnostics</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
            Weather Details for {city.name}
          </h2>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
          <MapPin className="w-3.5 h-3.5 text-indigo-400" />
          <span>{city.name}, {city.country}</span>
        </div>
      </div>

      {/* Grid of Weather Details Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 1. Humidity & Dew Point */}
        <div
          className={`p-6 rounded-3xl border shadow-xl flex flex-col justify-between transition-all ${
            isDark ? 'glass-panel border-white/10' : 'glass-panel-light border-white/70'
          }`}
        >
          <div>
            <div className="flex items-center justify-between text-slate-400 mb-3">
              <span className="text-xs uppercase font-extrabold tracking-wider flex items-center gap-2">
                <Droplets className="w-4 h-4 text-sky-400" />
                <span>Humidity</span>
              </span>
              <span className="text-xs font-semibold">{current.relativeHumidity}%</span>
            </div>

            <div className="text-4xl font-black mt-2">
              {current.relativeHumidity}%
            </div>

            <div className="mt-4 w-full bg-slate-700/30 rounded-full h-2.5 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-sky-400 to-blue-500 rounded-full transition-all duration-500"
                style={{ width: `${current.relativeHumidity}%` }}
              />
            </div>

            <p className={`text-xs mt-4 leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Dew point is calculated at {formatTemperature(dewPointC, tempUnit)}.
              {current.relativeHumidity > 65
                ? ' High moisture content; air feels humid.'
                : ' Dry and comfortable ambient air levels.'}
            </p>
          </div>

          <div className="pt-4 mt-4 border-t border-white/5 flex justify-between text-xs text-slate-400">
            <span>Dew Point</span>
            <span className="font-semibold text-slate-200">
              {formatTemperature(dewPointC, tempUnit)}
            </span>
          </div>
        </div>

        {/* 2. Wind & Compass Heading */}
        <div
          className={`p-6 rounded-3xl border shadow-xl flex flex-col justify-between transition-all ${
            isDark ? 'glass-panel border-white/10' : 'glass-panel-light border-white/70'
          }`}
        >
          <div>
            <div className="flex items-center justify-between text-slate-400 mb-3">
              <span className="text-xs uppercase font-extrabold tracking-wider flex items-center gap-2">
                <Wind className="w-4 h-4 text-teal-400" />
                <span>Wind & Gusts</span>
              </span>
              <span className="text-xs font-semibold">{windDirLabel}</span>
            </div>

            <div className="flex items-center justify-between gap-4 mt-2">
              <div>
                <div className="text-4xl font-black">
                  {formatWindSpeed(current.windSpeed, tempUnit)}
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  Gusts up to {formatWindSpeed(current.windGusts, tempUnit)}
                </div>
              </div>

              {/* Graphical Compass Rose */}
              <div className="relative w-16 h-16 rounded-full border border-white/20 bg-slate-800/40 flex items-center justify-center shrink-0">
                <span className="absolute top-1 text-[9px] font-black text-slate-400">N</span>
                <span className="absolute right-1 text-[9px] font-black text-slate-400">E</span>
                <span className="absolute bottom-1 text-[9px] font-black text-slate-400">S</span>
                <span className="absolute left-1 text-[9px] font-black text-slate-400">W</span>
                
                {/* Pointer Arrow */}
                <div
                  className="w-8 h-8 flex items-center justify-center transition-transform duration-700"
                  style={{ transform: `rotate(${current.windDirection}deg)` }}
                >
                  <Compass className="w-6 h-6 text-indigo-400" />
                </div>
              </div>
            </div>

            <p className={`text-xs mt-4 leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Blowing from {windDirLabel} ({current.windDirection}°). Wind resistance is moderate.
            </p>
          </div>

          <div className="pt-4 mt-4 border-t border-white/5 flex justify-between text-xs text-slate-400">
            <span>Peak Gusts</span>
            <span className="font-semibold text-slate-200">
              {formatWindSpeed(current.windGusts, tempUnit)}
            </span>
          </div>
        </div>

        {/* 3. Atmospheric Pressure */}
        <div
          className={`p-6 rounded-3xl border shadow-xl flex flex-col justify-between transition-all ${
            isDark ? 'glass-panel border-white/10' : 'glass-panel-light border-white/70'
          }`}
        >
          <div>
            <div className="flex items-center justify-between text-slate-400 mb-3">
              <span className="text-xs uppercase font-extrabold tracking-wider flex items-center gap-2">
                <Gauge className="w-4 h-4 text-purple-400" />
                <span>Atmospheric Pressure</span>
              </span>
              <span className="text-xs font-semibold">Sea Level</span>
            </div>

            <div className="text-4xl font-black mt-2">
              {formatPressure(current.surfacePressure, tempUnit)}
            </div>

            <div className="mt-4 flex items-center gap-2">
              <span className="text-xs font-semibold text-indigo-300">
                {current.surfacePressure >= 1013 ? 'High Pressure System' : 'Low Pressure System'}
              </span>
            </div>

            <p className="text-xs text-slate-300 mt-3 leading-relaxed">
              {current.surfacePressure >= 1013
                ? 'High pressure indicates stable, calm atmospheric conditions with lower likelihood of sudden squalls.'
                : 'Lower atmospheric pressure may encourage cloud formation and precipitation fronts.'}
            </p>
          </div>

          <div className="pt-4 mt-4 border-t border-white/5 flex justify-between text-xs text-slate-400">
            <span>Standard Baseline</span>
            <span className="font-semibold text-slate-200">1013 hPa / 29.92 inHg</span>
          </div>
        </div>

        {/* 4. UV Index & Sun Protection */}
        <div
          className={`p-6 rounded-3xl border shadow-xl flex flex-col justify-between transition-all ${
            isDark ? 'glass-panel border-white/10' : 'glass-panel-light border-white/70'
          }`}
        >
          <div>
            <div className="flex items-center justify-between text-slate-400 mb-3">
              <span className="text-xs uppercase font-extrabold tracking-wider flex items-center gap-2">
                <SunMedium className="w-4 h-4 text-amber-400" />
                <span>UV Radiation</span>
              </span>
              <span className={`text-xs font-extrabold ${uvInfo.color}`}>{uvInfo.level}</span>
            </div>

            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-4xl font-black">
                {todayDaily?.uvIndexMax ?? 0}
              </span>
              <span className="text-xs text-slate-400 font-semibold">/ 11+ scale</span>
            </div>

            {/* Gauge bar with segmented colors */}
            <div className="mt-4 w-full bg-slate-700/30 rounded-full h-2.5 overflow-hidden flex">
              <div className="w-1/5 bg-emerald-400" />
              <div className="w-1/5 bg-amber-400" />
              <div className="w-1/5 bg-orange-400" />
              <div className="w-1/5 bg-rose-500" />
              <div className="w-1/5 bg-purple-500" />
            </div>

            <p className={`text-xs mt-4 leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              {uvInfo.advice}
            </p>
          </div>

          <div className="pt-4 mt-4 border-t border-white/5 flex justify-between text-xs text-slate-400">
            <span>Peak Time</span>
            <span className="font-semibold text-slate-200">11:00 AM – 3:00 PM</span>
          </div>
        </div>

        {/* 5. Sunrise & Sunset Solar Arc */}
        <div
          className={`p-6 rounded-3xl border shadow-xl flex flex-col justify-between transition-all ${
            isDark ? 'glass-panel border-white/10' : 'glass-panel-light border-white/70'
          }`}
        >
          <div>
            <div className="flex items-center justify-between text-slate-400 mb-3">
              <span className="text-xs uppercase font-extrabold tracking-wider flex items-center gap-2">
                <Sunrise className="w-4 h-4 text-amber-400" />
                <span>Solar Cycle</span>
              </span>
              <span className="text-xs font-semibold text-indigo-300">{daylightStr} Sun</span>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4 text-center">
              <div
                className={`p-3 rounded-2xl border ${
                  isDark ? 'bg-slate-800/40 border-white/5' : 'bg-white/60 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-center gap-1.5 text-xs text-amber-300 font-semibold mb-1">
                  <Sunrise className="w-3.5 h-3.5" />
                  <span>Sunrise</span>
                </div>
                <div className="text-lg font-black font-mono">
                  {todayDaily?.sunrise ? formatLocalTime(todayDaily.sunrise, city.timezone) : '--:--'}
                </div>
              </div>

              <div
                className={`p-3 rounded-2xl border ${
                  isDark ? 'bg-slate-800/40 border-white/5' : 'bg-white/60 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-center gap-1.5 text-xs text-indigo-300 font-semibold mb-1">
                  <Sunset className="w-3.5 h-3.5" />
                  <span>Sunset</span>
                </div>
                <div className="text-lg font-black font-mono">
                  {todayDaily?.sunset ? formatLocalTime(todayDaily.sunset, city.timezone) : '--:--'}
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-300 mt-4 leading-relaxed">
              Total daylight duration today is approx {daylightStr}. Local solar noon occurs near 1:00 PM.
            </p>
          </div>

          <div className="pt-4 mt-4 border-t border-white/5 flex justify-between text-xs text-slate-400">
            <span>Daylight</span>
            <span className="font-semibold text-slate-200">{daylightStr}</span>
          </div>
        </div>

        {/* 6. Visibility & Air Quality */}
        <div
          className={`p-6 rounded-3xl border shadow-xl flex flex-col justify-between transition-all ${
            isDark ? 'glass-panel border-white/10' : 'glass-panel-light border-white/70'
          }`}
        >
          <div>
            <div className="flex items-center justify-between text-slate-400 mb-3">
              <span className="text-xs uppercase font-extrabold tracking-wider flex items-center gap-2">
                <Eye className="w-4 h-4 text-sky-400" />
                <span>Visibility & Air</span>
              </span>
              <span className="text-xs font-semibold text-emerald-400">
                {airQuality ? airQuality.status : 'Good'}
              </span>
            </div>

            <div className="flex items-baseline gap-4 mt-2">
              <div>
                <span className="text-4xl font-black">
                  {formatVisibility(10000, tempUnit)}
                </span>
                <div className="text-xs text-slate-400 mt-0.5">Atmospheric clarity</div>
              </div>

              {airQuality && (
                <div className="pl-4 border-l border-white/10">
                  <span className="text-2xl font-black text-indigo-300">
                    AQI {airQuality.europeanAqi}
                  </span>
                  <div className="text-xs text-slate-400 mt-0.5">Air Quality Index</div>
                </div>
              )}
            </div>

            {airQuality ? (
              <div className="grid grid-cols-2 gap-2 mt-4 text-[11px] text-slate-300">
                <div className="p-2 rounded-xl bg-white/5 border border-white/5">
                  PM2.5: <span className="font-bold text-white">{airQuality.pm2_5} µg/m³</span>
                </div>
                <div className="p-2 rounded-xl bg-white/5 border border-white/5">
                  PM10: <span className="font-bold text-white">{airQuality.pm10} µg/m³</span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-300 mt-4 leading-relaxed">
                Clear horizontal visibility with no significant fog or aerosol interference.
              </p>
            )}
          </div>

          <div className="pt-4 mt-4 border-t border-white/5 flex justify-between text-xs text-slate-400">
            <span>Status</span>
            <span className="font-semibold text-emerald-400">Excellent Range</span>
          </div>
        </div>
      </div>
    </div>
  );
};
