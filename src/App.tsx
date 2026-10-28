import React, { useState, useEffect, useCallback } from 'react';
import { 
  CityLocation, 
  PageId, 
  SavedCity, 
  TempUnit, 
  WeatherData 
} from './types/weather';
import { 
  fetchWeatherData, 
  getCityFromCoordinates, 
  POPULAR_CITIES 
} from './services/weatherService';
import { Navbar } from './components/Navbar';
import { SearchBar } from './components/SearchBar';
import { WeatherBackground } from './components/WeatherBackground';
import { WeatherAlert } from './components/WeatherAlert';
import { HomePage } from './components/HomePage';
import { DailyForecastPage } from './components/DailyForecastPage';
import { HourlyForecastPage } from './components/HourlyForecastPage';
import { WeatherDetailsPage } from './components/WeatherDetailsPage';
import { FavoritesPage } from './components/FavoritesPage';
import { AboutPage } from './components/AboutPage';
import { Footer } from './components/Footer';
import { SettingsModal } from './components/SettingsModal';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';

const STORAGE_KEYS = {
  UNIT: 'weathernow_unit',
  THEME: 'weathernow_theme',
  FAVORITES: 'weathernow_favorites',
  RECENT: 'weathernow_recent_searches',
  LAST_CITY: 'weathernow_last_city',
};

