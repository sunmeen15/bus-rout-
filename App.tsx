import React, { useState, useMemo } from 'react';
import { MapPin, Navigation2, Search, ArrowRight, Map as MapIcon, X, List } from 'lucide-react';
import { LOCATIONS, BUSES } from './constants';
import { findBuses, getBusFullRoute } from './services/busService';
import { Location, RouteResult } from './types';
import MapPicker from './components/MapPicker';
import BusCard from './components/BusCard';
import BusDetail from './components/BusDetail';
import GeminiAssistant from './components/GeminiAssistant';

const App: React.FC = () => {
  const [startLocation, setStartLocation] = useState<Location | null>(null);
  const [endLocation, setEndLocation] = useState<Location | null>(null);
  const [showMapPicker, setShowMapPicker] = useState<'start' | 'end' | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<RouteResult | null>(null);
  const [viewMode, setViewMode] = useState<'search' | 'browse'>('search');

  // Derived state for results
  const busRoutes = useMemo(() => {
    if (viewMode === 'browse') {
      return BUSES.map(bus => getBusFullRoute(bus));
    }

    if (startLocation && endLocation) {
      return findBuses(startLocation.id, endLocation.id);
    }
    return [];
  }, [startLocation, endLocation, viewMode]);

  // Sort locations alphabetically for dropdown
  const sortedLocations = useMemo(() => {
    return [...LOCATIONS].sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  const handleLocationSelect = (loc: Location) => {
    if (showMapPicker === 'start') {
      setStartLocation(loc);
    } else if (showMapPicker === 'end') {
      setEndLocation(loc);
    }
    setShowMapPicker(null);
    setViewMode('search'); // Switch back to search when picking a location
  };

  const handleSwap = () => {
    const temp = startLocation;
    setStartLocation(endLocation);
    setEndLocation(temp);
  };

  const toggleViewMode = () => {
    if (viewMode === 'search') {
      setViewMode('browse');
    } else {
      setViewMode('search');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 relative pb-20">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 text-white p-1.5 rounded-lg">
              <Navigation2 size={20} fill="currentColor" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-700 to-teal-600 bg-clip-text text-transparent">
              Dhaka Chaka
            </h1>
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {/* Search Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-slate-800">Plan your journey</h2>
            <button 
              onClick={toggleViewMode}
              className={`text-sm font-medium px-3 py-1.5 rounded-lg transition-colors flex items-center gap-2 ${viewMode === 'browse' ? 'bg-blue-100 text-blue-700' : 'text-slate-500 hover:bg-slate-100'}`}
            >
              <List size={16} />
              {viewMode === 'browse' ? 'Back to Search' : 'Browse All Buses'}
            </button>
          </div>
          
          {viewMode === 'search' ? (
            <div className="relative space-y-3 animate-in fade-in slide-in-from-top-2">
              {/* Start Input */}
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500">
                  <MapPin size={18} fill="currentColor" className="opacity-20" />
                  <MapPin size={18} className="absolute inset-0" />
                </div>
                <select 
                  value={startLocation?.id || ''}
                  onChange={(e) => setStartLocation(LOCATIONS.find(l => l.id === e.target.value) || null)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none appearance-none transition-all text-slate-800 font-medium"
                >
                  <option value="" disabled>Where from?</option>
                  {sortedLocations.map(loc => (
                    <option key={loc.id} value={loc.id}>{loc.name}</option>
                  ))}
                </select>
                <button 
                  onClick={() => setShowMapPicker('start')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Pick on map"
                >
                  <MapIcon size={18} />
                </button>
              </div>

              {/* Connecting Line (Visual) */}
              <div className="absolute left-[19px] top-10 bottom-10 w-[2px] bg-gradient-to-b from-green-500/20 via-slate-200 to-red-500/20 pointer-events-none"></div>

              {/* End Input */}
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-red-500">
                  <MapPin size={18} fill="currentColor" className="opacity-20" />
                  <MapPin size={18} className="absolute inset-0" />
                </div>
                <select 
                  value={endLocation?.id || ''}
                  onChange={(e) => setEndLocation(LOCATIONS.find(l => l.id === e.target.value) || null)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none appearance-none transition-all text-slate-800 font-medium"
                >
                  <option value="" disabled>Where to?</option>
                  {sortedLocations.map(loc => (
                    <option key={loc.id} value={loc.id}>{loc.name}</option>
                  ))}
                </select>
                <button 
                  onClick={() => setShowMapPicker('end')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Pick on map"
                >
                  <MapIcon size={18} />
                </button>
              </div>
            </div>
          ) : (
             <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 text-blue-800 text-sm animate-in fade-in">
                Showing all available buses in the database. Tap a card to see the full route map and fare details.
             </div>
          )}
        </div>

        {/* Results Section */}
        {(viewMode === 'browse' || (startLocation && endLocation)) && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
              <h3 className="text-slate-600 font-medium">
                {viewMode === 'browse' ? 'All Bus Routes' : 'Available Buses'} 
                <span className="text-slate-400 text-sm ml-2">({busRoutes.length})</span>
              </h3>
              
              {viewMode === 'search' && (
                <button onClick={handleSwap} className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                  Swap locations <Navigation2 size={14} className="rotate-90"/>
                </button>
              )}
            </div>

            {busRoutes.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {busRoutes.map((route, idx) => (
                  <BusCard 
                    key={`${route.bus.id}-${idx}`} 
                    result={route} 
                    onClick={() => setSelectedRoute(route)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-300">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Search size={24} className="text-slate-400" />
                </div>
                <p className="text-slate-600 font-medium">No direct buses found.</p>
                <p className="text-slate-400 text-sm mt-1">
                  Try finding an intermediate stop or ask the AI Assistant.
                </p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Map Picker Modal */}
      {showMapPicker && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-4xl aspect-[4/5] sm:aspect-video rounded-2xl shadow-2xl overflow-hidden flex flex-col relative">
            <div className="p-3 border-b border-slate-100 flex justify-between items-center bg-white z-10 sm:hidden">
               <h3 className="font-semibold text-slate-800 pl-2">Select Location</h3>
               <button onClick={() => setShowMapPicker(null)} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200">
                 <X size={20} />
               </button>
            </div>
            
            <div className="flex-1 relative bg-slate-100">
              <MapPicker 
                onSelect={handleLocationSelect}
                onClose={() => setShowMapPicker(null)} 
                selectedStart={startLocation?.id}
                selectedEnd={endLocation?.id}
                isSelecting={showMapPicker}
              />
            </div>
          </div>
        </div>
      )}

      {/* Bus Detail Modal/Slide-over */}
      {selectedRoute && (
        <BusDetail 
          result={selectedRoute} 
          onClose={() => setSelectedRoute(null)} 
        />
      )}

      {/* AI Assistant */}
      <GeminiAssistant />
    </div>
  );
};

export default App;