import { useEffect, useRef, useState } from "react";

export interface Coords {
  lat: number;
  lng: number;
}

export function useGeocode(address: string): Coords | null {
  const [coords, setCoords] = useState<Coords | null>(null);
  const cache = useRef<Map<string, Coords>>(new Map());

  useEffect(() => {
    if (!address) return;

    const cached = cache.current.get(address);
    if (cached) {
      setCoords(cached);
      return;
    }

    const controller = new AbortController();

    (async () => {
      try {
        const encoded = encodeURIComponent(`${address}, Guwahati, Assam`);
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encoded}&format=json&limit=1`,
          {
            signal: controller.signal,
            headers: {
              "Accept-Language": "en",
              "User-Agent": "MyAssam-Directory/1.0",
            },
          },
        );
        if (!res.ok) return;
        const data = await res.json();
        if (data.length > 0) {
          const result: Coords = {
            lat: Number.parseFloat(data[0].lat),
            lng: Number.parseFloat(data[0].lon),
          };
          cache.current.set(address, result);
          setCoords(result);
        }
      } catch {
        // silently ignore
      }
    })();

    return () => controller.abort();
  }, [address]);

  return coords;
}
