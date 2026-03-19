import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronDown, MapPin, Search } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { Variant_retail_healthcare_finance_other_food_education_services } from "../backend";
import { useNominatim } from "../hooks/useNominatim";
import { CITIES } from "../types";
import CategoryTiles from "./CategoryTiles";

interface HeroProps {
  onSearch: (keyword: string, city: string) => void;
  onCategorySelect: (
    category: Variant_retail_healthcare_finance_other_food_education_services,
  ) => void;
  selectedCategory: Variant_retail_healthcare_finance_other_food_education_services | null;
  selectedCity: string;
}

export default function Hero({
  onSearch,
  onCategorySelect,
  selectedCategory,
  selectedCity,
}: HeroProps) {
  const [keyword, setKeyword] = useState("");
  const [city, setCity] = useState(selectedCity || CITIES[0]);
  const [showDropdown, setShowDropdown] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const suggestions = useNominatim(keyword);

  const handleSearch = () => {
    setShowDropdown(false);
    onSearch(keyword, city);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
    if (e.key === "Escape") setShowDropdown(false);
  };

  const handleSuggestionClick = (displayName: string) => {
    setKeyword(displayName);
    setShowDropdown(false);
    onSearch(displayName, city);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <section
      className="relative w-full min-h-[520px] flex items-center justify-center overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #1E5A78 0%, #2A6F86 50%, #1a4a6e 100%)",
      }}
    >
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 w-full max-w-[1200px] mx-auto px-4 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-4">
            Discover Local Businesses in Guwahati
          </h1>
          <p className="text-white/80 text-base md:text-lg mb-10 max-w-2xl mx-auto">
            Find shops, restaurants, hospitals, ATMs, and institutions across
            Guwahati — all in one place.
          </p>
        </motion.div>

        {/* Search bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto max-w-3xl mb-10"
        >
          <div ref={wrapperRef} className="relative">
            <div className="flex items-center bg-white rounded-full shadow-search overflow-hidden h-14">
              <div className="flex-1 flex items-center px-5">
                <Search className="w-5 h-5 text-muted-foreground mr-3 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search for shops, hospitals, ATMs…"
                  value={keyword}
                  onChange={(e) => {
                    setKeyword(e.target.value);
                    setShowDropdown(true);
                  }}
                  onKeyDown={handleKeyDown}
                  onFocus={() => keyword.length >= 2 && setShowDropdown(true)}
                  className="flex-1 bg-transparent text-foreground placeholder-muted-foreground text-sm outline-none"
                  data-ocid="hero.search_input"
                  autoComplete="off"
                />
              </div>
              <div className="w-px h-8 bg-border flex-shrink-0" />
              <div className="flex items-center px-3">
                <MapPin className="w-4 h-4 text-orange mr-1 flex-shrink-0" />
                <Select value={city} onValueChange={setCity}>
                  <SelectTrigger
                    className="border-0 shadow-none text-sm font-medium w-[120px] h-full focus:ring-0 p-0"
                    data-ocid="hero.select"
                  >
                    <SelectValue />
                    <ChevronDown className="w-3 h-3 ml-1" />
                  </SelectTrigger>
                  <SelectContent>
                    {CITIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <button
                type="button"
                onClick={handleSearch}
                className="h-14 w-14 flex-shrink-0 bg-orange rounded-full flex items-center justify-center hover:bg-orange/90 transition-colors"
                data-ocid="hero.primary_button"
              >
                <Search className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Autocomplete dropdown */}
            {showDropdown && suggestions.length > 0 && (
              <div
                className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-100 z-50 overflow-hidden"
                data-ocid="hero.dropdown_menu"
              >
                {suggestions.slice(0, 5).map((s, i) => (
                  <button
                    key={`${s.lat}-${s.lon}`}
                    type="button"
                    className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm text-foreground hover:bg-muted/60 transition-colors border-b border-gray-50 last:border-0"
                    onClick={() => handleSuggestionClick(s.displayName)}
                    data-ocid={`hero.item.${i + 1}`}
                  >
                    <MapPin className="w-4 h-4 text-orange flex-shrink-0" />
                    <span className="truncate">{s.displayName}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Category tiles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <CategoryTiles
            onSelect={onCategorySelect}
            selectedCategory={selectedCategory}
          />
        </motion.div>
      </div>
    </section>
  );
}
