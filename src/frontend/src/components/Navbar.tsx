import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronDown, MapPin, Menu, Shield, User } from "lucide-react";
import { useState } from "react";
import { CITIES } from "../types";

interface NavbarProps {
  selectedCity: string;
  onCityChange: (city: string) => void;
  onLogin: () => void;
  onLogout: () => void;
  isLoggedIn: boolean;
  isAdmin: boolean;
  onAdminClick: () => void;
}

export default function Navbar({
  selectedCity,
  onCityChange,
  onLogin,
  onLogout,
  isLoggedIn,
  isAdmin,
  onAdminClick,
}: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border shadow-xs">
      <div className="max-w-[1200px] mx-auto px-4 h-16 flex items-center gap-4">
        {/* Logo */}
        <a
          href="/"
          className="flex items-center gap-2 flex-shrink-0"
          data-ocid="nav.link"
        >
          <div className="w-8 h-8 rounded-lg bg-orange flex items-center justify-center">
            <MapPin className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-navy">
            My<span className="text-orange">Assam</span>
          </span>
        </a>

        {/* Browse Categories */}
        <Button
          className="hidden md:flex items-center gap-2 bg-orange text-white hover:bg-orange/90 font-semibold text-sm px-4 h-9"
          data-ocid="nav.primary_button"
        >
          <Menu className="w-4 h-4" />
          Browse Categories
          <ChevronDown className="w-3 h-3" />
        </Button>

        {/* Nav links */}
        <nav className="hidden lg:flex items-center gap-6 ml-2">
          <a
            href="/#"
            className="text-sm text-foreground/70 hover:text-orange font-medium transition-colors"
            data-ocid="nav.link"
          >
            Add Your Business
          </a>
          <a
            href="/#"
            className="text-sm text-foreground/70 hover:text-orange font-medium transition-colors"
            data-ocid="nav.link"
          >
            Features
          </a>
          <a
            href="/#"
            className="text-sm text-foreground/70 hover:text-orange font-medium transition-colors"
            data-ocid="nav.link"
          >
            Blog
          </a>
          <a
            href="/#"
            className="text-sm text-foreground/70 hover:text-orange font-medium transition-colors"
            data-ocid="nav.link"
          >
            Support
          </a>
        </nav>

        <div className="flex-1" />

        {/* City selector */}
        <Select value={selectedCity} onValueChange={onCityChange}>
          <SelectTrigger
            className="hidden sm:flex w-[130px] h-9 border-border text-sm font-medium"
            data-ocid="nav.select"
          >
            <MapPin className="w-3.5 h-3.5 text-orange mr-1" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CITIES.map((city) => (
              <SelectItem key={city} value={city}>
                {city}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Admin link */}
        {isAdmin && (
          <button
            type="button"
            onClick={onAdminClick}
            className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-blue-cta hover:text-blue-cta/80 transition-colors"
            data-ocid="nav.link"
          >
            <Shield className="w-4 h-4" />
            Admin
          </button>
        )}

        {/* User / Login */}
        {isLoggedIn ? (
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="w-8 h-8 rounded-full bg-muted flex items-center justify-center"
              data-ocid="nav.toggle"
            >
              <User className="w-4 h-4 text-muted-foreground" />
            </button>
            <Button
              variant="outline"
              size="sm"
              onClick={onLogout}
              className="border-blue-cta text-blue-cta hover:bg-blue-cta/5 text-sm font-semibold"
              data-ocid="nav.secondary_button"
            >
              Logout
            </Button>
          </div>
        ) : (
          <Button
            onClick={onLogin}
            size="sm"
            className="bg-blue-cta text-white hover:bg-blue-cta/90 font-semibold text-sm px-5"
            data-ocid="nav.primary_button"
          >
            Login
          </Button>
        )}

        {/* Mobile menu toggle */}
        <button
          type="button"
          className="md:hidden p-1"
          onClick={() => setMobileOpen(!mobileOpen)}
          data-ocid="nav.toggle"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-border px-4 py-3 flex flex-col gap-3">
          <a
            href="/#"
            className="text-sm font-medium py-1"
            data-ocid="nav.link"
          >
            Add Your Business
          </a>
          <a
            href="/#"
            className="text-sm font-medium py-1"
            data-ocid="nav.link"
          >
            Features
          </a>
          <a
            href="/#"
            className="text-sm font-medium py-1"
            data-ocid="nav.link"
          >
            Blog
          </a>
          <a
            href="/#"
            className="text-sm font-medium py-1"
            data-ocid="nav.link"
          >
            Support
          </a>
          <Select value={selectedCity} onValueChange={onCityChange}>
            <SelectTrigger className="w-full h-9" data-ocid="nav.select">
              <MapPin className="w-3.5 h-3.5 text-orange mr-1" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CITIES.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </header>
  );
}
