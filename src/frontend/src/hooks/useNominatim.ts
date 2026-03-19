import { useEffect, useState } from "react";

export interface NominatimSuggestion {
  displayName: string;
  lat: string;
  lon: string;
}

export function useNominatim(query: string): NominatimSuggestion[] {
  const [suggestions, setSuggestions] = useState<NominatimSuggestion[]>([]);

  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const encoded = encodeURIComponent(`${query}, Guwahati, Assam`);
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encoded}&format=json&limit=5&addressdetails=1`,
          {
            headers: {
              "Accept-Language": "en",
              "User-Agent": "MyAssam-Directory/1.0",
            },
          },
        );
        if (!res.ok) return;
        const data = await res.json();
        setSuggestions(
          data.map(
            (item: { display_name: string; lat: string; lon: string }) => ({
              displayName: item.display_name,
              lat: item.lat,
              lon: item.lon,
            }),
          ),
        );
      } catch {
        setSuggestions([]);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  return suggestions;
}
