import React, { useState, useEffect, useRef } from 'react';
import { useData } from '../contexts/DataContext';
import { Location, Bus } from '../types';
import L from 'leaflet';
import { X, Plus, Save, Trash2, MapPin, Bus as BusIcon, Download, RotateCcw } from 'lucide-react';

// --- Sub-component: Admin Map for picking coordinates ---
const AdminMap: React.FC<{ 
  selectedLat?: number, 
  selectedLng?: number, 
  onPick: (lat: number, lng: number) => void,
  existingLocations: Location[],
  onSelectExisting: (loc: Location) => void
}> = ({ selectedLat, selectedLng, onPick, existingLocations, onSelectExisting }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const draggableMarkerRef = useRef<L.Marker | null>(null);
  const stopsLayerRef = useRef<L.LayerGroup | null>(null);

  // 1. Initialize Map (Once)
  useEffect(() => {
    if (!mapRef.current) return;
    if (mapInstance.current) return;

    const map = L.map(mapRef.current, {
      zoomControl: false
    }).setView([23.7937, 90.4043], 12);
    
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 20
    }).addTo(map);

    L.control.zoom({ position: 'topright' }).addTo(map);

    // Layer group for existing stops
    stopsLayerRef.current = L.layerGroup().addTo(map);

    // Handle Map Clicks (Pick new location)
    map.on('click', (e: L.LeafletMouseEvent) => {
      onPick(e.latlng.lat, e.latlng.lng);
    });

    mapInstance.current = map;
    
    // Resize fix
    setTimeout(() => map.invalidateSize(), 100);
  }, []);

  // 2. Render Existing Locations (Reactive)
  useEffect(() => {
    if (!mapInstance.current || !stopsLayerRef.current) return;
    
    // Clear old markers to prevent duplicates
    stopsLayerRef.current.clearLayers();

    existingLocations.forEach(loc => {
       // Check if this location is the one currently being edited (matches coords)
       const marker = L.circleMarker([loc.lat, loc.lng], {
         radius: 8, // Bigger for easier clicking
         color: '#3b82f6', // Blue border
         fillColor: '#eff6ff', // Light blue fill
         fillOpacity: 0.8,
         weight: 2,
         className: 'cursor-pointer interactive-marker'
       });
       
       marker.bindTooltip(loc.name, { direction: 'top', offset: [0, -8], opacity: 0.9 });

       // Click handler to SELECT this location for editing
       marker.on('click', (e) => {
          L.DomEvent.stopPropagation(e); // Stop map click (which would create new point)
          onSelectExisting(loc);
       });

       stopsLayerRef.current.addLayer(marker);
    });
  }, [existingLocations, onSelectExisting]);

  // 3. Manage Draggable Marker (The "Editor" Pin)
  useEffect(() => {
    if (!mapInstance.current) return;
    const map = mapInstance.current;

    if (selectedLat && selectedLng) {
      if (draggableMarkerRef.current) {
        // Move existing marker
        draggableMarkerRef.current.setLatLng([selectedLat, selectedLng]);
      } else {
        // Create new draggable marker
        const marker = L.marker([selectedLat, selectedLng], { 
          draggable: true,
          zIndexOffset: 1000 // Ensure it's on top
        }).addTo(map);
        
        marker.on('drag', (e) => {
           // Real-time update while dragging (optional, but smoother feel if connected to input)
        });

        marker.on('dragend', (e) => {
          const m = e.target as L.Marker;
          const pos = m.getLatLng();
          onPick(pos.lat, pos.lng);
        });
        
        draggableMarkerRef.current = marker;
      }
      
      // Auto-pan to selection if it's far
      if (!map.getBounds().contains([selectedLat, selectedLng])) {
         map.panTo([selectedLat, selectedLng]);
      }

    } else {
      // Remove marker if no selection
      if (draggableMarkerRef.current) {
        draggableMarkerRef.current.remove();
        draggableMarkerRef.current = null;
      }
    }
  }, [selectedLat, selectedLng, onPick]);

  return <div ref={mapRef} className="w-full h-80 bg-slate-100 rounded-lg border border-slate-300 relative z-0" />;
};


