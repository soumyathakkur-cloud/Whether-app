import { 
  AirQualityData, 
  CityLocation, 
  CurrentWeather, 
  DailyForecastItem, 
  HourlyForecastItem, 
  WeatherData 
} from '../types/weather';
import { 
  formatDayAbbreviation, 
  formatLocalTime, 
  getAirQualityInfo, 
  getWeatherCondition 
} from '../utils/weatherUtils';

export const POPULAR_CITIES: CityLocation[] = [
  {
    id: 'london-gb',
    name: 'London',
    country: 'United Kingdom',
    countryCode: 'GB',
    admin1: 'England',
    latitude: 51.5074,
    longitude: -0.1278,
    timezone: 'Europe/London',
  },
  {
    id: 'new-york-us',
    name: 'New York',
    country: 'United States',
    countryCode: 'US',
    admin1: 'New York',
    latitude: 40.7128,
    longitude: -74.0060,
    timezone: 'America/New_York',
  },
  {
    id: 'tokyo-jp',
    name: 'Tokyo',
    country: 'Japan',
    countryCode: 'JP',
    admin1: 'Tokyo',
    latitude: 35.6895,
    longitude: 139.6917,
    timezone: 'Asia/Tokyo',
  },
  {
    id: 'paris-fr',
    name: 'Paris',
    country: 'France',
    countryCode: 'FR',
    admin1: 'Île-de-France',
    latitude: 48.8566,
    longitude: 2.3522,
    timezone: 'Europe/Paris',
  },
  {
    id: 'sydney-au',
    name: 'Sydney',
    country: 'Australia',
    countryCode: 'AU',
    admin1: 'New South Wales',
    latitude: -33.8688,
    longitude: 151.2093,
    timezone: 'Australia/Sydney',
  },
];

export async function searchCities(query: string): Promise<CityLocation[]> {
  const trimmed = query.trim();
  if (trimmed.length < 2) return [];

  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(trimmed)}&count=8&language=en&format=json`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Geocoding HTTP error: ${res.status}`);
    const data = await res.json();

    if (!data.results || !Array.isArray(data.results)) {
      return [];
    }

    return data.results.map((item: any) => ({
      id: item.id || `${item.name}-${item.latitude}`,
      name: item.name,
      country: item.country || '',
      countryCode: item.country_code,
      admin1: item.admin1 || item.admin2 || '',
      latitude: item.latitude,
      longitude: item.longitude,
      timezone: item.timezone || 'auto',
    }));
  } catch (err) {
    console.warn('Geocoding search error:', err);
    // Fallback: match in popular cities
    return POPULAR_CITIES.filter(
      (c) =>
        c.name.toLowerCase().includes(trimmed.toLowerCase()) ||
        c.country.toLowerCase().includes(trimmed.toLowerCase())
    );
  }
}

