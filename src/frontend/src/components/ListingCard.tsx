import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Star } from "lucide-react";
import { type Listing, Variant_atm_institution_shop } from "../backend";
import {
  ATM_GRADIENT,
  CATEGORY_GRADIENTS,
  CATEGORY_LABELS,
  LISTING_TYPE_LABELS,
} from "../types";

interface ListingCardProps {
  listing: Listing;
  index: number;
  onViewDetails: (listing: Listing) => void;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      <Star className="w-3.5 h-3.5 fill-orange text-orange" />
      <span className="text-sm font-bold text-foreground">
        {rating.toFixed(1)}
      </span>
    </div>
  );
}

export default function ListingCard({
  listing,
  index,
  onViewDetails,
}: ListingCardProps) {
  const isAtm = listing.listingType === Variant_atm_institution_shop.atm;
  const gradient = isAtm ? ATM_GRADIENT : CATEGORY_GRADIENTS[listing.category];
  const typeLabel = LISTING_TYPE_LABELS[listing.listingType];
  const categoryLabel = CATEGORY_LABELS[listing.category];

  const badgeColors: Record<string, string> = {
    SHOP: "bg-orange-light text-orange",
    ATM: "bg-blue-cta-light text-blue-cta",
    INSTITUTION: "bg-violet-50 text-violet-700",
  };

  return (
    <article
      className="bg-card rounded-xl shadow-card hover:shadow-card-hover transition-all duration-200 overflow-hidden flex flex-col"
      data-ocid={`listing.item.${index}`}
    >
      {/* Image / gradient top */}
      <div className={`relative h-32 bg-gradient-to-br ${gradient}`}>
        <div className="absolute inset-0 opacity-20 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute top-2 right-2">
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badgeColors[typeLabel] ?? "bg-gray-100 text-gray-700"}`}
          >
            {typeLabel}
          </span>
        </div>
        <div className="absolute bottom-2 left-3">
          <Badge
            variant="secondary"
            className="text-[10px] font-medium bg-white/90 text-foreground"
          >
            {categoryLabel}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1 gap-2">
        <h3 className="font-bold text-base text-foreground leading-snug line-clamp-2">
          {listing.name}
        </h3>

        <div className="flex items-center justify-between">
          <StarRating rating={listing.rating} />
          <span className="text-xs text-muted-foreground">
            ({Number(listing.totalRatings)} reviews)
          </span>
        </div>

        <div className="flex items-start gap-1.5 text-xs text-muted-foreground">
          <MapPin className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-orange" />
          <span className="line-clamp-2">
            {listing.address}, {listing.city} – {listing.pincode}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-xs">
          <Phone className="w-3.5 h-3.5 text-blue-cta flex-shrink-0" />
          <a
            href={`tel:${listing.phone}`}
            className="text-blue-cta font-medium hover:underline"
          >
            {listing.phone}
          </a>
        </div>

        <div className="flex gap-2 mt-auto pt-2">
          <a
            href={`tel:${listing.phone}`}
            className="flex-1 h-9 flex items-center justify-center gap-1.5 bg-orange text-white text-xs font-semibold rounded-lg hover:bg-orange/90 transition-colors"
            data-ocid={`listing.primary_button.${index}`}
          >
            <Phone className="w-3.5 h-3.5" />
            Call Now
          </a>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails(listing)}
            className="flex-1 h-9 border-blue-cta text-blue-cta hover:bg-blue-cta/5 text-xs font-semibold"
            data-ocid={`listing.secondary_button.${index}`}
          >
            View Details
          </Button>
        </div>
      </div>
    </article>
  );
}
