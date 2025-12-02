import React from 'react';
import { RouteResult } from '../types';
import { Clock, Banknote, MapPin } from 'lucide-react';

interface BusCardProps {
  result: RouteResult;
  onClick: () => void;
}

const BusCard: React.FC<BusCardProps> = ({ result, onClick }) => {
  const { bus, totalFare, estimatedTime, stopsCount } = result;

  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 hover:shadow-md transition-shadow cursor-pointer flex flex-col gap-3 group active:scale-[0.98] transition-transform"
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
            {bus.name}
          </h3>
          <span className={`inline-block px-2 py-0.5 text-xs rounded text-white font-medium ${bus.color}`}>
            {bus.type}
          </span>
        </div>
        <div className="text-right">
          <div className="text-xl font-bold text-slate-900">৳{totalFare}</div>
          <div className="text-xs text-slate-500">per person</div>
        </div>
      </div>

      <div className="flex items-center gap-4 text-sm text-slate-600 mt-2">
        <div className="flex items-center gap-1.5">
          <Clock size={16} className="text-blue-500" />
          <span>{estimatedTime} mins</span>
        </div>
        <div className="flex items-center gap-1.5">
          <MapPin size={16} className="text-blue-500" />
          <span>{stopsCount} stops</span>
        </div>
      </div>

      <div className="w-full bg-slate-50 h-1.5 rounded-full mt-2 overflow-hidden">
        <div className={`h-full ${bus.color} opacity-70 w-2/3`}></div>
      </div>
    </div>
  );
};

export default BusCard;
