import { useRef, useState } from "react";
import Map, { NavigationControl } from "react-map-gl/maplibre";
import type { MapRef } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";

interface MapLibreLayerProps {
  children?: React.ReactNode;
}

export default function MapLibreLayer({ children }: MapLibreLayerProps) {
  const mapRef = useRef<MapRef>(null);
  
  // Default to Zagreb center
  const [viewState, setViewState] = useState({
    longitude: 15.9819,
    latitude: 45.815,
    zoom: 12
  });

  return (
    <Map
        ref={mapRef}
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        style={{width: '100%', height: '100%'}}
        mapStyle="https://tiles.openfreemap.org/styles/liberty"
    >
      <NavigationControl position="top-right" />
      {children}
    </Map>
  );
}
