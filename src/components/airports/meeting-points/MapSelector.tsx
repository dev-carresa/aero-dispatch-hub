
import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface MapSelectorProps {
  initialLatitude?: number;
  initialLongitude?: number;
  onLocationChange: (lat: number, lng: number) => void;
}

export function MapSelector({ 
  initialLatitude = 51.5074, 
  initialLongitude = -0.1278,
  onLocationChange 
}: MapSelectorProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string>("");
  const [latitude, setLatitude] = useState<number>(initialLatitude);
  const [longitude, setLongitude] = useState<number>(initialLongitude);
  const [mapInitialized, setMapInitialized] = useState<boolean>(false);

  const initializeMap = () => {
    if (!mapContainer.current || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [longitude, latitude],
      zoom: 15
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    marker.current = new mapboxgl.Marker({
      draggable: true
    })
      .setLngLat([longitude, latitude])
      .addTo(map.current);

    marker.current.on('dragend', () => {
      if (marker.current) {
        const lngLat = marker.current.getLngLat();
        setLatitude(lngLat.lat);
        setLongitude(lngLat.lng);
        onLocationChange(lngLat.lat, lngLat.lng);
      }
    });

    map.current.on('click', (e) => {
      if (marker.current) {
        marker.current.setLngLat([e.lngLat.lng, e.lngLat.lat]);
        setLatitude(e.lngLat.lat);
        setLongitude(e.lngLat.lng);
        onLocationChange(e.lngLat.lat, e.lngLat.lng);
      }
    });

    setMapInitialized(true);

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  };

  // Update coordinates when latitude/longitude change manually
  useEffect(() => {
    if (map.current && marker.current && mapInitialized) {
      marker.current.setLngLat([longitude, latitude]);
      map.current.flyTo({ center: [longitude, latitude], zoom: 15 });
    }
  }, [latitude, longitude, mapInitialized]);

  const handleManualCoordinateChange = () => {
    onLocationChange(latitude, longitude);
  };

  return (
    <div className="space-y-4">
      <Label>Select Location on Map</Label>
      
      {!mapInitialized && (
        <div className="flex flex-col space-y-2 mb-4">
          <Label htmlFor="mapbox-token">Enter your Mapbox Public Token</Label>
          <div className="flex space-x-2">
            <Input 
              id="mapbox-token"
              value={mapboxToken}
              onChange={(e) => setMapboxToken(e.target.value)}
              placeholder="pk.eyJ1I..."
              className="flex-1"
            />
            <Button onClick={initializeMap} disabled={!mapboxToken}>
              Initialize Map
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Get your token at <a href="https://mapbox.com" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">mapbox.com</a>
          </p>
        </div>
      )}

      <div 
        ref={mapContainer} 
        className={`w-full h-[300px] rounded-md border ${!mapInitialized ? 'bg-gray-100' : ''}`}
      >
        {!mapInitialized && (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">Enter your Mapbox token to load the map</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="latitude">Latitude</Label>
          <Input
            id="latitude"
            type="number"
            step="0.0001"
            value={latitude}
            onChange={(e) => setLatitude(parseFloat(e.target.value))}
            onBlur={handleManualCoordinateChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="longitude">Longitude</Label>
          <Input
            id="longitude"
            type="number"
            step="0.0001"
            value={longitude}
            onChange={(e) => setLongitude(parseFloat(e.target.value))}
            onBlur={handleManualCoordinateChange}
          />
        </div>
      </div>
    </div>
  );
}
