import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useRef } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

// Fix default Leaflet marker icons broken by bundlers
// biome-ignore lint/performance/noDelete: required for Leaflet icon fix
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)
  ._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export interface MapMarker {
  lat: number;
  lng: number;
  title: string;
  id?: number;
}

interface OsmMapProps {
  markers: MapMarker[];
  center?: [number, number];
  zoom?: number;
  height?: string;
  onMarkerClick?: (id: number) => void;
}

function MarkerWithClick({
  marker,
  onMarkerClick,
}: {
  marker: MapMarker;
  onMarkerClick?: (id: number) => void;
}) {
  const markerRef = useRef<L.Marker>(null);

  return (
    <Marker
      ref={markerRef}
      position={[marker.lat, marker.lng]}
      eventHandlers={{
        click: () => {
          if (onMarkerClick && marker.id !== undefined) {
            onMarkerClick(marker.id);
          }
        },
      }}
    >
      <Popup>{marker.title}</Popup>
    </Marker>
  );
}

export default function OsmMap({
  markers,
  center = [26.1445, 91.7362],
  zoom = 13,
  height = "300px",
  onMarkerClick,
}: OsmMapProps) {
  return (
    <div style={{ height }} className="w-full rounded-xl overflow-hidden z-0">
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers.map((marker, i) => (
          <MarkerWithClick
            key={marker.id !== undefined ? marker.id : i}
            marker={marker}
            onMarkerClick={onMarkerClick}
          />
        ))}
      </MapContainer>
    </div>
  );
}
