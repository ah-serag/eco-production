"use client";

import { useState } from "react";
import {
  useGetSubcategoryBannersQuery,
  useToggleSubcategoryBannerActiveMutation,
  useDeleteSubcategoryBannerMutation,
} from "../../../../../../../redux/features/home/subCategoryBannerSlice";

import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Layers, Trash2, Monitor, Smartphone } from "lucide-react";
import { toast } from "sonner";

export default function SubcategoryBannersAdminPage() {
  const { data, isLoading } = useGetSubcategoryBannersQuery(undefined);
  const [toggleActive] = useToggleSubcategoryBannerActiveMutation();
  const [deleteBanner] = useDeleteSubcategoryBannerMutation();

  const [activeLoading, setActiveLoading]   = useState<number | null>(null);
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

  const banners = data?.subcategoryBanners || [];

  return (
    <div className="w-full space-y-4">

      {/* Header */}
      <div className="flex items-center gap-3 pb-2 border-b border-slate-100">
        <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center">
          <Layers size={14} className="text-white" />
        </div>
        <div>
          <h1 className="text-[13px] font-semibold text-slate-800 tracking-tight">Subcategory Banners</h1>
          <p className="text-[11px] text-slate-400">Manage, activate and delete subcategory banners</p>
        </div>
      </div>

      {/* List */}
      <Accordion type="single" collapsible className="space-y-2">
        {banners.map((banner: any) => (
          <AccordionItem
            key={banner.id}
            value={`${banner.id}`}
            className="bg-white border border-slate-100 rounded-xl overflow-hidden shadow-none"
          >
            <div className="flex items-center justify-between">
              <AccordionTrigger className="flex-1 px-4 py-3 hover:no-underline hover:bg-slate-50/50 transition-colors">
                <div className="flex items-center gap-3 text-start">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[12px] font-medium text-slate-800">{banner.subcategory_name}</span>
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest">{banner.section_name}</span>
                  </div>
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${banner.is_active ? "bg-emerald-400" : "bg-slate-300"}`} />
                </div>
              </AccordionTrigger>

              <div className="flex items-center gap-2 px-4">
                <Switch
                  checked={banner.is_active}
                  disabled={activeLoading === banner.id}
                  onCheckedChange={() => handleToggle(banner.id, banner.is_active)}
                />

                <Dialog
                  open={deleteDialogOpen && selectedBannerId === banner.id}
                  onOpenChange={setDeleteDialogOpen}
                >
                  <DialogTrigger asChild>
                    <button
                      onClick={() => { setSelectedBannerId(banner.id); setDeleteDialogOpen(true); }}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 size={13} />
                    </button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-sm rounded-2xl">
                    <DialogHeader>
                      <DialogTitle className="text-[14px]">Delete Banner?</DialogTitle>
                      <DialogDescription className="text-[12px]">
                        This action cannot be undone.
                      </DialogDescription>
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

            {/* Content */}
            <AccordionContent className="px-4 pb-4 pt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

                {/* Desktop */}
                {banner.desktop_image_url && (
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-[9px] uppercase tracking-widest text-slate-400">
                      <Monitor size={10} /> Desktop
                    </div>
                    <div className="w-full aspect-video rounded-xl overflow-hidden bg-slate-100">
                      <img src={banner.desktop_image_url} alt="desktop" className="w-full h-full object-cover" />
                    </div>
                  </div>
                )}

                {/* Mobile */}
                {banner.mobile_image_url && (
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-[9px] uppercase tracking-widest text-slate-400">
                      <Smartphone size={10} /> Mobile
                    </div>
                    <div className="w-full aspect-video rounded-xl overflow-hidden bg-slate-100">
                      <img src={banner.mobile_image_url} alt="mobile" className="w-full h-full object-cover" />
                    </div>
                  </div>
                )}

                {/* Fallback old image_url */}
                {!banner.desktop_image_url && !banner.mobile_image_url && banner.image_url && (
                  <div className="col-span-2 w-full aspect-video rounded-xl overflow-hidden bg-slate-100">
                    <img src={banner.image_url} alt="banner" className="w-full h-full object-cover" />
                  </div>
                )}

              </div>

              {/* Meta */}
              <div className="mt-3 flex flex-wrap gap-2">
                {banner.subcategory_id && (
                  <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md">
                    Sub ID: {banner.subcategory_id}
                  </span>
                )}
                {banner.category_id && (
                  <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md">
                    Cat ID: {banner.category_id}
                  </span>
                )}
                <span className={`text-[10px] px-2 py-0.5 rounded-md ${banner.is_active ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-400"}`}>
                  {banner.is_active ? "Active" : "Inactive"}
                </span>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {banners.length === 0 && (
        <p className="text-center text-[11px] uppercase tracking-widest text-slate-400 py-12">No banners found</p>
      )}
    </div>
  );
}
