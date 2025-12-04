import React from 'react';
import { RouteResult, Location } from '../types';
import { X, Wifi, Armchair, Wind, Bus as BusIcon } from 'lucide-react';
import RouteMap from './RouteMap';

interface BusDetailProps {
  result: RouteResult;
  onClose: () => void;
  allLocations: Location[];
}

const BusDetail: React.FC<BusDetailProps> = ({ result, onClose, allLocations }) => {
  const { bus, path } = result;
  
  // Resolve location objects for the path using dynamic list
  const pathLocations = path.map(id => allLocations.find(l => l.id === id)).filter(Boolean) as Location[];

  const getFeatureIcon = (feature: string) => {
    const lower = feature.toLowerCase();
    if (lower.includes('wi-fi')) return <Wifi size={14} />;
    if (lower.includes('seat')) return <Armchair size={14} />;
    if (lower.includes('air') || lower.includes('fan')) return <Wind size={14} />;
    return <BusIcon size={14} />;
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white sm:max-w-lg sm:ml-auto sm:border-l shadow-2xl animate-in slide-in-from-right duration-300">
      {/* Header Image */}
      <div className="relative h-48 w-full shrink-0">
        <img src={bus.image} alt={bus.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 backdrop-blur p-2 rounded-full text-white transition-colors z-20"
        >
          <X size={20} />
        </button>
        <div className="absolute bottom-4 left-4 text-white">
          <h2 className="text-2xl font-bold">{bus.name}</h2>
          <p className="text-white/90 text-sm flex items-center gap-2">
            <span className={`inline-block w-2 h-2 rounded-full ${bus.color === 'bg-white' ? 'bg-slate-200' : bus.color.replace('bg-', 'bg-')}`}></span>
            {bus.type} Service
          </p>
        </div>
      </div>

      {/* Map Section */}
      <div className="h-64 w-full bg-slate-100 border-b border-slate-200 relative">
        <RouteMap locations={pathLocations} />
        <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur px-2 py-1 text-[10px] text-slate-500 rounded shadow-sm z-[400]">
          Real-time Route
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Fare Card */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex justify-between items-center">
          <div>
            <p className="text-slate-500 text-sm">Total Fare</p>
            <p className="text-2xl font-bold text-slate-800">৳{result.totalFare}</p>
          </div>
          <div className="h-10 w-[1px] bg-slate-200"></div>
          <div>
            <p className="text-slate-500 text-sm">Time</p>
            <p className="text-2xl font-bold text-slate-800">~{result.estimatedTime}<span className="text-sm font-normal text-slate-500">m</span></p>
          </div>
        </div>

        {/* Features */}
        <div>
          <h3 className="font-semibold text-slate-800 mb-3">Amenities</h3>
          <div className="flex flex-wrap gap-2">
            {bus.features.map((feat, idx) => (
              <span key={idx} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs font-medium border border-blue-100">
                {getFeatureIcon(feat)}
                {feat}
              </span>
            ))}
          </div>
        </div>

        {/* Route Path List */}
        <div>
          <h3 className="font-semibold text-slate-800 mb-4">Stops ({pathLocations.length})</h3>
          <div className="relative pl-4 space-y-6 before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-200">
            {pathLocations.map((loc, idx) => {
              const isStart = idx === 0;
              const isEnd = idx === pathLocations.length - 1;
              return (
                <div key={loc.id} className="relative flex items-center gap-4">
                  <div className={`
                    absolute left-0 w-2.5 h-2.5 rounded-full ring-4 ring-white z-10
                    ${isStart ? 'bg-green-500' : isEnd ? 'bg-red-500' : 'bg-slate-300'}
                  `}></div>
                  <div className={`flex-1 p-3 rounded-lg ${isStart || isEnd ? 'bg-slate-50 border border-slate-100 shadow-sm' : ''}`}>
                    <p className={`font-medium ${isStart || isEnd ? 'text-slate-900' : 'text-slate-500'}`}>
                      {loc.name}
                    </p>
                    {(isStart || isEnd) && (
                      <p className="text-xs text-slate-400 mt-0.5">
                        {isStart ? 'Boarding Point' : 'Drop-off Point'}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Bottom Action */}
      <div className="p-4 border-t border-slate-100 bg-white">
        <button className="w-full bg-slate-900 text-white font-medium py-3 rounded-xl shadow-lg shadow-slate-200 hover:bg-slate-800 active:scale-[0.98] transition-all">
          Buy Ticket (Mock)
        </button>
      </div>
    </div>
  );
};

export default BusDetail;