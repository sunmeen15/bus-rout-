export interface Location {
  id: string;
  name: string;
  x: number; // Percentage coordinate for SVG map (0-100)
  y: number; // Percentage coordinate for SVG map (0-100)
  lat: number;
  lng: number;
}

export interface BusStop {
  locationId: string;
  order: number;
}

export interface Bus {
  id: string;
  name: string;
  type: 'Local' | 'Sitting Service' | 'AC';
  image: string;
  routePoints: string[]; // List of Location IDs in order
  baseFare: number;
  farePerStop: number;
  color: string;
  features: string[];
}

export interface RouteResult {
  bus: Bus;
  startLocationId: string;
  endLocationId: string;
  totalFare: number;
  stopsCount: number;
  estimatedTime: number; // in minutes
  path: string[]; // Array of location IDs involved in the trip
}

export type ScreenView = 'SEARCH' | 'RESULTS' | 'DETAILS';

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
}