import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface TrackingMapProps {
  trackingData: Array<{
    latitude?: number;
    longitude?: number;
    location?: string;
    status: string;
    created_at: string;
  }>;
}

const TrackingMap: React.FC<TrackingMapProps> = ({ trackingData }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [apiKey, setApiKey] = useState('');
  const [mapInitialized, setMapInitialized] = useState(false);

  useEffect(() => {
    if (!mapContainer.current || !apiKey || mapInitialized) return;

    mapboxgl.accessToken = apiKey;
    
    // Filter tracking data with valid coordinates
    const validLocations = trackingData.filter(
      item => item.latitude && item.longitude
    );

    if (validLocations.length === 0) return;

    const firstLocation = validLocations[0];
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [firstLocation.longitude!, firstLocation.latitude!],
      zoom: 12,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add markers for each tracking point
    validLocations.forEach((item, index) => {
      const marker = new mapboxgl.Marker({
        color: index === validLocations.length - 1 ? '#22c55e' : '#3b82f6'
      })
        .setLngLat([item.longitude!, item.latitude!])
        .setPopup(
          new mapboxgl.Popup().setHTML(
            `<div class="p-2">
              <p class="font-semibold">${item.status.replace('_', ' ')}</p>
              <p class="text-sm text-muted-foreground">${item.location || ''}</p>
              <p class="text-xs">${new Date(item.created_at).toLocaleString()}</p>
            </div>`
          )
        )
        .addTo(map.current!);
    });

    // Draw route line if multiple points
    if (validLocations.length > 1) {
      map.current.on('load', () => {
        const coordinates = validLocations.map(item => [item.longitude!, item.latitude!]);
        
        map.current!.addSource('route', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: coordinates
            }
          }
        });

        map.current!.addLayer({
          id: 'route',
          type: 'line',
          source: 'route',
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#3b82f6',
            'line-width': 4,
            'line-opacity': 0.8
          }
        });
      });

      // Fit map to show all markers
      const bounds = new mapboxgl.LngLatBounds();
      validLocations.forEach(item => {
        bounds.extend([item.longitude!, item.latitude!]);
      });
      map.current.fitBounds(bounds, { padding: 50 });
    }

    setMapInitialized(true);

    return () => {
      map.current?.remove();
    };
  }, [apiKey, trackingData]);

  const validLocations = trackingData.filter(
    item => item.latitude && item.longitude
  );

  if (validLocations.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No location data available for this order
      </div>
    );
  }

  if (!mapInitialized) {
    return (
      <div className="space-y-4">
        <div>
          <Label htmlFor="mapbox-token">Mapbox Access Token</Label>
          <Input
            id="mapbox-token"
            type="text"
            placeholder="Enter your Mapbox public token"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="mt-2"
          />
          <p className="text-sm text-muted-foreground mt-2">
            Get your free token at{' '}
            <a 
              href="https://mapbox.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              mapbox.com
            </a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[400px] rounded-lg overflow-hidden">
      <div ref={mapContainer} className="absolute inset-0" />
    </div>
  );
};

export default TrackingMap;
