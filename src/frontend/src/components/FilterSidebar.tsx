import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import {
  Variant_atm_institution_shop,
  type Variant_retail_healthcare_finance_other_food_education_services,
} from "../backend";
import { CATEGORY_LABELS } from "../types";

const S = Variant_atm_institution_shop;

interface FilterSidebarProps {
  sortBy: string;
  onSortChange: (v: string) => void;
  typeFilters: Set<Variant_atm_institution_shop>;
  onTypeToggle: (v: Variant_atm_institution_shop) => void;
  categoryFilters: Set<Variant_retail_healthcare_finance_other_food_education_services>;
  onCategoryToggle: (
    v: Variant_retail_healthcare_finance_other_food_education_services,
  ) => void;
  onReset: () => void;
}

export default function FilterSidebar({
  sortBy,
  onSortChange,
  typeFilters,
  onTypeToggle,
  categoryFilters,
  onCategoryToggle,
  onReset,
}: FilterSidebarProps) {
  const allCategories = Object.entries(CATEGORY_LABELS) as [
    Variant_retail_healthcare_finance_other_food_education_services,
    string,
  ][];

  return (
    <aside className="bg-card rounded-xl shadow-card p-5 flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-base text-foreground">Filters</h3>
        <button
          type="button"
          onClick={onReset}
          className="text-xs text-blue-cta font-medium hover:underline"
          data-ocid="filter.secondary_button"
        >
          Reset All
        </button>
      </div>

      <Separator />

      {/* Sort */}
      <div>
        <h4 className="text-sm font-semibold text-foreground mb-3">Sort By</h4>
        <RadioGroup
          value={sortBy}
          onValueChange={onSortChange}
          className="flex flex-col gap-2"
        >
          {[
            { value: "relevance", label: "Most Relevant" },
            { value: "rating", label: "Highest Rated" },
            { value: "reviews", label: "Most Reviewed" },
            { value: "name", label: "Name (A–Z)" },
          ].map(({ value, label }) => (
            <div key={value} className="flex items-center gap-2">
              <RadioGroupItem
                value={value}
                id={`sort-${value}`}
                className="text-orange border-orange"
                data-ocid="filter.radio"
              />
              <Label
                htmlFor={`sort-${value}`}
                className="text-sm cursor-pointer"
              >
                {label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <Separator />

      {/* Type filter */}
      <div>
        <h4 className="text-sm font-semibold text-foreground mb-3">Type</h4>
        <div className="flex flex-col gap-2">
          {(
            [
              [S.shop, "Shops"],
              [S.institution, "Institutions"],
              [S.atm, "ATMs"],
            ] as [Variant_atm_institution_shop, string][]
          ).map(([type, label]) => (
            <div key={type} className="flex items-center gap-2">
              <Checkbox
                id={`type-${type}`}
                checked={typeFilters.has(type)}
                onCheckedChange={() => onTypeToggle(type)}
                className="border-border data-[state=checked]:bg-orange data-[state=checked]:border-orange"
                data-ocid="filter.checkbox"
              />
              <Label
                htmlFor={`type-${type}`}
                className="text-sm cursor-pointer"
              >
                {label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Category filter */}
      <div>
        <h4 className="text-sm font-semibold text-foreground mb-3">Category</h4>
        <div className="flex flex-col gap-2">
          {allCategories.map(([cat, label]) => (
            <div key={cat} className="flex items-center gap-2">
              <Checkbox
                id={`cat-${cat}`}
                checked={categoryFilters.has(cat)}
                onCheckedChange={() => onCategoryToggle(cat)}
                className="border-border data-[state=checked]:bg-orange data-[state=checked]:border-orange"
                data-ocid="filter.checkbox"
              />
              <Label htmlFor={`cat-${cat}`} className="text-sm cursor-pointer">
                {label}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
