import { Bus, RouteResult } from '../types';

// Updated to accept 'buses' as an argument so it works with dynamic Context data
export const findBuses = (fromId: string, toId: string, buses: Bus[]): RouteResult[] => {
  const results: RouteResult[] = [];

  buses.forEach(bus => {
    // Exact match for start and end location
    const startIndex = bus.routePoints.indexOf(fromId);
    const endIndex = bus.routePoints.indexOf(toId);

    // Check if both stops exist and direction is valid (start comes before end)
    if (startIndex !== -1 && endIndex !== -1 && startIndex < endIndex) {
      const stopsCount = endIndex - startIndex;
      const totalFare = bus.baseFare + (stopsCount * bus.farePerStop);
      // Rough estimate: 5 mins per stop + 10 mins base buffer
      const estimatedTime = 10 + (stopsCount * 5); 
      
      const path = bus.routePoints.slice(startIndex, endIndex + 1);

      results.push({
        bus,
        startLocationId: fromId,
        endLocationId: toId,
        totalFare,
        stopsCount,
        estimatedTime,
        path
      });
    }
  });

  return results.sort((a, b) => a.estimatedTime - b.estimatedTime);
};

// Helper to generate a result object representing the full route of a bus
export const getBusFullRoute = (bus: Bus): RouteResult => {
  const stopsCount = bus.routePoints.length > 1 ? bus.routePoints.length - 1 : 0;
  const totalFare = bus.baseFare + (stopsCount * bus.farePerStop);
  const estimatedTime = 10 + (stopsCount * 5);
  
  return {
    bus,
    startLocationId: bus.routePoints[0] || '',
    endLocationId: bus.routePoints[bus.routePoints.length - 1] || '',
    totalFare,
    stopsCount: bus.routePoints.length, // Total stops count
    estimatedTime,
    path: bus.routePoints
  };
};