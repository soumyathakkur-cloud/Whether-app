import React from 'react';
import { AlertCircle, CloudRain, ShieldAlert, X } from 'lucide-react';
import { WeatherData } from '../types/weather';

interface WeatherAlertProps {
  weather: WeatherData;
  onDismiss: () => void;
  isDismissed: boolean;
  isDark: boolean;
}

export const WeatherAlert: React.FC<WeatherAlertProps> = ({
  weather,
  onDismiss,
  isDismissed,
  isDark,
}) => {
  if (isDismissed) return null;

  const currentPrecip = weather.current.precipitation;
  const isRainingNow = weather.current.condition.isRain;
  const isStorm = weather.current.condition.type === 'thunderstorm';
  const highRainProb = weather.hourly.slice(0, 6).find((h) => h.precipitationProbability >= 65);

  if (!isRainingNow && !isStorm && !highRainProb && currentPrecip <= 0) {
    return null;
  }

  let title = 'Precipitation Advisory';
  let message = 'Rain is expected in your area over the next few hours. Keep an umbrella handy.';
  let icon = <CloudRain className="w-5 h-5 text-sky-400 shrink-0" />;

  if (isStorm) {
    title = 'Severe Weather: Thunderstorm Alert';
    message = 'Thunderstorms detected with possible lightning and heavy gusts. Seek indoor shelter.';
    icon = <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0" />;
  } else if (isRainingNow) {
    title = 'Active Rain Alert';
    message = `Currently experiencing ${weather.current.condition.label.toLowerCase()} in ${weather.city.name}. Roadways may be slippery.`;
    icon = <CloudRain className="w-5 h-5 text-blue-400 shrink-0" />;
  } else if (highRainProb) {
    title = 'Rain Probability Alert';
    message = `${highRainProb.precipitationProbability}% chance of rain around ${highRainProb.formattedTime}. Prepare outdoor plans accordingly.`;
    icon = <AlertCircle className="w-5 h-5 text-indigo-400 shrink-0" />;
  }

  return (
    <div
      className={`w-full max-w-4xl mx-auto mb-6 p-4 rounded-2xl flex items-center justify-between gap-4 border transition-all shadow-lg ${
        isStorm
          ? 'bg-gradient-to-r from-purple-950/80 via-slate-900/80 to-amber-950/60 border-amber-500/30 text-amber-100'
          : isDark
          ? 'bg-gradient-to-r from-blue-950/70 via-indigo-950/60 to-slate-900/80 border-blue-500/30 text-blue-100'
          : 'bg-gradient-to-r from-blue-100/90 via-indigo-50/90 to-sky-100/90 border-blue-300 text-blue-950'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-white/10 backdrop-blur-md">
          {icon}
        </div>
        <div>
          <h4 className="font-bold text-sm tracking-tight">{title}</h4>
          <p className="text-xs opacity-90 mt-0.5">{message}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={onDismiss}
        className="p-1.5 rounded-lg hover:bg-white/10 transition-colors opacity-70 hover:opacity-100 shrink-0"
        aria-label="Dismiss alert"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
