"use client";

import { useState } from "react";
import {
  useGetHeroBannersQuery,
  useToggleHeroBannerActiveMutation,
  useDeleteHeroBannerMutation,
} from "../../../../../../../redux/features/home/herroBannerSlice";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogClose,
} from "@/components/ui/dialog";
import {
  Trash2, Monitor, Smartphone, ExternalLink,
  Images, ShieldAlert,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function HeroBannersAdminPage() {
  const { data, isLoading }        = useGetHeroBannersQuery(undefined);
  const [toggleActive]             = useToggleHeroBannerActiveMutation();
  const [deleteBanner]             = useDeleteHeroBannerMutation();
  const [togglingId, setTogglingId] = useState<number | null>(null);
  const [toDelete, setToDelete]    = useState<any | null>(null);

  const handleToggle = async (id: number, is_active: boolean) => {
    setTogglingId(id);
    try {
      await toggleActive({ id, is_active: !is_active }).unwrap();
      toast.success(is_active ? "Banner deactivated" : "Banner activated");
    } catch {
      toast.error("Failed to update banner");
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async () => {
    if (!toDelete) return;
    try {
      await deleteBanner(toDelete.id).unwrap();
      toast.success("Banner deleted");
      setToDelete(null);
    } catch {
      toast.error("Failed to delete banner");
    }
  };

  return (
    <div className="p-6 bg-[#f8f8f8] min-h-screen space-y-5 font-sans">

      {/* ── Header ── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-lg font-semibold text-slate-900 tracking-tight">Hero Banners</h1>
          <p className="text-[11px] text-slate-400 mt-0.5">Manage homepage slider banners.</p>
        </div>
        <div className="flex items-center gap-1.5 bg-white border border-slate-100 rounded-xl px-3 py-2 shadow-sm">
          <Images size={13} className="text-slate-400" />
          <span className="text-[11px] font-semibold text-slate-600">{data?.heroBanners?.length ?? "—"}</span>
          <span className="text-[10px] text-slate-300 font-medium">banners</span>
        </div>
      </div>

      {/* ── List ── */}
      <div className="space-y-3">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 space-y-3">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-36 w-full rounded-xl" />
              <Skeleton className="h-24 w-full rounded-xl" />
            </div>
          ))
        ) : data?.heroBanners?.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm py-20 text-center">
            <Images size={28} className="mx-auto text-slate-200 mb-2" />
            <p className="text-[11px] font-semibold text-slate-400">No banners yet</p>
          </div>
        ) : data?.heroBanners?.map((banner: any) => (
          <div key={banner.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

            {/* ── Row header ── */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-50">
              <div className="flex items-center gap-2">
                <span className={cn(
                  "w-1.5 h-1.5 rounded-full ring-2 ring-offset-1",
                  banner.is_active ? "bg-emerald-500 ring-emerald-100" : "bg-slate-300 ring-slate-100"
                )} />
                <span className="text-[12px] font-semibold text-slate-700">{banner.section_name}</span>
                {banner.cta_link && (
                  <a
                    href={banner.cta_link} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 text-[10px] text-sky-500 hover:text-sky-700 transition-colors"
                  >
                    <ExternalLink size={10} /> {banner.cta_text || banner.cta_link}
                  </a>
                )}
              </div>
              <div className="flex items-center gap-3">
                <Switch
                  checked={banner.is_active}
                  disabled={togglingId === banner.id}
                  onCheckedChange={() => handleToggle(banner.id, banner.is_active)}
                />
                <Button
                  variant="outline" size="icon"
                  className="h-7 w-7 rounded-lg border-slate-200 hover:bg-rose-50 hover:text-rose-500 hover:border-rose-200 transition-colors"
                  onClick={() => setToDelete(banner)}
                >
                  <Trash2 size={13} />
                </Button>
              </div>
            </div>

            {/* ── Images ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4">

              {/* Desktop */}
              <div className="space-y-1.5">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                  <Monitor size={10} /> Desktop
                </p>
                {banner.desktop_image_url ? (
                  <div className="rounded-xl overflow-hidden border border-slate-100 bg-slate-50" style={{ aspectRatio: "7/2" }}>
                    <img
                      src={banner.desktop_image_url}
                      alt="desktop"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 flex items-center justify-center text-slate-300 text-[11px]" style={{ aspectRatio: "7/2" }}>
                    No image
                  </div>
                )}
              </div>

              {/* Mobile */}
              <div className="space-y-1.5">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                  <Smartphone size={10} /> Mobile
                </p>
                {banner.mobile_image_url ? (
                  <div className="rounded-xl overflow-hidden border border-slate-100 bg-slate-50" style={{ aspectRatio: "7/2" }}>
                    <img
                      src={banner.mobile_image_url}
                      alt="mobile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 flex items-center justify-center text-slate-300 text-[11px]" style={{ aspectRatio: "7/2" }}>
                    No image
                  </div>
                )}
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* ── Delete Dialog ── */}
      <Dialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)}>
        <DialogContent className="max-w-xs rounded-2xl border-none shadow-2xl p-6">
          <DialogHeader className="flex flex-col items-center gap-3 mb-1">
            <div className="w-11 h-11 rounded-full bg-rose-50 flex items-center justify-center">
              <ShieldAlert className="text-rose-500" size={20} />
            </div>
            <DialogTitle className="text-[13px] font-semibold text-slate-900">Delete Banner</DialogTitle>
          </DialogHeader>
          <p className="text-[11px] text-slate-500 text-center leading-relaxed">
            Are you sure you want to delete the banner for{" "}
            <span className="font-semibold text-slate-800">"{toDelete?.section_name}"</span>?
            This action cannot be undone.
          </p>
          <div className="flex gap-2 mt-4">
            <DialogClose asChild>
              <Button variant="outline" className="flex-1 h-9 text-[11px] rounded-xl">Cancel</Button>
            </DialogClose>
            <Button variant="destructive" className="flex-1 h-9 text-[11px] rounded-xl" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}
