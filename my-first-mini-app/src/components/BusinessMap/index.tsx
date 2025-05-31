'use client';

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

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
  placeId?: string;
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
  const router = useRouter();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [center, setCenter] = useState<[number, number]>([50.0755, 14.4378]);
  const [isSearching, setIsSearching] = useState(false);
  const mapRef = useRef<any>(null);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      
      if (data.error) {
        console.error('Search error:', data.error);
        return;
      }

      if (data.length > 0) {
        setBusinesses(data);
        setCenter(data[0].location);
      } else {
        setBusinesses([]);
      }
    } catch (error) {
      console.error('Error searching businesses:', error);
      setBusinesses([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleBusinessSelect = (business: Business, closePopup: () => void) => {
    closePopup();
    onBusinessSelect(business);
    router.push(`/business/${business.id}`);
  };

  return (
    <div className="relative h-full w-full">
      <div className="absolute top-4 left-4 ml-16 z-[1000] flex gap-2 max-w-md w-full">
        <input
          type="text"
          placeholder="Search for businesses or locations..."
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
      <div className="h-full w-full">
        <MapContainer
          center={center}
          zoom={14}
          style={{ height: '100%', width: '100%' }}
          className="rounded-xl"
          ref={mapRef}
        >
          <ChangeView center={center} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            detectRetina={true}
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
                      <span className="font-medium text-gray-900">{business.rating.toFixed(1)}</span>
                    </div>
                    <span className="text-gray-300">•</span>
                    <span className="text-sm text-gray-500">{business.reviewCount} reviews</span>
                  </div>

                  <button
                    onClick={() => handleBusinessSelect(business, () => {
                      const popup = document.querySelector('.leaflet-popup');
                      if (popup) {
                        const closeButton = popup.querySelector('.leaflet-popup-close-button');
                        if (closeButton instanceof HTMLElement) {
                          closeButton.click();
                        }
                      }
                    })}
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