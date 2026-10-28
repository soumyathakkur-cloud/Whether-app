import { TempUnit, WeatherConditionInfo, WeatherConditionType } from '../types/weather';

/**
 * Maps WMO Weather interpretation codes (WW) from Open-Meteo & WMO standard
 * to user-friendly conditions, labels, and color gradients.
 */
export function getWeatherCondition(code: number, isDay: boolean = true): WeatherConditionInfo {
  // Clear sky
  if (code === 0) {
    if (isDay) {
      return {
        type: 'clear-day',
        label: 'Clear Sky',
        iconName: 'Sun',
        isRain: false,
        bgGradientDark: 'from-blue-900 via-indigo-950 to-slate-950',
        bgGradientLight: 'from-sky-400 via-blue-200 to-indigo-100',
      };
    } else {
      return {
        type: 'clear-night',
        label: 'Clear Sky',
        iconName: 'Moon',
        isRain: false,
        bgGradientDark: 'from-slate-950 via-indigo-950 to-slate-900',
        bgGradientLight: 'from-indigo-300 via-blue-200 to-slate-100',
      };
    }
  }

  // Mainly clear, partly cloudy
  if (code === 1 || code === 2) {
    return {
      type: 'partly-cloudy',
      label: code === 1 ? 'Mainly Clear' : 'Partly Cloudy',
      iconName: isDay ? 'CloudSun' : 'CloudMoon',
      isRain: false,
      bgGradientDark: 'from-blue-950 via-slate-900 to-indigo-950',
      bgGradientLight: 'from-sky-300 via-blue-100 to-indigo-50',
    };
  }

  // Overcast
  if (code === 3) {
    return {
      type: 'overcast',
      label: 'Overcast',
      iconName: 'Cloud',
      isRain: false,
      bgGradientDark: 'from-slate-900 via-slate-800 to-zinc-900',
      bgGradientLight: 'from-slate-300 via-slate-200 to-indigo-100',
    };
  }

  // Fog & depositing rime fog
  if (code === 45 || code === 48) {
    return {
      type: 'fog',
      label: code === 48 ? 'Depositing Rime Fog' : 'Foggy',
      iconName: 'CloudFog',
      isRain: false,
      bgGradientDark: 'from-slate-900 via-zinc-800 to-slate-950',
      bgGradientLight: 'from-slate-300 via-zinc-200 to-slate-100',
    };
  }

  // Drizzle: light, moderate, dense
  if (code >= 51 && code <= 57) {
    return {
      type: 'drizzle',
      label: code >= 55 ? 'Dense Drizzle' : 'Light Drizzle',
      iconName: 'CloudDrizzle',
      isRain: true,
      bgGradientDark: 'from-blue-950 via-slate-900 to-cyan-950',
      bgGradientLight: 'from-blue-300 via-sky-200 to-slate-100',
    };
  }

  // Rain: slight, moderate, heavy
  if (code >= 61 && code <= 67) {
    const isHeavy = code === 65 || code === 67;
    return {
      type: isHeavy ? 'heavy-rain' : 'rain',
      label: isHeavy ? 'Heavy Rain' : (code === 61 ? 'Slight Rain' : 'Moderate Rain'),
      iconName: 'CloudRain',
      isRain: true,
      bgGradientDark: 'from-blue-950 via-indigo-950 to-slate-950',
      bgGradientLight: 'from-blue-400 via-indigo-200 to-slate-200',
    };
  }

  // Snow fall: slight, moderate, heavy
  if (code >= 71 && code <= 77) {
    return {
      type: 'snow',
      label: code === 71 ? 'Slight Snow' : (code === 75 ? 'Heavy Snow' : 'Moderate Snow'),
      iconName: 'Snowflake',
      isRain: false,
      bgGradientDark: 'from-indigo-950 via-slate-900 to-blue-950',
      bgGradientLight: 'from-indigo-100 via-blue-50 to-white',
    };
  }

  // Rain showers
  if (code >= 80 && code <= 82) {
    return {
      type: code === 82 ? 'heavy-rain' : 'rain',
      label: code === 82 ? 'Violent Rain Showers' : 'Rain Showers',
      iconName: 'CloudRain',
      isRain: true,
      bgGradientDark: 'from-slate-900 via-blue-950 to-indigo-950',
      bgGradientLight: 'from-blue-300 via-sky-200 to-slate-100',
    };
  }

  // Snow showers
  if (code === 85 || code === 86) {
    return {
      type: 'snow',
      label: code === 86 ? 'Heavy Snow Showers' : 'Snow Showers',
      iconName: 'Snowflake',
      isRain: false,
      bgGradientDark: 'from-slate-900 via-indigo-950 to-slate-950',
      bgGradientLight: 'from-indigo-200 via-slate-100 to-blue-100',
    };
  }

  // Thunderstorm
  if (code >= 95 && code <= 99) {
    return {
      type: 'thunderstorm',
      label: code >= 96 ? 'Thunderstorm with Hail' : 'Thunderstorm',
      iconName: 'CloudLightning',
      isRain: true,
      bgGradientDark: 'from-purple-950 via-slate-950 to-indigo-950',
      bgGradientLight: 'from-indigo-400 via-purple-200 to-slate-200',
    };
  }

  // Default fallback
  return {
    type: 'partly-cloudy',
    label: 'Partly Cloudy',
    iconName: 'CloudSun',
    isRain: false,
    bgGradientDark: 'from-blue-950 via-slate-900 to-indigo-950',
    bgGradientLight: 'from-sky-300 via-blue-100 to-indigo-50',
  };
}

