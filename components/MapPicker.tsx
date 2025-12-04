import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Location } from '../types';
import { X } from 'lucide-react';

interface MapPickerProps {
  locations: Location[];
  onSelect: (location: Location) => void;
  onClose: () => void;
  selectedStart?: string;
  selectedEnd?: string;
  isSelecting: 'start' | 'end';
}

const MapPicker: React.FC<MapPickerProps> = ({ locations, onSelect, onClose, selectedStart, selectedEnd, isSelecting }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapContainerRef.current, {
        zoomControl: false,
        attributionControl: false
      }).setView([23.7937, 90.4043], 12); // Center on Dhaka

      // Add Tile Layer
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        subdomains: 'abcd',
        maxZoom: 20
      }).addTo(mapInstanceRef.current);

      L.control.zoom({ position: 'topright' }).addTo(mapInstanceRef.current);
      L.control.attribution({ position: 'bottomright', prefix: false }).addTo(mapInstanceRef.current);
    }

    const map = mapInstanceRef.current;

    // Fix for map not rendering correctly in modal
    setTimeout(() => {
      map.invalidateSize();
    }, 100);

    // Cleanup on unmount
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markersRef.current = {};
      }
    };
  }, []);

  // Update Markers (Reactive to locations prop)
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    // Clear old markers
    Object.values(markersRef.current).forEach((marker: L.Marker) => marker.remove());
    markersRef.current = {};

    // Create Markers for all locations
    locations.forEach(loc => {
      // Create marker
      const marker = L.marker([loc.lat, loc.lng], {
        icon: createMarkerIcon('default')
      }).addTo(map);

      // Bind Popup
      marker.bindPopup(`
        <div style="font-family: sans-serif; text-align: center; padding: 4px;">
          <div style="font-weight: 600; color: #1e293b; margin-bottom: 2px;">${loc.name}</div>
          <div style="font-size: 11px; color: #64748b;">Tap to select</div>
        </div>
      `, { closeButton: false, offset: [0, -10] });

      // Events
      marker.on('click', () => {
        onSelect(loc);
      });

      marker.on('mouseover', () => marker.openPopup());
      marker.on('mouseout', () => marker.closePopup());

      markersRef.current[loc.id] = marker;
    });

    // Re-apply highlights if selection exists
    updateMarkerHighlights();
  }, [locations, onSelect]);

  // Update Markers Style when selection changes
  const updateMarkerHighlights = () => {
    Object.keys(markersRef.current).forEach(id => {
      const marker = markersRef.current[id];
      let type: 'default' | 'start' | 'end' = 'default';

      if (id === selectedStart) type = 'start';
      else if (id === selectedEnd) type = 'end';

      marker.setIcon(createMarkerIcon(type));
      marker.setZIndexOffset(type !== 'default' ? 1000 : 0);
    });
  };

  useEffect(() => {
    updateMarkerHighlights();
  }, [selectedStart, selectedEnd]);

  // Helper to create custom icons
  const createMarkerIcon = (type: 'default' | 'start' | 'end') => {
    let color = '#64748b'; // slate-500
    let size = 14;
    
    if (type === 'start') { color = '#22c55e'; size = 20; } // green-500
    if (type === 'end') { color = '#ef4444'; size = 20; } // red-500

    return L.divIcon({
      className: 'custom-map-marker',
      html: `<div style="
        background-color: ${color};
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      "></div>`,
      iconSize: [size, size],
      iconAnchor: [size/2, size/2],
      popupAnchor: [0, -size/2]
    });
  };

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainerRef} className="w-full h-full bg-slate-100 z-0" />
      
      {/* Close Button Inside Map (Easy Access) */}
      <button 
        onClick={onClose}
        className="absolute top-4 right-14 z-[400] bg-white p-2 rounded-lg shadow-md hover:bg-slate-50 text-slate-600 transition-colors"
        title="Close Map"
      >
        <X size={20} />
      </button>

      {/* Floating Instruction Pill */}
      <div className="absolute top-4 left-4 z-[400] bg-white/95 backdrop-blur px-5 py-2.5 rounded-full shadow-lg border border-slate-100/50 pointer-events-none transition-all animate-in fade-in slide-in-from-top-4">
        <p className="text-sm font-medium text-slate-700 whitespace-nowrap flex items-center gap-2">
          <span>Tap to set</span>
          <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide text-white shadow-sm ${isSelecting === 'start' ? 'bg-green-500' : 'bg-red-500'}`}>
            {isSelecting === 'start' ? 'Start' : 'End'}
          </span>
        </p>
      </div>
    </div>
  );
};

export default MapPicker;