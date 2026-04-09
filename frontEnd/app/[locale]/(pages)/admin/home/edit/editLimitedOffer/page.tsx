"use client";

import { useState } from "react";
import {
  useGetLimitedOfferBannersQuery,
  useToggleLimitedOfferBannerActiveMutation,
  useDeleteLimitedOfferBannerMutation,
} from "../../../../../../../redux/features/home/limitedOfferSlice";

import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Clock, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function LimitedOfferAdminPage() {
  const { data, isLoading } = useGetLimitedOfferBannersQuery(undefined);
  const [toggleActive] = useToggleLimitedOfferBannerActiveMutation();
  const [deleteBanner] = useDeleteLimitedOfferBannerMutation();

  const [activeLoading, setActiveLoading]       = useState<number | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedBannerId, setSelectedBannerId] = useState<number | null>(null);

  if (isLoading) return (
    <div className="flex items-center justify-center h-48 text-[11px] uppercase tracking-widest text-slate-400">
      Loading…
    </div>
  );

  const handleToggle = async (id: number, is_active: boolean) => {
    setActiveLoading(id);
    try {
      await toggleActive({ id, is_active: !is_active }).unwrap();
      toast.success("Banner updated");
    } catch {
      toast.error("Failed to update banner");
    } finally {
      setActiveLoading(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedBannerId) return;
    try {
      await deleteBanner(selectedBannerId).unwrap();
      toast.success("Banner deleted");
    } catch {
      toast.error("Failed to delete banner");
    } finally {
      setDeleteDialogOpen(false);
      setSelectedBannerId(null);
    }
  };

  const formatDate = (d: string) =>
    d ? new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—";

  const banners = data?.limitedOfferBanners || [];

  return (
    <div className="w-full space-y-4">

      {/* Header */}
      <div className="flex items-center gap-3 pb-2 border-b border-slate-100">
        <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center">
          <Clock size={14} className="text-white" />
        </div>
        <div>
          <h1 className="text-[13px] font-semibold text-slate-800 tracking-tight">Limited Offer Banners</h1>
          <p className="text-[11px] text-slate-400">Manage time-limited promotional banners</p>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {banners.map((banner: any) => (
          <div key={banner.id} className="group bg-white border border-slate-100 rounded-xl overflow-hidden">

            {/* Image */}
            <div className="relative w-full aspect-video bg-slate-50 overflow-hidden">
              {banner.image_url ? (
                <img
                  src={banner.image_url}
                  alt="offer"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[9px] uppercase tracking-widest text-slate-300">
                  No image
                </div>
              )}
              <span className={`absolute top-2 left-2 text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full font-medium
                ${banner.is_active ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-500"}`}>
                {banner.is_active ? "Active" : "Off"}
              </span>
            </div>

            {/* Meta */}
            <div className="px-3 py-2.5 space-y-1.5">
              <p className="text-[11px] font-medium text-slate-700 truncate">
                {banner.section_name || `Banner #${banner.id}`}
              </p>

              {banner.link_url && (
                <p className="text-[10px] text-slate-400 truncate">{banner.link_url}</p>
              )}

              <div className="flex items-center gap-1.5 text-[9px] text-slate-400 uppercase tracking-widest">
                <Clock size={9} />
                <span>{formatDate(banner.start_at)} → {formatDate(banner.end_at)}</span>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-1 border-t border-slate-50">
                <Switch
                  checked={banner.is_active}
                  disabled={activeLoading === banner.id}
                  onCheckedChange={() => handleToggle(banner.id, banner.is_active)}
                  className="scale-75 origin-left"
                />

                <Dialog
                  open={deleteDialogOpen && selectedBannerId === banner.id}
                  onOpenChange={(o) => !o && setDeleteDialogOpen(false)}
                >
                  <DialogTrigger asChild>
                    <button
                      onClick={() => { setSelectedBannerId(banner.id); setDeleteDialogOpen(true); }}
                      className="w-6 h-6 flex items-center justify-center rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 size={12} />
                    </button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-sm rounded-2xl">
                    <DialogHeader>
                      <DialogTitle className="text-[14px]">Delete Banner?</DialogTitle>
                      <DialogDescription className="text-[12px]">This action cannot be undone.</DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end gap-2 mt-2">
                      <button
                        onClick={() => setDeleteDialogOpen(false)}
                        className="px-4 py-1.5 rounded-lg text-[11px] border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleConfirmDelete}
                        className="px-4 py-1.5 rounded-lg text-[11px] bg-red-500 hover:bg-red-600 text-white transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        ))}
      </div>

      {banners.length === 0 && (
        <p className="text-center text-[11px] uppercase tracking-widest text-slate-400 py-12">No banners found</p>
      )}
    </div>
  );
}
