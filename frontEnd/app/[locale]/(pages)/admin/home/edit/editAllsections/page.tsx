"use client";

import {
  useGetHomeSectionsAdminQuery,
  useToggleSectionActiveMutation,
  useDeleteSectionMutation,
  useReorderSectionsMutation,
} from "../../../../../../../redux/features/home/AllsectionsSlice";

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Trash,
  LayoutGrid,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function HomeSectionsAdminPage() {
  const { data, isLoading } = useGetHomeSectionsAdminQuery(undefined);
  const [toggleActive] = useToggleSectionActiveMutation();
  const [deleteSection] = useDeleteSectionMutation();
  const [reorderSections, { isLoading: isSaving }] =
    useReorderSectionsMutation();

  const [sections, setSections] = useState<any[]>([]);
  const [activeLoading, setActiveLoading] = useState<number | null>(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedSectionId, setSelectedSectionId] = useState<number | null>(null);

  useEffect(() => {
    if (data?.sections) {
      setSections(data.sections);
    }
  }, [data]);

  if (isLoading) return <div className="p-8">Loading...</div>;

  /* ================= Actions ================= */
  const handleToggle = async (id: number, is_active: boolean) => {
    setActiveLoading(id);
    try {
      await toggleActive({ id, is_active: !is_active }).unwrap();
      toast.success("Section updated successfully");
    } catch {
      toast.error("Failed to update section");
    } finally {
      setActiveLoading(null);
    }
  };

  const openDeleteDialog = (id: number) => {
    setSelectedSectionId(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedSectionId) return;
    try {
      await deleteSection(selectedSectionId).unwrap();
      toast.success("Section deleted successfully");
    } catch {
      toast.error("Failed to delete section");
    } finally {
      setDeleteDialogOpen(false);
      setSelectedSectionId(null);
    }
  };

  /* ================= Manual Reorder ================= */
  const moveUp = (index: number) => {
    if (index === 0) return;
    const updated = [...sections];
    [updated[index - 1], updated[index]] = [
      updated[index],
      updated[index - 1],
    ];
    setSections(updated);
  };

  const moveDown = (index: number) => {
    if (index === sections.length - 1) return;
    const updated = [...sections];
    [updated[index + 1], updated[index]] = [
      updated[index],
      updated[index + 1],
    ];
    setSections(updated);
  };

  const handleSaveOrder = async () => {
    try {
      const payload = sections.map((section, index) => ({
        id: section.id,
        order_index: index + 1,
      }));

      await reorderSections(payload).unwrap();
      toast.success("Sections order saved successfully");
    } catch {
      toast.error("Failed to save order");
    }
  };

  /* ================= UI ================= */
  return (
    <div className="bg-gray-50 min-h-screen space-y-6">
      {/* ===== Banner ===== */}
      <div className="rounded-md p-10 bg-secondary text-white shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-6 items-center">
          <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-white/20">
            <LayoutGrid size={32} />
          </div>

          <div>
            <h1 className="text-3xl font-bold">Manage Home Sections</h1>
            <p className="text-sm text-white/80 max-w-2xl mt-2">
              Manually reorder homepage sections using the arrows, then save
              the final order.
            </p>
          </div>
        </div>
      </div>

      {/* ===== Save Order ===== */}
      <div className="flex justify-end">
        <Button onClick={handleSaveOrder} disabled={isSaving}>
          Save Sections Order
        </Button>
      </div>

      {/* ===== Sections ===== */}
      <Accordion type="single" collapsible className="space-y-4">
        {sections.map((section: any, index: number) => (
          <AccordionItem
            key={section.id}
            value={`${section.id}`}
            className="bg-white shadow rounded-lg border"
          >
            <div className="flex justify-between items-center">
              <AccordionTrigger className="flex-1 px-4 py-3 font-medium hover:bg-gray-100">
                {section.name}
              </AccordionTrigger>

              {/* Controls */}
              <div className="flex items-center gap-2 px-4">
                {/* Reorder */}
                <Button
                  variant="outline"
                  size="icon"
                  disabled={index === 0}
                  onClick={() => moveUp(index)}
                >
                  <ArrowUp size={16} />
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  disabled={index === sections.length - 1}
                  onClick={() => moveDown(index)}
                >
                  <ArrowDown size={16} />
                </Button>

                {/* Active */}
                <Switch
                  checked={section.is_active}
                  disabled={activeLoading === section.id}
                  onCheckedChange={() =>
                    handleToggle(section.id, section.is_active)
                  }
                />

                {/* Delete Dialog */}
                <Dialog
                  open={
                    deleteDialogOpen &&
                    selectedSectionId === section.id
                  }
                  onOpenChange={setDeleteDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => openDeleteDialog(section.id)}
                    >
                      <Trash size={16} />
                    </Button>
                  </DialogTrigger>

                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Confirm Delete</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to delete this section?
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

            <AccordionContent className="px-6 py-4 space-y-4">
              {section.items?.length ? (
                section.items.map((item: any) => (
                  <div
                    key={item.id}
                    className="relative h-[150px] rounded-md overflow-hidden border"
                  >
                    {item.image_url && (
                      <img
                        src={item.image_url}
                        alt={item.title || item.name}
                        className="w-full h-full object-contain"
                      />
                    )}
                    <div className="absolute bottom-0 w-full bg-black/40 text-white text-sm p-2">
                      {item.title || item.name}
                    </div>
                  </div>
                ))
              ) : (
                <span className="text-gray-400">No items</span>
              )}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