export async function getCityFromCoordinates(lat: number, lon: number): Promise<CityLocation> {
  try {
    // Reverse geocode with OpenStreetMap Nominatim
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&zoom=10&addressdetails=1`,
      { headers: { 'User-Agent': 'WeatherNowApp/1.0' } }
    );
    if (res.ok) {
      const data = await res.json();
      const addr = data.address || {};
      const cityName = addr.city || addr.town || addr.village || addr.municipality || addr.county || 'My Location';
      const country = addr.country || '';
      return {
        id: `geo-${lat.toFixed(3)}-${lon.toFixed(3)}`,
        name: cityName,
        country: country,
        admin1: addr.state || addr.region || '',
        latitude: lat,
        longitude: lon,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'auto',
      };
    }
  } catch (err) {
    console.warn('Reverse geocoding error:', err);
  }

  return {
    id: `geo-${lat.toFixed(3)}-${lon.toFixed(3)}`,
    name: 'Current Location',
    country: '',
    latitude: lat,
    longitude: lon,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'auto',
  };
}

export async function fetchWeatherData(city: CityLocation): Promise<WeatherData> {
  const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${city.latitude}&longitude=${city.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m&hourly=temperature_2m,relative_humidity_2m,dew_point_2m,apparent_temperature,precipitation_probability,precipitation,weather_code,surface_pressure,visibility,wind_speed_10m,uv_index&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_probability_max,wind_speed_10m_max&timezone=auto`;
  const aqiUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${city.latitude}&longitude=${city.longitude}&current=european_aqi,pm10,pm2_5,nitrogen_dioxide,ozone`;

  const [weatherRes, aqiRes] = await Promise.all([
    fetch(weatherUrl),
    fetch(aqiUrl).catch(() => null),
  ]);

  if (!weatherRes.ok) {
    throw new Error(`Weather API error: HTTP ${weatherRes.status}`);
  }

  const wData = await weatherRes.json();
  const currentRaw = wData.current || {};
  const isDay = currentRaw.is_day === 1;
  const currentCondition = getWeatherCondition(currentRaw.weather_code ?? 0, isDay);

  const current: CurrentWeather = {
    temperature: currentRaw.temperature_2m ?? 20,
    apparentTemperature: currentRaw.apparent_temperature ?? currentRaw.temperature_2m ?? 20,
    weatherCode: currentRaw.weather_code ?? 0,
    condition: currentCondition,
    relativeHumidity: currentRaw.relative_humidity_2m ?? 50,
    windSpeed: currentRaw.wind_speed_10m ?? 10,
    windDirection: currentRaw.wind_direction_10m ?? 0,
    windGusts: currentRaw.wind_gusts_10m ?? (currentRaw.wind_speed_10m ?? 10) * 1.3,
    surfacePressure: currentRaw.surface_pressure ?? 1013,
    precipitation: currentRaw.precipitation ?? 0,
    isDay: isDay,
    time: currentRaw.time || new Date().toISOString(),
  };

  // Process hourly (next 24 to 48 hours starting from current hour)
  const hourlyRaw = wData.hourly || {};
  const hourlyTimes: string[] = hourlyRaw.time || [];
  const nowIsoHour = current.time.slice(0, 13);
  let startIndex = hourlyTimes.findIndex((t) => t.startsWith(nowIsoHour));
  if (startIndex === -1) startIndex = 0;

  const hourly: HourlyForecastItem[] = [];
  const hourlyLimit = Math.min(startIndex + 24, hourlyTimes.length);

  for (let i = startIndex; i < hourlyLimit; i++) {
    const timeIso = hourlyTimes[i];
    const code = hourlyRaw.weather_code?.[i] ?? 0;
    // Estimate day/night for hourly based on hour
    const dateObj = new Date(timeIso);
    const hour = dateObj.getHours();
    const isHourlyDay = hour >= 6 && hour < 20;

    hourly.push({
      time: timeIso,
      formattedTime: i === startIndex ? 'Now' : formatLocalTime(timeIso, wData.timezone),
      temperature: hourlyRaw.temperature_2m?.[i] ?? 0,
      apparentTemperature: hourlyRaw.apparent_temperature?.[i] ?? hourlyRaw.temperature_2m?.[i] ?? 0,
      precipitationProbability: hourlyRaw.precipitation_probability?.[i] ?? 0,
      precipitation: hourlyRaw.precipitation?.[i] ?? 0,
      weatherCode: code,
      condition: getWeatherCondition(code, isHourlyDay),
      relativeHumidity: hourlyRaw.relative_humidity_2m?.[i] ?? 50,
      windSpeed: hourlyRaw.wind_speed_10m?.[i] ?? 0,
      uvIndex: hourlyRaw.uv_index?.[i] ?? 0,
      surfacePressure: hourlyRaw.surface_pressure?.[i] ?? 1013,
      visibility: hourlyRaw.visibility?.[i] ?? 10000,
    });
  }

  // Process 7-day daily forecast
  const dailyRaw = wData.daily || {};
  const dailyDates: string[] = dailyRaw.time || [];
  const daily: DailyForecastItem[] = [];

  for (let i = 0; i < Math.min(7, dailyDates.length); i++) {
    const dateStr = dailyDates[i];
    const code = dailyRaw.weather_code?.[i] ?? 0;
    const dayOfWeek = i === 0 ? 'Today' : (i === 1 ? 'Tomorrow' : formatDayAbbreviation(dateStr, wData.timezone));

    daily.push({
      date: dateStr,
      dayOfWeek: dayOfWeek,
      weatherCode: code,
      condition: getWeatherCondition(code, true),
      temperatureMax: dailyRaw.temperature_2m_max?.[i] ?? 22,
      temperatureMin: dailyRaw.temperature_2m_min?.[i] ?? 14,
      precipitationProbabilityMax: dailyRaw.precipitation_probability_max?.[i] ?? 0,
      windSpeedMax: dailyRaw.wind_speed_10m_max?.[i] ?? 15,
      uvIndexMax: dailyRaw.uv_index_max?.[i] ?? 3,
      sunrise: dailyRaw.sunrise?.[i] || '',
      sunset: dailyRaw.sunset?.[i] || '',
    });
  }

  // Process Air Quality
  let airQuality: AirQualityData | undefined;
  if (aqiRes && aqiRes.ok) {
    try {
      const aqiJson = await aqiRes.json();
      const curAqi = aqiJson.current || {};
      const aqiVal = curAqi.european_aqi ?? 25;
      const info = getAirQualityInfo(aqiVal);
      airQuality = {
        europeanAqi: aqiVal,
        pm2_5: curAqi.pm2_5 ?? 8.5,
        pm10: curAqi.pm10 ?? 14.2,
        nitrogenDioxide: curAqi.nitrogen_dioxide ?? 12.0,
        ozone: curAqi.ozone ?? 45.0,
        status: info.status,
        description: info.description,
      };
    } catch {
      // AQI optional fallback
    }
  }

  return {
    city: {
      ...city,
      timezone: wData.timezone || city.timezone,
    },
    current,
    hourly,
    daily,
    airQuality,
    updatedAt: new Date().toISOString(),
  };
}
