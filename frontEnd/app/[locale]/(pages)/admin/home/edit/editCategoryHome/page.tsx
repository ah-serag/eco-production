"use client";

import { useState } from "react";
import {
  useGetCategoryHomeQuery,
  useToggleHomeCategoryActiveMutation,
  useDeleteHomeCategoryMutation,
} from "../../../../../../../redux/features/home/categoryHomeSlice";

import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { LayoutGrid, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function HomeCategoriesAdminPage() {
  const { data, isLoading } = useGetCategoryHomeQuery(undefined);
  const [toggleActive] = useToggleHomeCategoryActiveMutation();
  const [deleteCategory] = useDeleteHomeCategoryMutation();

  const [activeLoading, setActiveLoading] = useState<number | null>(null);
  const [openDialogId, setOpenDialogId]   = useState<number | null>(null);

  if (isLoading) return (
    <div className="flex items-center justify-center h-48 text-[11px] uppercase tracking-widest text-slate-400">
      Loading…
    </div>
  );

  const handleToggle = async (id: number) => {
    setActiveLoading(id);
    try {
      await toggleActive(id).unwrap();
      toast.success("Category updated");
    } catch {
      toast.error("Failed to update category");
    } finally {
      setActiveLoading(null);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteCategory(id).unwrap();
      toast.success("Category deleted");
    } catch {
      toast.error("Failed to delete category");
    } finally {
      setOpenDialogId(null);
    }
  };

  const categories = data?.categoryHome || [];

  return (
    <div className="w-full space-y-4">

      {/* Header */}
      <div className="flex items-center gap-3 pb-2 border-b border-slate-100">
        <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center">
          <LayoutGrid size={14} className="text-white" />
        </div>
        <div>
          <h1 className="text-[13px] font-semibold text-slate-800 tracking-tight">Home Categories</h1>
          <p className="text-[11px] text-slate-400">Activate, deactivate or delete home category items</p>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {categories.map((cat: any) => (
          <div
            key={cat.id}
            className="relative group bg-white border border-slate-100 rounded-xl overflow-hidden"
          >
            {/* Image */}
            <div className="aspect-square w-full overflow-hidden bg-slate-50">
              {cat.image_url ? (
                <img
                  src={cat.image_url}
                  alt={cat.title || "category"}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[9px] text-slate-300 uppercase tracking-widest">
                  No image
                </div>
              )}
            </div>

            {/* Meta */}
            <div className="px-2 py-2 flex items-center justify-between gap-1">
              <div className="flex flex-col gap-0.5 min-w-0">
                <span className="text-[11px] font-medium text-slate-700 truncate">
                  {cat.title || `Cat #${cat.category_id}`}
                </span>
                <div className="flex items-center gap-1">
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${cat.is_active ? "bg-emerald-400" : "bg-slate-300"}`} />
                  <span className="text-[9px] uppercase tracking-widest text-slate-400">
                    {cat.is_active ? "Active" : "Off"}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <Switch
                  checked={cat.is_active}
                  disabled={activeLoading === cat.id}
                  onCheckedChange={() => handleToggle(cat.id)}
                  className="scale-75"
                />

                <Dialog
                  open={openDialogId === cat.id}
                  onOpenChange={(o) => !o && setOpenDialogId(null)}
                >
                  <DialogTrigger asChild>
                    <button
                      onClick={() => setOpenDialogId(cat.id)}
                      className="w-6 h-6 flex items-center justify-center rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 size={12} />
                    </button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-sm rounded-2xl">
                    <DialogHeader>
                      <DialogTitle className="text-[14px]">Delete Category?</DialogTitle>
                      <DialogDescription className="text-[12px]">
                        This action cannot be undone.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end gap-2 mt-2">
                      <button
                        onClick={() => setOpenDialogId(null)}
                        className="px-4 py-1.5 rounded-lg text-[11px] border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id)}
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

      {categories.length === 0 && (
        <p className="text-center text-[11px] uppercase tracking-widest text-slate-400 py-12">No categories found</p>
      )}
    </div>
  );
}