export default function App() {
  // Navigation & Page State
  const [currentPage, setCurrentPage] = useState<PageId>('home');

  // Preferences
  const [tempUnit, setTempUnit] = useState<TempUnit>(() => {
    return (localStorage.getItem(STORAGE_KEYS.UNIT) as TempUnit) || 'C';
  });
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.THEME);
    return saved !== null ? saved === 'true' : true;
  });

  // Active City & Weather Data
  const [currentCity, setCurrentCity] = useState<CityLocation>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LAST_CITY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return POPULAR_CITIES[0]; // London default
  });

  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Favorites & Search History
  const [favorites, setFavorites] = useState<SavedCity[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FAVORITES);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: POPULAR_CITIES[1].id as string,
        name: POPULAR_CITIES[1].name,
        country: POPULAR_CITIES[1].country,
        admin1: POPULAR_CITIES[1].admin1,
        latitude: POPULAR_CITIES[1].latitude,
        longitude: POPULAR_CITIES[1].longitude,
        timezone: POPULAR_CITIES[1].timezone,
        addedAt: Date.now(),
        currentTemp: 21,
        conditionLabel: 'Sunny',
      },
      {
        id: POPULAR_CITIES[2].id as string,
        name: POPULAR_CITIES[2].name,
        country: POPULAR_CITIES[2].country,
        admin1: POPULAR_CITIES[2].admin1,
        latitude: POPULAR_CITIES[2].latitude,
        longitude: POPULAR_CITIES[2].longitude,
        timezone: POPULAR_CITIES[2].timezone,
        addedAt: Date.now(),
        currentTemp: 19,
        conditionLabel: 'Clear Sky',
      },
    ];
  });

  const [recentSearches, setRecentSearches] = useState<CityLocation[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.RECENT);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [POPULAR_CITIES[0], POPULAR_CITIES[1], POPULAR_CITIES[3]];
  });

  // Geolocation & Dialog States
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [isAlertDismissed, setIsAlertDismissed] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Persist preferences
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.UNIT, tempUnit);
  }, [tempUnit]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.THEME, String(isDark));
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RECENT, JSON.stringify(recentSearches));
  }, [recentSearches]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LAST_CITY, JSON.stringify(currentCity));
  }, [currentCity]);

  // Load weather for current city
  const loadWeather = useCallback(async (city: CityLocation) => {
    setIsLoading(true);
    setError(null);
    setIsAlertDismissed(false);
    try {
      const data = await fetchWeatherData(city);
      setWeather(data);
      // Update snapshot if in favorites
      setFavorites((prev) =>
        prev.map((f) =>
          f.id === String(city.id) || f.name === city.name
            ? {
                ...f,
                currentTemp: data.current.temperature,
                conditionLabel: data.current.condition.label,
                tempMax: data.daily[0]?.temperatureMax,
                tempMin: data.daily[0]?.temperatureMin,
              }
            : f
        )
      );
    } catch (err: any) {
      console.error('Failed to load weather data:', err);
      setError(
        'Unable to fetch live meteorological data. Please check your internet connection or try another city.'
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load or city change
  useEffect(() => {
    loadWeather(currentCity);
  }, [currentCity, loadWeather]);

  // Handle City Selection
  const handleSelectCity = (city: CityLocation) => {
    setCurrentCity(city);
    // Add to recent searches (deduplicated, max 6)
    setRecentSearches((prev) => {
      const filtered = prev.filter((c) => c.name !== city.name);
      return [city, ...filtered].slice(0, 6);
    });
  };

  // Handle Geolocation Detection
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          const detectedCity = await getCityFromCoordinates(lat, lon);
          handleSelectCity(detectedCity);
        } catch (err) {
          console.warn('Geolocation lookup failed:', err);
        } finally {
          setIsDetectingLocation(false);
        }
      },
      (err) => {
        console.warn('Geolocation error:', err);
        setIsDetectingLocation(false);
        // Fallback: notice to user
        setError('Location access was denied or timed out. You can still search for any city.');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Toggle Favorite for Current City
  const isCurrentFavorite = favorites.some(
    (f) => f.id === String(currentCity.id) || f.name === currentCity.name
  );

  const handleToggleFavorite = () => {
    if (isCurrentFavorite) {
      setFavorites((prev) =>
        prev.filter((f) => f.id !== String(currentCity.id) && f.name !== currentCity.name)
      );
    } else {
      const newFav: SavedCity = {
        id: String(currentCity.id),
        name: currentCity.name,
        country: currentCity.country,
        admin1: currentCity.admin1,
        latitude: currentCity.latitude,
        longitude: currentCity.longitude,
        timezone: currentCity.timezone,
        addedAt: Date.now(),
        currentTemp: weather?.current.temperature ?? 20,
        conditionLabel: weather?.current.condition.label ?? 'Clear Sky',
        tempMax: weather?.daily[0]?.temperatureMax,
        tempMin: weather?.daily[0]?.temperatureMin,
      };
      setFavorites((prev) => [newFav, ...prev]);
    }
  };

  const handleRemoveFavorite = (id: string) => {
    setFavorites((prev) => prev.filter((f) => f.id !== id));
  };

  const handleAddCurrentAsFavorite = () => {
    if (!isCurrentFavorite) {
      handleToggleFavorite();
    }
  };

  const handleClearRecentSearches = () => {
    setRecentSearches([]);
  };

  const handleResetFavorites = () => {
    setFavorites([]);
    setRecentSearches([]);
    localStorage.removeItem(STORAGE_KEYS.FAVORITES);
    localStorage.removeItem(STORAGE_KEYS.RECENT);
  };

  return (
    <WeatherBackground
      conditionType={weather?.current.condition.type}
      isDark={isDark}
    >
      {/* Top Navigation Bar */}
      <Navbar
        currentPage={currentPage}
        onSelectPage={setCurrentPage}
        tempUnit={tempUnit}
        onToggleTempUnit={() => setTempUnit((u) => (u === 'C' ? 'F' : 'C'))}
        isDark={isDark}
        onToggleTheme={() => setIsDark((d) => !d)}
        favoritesCount={favorites.length}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Page Body */}
      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto w-full">
        {/* Search Bar (visible across weather views, subtle on about) */}
        <div className="mb-6">
          <SearchBar
            onSelectCity={handleSelectCity}
            onDetectLocation={handleDetectLocation}
            isDetectingLocation={isDetectingLocation}
            recentSearches={recentSearches}
            onClearRecentSearches={handleClearRecentSearches}
            isDark={isDark}
          />
        </div>

        {/* Rain or Severe Weather Alert Banner */}
        {weather && (
          <WeatherAlert
            weather={weather}
            onDismiss={() => setIsAlertDismissed(true)}
            isDismissed={isAlertDismissed}
            isDark={isDark}
          />
        )}

        {/* Loading State */}
        {isLoading && !weather && (
          <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
              <Loader2 className="w-6 h-6 text-indigo-400 absolute inset-0 m-auto animate-pulse" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="font-extrabold text-lg tracking-tight">
                Fetching Live Weather
              </h3>
              <p className="text-xs text-slate-400">
                Retrieving atmospheric measurements for {currentCity.name}...
              </p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div
            className={`p-6 rounded-3xl border shadow-xl max-w-xl mx-auto text-center space-y-4 ${
              isDark ? 'glass-panel border-rose-500/30' : 'glass-panel-light border-rose-300'
            }`}
          >
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-rose-300">
                Connection Notice
              </h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                {error}
              </p>
            </div>
            <button
              onClick={() => loadWeather(currentCity)}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs inline-flex items-center gap-2"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry Connection</span>
            </button>
          </div>
        )}

        {/* Weather Pages */}
        {!isLoading && weather && (
          <>
            {currentPage === 'home' && (
              <HomePage
                weather={weather}
                tempUnit={tempUnit}
                isFavorite={isCurrentFavorite}
                onToggleFavorite={handleToggleFavorite}
                onNavigate={setCurrentPage}
                isDark={isDark}
              />
            )}

            {currentPage === 'forecast' && (
              <DailyForecastPage
                weather={weather}
                tempUnit={tempUnit}
                isDark={isDark}
              />
            )}

            {currentPage === 'hourly' && (
              <HourlyForecastPage
                weather={weather}
                tempUnit={tempUnit}
                isDark={isDark}
              />
            )}

            {currentPage === 'details' && (
              <WeatherDetailsPage
                weather={weather}
                tempUnit={tempUnit}
                isDark={isDark}
              />
            )}
          </>
        )}

        {/* Saved Cities Page */}
        {currentPage === 'favorites' && weather && (
          <FavoritesPage
            favorites={favorites}
            currentCity={currentCity}
            currentWeather={weather}
            onRemoveFavorite={handleRemoveFavorite}
            onAddCurrentAsFavorite={handleAddCurrentAsFavorite}
            onSelectCity={handleSelectCity}
            onNavigate={setCurrentPage}
            tempUnit={tempUnit}
            isDark={isDark}
          />
        )}

        {/* About & Contact Page */}
        {currentPage === 'about' && <AboutPage isDark={isDark} />}
      </main>

      {/* Footer */}
      <Footer onNavigate={setCurrentPage} isDark={isDark} />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        tempUnit={tempUnit}
        onToggleTempUnit={() => setTempUnit((u) => (u === 'C' ? 'F' : 'C'))}
        isDark={isDark}
        onToggleTheme={() => setIsDark((d) => !d)}
        onResetFavorites={handleResetFavorites}
        isDarkTheme={isDark}
      />
    </WeatherBackground>
  );
}
