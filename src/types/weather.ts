export type TempUnit = 'C' | 'F';

export type WeatherConditionType = 
  | 'clear-day'
  | 'clear-night'
  | 'partly-cloudy'
  | 'overcast'
  | 'fog'
  | 'drizzle'
  | 'rain'
  | 'heavy-rain'
  | 'thunderstorm'
  | 'snow'
  | 'sleet';

export interface WeatherConditionInfo {
  type: WeatherConditionType;
  label: string;
  iconName: string;
  isRain: boolean;
  bgGradientDark: string;
  bgGradientLight: string;
}

export interface CityLocation {
  id: string | number;
  name: string;
  country: string;
  countryCode?: string;
  admin1?: string; // State or region
  latitude: number;
  longitude: number;
  timezone: string;
}

export interface CurrentWeather {
  temperature: number;
  apparentTemperature: number;
  weatherCode: number;
  condition: WeatherConditionInfo;
  relativeHumidity: number;
  windSpeed: number; // km/h
  windDirection: number; // degrees
  windGusts: number;
  surfacePressure: number; // hPa
  precipitation: number; // mm
  isDay: boolean;
  time: string; // ISO string
}

export interface HourlyForecastItem {
  time: string; // ISO string
  formattedTime: string;
  temperature: number;
  apparentTemperature: number;
  precipitationProbability: number;
  precipitation: number;
  weatherCode: number;
  condition: WeatherConditionInfo;
  relativeHumidity: number;
  windSpeed: number;
  uvIndex: number;
  surfacePressure: number;
  visibility: number; // meters
}

export interface DailyForecastItem {
  date: string; // YYYY-MM-DD
  dayOfWeek: string;
  weatherCode: number;
  condition: WeatherConditionInfo;
  temperatureMax: number;
  temperatureMin: number;
  precipitationProbabilityMax: number;
  windSpeedMax: number;
  uvIndexMax: number;
  sunrise: string;
  sunset: string;
}

export interface AirQualityData {
  europeanAqi: number;
  pm2_5: number;
  pm10: number;
  nitrogenDioxide: number;
  ozone: number;
  status: string;
  description: string;
}

export interface WeatherData {
  city: CityLocation;
  current: CurrentWeather;
  hourly: HourlyForecastItem[];
  daily: DailyForecastItem[];
  airQuality?: AirQualityData;
  updatedAt: string;
}

export interface SavedCity {
  id: string;
  name: string;
  country: string;
  admin1?: string;
  latitude: number;
  longitude: number;
  timezone: string;
  addedAt: number;
  // Cached snapshot for quick offline display
  currentTemp?: number;
  conditionLabel?: string;
  weatherCode?: number;
  tempMax?: number;
  tempMin?: number;
}

export type PageId = 'home' | 'forecast' | 'hourly' | 'details' | 'favorites' | 'about';
