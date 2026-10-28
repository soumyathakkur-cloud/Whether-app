import React from 'react';
import { 
  Heart, 
  Trash2, 
  MapPin, 
  Plus, 
  ArrowRight, 
  Sparkles,
  CloudSun
} from 'lucide-react';
import { CityLocation, PageId, SavedCity, TempUnit, WeatherData } from '../types/weather';
import { WeatherIcon } from './WeatherIcon';
import { formatTemperature } from '../utils/weatherUtils';
import { POPULAR_CITIES } from '../services/weatherService';

interface FavoritesPageProps {
  favorites: SavedCity[];
  currentCity: CityLocation;
  currentWeather: WeatherData;
  onRemoveFavorite: (id: string) => void;
  onAddCurrentAsFavorite: () => void;
  onSelectCity: (city: CityLocation) => void;
  onNavigate: (page: PageId) => void;
  tempUnit: TempUnit;
  isDark: boolean;
}

export const FavoritesPage: React.FC<FavoritesPageProps> = ({
  favorites,
  currentCity,
  currentWeather,
  onRemoveFavorite,
  onAddCurrentAsFavorite,
  onSelectCity,
  onNavigate,
  tempUnit,
  isDark,
}) => {
  const isCurrentInFavorites = favorites.some((f) => f.id === String(currentCity.id) || f.name === currentCity.name);

  const handleCityClick = (saved: SavedCity) => {
    onSelectCity({
      id: saved.id,
      name: saved.name,
      country: saved.country,
      admin1: saved.admin1,
      latitude: saved.latitude,
      longitude: saved.longitude,
      timezone: saved.timezone,
    });
    onNavigate('home');
  };

  const handleAddPreset = (preset: CityLocation) => {
    onSelectCity(preset);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2 text-rose-400 text-sm font-bold uppercase tracking-wider">
            <Heart className="w-4 h-4 fill-rose-400" />
            <span>Saved Places</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
            Favourite Cities ({favorites.length})
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Persisted securely in your browser localStorage for fast 1-click access.
          </p>
        </div>

        {/* Add Current City button */}
        <button
          onClick={onAddCurrentAsFavorite}
          disabled={isCurrentInFavorites}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all shadow-md self-start sm:self-auto border ${
            isCurrentInFavorites
              ? 'opacity-50 cursor-not-allowed bg-slate-800 text-slate-400 border-white/5'
              : 'bg-indigo-600 hover:bg-indigo-500 text-white border-indigo-400 shadow-indigo-600/30'
          }`}
          aria-label={isCurrentInFavorites ? 'Already saved' : `Add ${currentCity.name} to favourites`}
        >
          <Plus className="w-4 h-4" />
          <span>
            {isCurrentInFavorites ? `Saved (${currentCity.name})` : `Save Current (${currentCity.name})`}
          </span>
        </button>
      </div>

      {/* Favorites Grid */}
      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {favorites.map((fav) => {
            const isCurrentlyViewed = fav.id === String(currentCity.id) || fav.name === currentCity.name;
            const tempVal = isCurrentlyViewed ? currentWeather.current.temperature : (fav.currentTemp ?? 20);
            const conditionLabel = isCurrentlyViewed ? currentWeather.current.condition.label : (fav.conditionLabel ?? 'Clear Sky');
            const iconName = isCurrentlyViewed ? currentWeather.current.condition.iconName : 'CloudSun';

            return (
              <div
                key={fav.id}
                className={`relative group rounded-3xl p-5 border transition-all duration-300 flex flex-col justify-between shadow-xl ${
                  isCurrentlyViewed
                    ? isDark
                      ? 'bg-indigo-950/60 border-indigo-500/60 ring-2 ring-indigo-500/30 shadow-indigo-950/40'
                      : 'bg-indigo-50/90 border-indigo-400 ring-2 ring-indigo-400/30 shadow-indigo-100/60'
                    : isDark
                    ? 'glass-panel hover:border-white/20 border-white/10'
                    : 'glass-panel-light hover:border-indigo-300 border-slate-200'
                }`}
              >
                {/* Delete Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveFavorite(fav.id);
                  }}
                  className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  title={`Remove ${fav.name} from favourites`}
                  aria-label={`Remove ${fav.name} from favourites`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                {/* Card Clickable Area */}
                <div
                  onClick={() => handleCityClick(fav)}
                  className="cursor-pointer space-y-4"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleCityClick(fav);
                  }}
                >
                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-indigo-400 font-semibold mb-1">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{fav.country}</span>
                      {isCurrentlyViewed && (
                        <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 ml-1">
                          Viewing
                        </span>
                      )}
                    </div>
                    <h3 className="text-2xl font-black tracking-tight leading-none">
                      {fav.name}
                    </h3>
                    {fav.admin1 && (
                      <p className="text-xs text-slate-400 mt-0.5">{fav.admin1}</p>
                    )}
                  </div>

                  {/* Temp and Icon row */}
                  <div className="flex items-center justify-between pt-2">
                    <div>
                      <div className="text-3xl sm:text-4xl font-black">
                        {formatTemperature(tempVal, tempUnit)}
                      </div>
                      <div className="text-xs text-slate-300 mt-0.5">
                        {conditionLabel}
                      </div>
                    </div>

                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center p-2">
                      <WeatherIcon name={iconName} className="w-8 h-8" />
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-semibold text-indigo-400 group-hover:text-indigo-300 transition-colors">
                    <span>Open Forecast</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div
          className={`p-10 rounded-3xl border text-center space-y-4 max-w-lg mx-auto ${
            isDark ? 'glass-panel border-white/10' : 'glass-panel-light border-slate-200'
          }`}
        >
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto">
            <Heart className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold">No Favourite Cities Saved Yet</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Save your hometown, travel destinations, or dream spots to check their live weather with a single tap.
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={onAddCurrentAsFavorite}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-indigo-600/30 transition-all inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Save {currentCity.name} Now</span>
            </button>
          </div>
        </div>
      )}

      {/* Suggested Popular Cities to Add */}
      <div
        className={`p-6 rounded-3xl border shadow-xl ${
          isDark ? 'glass-panel border-white/10' : 'glass-panel-light border-slate-200'
        }`}
      >
        <div className="flex items-center gap-2 text-xs uppercase font-extrabold tracking-wider text-slate-400 mb-3">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Quick Add Popular World Capitals</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {POPULAR_CITIES.map((city) => (
            <button
              key={city.id}
              onClick={() => handleAddPreset(city)}
              className={`p-3 rounded-2xl text-left border transition-all ${
                isDark
                  ? 'bg-slate-800/50 hover:bg-indigo-950/60 border-white/5 hover:border-indigo-500/30'
                  : 'bg-white hover:bg-indigo-50 border-slate-200 hover:border-indigo-300'
              }`}
            >
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                <CloudSun className="w-3.5 h-3.5 text-indigo-400" />
                <span>{city.countryCode}</span>
              </div>
              <div className="font-extrabold text-sm mt-0.5">{city.name}</div>
              <div className="text-[10px] text-indigo-400 font-semibold mt-1 flex items-center gap-0.5">
                <span>View</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
