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

export default function OsmMap({
  markers,
  center,
  height = "300px",
  onMarkerClick,
}: OsmMapProps) {
  // Determine map center: use provided center, or first marker, or Guwahati default
  const mapCenter: [number, number] =
    center ??
    (markers.length > 0
      ? [markers[0].lat, markers[0].lng]
      : [26.1445, 91.7362]);

  // Build OSM embed URL with marker(s)
  let src: string;
  if (markers.length === 1) {
    const m = markers[0];
    src = `https://www.openstreetmap.org/export/embed.html?bbox=${m.lng - 0.01}%2C${m.lat - 0.008}%2C${m.lng + 0.01}%2C${m.lat + 0.008}&layer=mapnik&marker=${m.lat}%2C${m.lng}`;
  } else {
    const latDelta = 0.04;
    const lngDelta = 0.05;
    src = `https://www.openstreetmap.org/export/embed.html?bbox=${mapCenter[1] - lngDelta}%2C${mapCenter[0] - latDelta}%2C${mapCenter[1] + lngDelta}%2C${mapCenter[0] + latDelta}&layer=mapnik`;
  }

  return (
    <div
      style={{ height }}
      className="w-full rounded-xl overflow-hidden z-0 relative"
    >
      <iframe
        title="OpenStreetMap"
        src={src}
        width="100%"
        height="100%"
        style={{ border: 0, display: "block" }}
        loading="lazy"
        referrerPolicy="no-referrer"
        sandbox="allow-scripts allow-same-origin"
      />
      {/* Clickable overlay for multi-marker maps */}
      {markers.length > 1 && onMarkerClick && (
        <div className="absolute inset-0 pointer-events-none">
          {markers.map((marker) => (
            <button
              key={marker.id ?? `${marker.lat}-${marker.lng}`}
              type="button"
              title={marker.title}
              className="absolute pointer-events-auto opacity-0 w-6 h-6"
              style={{ left: "50%", top: "50%" }}
              onClick={() =>
                marker.id !== undefined && onMarkerClick(marker.id)
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
