"use client";

import { useState } from "react";
import {
  useGetHeroBannersQuery,
  useToggleHeroBannerActiveMutation,
  useDeleteHeroBannerMutation,
} from "../../../../../../../redux/features/home/herroBannerSlice";

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Trash, LayoutGrid } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function HeroBannersAdminPage() {
  const { data, isLoading } = useGetHeroBannersQuery(undefined);
  const [toggleActive] = useToggleHeroBannerActiveMutation();
  const [deleteBanner] = useDeleteHeroBannerMutation();

  const [activeLoading, setActiveLoading] = useState<number | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedBannerId, setSelectedBannerId] = useState<number | null>(null);

  if (isLoading) return <div className="p-8">Loading...</div>;

  const handleToggle = async (id: number, is_active: boolean) => {
    setActiveLoading(id);
    try {
      await toggleActive({ id, is_active: !is_active }).unwrap();
      toast.success("Hero banner updated successfully");
    } catch {
      toast.error("Failed to update hero banner");
    } finally {
      setActiveLoading(null);
    }
  };

  const openDeleteDialog = (id: number) => {
    setSelectedBannerId(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedBannerId) return;
    try {
      await deleteBanner(selectedBannerId).unwrap();
      toast.success("Hero banner deleted successfully");
    } catch {
      toast.error("Failed to delete hero banner");
    } finally {
      setDeleteDialogOpen(false);
      setSelectedBannerId(null);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen space-y-6">
      {/* ================= Page Banner ================= */}
      <div className="relative overflow-hidden mb-10 rounded-md p-10 bg-secondary text-white shadow-lg">
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-[auto_1fr] gap-6 items-center">
          <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-white/20">
            <LayoutGrid size={32} />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">
              Manage Hero Banners
            </h1>
            <span className="inline-block text-xs uppercase tracking-widest text-white/70">
              Admin Dashboard
            </span>
            <p className="max-w-2xl text-white/80 text-sm leading-relaxed">
              On this page, you can manage all hero banners dynamically.
              Activate or deactivate banners, view all items, and delete banners as needed.
            </p>
          </div>
        </div>
      </div>

      <Accordion type="single" collapsible className="space-y-4">
        {data?.heroBanners.map((banner: any) => (
          <AccordionItem
            key={banner.id}
            value={`${banner.id}`}
            className="bg-white shadow rounded-lg border"
          >
            {/* Header */}
            <div className="flex justify-between items-center">
              <AccordionTrigger className="flex-1 px-4 py-3 font-medium hover:bg-gray-100">
                section name : <span className="text-black">{banner.section_name}</span> 
              </AccordionTrigger>

              <div className="flex items-center gap-3 px-4">
                <Switch
                  checked={banner.is_active}
                  disabled={activeLoading === banner.id}
                  onCheckedChange={() =>
                    handleToggle(banner.id, banner.is_active)
                  }
                />

                {/* Delete Dialog */}
                <Dialog
                  open={
                    deleteDialogOpen && selectedBannerId === banner.id
                  }
                  onOpenChange={setDeleteDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => openDeleteDialog(banner.id)}
                    >
                      <Trash size={16} />
                    </Button>
                  </DialogTrigger>

                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Confirm Delete</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to delete this hero banner?
                        This action cannot be undone.
                      </DialogDescription>
                    </DialogHeader>

                    <div className="mt-4 flex justify-end gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setDeleteDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        className="bg-red-500 hover:bg-red-600 text-white"
                        onClick={handleConfirmDelete}
                      >
                        Delete
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* Content */}
            <AccordionContent className="px-6 py-4 text-sm text-gray-700 space-y-4">
              {banner.image_url ? (
                <div className="relative w-full h-[150px] md:h-[200px] rounded-md overflow-hidden shadow">
                  <img
                    src={banner.image_url}
                    alt={banner.title}
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute inset-0 bg-black/20 flex flex-col justify-end p-2">
                    <p className="text-white font-medium text-sm md:text-base">
                      {banner.title}
                    </p>
                    {banner.subtitle && (
                      <p className="text-white/80 text-xs md:text-sm">
                        {banner.subtitle}
                      </p>
                    )}
                    {banner.cta_text && (
                      <a
                        href={banner.cta_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 text-blue-400 text-xs md:text-sm hover:underline"
                      >
                        {banner.cta_text}
                      </a>
                    )}
                  </div>
                </div>
              ) : (
                <span className="text-gray-400">No image</span>
              )}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
