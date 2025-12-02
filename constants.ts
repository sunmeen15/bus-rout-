import { Location, Bus } from './types';

// Expanded list of key Dhaka locations with real coordinates
export const LOCATIONS: Location[] = [
  // North
  { id: 'abdullahpur', name: 'Abdullahpur', x: 50, y: 5, lat: 23.8785, lng: 90.3995 },
  { id: 'uttara', name: 'Uttara (House Bldg)', x: 50, y: 10, lat: 23.8728, lng: 90.3984 },
  { id: 'airport', name: 'Airport', x: 50, y: 20, lat: 23.8518, lng: 90.4081 },
  { id: 'khilkhet', name: 'Khilkhet', x: 55, y: 22, lat: 23.8327, lng: 90.4172 },
  { id: 'kuril', name: 'Kuril Bishwa Road', x: 65, y: 25, lat: 23.8223, lng: 90.4275 },
  { id: 'bashundhara', name: 'Bashundhara Gate', x: 70, y: 28, lat: 23.8139, lng: 90.4233 },
  { id: 'notun_bazar', name: 'Notun Bazar', x: 70, y: 32, lat: 23.7954, lng: 90.4251 },
  
  // Mirpur Area
  { id: 'mirpur_zoo', name: 'Mirpur Zoo/Sony', x: 15, y: 15, lat: 23.8115, lng: 90.3496 },
  { id: 'mirpur12', name: 'Mirpur 12', x: 20, y: 20, lat: 23.8273, lng: 90.3639 },
  { id: 'mirpur10', name: 'Mirpur 10', x: 20, y: 30, lat: 23.8069, lng: 90.3686 },
  { id: 'kazipara', name: 'Kazipara', x: 25, y: 35, lat: 23.7972, lng: 90.3725 },
  { id: 'shewrapara', name: 'Shewrapara', x: 25, y: 38, lat: 23.7885, lng: 90.3752 },
  { id: 'mirpur1', name: 'Mirpur 1', x: 20, y: 40, lat: 23.7956, lng: 90.3537 },
  { id: 'gabtoli', name: 'Gabtoli', x: 10, y: 45, lat: 23.7837, lng: 90.3442 },
  { id: 'kallyanpur', name: 'Kallyanpur', x: 20, y: 48, lat: 23.7785, lng: 90.3620 },
  { id: 'shyamoli', name: 'Shyamoli', x: 30, y: 50, lat: 23.7718, lng: 90.3631 },
  { id: 'kalshi', name: 'Kalshi', x: 25, y: 15, lat: 23.8197, lng: 90.3808 },
  
  // Central
  { id: 'agargaon', name: 'Agargaon', x: 30, y: 45, lat: 23.7763, lng: 90.3736 },
  { id: 'bijoy_sarani', name: 'Bijoy Sarani', x: 40, y: 50, lat: 23.7663, lng: 90.3891 },
  { id: 'mohakhali', name: 'Mohakhali', x: 50, y: 45, lat: 23.7776, lng: 90.4048 },
  { id: 'banani', name: 'Banani', x: 55, y: 40, lat: 23.7937, lng: 90.4043 },
  { id: 'gulshan1', name: 'Gulshan 1', x: 65, y: 45, lat: 23.7786, lng: 90.4165 },
  { id: 'gulshan2', name: 'Gulshan 2', x: 65, y: 42, lat: 23.7979, lng: 90.4144 },
  { id: 'farmgate', name: 'Farmgate', x: 45, y: 55, lat: 23.7561, lng: 90.3871 },
  { id: 'karwan_bazar', name: 'Karwan Bazar', x: 45, y: 58, lat: 23.7508, lng: 90.3934 },
  { id: 'bangla_motor', name: 'Bangla Motor', x: 50, y: 60, lat: 23.7460, lng: 90.3952 },
  { id: 'mogbazar', name: 'Mogbazar', x: 55, y: 60, lat: 23.7494, lng: 90.4087 },
  { id: 'malibagh', name: 'Malibagh', x: 60, y: 62, lat: 23.7483, lng: 90.4120 },
  { id: 'shantinagar', name: 'Shantinagar', x: 58, y: 65, lat: 23.7420, lng: 90.4146 },
  
  // South/Old Dhaka
  { id: 'dhanmondi27', name: 'Dhanmondi 27', x: 35, y: 60, lat: 23.7543, lng: 90.3722 },
  { id: 'dhanmondi32', name: 'Dhanmondi 32', x: 38, y: 62, lat: 23.7513, lng: 90.3778 },
  { id: 'asad_gate', name: 'Asad Gate', x: 32, y: 55, lat: 23.7621, lng: 90.3752 },
  { id: 'science_lab', name: 'Science Lab', x: 40, y: 65, lat: 23.7390, lng: 90.3835 },
  { id: 'new_market', name: 'New Market', x: 40, y: 68, lat: 23.7335, lng: 90.3853 },
  { id: 'nilkhet', name: 'Nilkhet', x: 42, y: 69, lat: 23.7314, lng: 90.3875 },
  { id: 'azimpur', name: 'Azimpur', x: 42, y: 75, lat: 23.7276, lng: 90.3861 },
  { id: 'shahbag', name: 'Shahbag', x: 50, y: 70, lat: 23.7381, lng: 90.3957 },
  { id: 'paltan', name: 'Paltan', x: 52, y: 75, lat: 23.7297, lng: 90.4093 },
  { id: 'motijheel', name: 'Motijheel', x: 55, y: 80, lat: 23.7330, lng: 90.4172 },
  { id: 'sadarghat', name: 'Sadarghat', x: 55, y: 90, lat: 23.7048, lng: 90.4124 },
  { id: 'gulistan', name: 'Gulistan', x: 53, y: 82, lat: 23.7246, lng: 90.4116 },
  
  // East/West Edges
  { id: 'badda', name: 'Middle Badda', x: 70, y: 35, lat: 23.7806, lng: 90.4267 },
  { id: 'rampura', name: 'Rampura', x: 70, y: 50, lat: 23.7612, lng: 90.4208 },
  { id: 'khilgaon', name: 'Khilgaon', x: 72, y: 55, lat: 23.7490, lng: 90.4261 },
  { id: 'bashabo', name: 'Bashabo', x: 75, y: 60, lat: 23.7431, lng: 90.4326 },
  { id: 'jatrabari', name: 'Jatrabari', x: 65, y: 85, lat: 23.7126, lng: 90.4304 },
  { id: 'sayedabad', name: 'Sayedabad', x: 63, y: 83, lat: 23.7188, lng: 90.4244 },
  { id: 'signboard', name: 'Signboard', x: 70, y: 90, lat: 23.6938, lng: 90.4705 },
  { id: 'mohammadpur', name: 'Mohammadpur', x: 25, y: 55, lat: 23.7658, lng: 90.3584 },
  { id: 'bosila', name: 'Bosila', x: 20, y: 60, lat: 23.7528, lng: 90.3478 },
  { id: 'savar', name: 'Savar', x: 0, y: 30, lat: 23.8483, lng: 90.2672 },
  { id: 'demra', name: 'Demra', x: 80, y: 80, lat: 23.7093, lng: 90.5059 },
  { id: 'kadamtoli', name: 'Kadamtoli', x: 60, y: 88, lat: 23.6961, lng: 90.4378 },
  { id: 'mugda', name: 'Mugda', x: 68, y: 70, lat: 23.7317, lng: 90.4338 },
];

