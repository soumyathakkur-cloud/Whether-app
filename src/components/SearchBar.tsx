import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  MapPin, 
  History, 
  X, 
  Loader2, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { CityLocation } from '../types/weather';
import { searchCities, POPULAR_CITIES } from '../services/weatherService';

interface SearchBarProps {
  onSelectCity: (city: CityLocation) => void;
  onDetectLocation: () => void;
  isDetectingLocation: boolean;
  recentSearches: CityLocation[];
  onClearRecentSearches: () => void;
  isDark: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSelectCity,
  onDetectLocation,
  isDetectingLocation,
  recentSearches,
  onClearRecentSearches,
  isDark,
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<CityLocation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Debounced live geocoding query
  useEffect(() => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      setIsLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const results = await searchCities(query);
        setSuggestions(results);
      } catch (err) {
        console.error('Search failed', err);
      } finally {
        setIsLoading(false);
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (city: CityLocation) => {
    onSelectCity(city);
    setQuery('');
    setIsOpen(false);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (suggestions.length > 0) {
      handleSelect(suggestions[0]);
    } else if (query.trim().length >= 2) {
      // Trigger search and pick top result
      searchCities(query).then((res) => {
        if (res.length > 0) {
          handleSelect(res[0]);
        }
      });
    }
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-3xl mx-auto z-30">
      {/* Search Input Bar */}
      <form onSubmit={handleFormSubmit} className="relative flex items-center">
        <div className="absolute left-4 pointer-events-none text-slate-400">
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin text-indigo-400" />
          ) : (
            <Search className="w-5 h-5 text-indigo-400" />
          )}
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search for any city (e.g., Paris, Tokyo, New York)..."
          className={`w-full pl-12 pr-28 py-3.5 rounded-2xl text-sm md:text-base outline-none transition-all duration-300 font-medium ${
            isDark
              ? 'glass-panel text-white placeholder-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/20'
              : 'glass-panel-light text-slate-900 placeholder-slate-500 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15'
          }`}
          aria-label="Search city weather"
        />

        {/* Clear query button if typed */}
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="absolute right-20 p-1.5 rounded-lg text-slate-400 hover:text-white"
            aria-label="Clear search input"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Geolocation Auto-detect button */}
        <button
          type="button"
          onClick={onDetectLocation}
          disabled={isDetectingLocation}
          className={`absolute right-2.5 px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm ${
            isDetectingLocation
              ? 'bg-indigo-600/50 text-indigo-200 cursor-wait'
              : isDark
              ? 'bg-indigo-600/80 hover:bg-indigo-600 text-white shadow-indigo-600/30'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20'
          }`}
          title="Detect Current Location"
          aria-label="Detect my location"
        >
          {isDetectingLocation ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <MapPin className="w-3.5 h-3.5 text-indigo-200" />
          )}
          <span className="hidden sm:inline">
            {isDetectingLocation ? 'Locating...' : 'Locate'}
          </span>
        </button>
      </form>

      {/* Autocomplete Suggestions / History Dropdown */}
      {isOpen && (
        <div
          className={`absolute top-full left-0 right-0 mt-2 rounded-2xl overflow-hidden shadow-2xl transition-all duration-200 p-2 border backdrop-blur-xl ${
            isDark
              ? 'bg-slate-900/95 border-white/10 shadow-black/40 text-slate-200'
              : 'bg-white/95 border-slate-200 shadow-slate-300/50 text-slate-800'
          }`}
        >
          {/* Autocomplete Results */}
          {suggestions.length > 0 && (
            <div className="py-1">
              <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Matching Cities
              </div>
              <ul className="space-y-0.5">
                {suggestions.map((city) => (
                  <li key={`${city.id}-${city.latitude}`}>
                    <button
                      type="button"
                      onClick={() => handleSelect(city)}
                      className={`w-full px-3 py-2.5 rounded-xl text-left flex items-center justify-between text-sm transition-colors ${
                        isDark ? 'hover:bg-white/10' : 'hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <MapPin className="w-4 h-4 text-indigo-400 shrink-0" />
                        <div>
                          <span className="font-semibold text-white/90 dark:text-white">
                            {city.name}
                          </span>
                          <span className="text-xs text-slate-400 ml-1.5">
                            {city.admin1 ? `${city.admin1}, ` : ''}{city.country}
                          </span>
                        </div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* No results notice */}
          {query.trim().length >= 2 && !isLoading && suggestions.length === 0 && (
            <div className="p-4 text-center text-sm text-slate-400">
              No matching cities found for &quot;{query}&quot;. Try another name.
            </div>
          )}

          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div className="border-t border-white/5 pt-2 mt-1">
              <div className="px-3 py-1 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <div className="flex items-center gap-1.5">
                  <History className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Recent Searches</span>
                </div>
                <button
                  type="button"
                  onClick={onClearRecentSearches}
                  className="text-[10px] text-slate-400 hover:text-red-400 transition-colors lowercase"
                >
                  clear history
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5 p-2">
                {recentSearches.map((city) => (
                  <button
                    key={`recent-${city.id}`}
                    type="button"
                    onClick={() => handleSelect(city)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                      isDark
                        ? 'bg-slate-800/80 hover:bg-indigo-950/80 text-slate-300 hover:text-indigo-200 border border-white/5'
                        : 'bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 border border-slate-200'
                    }`}
                  >
                    <span>{city.name}</span>
                    <span className="text-[10px] opacity-60">({city.countryCode || city.country})</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Popular Cities Quick Picks */}
          <div className="border-t border-white/5 pt-2 mt-1">
            <div className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Popular Destinations</span>
            </div>
            <div className="flex flex-wrap gap-1.5 p-2">
              {POPULAR_CITIES.map((city) => (
                <button
                  key={`pop-${city.id}`}
                  type="button"
                  onClick={() => handleSelect(city)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                    isDark
                      ? 'bg-slate-800/60 hover:bg-indigo-600/20 text-slate-300 hover:text-indigo-300 border border-white/5'
                      : 'bg-slate-100/80 hover:bg-indigo-100 text-slate-700 hover:text-indigo-700 border border-slate-200'
                  }`}
                >
                  {city.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
