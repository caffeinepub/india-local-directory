import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Pencil, Plus, Trash2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  type Listing,
  Variant_atm_institution_shop,
  Variant_retail_healthcare_finance_other_food_education_services,
} from "../backend";
import { sampleListings } from "../data/sampleData";
import {
  useCreateListing,
  useDeleteListing,
  useUpdateListing,
} from "../hooks/useQueries";
import { CATEGORY_LABELS, CITIES, LISTING_TYPE_LABELS } from "../types";
import MapPicker from "./MapPicker";

const S = Variant_atm_institution_shop;
const C = Variant_retail_healthcare_finance_other_food_education_services;

type FormData = {
  name: string;
  listingType: Variant_atm_institution_shop;
  category: Variant_retail_healthcare_finance_other_food_education_services;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  description: string;
  openHours: string;
  lat: number;
  lng: number;
};

const EMPTY_FORM: FormData = {
  name: "",
  listingType: S.shop,
  category: C.retail,
  address: "",
  city: "Guwahati",
  state: "",
  pincode: "",
  phone: "",
  description: "",
  openHours: "",
  lat: 0,
  lng: 0,
};

interface AdminPanelProps {
  onClose: () => void;
  listings: Listing[];
  autoOpenForm?: boolean;
}

export default function AdminPanel({
  onClose,
  listings,
  autoOpenForm,
}: AdminPanelProps) {
  const [dialogOpen, setDialogOpen] = useState(!!autoOpenForm);
  const [editTarget, setEditTarget] = useState<Listing | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);

  const createMutation = useCreateListing();
  const updateMutation = useUpdateListing();
  const deleteMutation = useDeleteListing();

  const openCreate = () => {
    setEditTarget(null);
    setForm(EMPTY_FORM);
    setDialogOpen(true);
  };

  const openEdit = (listing: Listing) => {
    setEditTarget(listing);
    setForm({
      name: listing.name,
      listingType: listing.listingType,
      category: listing.category,
      address: listing.address,
      city: listing.city,
      state: listing.state,
      pincode: listing.pincode,
      phone: listing.phone,
      description: listing.description,
      openHours: listing.openHours,
      lat: listing.lat,
      lng: listing.lng,
    });
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    try {
      if (editTarget) {
        await updateMutation.mutateAsync({ id: editTarget.id, data: form });
        toast.success("Listing updated successfully!");
      } else {
        await createMutation.mutateAsync(form);
        toast.success("Listing created successfully!");
      }
      setDialogOpen(false);
    } catch {
      toast.error("Operation failed. Please try again.");
    }
  };

  const handleDelete = async (id: bigint) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Listing deleted.");
    } catch {
      toast.error("Failed to delete listing.");
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;
  const displayListings = listings.length > 0 ? listings : sampleListings;

  const set = (field: keyof FormData) => (val: string) =>
    setForm((prev) => ({ ...prev, [field]: val }));

  return (
    <div className="fixed inset-0 z-50 bg-white overflow-auto">
      <div className="max-w-[1200px] mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-navy">Admin Panel</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage all local business listings
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={openCreate}
              className="bg-orange text-white hover:bg-orange/90 gap-2"
              data-ocid="admin.primary_button"
            >
              <Plus className="w-4 h-4" />
              Add Listing
            </Button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
              data-ocid="admin.close_button"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Table */}
        <div
          className="rounded-xl border border-border overflow-hidden shadow-card"
          data-ocid="admin.table"
        >
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold">Name</TableHead>
                <TableHead className="font-semibold">Type</TableHead>
                <TableHead className="font-semibold">Category</TableHead>
                <TableHead className="font-semibold">City</TableHead>
                <TableHead className="font-semibold">Phone</TableHead>
                <TableHead className="font-semibold">Rating</TableHead>
                <TableHead className="font-semibold text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayListings.map((listing, i) => (
                <TableRow
                  key={listing.id.toString()}
                  data-ocid={`admin.row.${i + 1}`}
                >
                  <TableCell className="font-medium">{listing.name}</TableCell>
                  <TableCell>
                    <span className="text-xs font-semibold px-2 py-0.5 bg-muted rounded-full">
                      {LISTING_TYPE_LABELS[listing.listingType]}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {CATEGORY_LABELS[listing.category]}
                  </TableCell>
                  <TableCell className="text-sm">{listing.city}</TableCell>
                  <TableCell className="text-sm text-blue-cta">
                    {listing.phone}
                  </TableCell>
                  <TableCell className="text-sm">
                    {listing.rating.toFixed(1)} ★
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEdit(listing)}
                        className="h-8 w-8 p-0 text-blue-cta hover:text-blue-cta/80 hover:bg-blue-cta/10"
                        data-ocid={`admin.edit_button.${i + 1}`}
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                            data-ocid={`admin.delete_button.${i + 1}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent data-ocid="admin.dialog">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Listing?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete{" "}
                              <strong>{listing.name}</strong>. This action
                              cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel data-ocid="admin.cancel_button">
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(listing.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              data-ocid="admin.confirm_button"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent
          className="max-w-lg max-h-[90vh] overflow-y-auto"
          data-ocid="admin.modal"
        >
          <DialogHeader>
            <DialogTitle>
              {editTarget ? "Edit Listing" : "Add New Listing"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            <div className="grid gap-1.5">
              <Label htmlFor="name">
                Business Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => set("name")(e.target.value)}
                placeholder="e.g. Rajesh Electronics"
                data-ocid="admin.input"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-1.5">
                <Label>Listing Type</Label>
                <Select
                  value={form.listingType}
                  onValueChange={set("listingType")}
                >
                  <SelectTrigger data-ocid="admin.select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(LISTING_TYPE_LABELS).map(([val, label]) => (
                      <SelectItem key={val} value={val}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-1.5">
                <Label>Category</Label>
                <Select value={form.category} onValueChange={set("category")}>
                  <SelectTrigger data-ocid="admin.select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(CATEGORY_LABELS).map(([val, label]) => (
                      <SelectItem key={val} value={val}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="address">
                Address <span className="text-destructive">*</span>
              </Label>
              <Input
                id="address"
                value={form.address}
                onChange={(e) => set("address")(e.target.value)}
                placeholder="Street, Area"
                data-ocid="admin.input"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-1.5">
                <Label>City</Label>
                <Select value={form.city} onValueChange={set("city")}>
                  <SelectTrigger data-ocid="admin.select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CITIES.filter((c) => c !== "All Cities").map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={form.state}
                  onChange={(e) => set("state")(e.target.value)}
                  placeholder="e.g. Assam"
                  data-ocid="admin.input"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-1.5">
                <Label htmlFor="pincode">Pincode</Label>
                <Input
                  id="pincode"
                  value={form.pincode}
                  onChange={(e) => set("pincode")(e.target.value)}
                  placeholder="6-digit pincode"
                  maxLength={6}
                  data-ocid="admin.input"
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="phone">
                  Phone <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="phone"
                  value={form.phone}
                  onChange={(e) => set("phone")(e.target.value)}
                  placeholder="+91 XXXXX XXXXX"
                  data-ocid="admin.input"
                />
              </div>
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="openHours">Open Hours</Label>
              <Input
                id="openHours"
                value={form.openHours}
                onChange={(e) => set("openHours")(e.target.value)}
                placeholder="e.g. Mon–Sat: 10AM – 9PM"
                data-ocid="admin.input"
              />
            </div>

            {/* Map Picker */}
            <div className="grid gap-1.5">
              <Label className="flex items-center gap-1.5">
                📍 Pin Location on Map
                <span className="text-muted-foreground text-xs font-normal">
                  (click or drag to reposition)
                </span>
              </Label>
              {dialogOpen && (
                <MapPicker
                  key={editTarget ? editTarget.id.toString() : "new"}
                  initialLat={form.lat}
                  initialLng={form.lng}
                  onChange={(lat, lng) =>
                    setForm((prev) => ({ ...prev, lat, lng }))
                  }
                />
              )}
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="description">
                Description <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="description"
                value={form.description}
                onChange={(e) => set("description")(e.target.value)}
                placeholder="Brief description of the business…"
                rows={3}
                data-ocid="admin.textarea"
              />
            </div>

            <p className="text-xs text-muted-foreground">
              Fields marked with <span className="text-destructive">*</span> are
              required.
            </p>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              data-ocid="admin.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={
                isPending ||
                !form.name ||
                !form.address ||
                !form.phone ||
                !form.description
              }
              className="bg-orange text-white hover:bg-orange/90"
              data-ocid="admin.submit_button"
            >
              {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              {editTarget ? "Save Changes" : "Create Listing"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