/**
 * Temperature conversion from Celsius to Fahrenheit
 */
export function celsiusToFahrenheit(c: number): number {
  return (c * 9) / 5 + 32;
}

/**
 * Temperature conversion from Fahrenheit to Celsius
 */
export function fahrenheitToCelsius(f: number): number {
  return ((f - 32) * 5) / 9;
}

/**
 * Formats a temperature in Celsius to target unit string
 */
export function formatTemperature(celsius: number, unit: TempUnit = 'C', showUnit: boolean = true): string {
  const temp = unit === 'F' ? celsiusToFahrenheit(celsius) : celsius;
  const rounded = Math.round(temp);
  return showUnit ? `${rounded}°${unit}` : `${rounded}°`;
}

/**
 * Converts wind speed from km/h to mph if unit is Fahrenheit, or keeps km/h
 */
export function formatWindSpeed(kmh: number, unit: TempUnit = 'C'): string {
  if (unit === 'F') {
    const mph = Math.round(kmh * 0.621371);
    return `${mph} mph`;
  }
  return `${Math.round(kmh)} km/h`;
}

/**
 * Converts wind direction in degrees (0-360) to cardinal direction
 */
export function getWindDirectionLabel(degrees: number): string {
  const directions = [
    'N', 'NNE', 'NE', 'ENE', 
    'E', 'ESE', 'SE', 'SSE', 
    'S', 'SSW', 'SW', 'WSW', 
    'W', 'WNW', 'NW', 'NNW'
  ];
  const normalized = ((degrees % 360) + 360) % 360;
  const index = Math.round(normalized / 22.5) % 16;
  return directions[index];
}

/**
 * Evaluates UV Index level and health recommendation
 */
export function getUvIndexInfo(uv: number): { level: string; color: string; advice: string } {
  if (uv < 3) {
    return {
      level: 'Low',
      color: 'text-emerald-400',
      advice: 'Minimal sun protection needed. Safe to be outdoors.',
    };
  }
  if (uv < 6) {
    return {
      level: 'Moderate',
      color: 'text-amber-400',
      advice: 'Wear sunglasses and SPF 30+ sunscreen if outdoors.',
    };
  }
  if (uv < 8) {
    return {
      level: 'High',
      color: 'text-orange-400',
      advice: 'Protection essential. Seek shade during midday hours.',
    };
  }
  if (uv < 11) {
    return {
      level: 'Very High',
      color: 'text-red-400',
      advice: 'Extra protection required. Avoid direct sun between 10 AM - 4 PM.',
    };
  }
  return {
    level: 'Extreme',
    color: 'text-purple-400',
    advice: 'Take all precautions. Unprotected skin can burn in minutes.',
  };
}

/**
 * Evaluates European Air Quality Index (AQI: 1-5 or value)
 */
export function getAirQualityInfo(aqi: number): { status: string; color: string; description: string } {
  if (aqi <= 20) {
    return {
      status: 'Good',
      color: 'text-emerald-400',
      description: 'Air quality is satisfactory and poses little or no risk.',
    };
  }
  if (aqi <= 40) {
    return {
      status: 'Fair',
      color: 'text-lime-400',
      description: 'Air quality is acceptable for most individuals.',
    };
  }
  if (aqi <= 60) {
    return {
      status: 'Moderate',
      color: 'text-amber-400',
      description: 'Sensitive individuals may experience minor symptoms.',
    };
  }
  if (aqi <= 80) {
    return {
      status: 'Poor',
      color: 'text-orange-400',
      description: 'Everyone may begin to experience health effects.',
    };
  }
  return {
    status: 'Very Poor',
    color: 'text-red-400',
    description: 'Health alert: serious risk of health effects for all.',
  };
}

/**
 * Format visibility in km or miles
 */
export function formatVisibility(meters: number, unit: TempUnit = 'C'): string {
  if (unit === 'F') {
    const miles = (meters / 1609.34).toFixed(1);
    return `${miles} mi`;
  }
  const km = (meters / 1000).toFixed(1);
  return `${km} km`;
}

/**
 * Format atmospheric pressure (hPa)
 */
export function formatPressure(hpa: number, unit: TempUnit = 'C'): string {
  if (unit === 'F') {
    const inHg = (hpa * 0.02953).toFixed(2);
    return `${inHg} inHg`;
  }
  return `${Math.round(hpa)} hPa`;
}

/**
 * Formats an ISO string to a human readable local time for a specific timezone
 */
export function formatLocalTime(isoOrDate: string | Date, timezone?: string): string {
  try {
    const date = typeof isoOrDate === 'string' ? new Date(isoOrDate) : isoOrDate;
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: timezone || undefined,
    }).format(date);
  } catch {
    return '12:00 PM';
  }
}

/**
 * Formats an ISO string to a human readable date (e.g. Tuesday, Oct 28)
 */
export function formatLocalDate(isoOrDate: string | Date, timezone?: string): string {
  try {
    const date = typeof isoOrDate === 'string' ? new Date(isoOrDate) : isoOrDate;
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      timeZone: timezone || undefined,
    }).format(date);
  } catch {
    return 'Today';
  }
}

/**
 * Formats day of the week abbreviation (e.g. Mon, Tue)
 */
export function formatDayAbbreviation(dateStr: string, timezone?: string): string {
  try {
    // Handle YYYY-MM-DD
    const date = new Date(dateStr.includes('T') ? dateStr : `${dateStr}T12:00:00`);
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      timeZone: timezone || undefined,
    }).format(date);
  } catch {
    return 'Day';
  }
}
