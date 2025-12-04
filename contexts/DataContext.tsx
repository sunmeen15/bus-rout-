import React, { createContext, useContext, useState, useEffect } from 'react';
import { Location, Bus } from '../types';
import { LOCATIONS as INITIAL_LOCATIONS, BUSES as INITIAL_BUSES } from '../constants';

interface DataContextType {
  locations: Location[];
  buses: Bus[];
  addLocation: (loc: Location) => void;
  updateLocation: (loc: Location) => void;
  deleteLocation: (id: string) => void;
  addBus: (bus: Bus) => void;
  updateBus: (bus: Bus) => void;
  deleteBus: (id: string) => void;
  resetToDefaults: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locations, setLocations] = useState<Location[]>(INITIAL_LOCATIONS);
  const [buses, setBuses] = useState<Bus[]>(INITIAL_BUSES);

  // Load from LocalStorage on mount
  useEffect(() => {
    const savedLocs = localStorage.getItem('dhaka_chaka_locations');
    const savedBuses = localStorage.getItem('dhaka_chaka_buses');

    if (savedLocs) {
      try {
        setLocations(JSON.parse(savedLocs));
      } catch (e) {
        console.error("Failed to parse saved locations");
      }
    }
    if (savedBuses) {
      try {
        setBuses(JSON.parse(savedBuses));
      } catch (e) {
        console.error("Failed to parse saved buses");
      }
    }
  }, []);

  // Save to LocalStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('dhaka_chaka_locations', JSON.stringify(locations));
  }, [locations]);

  useEffect(() => {
    localStorage.setItem('dhaka_chaka_buses', JSON.stringify(buses));
  }, [buses]);

  const addLocation = (loc: Location) => {
    setLocations(prev => [...prev, loc]);
  };

  const updateLocation = (loc: Location) => {
    setLocations(prev => prev.map(l => l.id === loc.id ? loc : l));
  };

  const deleteLocation = (id: string) => {
    setLocations(prev => prev.filter(l => l.id !== id));
    // Also remove this location from any bus routes to prevent crashes
    setBuses(prev => prev.map(bus => ({
      ...bus,
      routePoints: bus.routePoints.filter(pid => pid !== id)
    })));
  };

  const addBus = (bus: Bus) => {
    setBuses(prev => [...prev, bus]);
  };

  const updateBus = (bus: Bus) => {
    setBuses(prev => prev.map(b => b.id === bus.id ? bus : b));
  };

  const deleteBus = (id: string) => {
    setBuses(prev => prev.filter(b => b.id !== id));
  };

  const resetToDefaults = () => {
    if (confirm('Are you sure? This will wipe all your custom changes and restore original data.')) {
      setLocations(INITIAL_LOCATIONS);
      setBuses(INITIAL_BUSES);
      localStorage.removeItem('dhaka_chaka_locations');
      localStorage.removeItem('dhaka_chaka_buses');
    }
  };

  return (
    <DataContext.Provider value={{
      locations,
      buses,
      addLocation,
      updateLocation,
      deleteLocation,
      addBus,
      updateBus,
      deleteBus,
      resetToDefaults
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};