import { Skeleton } from "@/components/ui/skeleton";
import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Map as MapIcon, MapPin } from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import type {
  Listing,
  Variant_atm_institution_shop,
  Variant_retail_healthcare_finance_other_food_education_services,
} from "./backend";
import AdminPanel from "./components/AdminPanel";
import CategoryTiles from "./components/CategoryTiles";
import FilterSidebar from "./components/FilterSidebar";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import ListingCard from "./components/ListingCard";
import ListingDetailModal from "./components/ListingDetailModal";
import Navbar from "./components/Navbar";
import OsmMap from "./components/OsmMap";
import { sampleListings } from "./data/sampleData";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { useIsAdmin, useListings } from "./hooks/useQueries";

const queryClient = new QueryClient();

type ListingType = Variant_atm_institution_shop;
type Category = Variant_retail_healthcare_finance_other_food_education_services;

function AppContent() {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const isLoggedIn =
    (loginStatus === "success" || loginStatus === "idle") && !!identity;

  const [selectedCity, setSelectedCity] = useState("Guwahati");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
  const [sortBy, setSortBy] = useState("relevance");
  const [typeFilters, setTypeFilters] = useState<Set<ListingType>>(new Set());
  const [categoryFilters, setCategoryFilters] = useState<Set<Category>>(
    new Set(),
  );
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [autoOpenAdminForm, setAutoOpenAdminForm] = useState(false);

  const cityFilter = selectedCity;
  const typeFilter = typeFilters.size === 1 ? [...typeFilters][0] : null;
  const catFilter =
    selectedCategory ??
    (categoryFilters.size === 1 ? [...categoryFilters][0] : null);

  const { data: backendListings, isLoading } = useListings(
    searchKeyword,
    typeFilter,
    catFilter,
    cityFilter,
  );
  const { data: isAdmin } = useIsAdmin();

  const handleSearch = (keyword: string, city: string) => {
    setSearchKeyword(keyword);
    if (city) setSelectedCity(city);
  };

  const handleAddBusiness = () => {
    setAutoOpenAdminForm(true);
    setShowAdmin(true);
  };

  const toggleTypeFilter = (t: ListingType) => {
    setTypeFilters((prev) => {
      const next = new Set(prev);
      if (next.has(t)) next.delete(t);
      else next.add(t);
      return next;
    });
  };

  const toggleCategoryFilter = (c: Category) => {
    setCategoryFilters((prev) => {
      const next = new Set(prev);
      if (next.has(c)) next.delete(c);
      else next.add(c);
      return next;
    });
  };

  const resetFilters = () => {
    setSortBy("relevance");
    setTypeFilters(new Set());
    setCategoryFilters(new Set());
    setSelectedCategory(null);
    setSearchKeyword("");
  };

  // Use sample data if backend hasn't loaded
  const rawListings =
    backendListings && backendListings.length > 0
      ? backendListings
      : sampleListings;

  // Apply local filters + sort
  const listings = useMemo(() => {
    let filtered = rawListings.filter((l) => {
      if (typeFilters.size > 0 && !typeFilters.has(l.listingType)) return false;
      if (categoryFilters.size > 0 && !categoryFilters.has(l.category))
        return false;
      if (selectedCategory && l.category !== selectedCategory) return false;
      return true;
    });

    if (sortBy === "rating")
      filtered = [...filtered].sort((a, b) => b.rating - a.rating);
    else if (sortBy === "reviews")
      filtered = [...filtered].sort(
        (a, b) => Number(b.totalRatings) - Number(a.totalRatings),
      );
    else if (sortBy === "name")
      filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));

    return filtered;
  }, [rawListings, typeFilters, categoryFilters, selectedCategory, sortBy]);

  // Derive map markers directly from stored coordinates
  const mapMarkers = useMemo(
    () =>
      listings
        .filter((l) => l.lat !== 0 || l.lng !== 0)
        .map((l) => ({
          lat: l.lat,
          lng: l.lng,
          title: l.name,
          id: Number(l.id),
        })),
    [listings],
  );

  const handleMapMarkerClick = (id: number) => {
    const found = listings.find((l) => Number(l.id) === id);
    if (found) setSelectedListing(found);
  };

  if (showAdmin) {
    return (
      <AdminPanel
        onClose={() => {
          setShowAdmin(false);
          setAutoOpenAdminForm(false);
        }}
        listings={backendListings ?? []}
        autoOpenForm={autoOpenAdminForm}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar
        selectedCity={selectedCity}
        onCityChange={setSelectedCity}
        onLogin={login}
        onLogout={clear}
        isLoggedIn={isLoggedIn}
        isAdmin={!!isAdmin}
        onAdminClick={() => setShowAdmin(true)}
        onAddBusiness={handleAddBusiness}
      />

      <main className="flex-1">
        <Hero
          onSearch={handleSearch}
          onCategorySelect={(cat) =>
            setSelectedCategory(cat === selectedCategory ? null : cat)
          }
          selectedCategory={selectedCategory}
          selectedCity={selectedCity}
        />

        {/* Map View Toggle Section */}
        <section className="bg-background pt-8 pb-0">
          <div className="max-w-[1200px] mx-auto px-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-orange" />
                <h2 className="text-base font-semibold text-foreground">
                  Map View
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setShowMap((v) => !v)}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-orange/10 text-orange hover:bg-orange/20 transition-colors border border-orange/20"
                data-ocid="map.toggle"
              >
                <MapIcon className="w-4 h-4" />
                {showMap ? "Hide Map" : "Show Map"}
              </button>
            </div>

            {showMap && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-6 rounded-xl overflow-hidden shadow-md border border-border"
                data-ocid="map.panel"
              >
                <OsmMap
                  markers={mapMarkers}
                  height="350px"
                  onMarkerClick={handleMapMarkerClick}
                />
              </motion.div>
            )}
          </div>
        </section>

        {/* Listings section */}
        <section className="bg-background py-10">
          <div className="max-w-[1200px] mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-foreground">
                  Featured Local Businesses in Guwahati
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {listings.length} result{listings.length !== 1 ? "s" : ""}{" "}
                  found
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              {/* Card grid */}
              <div className="flex-1 min-w-0">
                {isLoading ? (
                  <div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                    data-ocid="listing.loading_state"
                  >
                    {Array.from({ length: 6 }, (_, i) => i).map((i) => (
                      <div
                        key={`skeleton-${i}`}
                        className="rounded-xl overflow-hidden"
                      >
                        <Skeleton className="h-32 w-full" />
                        <div className="p-4 space-y-2">
                          <Skeleton className="h-5 w-3/4" />
                          <Skeleton className="h-4 w-1/2" />
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-9 w-full mt-2" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : listings.length === 0 ? (
                  <div
                    className="text-center py-20 text-muted-foreground"
                    data-ocid="listing.empty_state"
                  >
                    <p className="text-lg font-semibold">No listings found</p>
                    <p className="text-sm mt-2">
                      Try adjusting your filters or search terms.
                    </p>
                    <button
                      type="button"
                      onClick={resetFilters}
                      className="mt-4 text-blue-cta text-sm font-medium hover:underline"
                      data-ocid="listing.secondary_button"
                    >
                      Clear all filters
                    </button>
                  </div>
                ) : (
                  <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4 }}
                    data-ocid="listing.list"
                  >
                    {listings.map((listing, i) => (
                      <motion.div
                        key={listing.id.toString()}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: i * 0.05 }}
                      >
                        <ListingCard
                          listing={listing}
                          index={i + 1}
                          onViewDetails={setSelectedListing}
                        />
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </div>

              {/* Filters sidebar */}
              <aside className="hidden lg:block w-64 flex-shrink-0">
                <FilterSidebar
                  sortBy={sortBy}
                  onSortChange={setSortBy}
                  typeFilters={typeFilters}
                  onTypeToggle={toggleTypeFilter}
                  categoryFilters={categoryFilters}
                  onCategoryToggle={toggleCategoryFilter}
                  onReset={resetFilters}
                />
              </aside>
            </div>
          </div>
        </section>

        {/* Discover by Category */}
        <section className="bg-muted py-12">
          <div className="max-w-[1200px] mx-auto px-4">
            <h2 className="text-xl font-bold text-foreground mb-6 text-center">
              Discover by Category
            </h2>
            <CategoryTiles
              onSelect={(cat) =>
                setSelectedCategory(cat === selectedCategory ? null : cat)
              }
              selectedCategory={selectedCategory}
            />
          </div>
        </section>
      </main>

      <Footer />

      <ListingDetailModal
        listing={selectedListing}
        open={!!selectedListing}
        onClose={() => setSelectedListing(null)}
        isLoggedIn={isLoggedIn}
      />

      <Toaster richColors position="top-right" />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}
