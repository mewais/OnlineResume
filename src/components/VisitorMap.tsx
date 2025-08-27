'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in React Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface VisitorData {
  id: string;
  country: string;
  state: string;
  city: string;
  postal: string;
  longitude: number;
  latitude: number;
  visits: number;
}

interface VisitorMapProps {
  visitors: VisitorData[];
}

export default function VisitorMap({ visitors }: VisitorMapProps) {
  // Filter out visitors with invalid coordinates
  const validVisitors = visitors.filter(
    visitor => visitor.latitude !== 0 && visitor.longitude !== 0
  );

  // Custom icon for visitors with multiple visits
  const createCustomIcon = (visits: number) => {
    const size = Math.min(30 + visits * 2, 50); // Scale icon size based on visits
    const color = visits > 5 ? '#dc2626' : visits > 2 ? '#ea580c' : '#3b82f6';
    
    return L.divIcon({
      html: `<div style="
        width: ${size}px; 
        height: ${size}px; 
        background-color: ${color}; 
        border: 3px solid white; 
        border-radius: 50%; 
        display: flex; 
        align-items: center; 
        justify-content: center; 
        color: white; 
        font-weight: bold; 
        font-size: ${Math.min(12 + visits, 16)}px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      ">${visits}</div>`,
      className: 'custom-marker',
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
      popupAnchor: [0, -size / 2]
    });
  };

  if (validVisitors.length === 0) {
    return (
      <div className="h-96 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600">
        No visitor location data available
      </div>
    );
  }

  return (
    <div className="h-96 rounded-xl overflow-hidden border border-slate-700/30">
      <MapContainer
        center={[20, 0]} // Center on world
        zoom={2}
        style={{ height: '100%', width: '100%' }}
        className="z-10"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {validVisitors.map((visitor, index) => {
          const location = [
            visitor.city,
            visitor.state,
            visitor.country
          ].filter(item => item && item !== 'Not found').join(', ') || 'Unknown Location';

          return (
            <Marker
              key={`${visitor.id}-${index}`}
              position={[visitor.latitude, visitor.longitude]}
              icon={createCustomIcon(visitor.visits)}
            >
              <Popup>
                <div className="text-center">
                  <div className="font-semibold text-slate-800">{location}</div>
                  {visitor.postal !== 'Not found' && (
                    <div className="text-sm text-slate-600">{visitor.postal}</div>
                  )}
                  <div className="mt-2 px-2 py-1 bg-purple-100 text-purple-800 rounded text-sm font-medium">
                    {visitor.visits} visit{visitor.visits !== 1 ? 's' : ''}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}