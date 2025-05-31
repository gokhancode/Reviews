'use client';

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';
import { useEffect, useState } from 'react';

// Fix for default marker icons in Leaflet with Next.js
const icon = new Icon({
  iconUrl: '/marker-icon.png',
  iconRetinaUrl: '/marker-icon-2x.png',
  shadowUrl: '/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface Business {
  id: string;
  name: string;
  location: [number, number];
  rating: number;
  reviewCount: number;
  type: string;
  address: string;
  placeId?: string; // Google Places ID for future integration
}

interface BusinessMapProps {
  onBusinessSelect: (business: Business) => void;
}

// Component to handle map center updates
function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  map.setView(center);
  return null;
}

export const BusinessMap = ({ onBusinessSelect }: BusinessMapProps) => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [center, setCenter] = useState<[number, number]>([50.0755, 14.4378]);
  const [isSearching, setIsSearching] = useState(false);

  // Mock data for different cities
  const mockBusinesses: Record<string, Business[]> = {
    'prague': [
      {
        id: '1',
        name: 'U Fleků',
        location: [50.0755, 14.4378],
        rating: 4.5,
        reviewCount: 120,
        type: 'Restaurant',
        address: 'Křemencova 11, Prague'
      },
      {
        id: '2',
        name: 'Café Louvre',
        location: [50.0815, 14.4278],
        rating: 4.3,
        reviewCount: 85,
        type: 'Cafe',
        address: 'Národní 22, Prague'
      }
    ],
    'london': [
      {
        id: '3',
        name: 'The Ivy',
        location: [51.5074, -0.1278],
        rating: 4.7,
        reviewCount: 250,
        type: 'Restaurant',
        address: '1-5 West Street, London'
      },
      {
        id: '4',
        name: 'Monmouth Coffee',
        location: [51.5072, -0.1275],
        rating: 4.6,
        reviewCount: 180,
        type: 'Cafe',
        address: '27 Monmouth Street, London'
      }
    ],
    'new york': [
      {
        id: '5',
        name: 'Shake Shack',
        location: [40.7419, -73.9893],
        rating: 4.4,
        reviewCount: 320,
        type: 'Restaurant',
        address: 'Madison Square Park, New York'
      },
      {
        id: '6',
        name: 'Blue Bottle Coffee',
        location: [40.7420, -73.9894],
        rating: 4.5,
        reviewCount: 150,
        type: 'Cafe',
        address: '1 Rockefeller Plaza, New York'
      }
    ]
  };

  // City coordinates
  const cityCoordinates: Record<string, [number, number]> = {
    'prague': [50.0755, 14.4378],
    'london': [51.5074, -0.1278],
    'new york': [40.7128, -74.0060]
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      // Convert search query to lowercase for case-insensitive matching
      const query = searchQuery.toLowerCase();
      
      // Find matching city
      const matchingCity = Object.keys(mockBusinesses).find(city => 
        city.toLowerCase().includes(query)
      );

      if (matchingCity) {
        // Update map center to the city
        setCenter(cityCoordinates[matchingCity]);
        // Set businesses for that city
        setBusinesses(mockBusinesses[matchingCity]);
      } else {
        // If no city match, search in business names
        const allBusinesses = Object.values(mockBusinesses).flat();
        const matchingBusinesses = allBusinesses.filter(business =>
          business.name.toLowerCase().includes(query) ||
          business.type.toLowerCase().includes(query)
        );
        
        if (matchingBusinesses.length > 0) {
          setBusinesses(matchingBusinesses);
          // Center map on the first matching business
          setCenter(matchingBusinesses[0].location);
        } else {
          // No results found
          setBusinesses([]);
        }
      }
    } catch (error) {
      console.error('Error searching businesses:', error);
      setBusinesses([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleBusinessSelect = (business: Business) => {
    onBusinessSelect(business);
  };

  return (
    <div className="relative">
      <div className="absolute top-4 left-4 right-4 z-[1000] flex gap-2">
        <input
          type="text"
          placeholder="Search for businesses or cities..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          className="flex-1 px-4 py-2.5 bg-white/90 backdrop-blur-sm rounded-lg border border-gray-100 focus:outline-none focus:ring-1 focus:ring-gray-200 text-gray-900 placeholder-gray-400"
        />
        <button
          onClick={handleSearch}
          disabled={isSearching}
          className="px-4 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:hover:bg-gray-900"
        >
          {isSearching ? 'Searching...' : 'Search'}
        </button>
      </div>
      <div className="h-[500px] w-full">
        <MapContainer
          center={center}
          zoom={14}
          style={{ height: '100%', width: '100%' }}
          className="rounded-xl"
        >
          <ChangeView center={center} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {businesses.map((business) => (
            <Marker
              key={business.id}
              position={business.location}
              icon={icon}
            >
              <Popup>
                <div className="p-3 min-w-[250px]">
                  <div className="mb-3">
                    <h3 className="text-lg font-medium text-gray-900 mb-1">{business.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                      <span className="inline-block px-2 py-0.5 bg-gray-100 rounded-full">{business.type}</span>
                    </div>
                    <p className="text-sm text-gray-400">{business.address}</p>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center">
                      <span className="text-yellow-400 mr-1">★</span>
                      <span className="font-medium text-gray-900">{business.rating}</span>
                    </div>
                    <span className="text-gray-300">•</span>
                    <span className="text-sm text-gray-500">{business.reviewCount} reviews</span>
                  </div>

                  <button
                    onClick={() => handleBusinessSelect(business)}
                    className="w-full bg-gray-900 text-white px-4 py-2.5 rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                  >
                    <span>Write a Review</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}; 