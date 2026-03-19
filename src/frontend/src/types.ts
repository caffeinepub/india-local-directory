import {
  Variant_atm_institution_shop,
  Variant_retail_healthcare_finance_other_food_education_services,
} from "./backend";

export type ListingType = Variant_atm_institution_shop;
export type Category =
  Variant_retail_healthcare_finance_other_food_education_services;

export const CITIES = ["Guwahati"];

export const LISTING_TYPE_LABELS: Record<ListingType, string> = {
  [Variant_atm_institution_shop.shop]: "SHOP",
  [Variant_atm_institution_shop.institution]: "INSTITUTION",
  [Variant_atm_institution_shop.atm]: "ATM",
};

export const CATEGORY_LABELS: Record<Category, string> = {
  [Variant_retail_healthcare_finance_other_food_education_services.retail]:
    "Retail",
  [Variant_retail_healthcare_finance_other_food_education_services.healthcare]:
    "Healthcare",
  [Variant_retail_healthcare_finance_other_food_education_services.finance]:
    "Finance",
  [Variant_retail_healthcare_finance_other_food_education_services.food]:
    "Food",
  [Variant_retail_healthcare_finance_other_food_education_services.education]:
    "Education",
  [Variant_retail_healthcare_finance_other_food_education_services.services]:
    "Services",
  [Variant_retail_healthcare_finance_other_food_education_services.other]:
    "Other",
};

export const CATEGORY_GRADIENTS: Record<Category, string> = {
  [Variant_retail_healthcare_finance_other_food_education_services.retail]:
    "from-orange-400 to-amber-500",
  [Variant_retail_healthcare_finance_other_food_education_services.healthcare]:
    "from-emerald-400 to-teal-500",
  [Variant_retail_healthcare_finance_other_food_education_services.finance]:
    "from-blue-400 to-indigo-500",
  [Variant_retail_healthcare_finance_other_food_education_services.food]:
    "from-red-400 to-rose-500",
  [Variant_retail_healthcare_finance_other_food_education_services.education]:
    "from-violet-400 to-purple-500",
  [Variant_retail_healthcare_finance_other_food_education_services.services]:
    "from-cyan-400 to-sky-500",
  [Variant_retail_healthcare_finance_other_food_education_services.other]:
    "from-slate-400 to-gray-500",
};

export const ATM_GRADIENT = "from-blue-500 to-navy-mid";