// --- Main Admin Component ---
const AdminPanel: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { locations, buses, addLocation, updateLocation, deleteLocation, addBus, updateBus, deleteBus, resetToDefaults } = useData();
  const [activeTab, setActiveTab] = useState<'locations' | 'buses'>('locations');
  
  // Location Form State
  const [editingLoc, setEditingLoc] = useState<Partial<Location>>({});
  const [isNewLoc, setIsNewLoc] = useState(true);

  // Bus Form State
  const [editingBus, setEditingBus] = useState<Partial<Bus>>({
    features: [],
    routePoints: []
  });
  const [isNewBus, setIsNewBus] = useState(true);

  // --- Location Handlers ---
  const handleEditLocation = (loc: Location) => {
    setEditingLoc({ ...loc }); // Copy to avoid direct mutation
    setIsNewLoc(false);
    setActiveTab('locations');
  };

  const handleSaveLocation = () => {
    if (!editingLoc.id || !editingLoc.name || !editingLoc.lat || !editingLoc.lng) {
      alert("Please fill ID, Name and pick a location on map");
      return;
    }
    const locData = { ...editingLoc, x: 50, y: 50 } as Location; // x,y are legacy SVG coords, defaulting
    if (isNewLoc) {
      // Check ID conflict
      if (locations.some(l => l.id === locData.id)) {
        alert("ID already exists! Use a unique ID.");
        return;
      }
      addLocation(locData);
    } else {
      updateLocation(locData);
    }
    setEditingLoc({});
    setIsNewLoc(true);
  };

  // --- Bus Handlers ---
  const handleEditBus = (bus: Bus) => {
    setEditingBus(bus);
    setIsNewBus(false);
    setActiveTab('buses');
  };

  const handleSaveBus = () => {
    if (!editingBus.id || !editingBus.name || !editingBus.routePoints || editingBus.routePoints.length < 2) {
      alert("Please fill name, ID, and select at least 2 stops");
      return;
    }
    const busData = {
       type: 'Local', 
       color: 'bg-slate-600', 
       baseFare: 10, 
       farePerStop: 2,
       image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800',
       features: [],
       ...editingBus 
    } as Bus;

    if (isNewBus) {
      if (buses.some(b => b.id === busData.id)) {
        alert("Bus ID exists");
        return;
      }
      addBus(busData);
    } else {
      updateBus(busData);
    }
    setEditingBus({ features: [], routePoints: [] });
    setIsNewBus(true);
  };

  // --- Export Data ---
  const handleExport = () => {
    const data = { LOCATIONS: locations, BUSES: buses };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dhaka_chaka_data.json';
    a.click();
  };

  return (
    <div className="fixed inset-0 z-[5000] bg-slate-50 overflow-y-auto">
      {/* Header */}
      <div className="bg-slate-900 text-white p-4 sticky top-0 z-[5001] flex justify-between items-center shadow-md">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <MapPin className="text-blue-400" /> Admin Panel
        </h2>
        <div className="flex gap-2">
           <button onClick={handleExport} className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 rounded text-sm flex items-center gap-2">
             <Download size={16} /> Export JSON
           </button>
           <button onClick={resetToDefaults} className="px-3 py-1.5 bg-red-600 hover:bg-red-500 rounded text-sm flex items-center gap-2">
             <RotateCcw size={16} /> Reset
           </button>
           <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-full">
            <X size={24} />
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: Editors */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 sticky top-24">
            <div className="flex gap-2 mb-4">
              <button 
                onClick={() => setActiveTab('locations')}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-colors ${activeTab === 'locations' ? 'bg-blue-100 text-blue-700' : 'bg-slate-50 text-slate-600'}`}
              >
                Stops
              </button>
              <button 
                onClick={() => setActiveTab('buses')}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-colors ${activeTab === 'buses' ? 'bg-blue-100 text-blue-700' : 'bg-slate-50 text-slate-600'}`}
              >
                Buses
              </button>
            </div>

            {/* LOCATION EDITOR */}
            {activeTab === 'locations' && (
              <div className="space-y-3">
                <h3 className="font-bold text-slate-800 border-b pb-2">{isNewLoc ? 'Add New Stop' : 'Edit Stop'}</h3>
                
                <AdminMap 
                  selectedLat={editingLoc.lat} 
                  selectedLng={editingLoc.lng} 
                  existingLocations={locations}
                  onPick={(lat, lng) => setEditingLoc(prev => ({ ...prev, lat, lng }))} 
                  onSelectExisting={handleEditLocation}
                />
                <div className="text-xs text-slate-500 text-center italic bg-yellow-50 p-2 rounded border border-yellow-100">
                  Tip: Click any blue circle to edit. Drag the blue pin to move it.
                </div>
                
                <div className="space-y-2">
                  <div>
                    <label className="text-xs font-semibold text-slate-500">ID (Unique)</label>
                    <input 
                      className="w-full border p-2 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                      placeholder="e.g. mirpur_10" 
                      value={editingLoc.id || ''} 
                      onChange={e => setEditingLoc({...editingLoc, id: e.target.value})}
                      disabled={!isNewLoc}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500">Display Name</label>
                    <input 
                      className="w-full border p-2 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                      placeholder="e.g. Mirpur 10" 
                      value={editingLoc.name || ''} 
                      onChange={e => setEditingLoc({...editingLoc, name: e.target.value})}
                    />
                  </div>
                  <div className="flex gap-2">
                    <input className="w-1/2 border p-2 rounded text-xs bg-slate-50 text-slate-500" value={editingLoc.lat?.toFixed(5) || ''} readOnly placeholder="Lat" />
                    <input className="w-1/2 border p-2 rounded text-xs bg-slate-50 text-slate-500" value={editingLoc.lng?.toFixed(5) || ''} readOnly placeholder="Lng" />
                  </div>
                </div>
                
                <div className="flex gap-2 pt-2">
                  <button onClick={handleSaveLocation} className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded flex items-center justify-center gap-2 transition-colors">
                    <Save size={16} /> Save Stop
                  </button>
                  {!isNewLoc && (
                    <button onClick={() => {setEditingLoc({}); setIsNewLoc(true)}} className="px-3 bg-slate-200 hover:bg-slate-300 rounded text-slate-600 transition-colors">
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* BUS EDITOR */}
            {activeTab === 'buses' && (
              <div className="space-y-3">
                <h3 className="font-bold text-slate-800 border-b pb-2">{isNewBus ? 'Add New Bus' : 'Edit Bus'}</h3>
                
                <div className="grid grid-cols-2 gap-2">
                   <div>
                      <label className="text-xs font-semibold text-slate-500">Bus ID</label>
                      <input 
                        className="w-full border p-2 rounded text-sm" 
                        placeholder="raida" 
                        value={editingBus.id || ''} 
                        onChange={e => setEditingBus({...editingBus, id: e.target.value})}
                        disabled={!isNewBus}
                      />
                   </div>
                   <div>
                      <label className="text-xs font-semibold text-slate-500">Service Type</label>
                      <select 
                        className="w-full border p-2 rounded text-sm"
                        value={editingBus.type || 'Local'}
                        onChange={e => setEditingBus({...editingBus, type: e.target.value as any})}
                      >
                        <option value="Local">Local</option>
                        <option value="Sitting Service">Sitting Service</option>
                        <option value="AC">AC</option>
                      </select>
                   </div>
                </div>
                
                <div>
                  <label className="text-xs font-semibold text-slate-500">Bus Name</label>
                  <input 
                    className="w-full border p-2 rounded text-sm" 
                    placeholder="Raida Paribahan" 
                    value={editingBus.name || ''} 
                    onChange={e => setEditingBus({...editingBus, name: e.target.value})}
                  />
                </div>

                <div className="flex gap-2">
                   <div className="w-1/2">
                    <label className="text-xs font-semibold text-slate-500">Base Fare</label>
                    <input 
                      type="number"
                      className="w-full border p-2 rounded text-sm" 
                      value={editingBus.baseFare || ''} 
                      onChange={e => setEditingBus({...editingBus, baseFare: Number(e.target.value)})}
                    />
                   </div>
                   <div className="w-1/2">
                    <label className="text-xs font-semibold text-slate-500">Fare/Stop</label>
                    <input 
                      type="number"
                      className="w-full border p-2 rounded text-sm" 
                      value={editingBus.farePerStop || ''} 
                      onChange={e => setEditingBus({...editingBus, farePerStop: Number(e.target.value)})}
                    />
                   </div>
                </div>

                <div className="border rounded p-2 max-h-64 overflow-y-auto bg-slate-50">
                  <p className="text-xs font-bold mb-2 sticky top-0 bg-slate-50 pb-1 border-b">Select Route Stops (Click to Add/Remove)</p>
                  <div className="space-y-1">
                    {locations.sort((a,b) => a.name.localeCompare(b.name)).map(loc => {
                      const idx = editingBus.routePoints?.indexOf(loc.id) ?? -1;
                      const isSelected = idx !== -1;
                      return (
                        <div 
                          key={loc.id} 
                          onClick={() => {
                             const current = editingBus.routePoints || [];
                             if (isSelected) {
                               setEditingBus({...editingBus, routePoints: current.filter(id => id !== loc.id)});
                             } else {
                               setEditingBus({...editingBus, routePoints: [...current, loc.id]});
                             }
                          }}
                          className={`text-xs p-2 rounded cursor-pointer flex justify-between items-center transition-colors ${isSelected ? 'bg-blue-600 text-white shadow-sm' : 'bg-white hover:bg-slate-100 border border-slate-100'}`}
                        >
                          <span className="font-medium">{loc.name}</span>
                          {isSelected && <span className="bg-white/20 px-1.5 rounded font-mono text-[10px]">{idx + 1}</span>}
                        </div>
                      )
                    })}
                  </div>
                </div>
                
                {/* Selected Route Preview */}
                {editingBus.routePoints && editingBus.routePoints.length > 0 && (
                  <div className="text-[10px] text-slate-500 bg-white p-2 rounded border border-slate-200">
                    <span className="font-bold">Path:</span> {editingBus.routePoints.map(id => locations.find(l => l.id === id)?.name).join(' → ')}
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <button onClick={handleSaveBus} className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded flex items-center justify-center gap-2 transition-colors">
                    <Save size={16} /> Save Bus
                  </button>
                  {!isNewBus && (
                    <button onClick={() => {setEditingBus({features:[], routePoints:[]}); setIsNewBus(true)}} className="px-3 bg-slate-200 hover:bg-slate-300 rounded text-slate-600 transition-colors">
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Lists */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full max-h-[calc(100vh-120px)]">
             <div className="bg-slate-50 p-3 border-b flex justify-between font-bold text-slate-700 sticky top-0 z-10">
               <span>{activeTab === 'locations' ? `All Stops (${locations.length})` : `All Buses (${buses.length})`}</span>
             </div>
             
             <div className="overflow-y-auto p-2 grid grid-cols-1 sm:grid-cols-2 gap-2 content-start">
               {activeTab === 'locations' && locations.map(loc => (
                 <div key={loc.id} className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded shadow-sm hover:shadow-md transition-shadow group">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 text-blue-600 p-2 rounded-full">
                        <MapPin size={16} />
                      </div>
                      <div>
                        <div className="font-semibold text-sm text-slate-800">{loc.name}</div>
                        <div className="text-xs text-slate-400 font-mono">{loc.id}</div>
                      </div>
                    </div>
                    <div className="flex gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                       <button onClick={() => handleEditLocation(loc)} className="text-blue-600 text-xs hover:bg-blue-50 px-2 py-1 rounded">Edit</button>
                       <button onClick={() => { if(confirm('Delete?')) deleteLocation(loc.id) }} className="text-red-600 hover:bg-red-50 p-1.5 rounded">
                         <Trash2 size={14} />
                       </button>
                    </div>
                 </div>
               ))}

               {activeTab === 'buses' && buses.map(bus => (
                 <div key={bus.id} className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded shadow-sm hover:shadow-md transition-shadow group">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${bus.color} shadow-sm`}>
                        <BusIcon size={14} />
                      </div>
                      <div>
                        <div className="font-semibold text-sm text-slate-800">{bus.name}</div>
                        <div className="text-xs text-slate-400">{bus.routePoints.length} stops • ৳{bus.baseFare}+</div>
                      </div>
                    </div>
                    <div className="flex gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                       <button onClick={() => handleEditBus(bus)} className="text-blue-600 text-xs hover:bg-blue-50 px-2 py-1 rounded">Edit</button>
                       <button onClick={() => { if(confirm('Delete?')) deleteBus(bus.id) }} className="text-red-600 hover:bg-red-50 p-1.5 rounded">
                         <Trash2 size={14} />
                       </button>
                    </div>
                 </div>
               ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;