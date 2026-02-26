"use client";

import {
  useGetCategoryHomeQuery,
  useToggleHomeCategoryActiveMutation,
  useDeleteHomeCategoryMutation,
} from "../../../../../../redux/features/home/categoryHomeSlice";

import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Trash, LayoutGrid } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export default function HomeCategoriesAdminPage() {
  const { data, isLoading } = useGetCategoryHomeQuery(undefined);
  const [toggleActive] = useToggleHomeCategoryActiveMutation();
  const [deleteCategory] = useDeleteHomeCategoryMutation();
  const [activeLoading, setActiveLoading] = useState<number | null>(null);
  const [openDialogId, setOpenDialogId] = useState<number | null>(null);

  if (isLoading) return <div className="p-8">Loading...</div>;

  const handleToggle = async (id: number) => {
    setActiveLoading(id);
    try {
      await toggleActive(id).unwrap();
      toast.success("Category updated successfully");
    } catch {
      toast.error("Failed to update category");
    } finally {
      setActiveLoading(null);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteCategory(id).unwrap();
      toast.success("Category deleted successfully");
    } catch {
      toast.error("Failed to delete category");
    } finally {
      setOpenDialogId(null);
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
              Manage Home Categories
            </h1>
            <span className="inline-block text-xs uppercase tracking-widest text-white/70">
              Admin Dashboard
            </span>
            <p className="max-w-2xl text-white/80 text-sm leading-relaxed">
              On this page, you can manage all home categories dynamically.
              Activate or deactivate categories, view all items, and delete categories as needed.
            </p>
          </div>
        </div>
      </div>

      <Accordion type="single" collapsible className="space-y-4">
        {data?.categoryHome.map((category: any) => (
          <AccordionItem key={category.id} value={`${category.id}`} className="bg-white shadow rounded-lg border">
            {/* Header */}
            <div className="flex justify-between items-center">
              <AccordionTrigger className="flex-1 px-4 py-3 font-medium hover:bg-gray-100">
                {category.title}
              </AccordionTrigger>
              <div className="flex items-center gap-3 px-4">
                <Switch
                  checked={category.is_active}
                  disabled={activeLoading === category.id}
                  onCheckedChange={() => handleToggle(category.id)}
                />

                {/* Delete Dialog */}
                <Dialog open={openDialogId === category.id} onOpenChange={() => setOpenDialogId }>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="icon" onClick={() => setOpenDialogId(category.id)}>
                      <Trash size={16} />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Delete Category</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to delete "{category.title}"? This action cannot be undone.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setOpenDialogId(null)}>Cancel</Button>
                      <Button className="bg-red-600 text-white hover:bg-red-700" onClick={() => handleDelete(category.id)}>Delete</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* Content */}
            <AccordionContent className="px-3 relative py-4 text-sm text-gray-700 space-y-2">
              {category.image_url ? (
                <div className="relative w-full h-[150px] md:h-[200px] rounded-md overflow-hidden shadow">
                  <img
                    src={category.image_url}
                    alt={category.title}
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute bottom-0 w-full bg-black/40 text-white text-sm p-2">
                    <p><strong>ID:</strong> {category.id}</p>
                    <p><strong>Title:</strong> {category.title || "No description"}</p>
                  </div>
                </div>
              ) : (
                <div className="relative w-full h-[150px] md:h-[200px] rounded-md overflow-hidden shadow flex items-center justify-center">
                  <span className="text-gray-400">No image</span>
                  <div className="absolute bottom-0 w-full bg-black/40 text-white text-sm p-2">
                    <p><strong>ID:</strong> {category.id}</p>
                    <p><strong>Title:</strong> {category.title || "No description"}</p>
                  </div>
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