// Comprehensive Bus List based on Real Dhaka Bus Routes
export const BUSES: Bus[] = [
  {
    id: 'raida',
    name: 'Raida Paribahan',
    type: 'Sitting Service',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=800&auto=format&fit=crop',
    color: 'bg-blue-600',
    baseFare: 15,
    farePerStop: 5,
    routePoints: ['abdullahpur', 'uttara', 'airport', 'khilkhet', 'kuril', 'notun_bazar', 'badda', 'rampura', 'malibagh', 'mogbazar', 'paltan', 'gulistan', 'jatrabari', 'signboard'],
    features: ['Wi-Fi', 'Comfortable Seats', 'Direct']
  },
  {
    id: 'victor_classic',
    name: 'Victor Classic',
    type: 'Local',
    image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?q=80&w=800&auto=format&fit=crop',
    color: 'bg-green-600',
    baseFare: 10,
    farePerStop: 3,
    routePoints: ['sadarghat', 'gulistan', 'paltan', 'shantinagar', 'malibagh', 'rampura', 'badda', 'notun_bazar', 'kuril', 'khilkhet', 'airport', 'uttara', 'abdullahpur'],
    features: ['Low Cost', 'Frequent Stops']
  },
  {
    id: 'akash',
    name: 'Akash Paribahan',
    type: 'Local',
    image: 'https://images.unsplash.com/photo-1606822368297-f5d6f8272915?q=80&w=800&auto=format&fit=crop',
    color: 'bg-indigo-600',
    baseFare: 10,
    farePerStop: 3,
    routePoints: ['kadamtoli', 'jatrabari', 'gulistan', 'mogbazar', 'mohakhali', 'banani', 'airport', 'uttara', 'abdullahpur'],
    features: ['Frequent Service']
  },
  {
    id: 'bikolpo',
    name: 'Bikolpo Auto',
    type: 'Sitting Service',
    image: 'https://images.unsplash.com/photo-1464219789935-c2d9d9aba644?q=80&w=800&auto=format&fit=crop',
    color: 'bg-purple-600',
    baseFare: 20,
    farePerStop: 5,
    routePoints: ['mirpur12', 'mirpur10', 'mirpur1', 'kallyanpur', 'shyamoli', 'asad_gate', 'farmgate', 'shahbag', 'paltan', 'motijheel'],
    features: ['Direct Route', 'Fan', 'Safe Driving']
  },
  {
    id: 'shikhor',
    name: 'Shikhor Paribahan',
    type: 'Sitting Service',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=800&auto=format&fit=crop',
    color: 'bg-sky-600',
    baseFare: 15,
    farePerStop: 4,
    routePoints: ['mirpur12', 'mirpur10', 'kazipara', 'agargaon', 'bijoy_sarani', 'farmgate', 'shahbag', 'paltan', 'jatrabari'],
    features: ['Comfortable']
  },
  {
    id: 'trans_silva',
    name: 'Trans Silva',
    type: 'Local',
    image: 'https://images.unsplash.com/photo-1557223562-6c77ef16210f?q=80&w=800&auto=format&fit=crop',
    color: 'bg-orange-600',
    baseFare: 10,
    farePerStop: 4,
    routePoints: ['mirpur1', 'kallyanpur', 'shyamoli', 'asad_gate', 'dhanmondi27', 'science_lab', 'shahbag', 'paltan', 'motijheel', 'sadarghat'],
    features: ['Available at Night', 'Spacious']
  },
  {
    id: 'dhaka_chaka',
    name: 'Dhaka Chaka',
    type: 'AC',
    image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?q=80&w=800&auto=format&fit=crop',
    color: 'bg-red-600',
    baseFare: 30,
    farePerStop: 15,
    routePoints: ['banani', 'gulshan2', 'gulshan1', 'badda', 'rampura'],
    features: ['Air Conditioned', 'Ticket System', 'Security', 'CCTV']
  },
  {
    id: 'alif',
    name: 'Alif Enterprise',
    type: 'Sitting Service',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=800&auto=format&fit=crop',
    color: 'bg-teal-600',
    baseFare: 15,
    farePerStop: 5,
    routePoints: ['mirpur10', 'mirpur_zoo', 'mirpur1', 'shyamoli', 'kallyanpur', 'gabtoli', 'savar'],
    features: ['Fast', 'Highway Bus']
  },
  {
    id: 'brtc_ac',
    name: 'BRTC AC (Double Decker)',
    type: 'AC',
    image: 'https://images.unsplash.com/photo-1532104333-e7a83d7265a9?q=80&w=800&auto=format&fit=crop',
    color: 'bg-red-700',
    baseFare: 20,
    farePerStop: 10,
    routePoints: ['abdullahpur', 'uttara', 'airport', 'banani', 'farmgate', 'shahbag', 'paltan', 'motijheel'],
    features: ['Double Decker', 'AC', 'State Owned']
  },
  {
    id: 'bihanga',
    name: 'Bihanga Paribahan',
    type: 'Local',
    image: 'https://images.unsplash.com/photo-1606822368297-f5d6f8272915?q=80&w=800&auto=format&fit=crop',
    color: 'bg-emerald-600',
    baseFare: 10,
    farePerStop: 3,
    routePoints: ['mirpur12', 'mirpur10', 'kazipara', 'mohakhali', 'gulshan1', 'badda'],
    features: ['Frequent', 'Connects Mirpur to Badda']
  },
  {
    id: 'dewan',
    name: 'Dewan Paribahan',
    type: 'Local',
    image: 'https://images.unsplash.com/photo-1464219789935-c2d9d9aba644?q=80&w=800&auto=format&fit=crop',
    color: 'bg-cyan-600',
    baseFare: 10,
    farePerStop: 4,
    routePoints: ['azimpur', 'nilkhet', 'new_market', 'science_lab', 'shyamoli', 'mohakhali', 'kuril'],
    features: ['Popular Route']
  },
  {
    id: 'turag',
    name: 'Turag Paribahan',
    type: 'Local',
    image: 'https://images.unsplash.com/photo-1557223562-6c77ef16210f?q=80&w=800&auto=format&fit=crop',
    color: 'bg-yellow-600',
    baseFare: 10,
    farePerStop: 3,
    routePoints: ['jatrabari', 'sayedabad', 'mugda', 'bashabo', 'khilgaon', 'rampura', 'badda', 'notun_bazar', 'kuril', 'uttara', 'abdullahpur'],
    features: ['Covers East Side', 'Crowded']
  },
  {
    id: 'achim',
    name: 'Achim Paribahan',
    type: 'Local',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=800&auto=format&fit=crop',
    color: 'bg-lime-600',
    baseFare: 10,
    farePerStop: 3,
    routePoints: ['gabtoli', 'mirpur1', 'mirpur10', 'kalshi', 'kuril', 'notun_bazar', 'badda', 'rampura', 'demra'],
    features: ['Long Route', 'Economy']
  },
  {
    id: 'prozapoti',
    name: 'Projapoti Paribahan',
    type: 'Sitting Service',
    image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?q=80&w=800&auto=format&fit=crop',
    color: 'bg-pink-600',
    baseFare: 15,
    farePerStop: 5,
    routePoints: ['bosila', 'mohammadpur', 'shyamoli', 'kallyanpur', 'mirpur1', 'mirpur10', 'mirpur12', 'kalshi', 'airport', 'uttara'],
    features: ['New Buses', 'Clean']
  }
];