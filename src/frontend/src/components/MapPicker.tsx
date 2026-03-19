import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const GUWAHATI_LAT = 26.1445;
const GUWAHATI_LNG = 91.7362;

interface MapPickerProps {
  initialLat?: number;
  initialLng?: number;
  onChange: (lat: number, lng: number) => void;
}

export default function MapPicker({
  initialLat,
  initialLng,
  onChange,
}: MapPickerProps) {
  const hasInitial =
    initialLat !== undefined &&
    initialLng !== undefined &&
    (initialLat !== 0 || initialLng !== 0);

  const mapRef = useRef<HTMLDivElement>(null);
  // biome-ignore lint/suspicious/noExplicitAny: leaflet loaded dynamically
  const leafletMapRef = useRef<any>(null);
  // biome-ignore lint/suspicious/noExplicitAny: leaflet loaded dynamically
  const markerRef = useRef<any>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const [pinLat, setPinLat] = useState<number | null>(
    hasInitial ? initialLat! : null,
  );
  const [pinLng, setPinLng] = useState<number | null>(
    hasInitial ? initialLng! : null,
  );
  const [addressQuery, setAddressQuery] = useState("");
  const [searching, setSearching] = useState(false);

  // biome-ignore lint/suspicious/noExplicitAny: leaflet loaded dynamically
  const placeMarkerRef = useRef(
    (L: any, map: any, lat: number, lng: number) => {
      if (markerRef.current) {
        markerRef.current.setLatLng([lat, lng]);
      } else {
        const icon = L.icon({
          iconUrl:
            "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
          iconRetinaUrl:
            "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
          shadowUrl:
            "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41],
        });
        markerRef.current = L.marker([lat, lng], {
          icon,
          draggable: true,
        }).addTo(map);
        markerRef.current.on("dragend", () => {
          const pos = markerRef.current.getLatLng();
          setPinLat(pos.lat);
          setPinLng(pos.lng);
          onChangeRef.current(pos.lat, pos.lng);
        });
      }
      map.setView([lat, lng], Math.max(map.getZoom(), 15));
      setPinLat(lat);
      setPinLng(lng);
      onChangeRef.current(lat, lng);
    },
  );

  useEffect(() => {
    if (!mapRef.current) return;

    const initLat = hasInitial ? initialLat! : GUWAHATI_LAT;
    const initLng = hasInitial ? initialLng! : GUWAHATI_LNG;
    const initZoom = hasInitial ? 15 : 13;

    import("leaflet").then((L) => {
      if (!mapRef.current || leafletMapRef.current) return;

      if (!document.querySelector("link[data-leaflet-css]")) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        link.setAttribute("data-leaflet-css", "1");
        document.head.appendChild(link);
      }

      const map = L.map(mapRef.current, { zoomControl: true }).setView(
        [initLat, initLng],
        initZoom,
      );
      leafletMapRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      if (hasInitial) {
        placeMarkerRef.current(L, map, initLat, initLng);
      }

      map.on("click", (e: { latlng: { lat: number; lng: number } }) => {
        placeMarkerRef.current(L, map, e.latlng.lat, e.latlng.lng);
      });
    });

    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
        markerRef.current = null;
      }
    };
  }, [hasInitial, initialLat, initialLng]);

  const handleGeocode = async () => {
    if (!addressQuery.trim()) return;
    setSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(`${addressQuery}, Guwahati`)}&format=json&limit=1`,
        { headers: { "Accept-Language": "en" } },
      );
      const data = await res.json();
      if (data.length > 0 && leafletMapRef.current) {
        const lat = Number.parseFloat(data[0].lat);
        const lng = Number.parseFloat(data[0].lon);
        import("leaflet").then((L) => {
          placeMarkerRef.current(L, leafletMapRef.current, lat, lng);
        });
      }
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {/* Address search */}
      <div className="flex gap-2">
        <Input
          value={addressQuery}
          onChange={(e) => setAddressQuery(e.target.value)}
          placeholder="Search address in Guwahati…"
          onKeyDown={(e) => e.key === "Enter" && handleGeocode()}
          data-ocid="admin.search_input"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleGeocode}
          disabled={searching}
          className="shrink-0 gap-1.5"
          data-ocid="admin.secondary_button"
        >
          <Search className="w-3.5 h-3.5" />
          {searching ? "Finding…" : "Find"}
        </Button>
      </div>

      {/* Leaflet interactive map */}
      <div
        ref={mapRef}
        className="rounded-lg overflow-hidden border border-border"
        style={{ height: 280, zIndex: 0 }}
      />

      <p className="text-xs text-muted-foreground">
        {pinLat !== null && pinLng !== null ? (
          <>
            <span className="font-medium text-foreground">Pinned:</span>{" "}
            {pinLat.toFixed(5)}, {pinLng.toFixed(5)}{" "}
            <span className="text-green-600 font-medium">✓</span>
          </>
        ) : (
          "Click anywhere on the map to drop a pin, or search an address above"
        )}
      </p>
    </div>
  );
}
