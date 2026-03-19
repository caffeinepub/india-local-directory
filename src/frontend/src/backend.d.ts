import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Listing {
    id: bigint;
    lat: number;
    lng: number;
    totalRatings: bigint;
    city: string;
    name: string;
    description: string;
    isActive: boolean;
    listingType: Variant_atm_institution_shop;
    state: string;
    address: string;
    openHours: string;
    category: Variant_retail_healthcare_finance_other_food_education_services;
    rating: number;
    phone: string;
    pincode: string;
}
export interface UserProfile {
    name: string;
}
export interface ListingUpdateData {
    lat?: number;
    lng?: number;
    city?: string;
    name?: string;
    description?: string;
    isActive?: boolean;
    listingType?: Variant_atm_institution_shop;
    state?: string;
    address?: string;
    openHours?: string;
    category?: Variant_retail_healthcare_finance_other_food_education_services;
    phone?: string;
    pincode?: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum Variant_atm_institution_shop {
    atm = "atm",
    institution = "institution",
    shop = "shop"
}
export enum Variant_retail_healthcare_finance_other_food_education_services {
    retail = "retail",
    healthcare = "healthcare",
    finance = "finance",
    other = "other",
    food = "food",
    education = "education",
    services = "services"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createListing(name: string, listingType: Variant_atm_institution_shop, category: Variant_retail_healthcare_finance_other_food_education_services, address: string, city: string, state: string, pincode: string, phone: string, description: string, openHours: string, lat: number, lng: number): Promise<bigint>;
    deleteListing(id: bigint): Promise<void>;
    getAllActiveListings(): Promise<Array<Listing>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getListing(id: bigint): Promise<Listing | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    rateListing(listingId: bigint, rating: bigint): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    searchListings(keyword: string, listingTypeFilter: Variant_atm_institution_shop | null, categoryFilter: Variant_retail_healthcare_finance_other_food_education_services | null, cityFilter: string | null): Promise<Array<Listing>>;
    updateListing(id: bigint, updateData: ListingUpdateData): Promise<void>;
}
