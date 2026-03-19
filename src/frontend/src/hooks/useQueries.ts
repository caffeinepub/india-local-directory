import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  Listing,
  ListingUpdateData,
  Variant_atm_institution_shop,
  Variant_retail_healthcare_finance_other_food_education_services,
} from "../backend";
import { useActor } from "./useActor";

type ListingType = Variant_atm_institution_shop;
type Category = Variant_retail_healthcare_finance_other_food_education_services;

export function useListings(
  keyword: string,
  typeFilter: ListingType | null,
  categoryFilter: Category | null,
  cityFilter: string | null,
) {
  const { actor, isFetching } = useActor();
  return useQuery<Listing[]>({
    queryKey: ["listings", keyword, typeFilter, categoryFilter, cityFilter],
    queryFn: async () => {
      if (!actor) return [];
      if (keyword || typeFilter || categoryFilter || cityFilter) {
        return actor.searchListings(
          keyword,
          typeFilter,
          categoryFilter,
          cityFilter,
        );
      }
      return actor.getAllActiveListings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useListing(id: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Listing | null>({
    queryKey: ["listing", id?.toString()],
    queryFn: async () => {
      if (!actor || id === null) return null;
      return actor.getListing(id);
    },
    enabled: !!actor && !isFetching && id !== null,
  });
}

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateListing() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      name: string;
      listingType: ListingType;
      category: Category;
      address: string;
      city: string;
      state: string;
      pincode: string;
      phone: string;
      description: string;
      openHours: string;
      lat?: number;
      lng?: number;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.createListing(
        data.name,
        data.listingType,
        data.category,
        data.address,
        data.city,
        data.state,
        data.pincode,
        data.phone,
        data.description,
        data.openHours,
        data.lat ?? 0,
        data.lng ?? 0,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["listings"] }),
  });
}

export function useUpdateListing() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: { id: bigint; data: ListingUpdateData }) => {
      if (!actor) throw new Error("No actor");
      return actor.updateListing(id, data);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["listings"] }),
  });
}

export function useDeleteListing() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("No actor");
      return actor.deleteListing(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["listings"] }),
  });
}

export function useRateListing() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, rating }: { id: bigint; rating: number }) => {
      if (!actor) throw new Error("No actor");
      return actor.rateListing(id, BigInt(rating));
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["listings"] }),
  });
}
