import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Building2,
  Clock,
  CreditCard,
  MapPin,
  Phone,
  ShoppingBag,
  Star,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { type Listing, Variant_atm_institution_shop } from "../backend";
import { useRateListing } from "../hooks/useQueries";
import {
  ATM_GRADIENT,
  CATEGORY_GRADIENTS,
  CATEGORY_LABELS,
  LISTING_TYPE_LABELS,
} from "../types";
import OsmMap from "./OsmMap";

interface ListingDetailModalProps {
  listing: Listing | null;
  open: boolean;
  onClose: () => void;
  isLoggedIn: boolean;
}

function ListingMap({ listing }: { listing: Listing }) {
  if (listing.lat === 0 && listing.lng === 0) {
    return (
      <div
        className="flex items-center justify-center h-[200px] bg-muted rounded-xl text-sm text-muted-foreground"
        data-ocid="listing.error_state"
      >
        Location not available
      </div>
    );
  }

  return (
    <OsmMap
      markers={[{ lat: listing.lat, lng: listing.lng, title: listing.name }]}
      center={[listing.lat, listing.lng]}
      zoom={15}
      height="200px"
    />
  );
}

export default function ListingDetailModal({
  listing,
  open,
  onClose,
  isLoggedIn,
}: ListingDetailModalProps) {
  const [hoveredRating, setHoveredRating] = useState(0);
  const [submittedRating, setSubmittedRating] = useState(0);
  const rateMutation = useRateListing();

  if (!listing) return null;

  const isAtm = listing.listingType === Variant_atm_institution_shop.atm;
  const gradient = isAtm ? ATM_GRADIENT : CATEGORY_GRADIENTS[listing.category];
  const typeLabel = LISTING_TYPE_LABELS[listing.listingType];
  const categoryLabel = CATEGORY_LABELS[listing.category];

  const TypeIcon = {
    [Variant_atm_institution_shop.shop]: ShoppingBag,
    [Variant_atm_institution_shop.institution]: Building2,
    [Variant_atm_institution_shop.atm]: CreditCard,
  }[listing.listingType];

  const handleRate = async (score: number) => {
    if (!isLoggedIn) {
      toast.error("Please login to rate this business.");
      return;
    }
    try {
      await rateMutation.mutateAsync({ id: listing.id, rating: score });
      setSubmittedRating(score);
      toast.success("Thank you for your rating!");
    } catch {
      toast.error("Failed to submit rating. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        className="max-w-lg p-0 overflow-hidden max-h-[90vh] overflow-y-auto"
        data-ocid="listing.modal"
      >
        {/* Header gradient */}
        <div className={`relative h-40 bg-gradient-to-br ${gradient}`}>
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            data-ocid="listing.close_button"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="absolute bottom-3 left-4 flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <TypeIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <Badge className="bg-white/90 text-foreground text-[10px] font-bold mb-0.5">
                {typeLabel}
              </Badge>
            </div>
          </div>
        </div>

        <div className="p-5">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-xl font-bold text-foreground">
              {listing.name}
            </DialogTitle>
            <div className="flex items-center gap-2 mt-1">
              <Star className="w-4 h-4 fill-orange text-orange" />
              <span className="text-sm font-bold">
                {listing.rating.toFixed(1)}
              </span>
              <span className="text-xs text-muted-foreground">
                ({Number(listing.totalRatings)} reviews)
              </span>
              <Badge variant="outline" className="text-xs ml-1">
                {categoryLabel}
              </Badge>
            </div>
          </DialogHeader>

          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-orange flex-shrink-0 mt-0.5" />
              <span className="text-muted-foreground">
                {listing.address}, {listing.city}, {listing.state} –{" "}
                {listing.pincode}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-blue-cta flex-shrink-0" />
              <a
                href={`tel:${listing.phone}`}
                className="text-blue-cta font-medium hover:underline"
              >
                {listing.phone}
              </a>
            </div>

            <div className="flex items-start gap-2">
              <Clock className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
              <span className="text-muted-foreground">{listing.openHours}</span>
            </div>

            {listing.description && (
              <p className="text-foreground/80 leading-relaxed pt-1">
                {listing.description}
              </p>
            )}
          </div>

          {/* Map */}
          <div className="mt-4">
            <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-orange" />
              Location
            </h4>
            <ListingMap listing={listing} />
          </div>

          {/* Rating */}
          <div className="mt-5 pt-4 border-t border-border">
            <h4 className="text-sm font-semibold text-foreground mb-3">
              {submittedRating > 0
                ? `You rated: ${submittedRating}/5`
                : "Rate this business"}
            </h4>
            <div
              className="flex gap-1"
              onMouseLeave={() => setHoveredRating(0)}
              data-ocid="listing.toggle"
            >
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onMouseEnter={() => setHoveredRating(star)}
                  onClick={() => handleRate(star)}
                  className="transition-transform hover:scale-110"
                  data-ocid={`listing.toggle.${star}`}
                >
                  <Star
                    className={`w-7 h-7 ${
                      (hoveredRating || submittedRating) >= star
                        ? "fill-orange text-orange"
                        : "text-muted-foreground"
                    }`}
                  />
                </button>
              ))}
            </div>
            {!isLoggedIn && (
              <p className="text-xs text-muted-foreground mt-2">
                Login to submit your rating.
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-5">
            <a
              href={`tel:${listing.phone}`}
              className="flex-1 h-10 flex items-center justify-center gap-2 bg-orange text-white text-sm font-semibold rounded-lg hover:bg-orange/90 transition-colors"
              data-ocid="listing.primary_button"
            >
              <Phone className="w-4 h-4" />
              Call Now
            </a>
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 h-10 border-blue-cta text-blue-cta hover:bg-blue-cta/5 text-sm font-semibold"
              data-ocid="listing.cancel_button"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
