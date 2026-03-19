import {
  Building2,
  CreditCard,
  HeartPulse,
  ShoppingBag,
  UtensilsCrossed,
  Wrench,
} from "lucide-react";
import { Variant_retail_healthcare_finance_other_food_education_services } from "../backend";

const C = Variant_retail_healthcare_finance_other_food_education_services;

const TILES = [
  {
    label: "Shops",
    icon: ShoppingBag,
    color: "text-orange",
    bg: "bg-orange-light",
    category: C.retail,
  },
  {
    label: "Restaurants",
    icon: UtensilsCrossed,
    color: "text-red-500",
    bg: "bg-red-50",
    category: C.food,
  },
  {
    label: "Healthcare",
    icon: HeartPulse,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    category: C.healthcare,
  },
  {
    label: "ATMs",
    icon: CreditCard,
    color: "text-blue-cta",
    bg: "bg-blue-cta-light",
    category: C.finance,
  },
  {
    label: "Institutions",
    icon: Building2,
    color: "text-violet-600",
    bg: "bg-violet-50",
    category: C.education,
  },
  {
    label: "Services",
    icon: Wrench,
    color: "text-cyan-600",
    bg: "bg-cyan-50",
    category: C.services,
  },
];

interface CategoryTilesProps {
  onSelect?: (
    category: Variant_retail_healthcare_finance_other_food_education_services,
  ) => void;
  selectedCategory?: Variant_retail_healthcare_finance_other_food_education_services | null;
}

export default function CategoryTiles({
  onSelect,
  selectedCategory,
}: CategoryTilesProps) {
  return (
    <div className="flex flex-wrap justify-center gap-3">
      {TILES.map(({ label, icon: Icon, color, bg, category }) => (
        <button
          type="button"
          key={label}
          onClick={() => onSelect?.(category)}
          className={`flex flex-col items-center gap-2 bg-white rounded-xl px-4 py-3 shadow-card hover:shadow-card-hover transition-all duration-200 min-w-[90px] ${
            selectedCategory === category ? "ring-2 ring-orange" : ""
          }`}
          data-ocid="category.tab"
        >
          <div
            className={`w-10 h-10 rounded-full ${bg} flex items-center justify-center`}
          >
            <Icon className={`w-5 h-5 ${color}`} />
          </div>
          <span className="text-xs font-semibold text-foreground">{label}</span>
        </button>
      ))}
    </div>
  );
}
