import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Location } from '../types';

interface RouteMapProps {
  locations: Location[];
}

const RouteMap: React.FC<RouteMapProps> = ({ locations }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || locations.length === 0) return;

    // Initialize Map if needed
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current, {
        zoomControl: false,
        attributionControl: false
      }).setView([23.8103, 90.4125], 12);

      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        subdomains: 'abcd',
        maxZoom: 20
      }).addTo(mapInstanceRef.current);
    }

    const map = mapInstanceRef.current;

    // Clear existing layers to prevent duplication on re-renders
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.Polyline) {
        map.removeLayer(layer);
      }
    });

    // 1. Draw the Path (Blue marked road)
    const latLngs = locations.map(l => [l.lat, l.lng] as [number, number]);
    
    // Outer glow for visibility
    L.polyline(latLngs, {
      color: '#2563eb', // Darker blue
      weight: 8,
      opacity: 0.2,
      lineJoin: 'round',
      lineCap: 'round'
    }).addTo(map);

    // Main line
    const routeLine = L.polyline(latLngs, {
      color: '#3b82f6', // Bright blue (Tailwind blue-500)
      weight: 4,
      opacity: 1,
      dashArray: '10, 10', // Dashed line implies transit route
      lineJoin: 'round',
      lineCap: 'round'
    }).addTo(map);

    // 2. Add Markers for stops
    locations.forEach((loc, index) => {
      const isStart = index === 0;
      const isEnd = index === locations.length - 1;
      
      let color = '#cbd5e1'; // slate-300 for stops
      let size = 10;
      let zIndex = 100;

      if (isStart) { color = '#22c55e'; size = 16; zIndex = 1000; } // Green
      if (isEnd) { color = '#ef4444'; size = 16; zIndex = 1000; } // Red

      const icon = L.divIcon({
        className: 'route-stop-marker',
        html: `<div style="
          background-color: ${color};
          width: ${size}px;
          height: ${size}px;
          border-radius: 50%;
          border: 2px solid white;
          box-shadow: 0 1px 3px rgba(0,0,0,0.3);
        "></div>`,
        iconSize: [size, size],
        iconAnchor: [size/2, size/2],
      });

      L.marker([loc.lat, loc.lng], { icon, zIndexOffset: zIndex })
        .addTo(map)
        .bindPopup(`
          <div class="text-xs font-bold text-slate-700">${loc.name}</div>
        `, { closeButton: false, offset: [0, -5] });
    });

    // 3. Fit bounds
    if (latLngs.length > 0) {
      map.fitBounds(routeLine.getBounds(), { 
        padding: [50, 50],
        maxZoom: 15,
        animate: true 
      });
    }

    // Cleanup on unmount
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [locations]);

  return <div ref={mapRef} className="w-full h-full bg-slate-100 z-0" />;
};

export default RouteMap;