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
                                   {/* Replace your AccordionTrigger with this improved version */}
<AccordionTrigger className="flex-1 gap-4 px-6 py-4 hover:no-underline hover:bg-gray-50/50 transition-all">
  <div className="flex items-center gap-6">
    {/* Section Name Group */}
    <div className="flex items-center gap-2">
      <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
        Section type
      </span>
      <span className="px-3 py-1 bg-slate-100 text-slate-900 rounded-md text-sm font-semibold border border-slate-200">
        {section.type}
      </span>
    </div>

    {/* Decorative Separator */}
    <div className="h-4 w-px bg-slate-200 hidden sm:block"></div>

    {/* Type Group */}
    <div className="flex items-center gap-2">
      <span className=" uppercase tracking-wider text-emerald-500 font-semibold">
        name :
      </span>
      <span className="text-sm text-slate-600 font-medium ">
        {section.name}
      </span>
    </div>
  </div>
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

            <AccordionContent className="px-6 pb-5 pt-2">
              {section.items?.length ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {section.items.map((item: any) => {
                    const desktopImg = item.desktop_image_url;
                    const mobileImg  = item.mobile_image_url;
                    const singleImg  = item.image_url;
                    const mainImg    = desktopImg || singleImg;

                    return (
                      <div key={item.id} className="rounded-xl border border-slate-100 overflow-hidden bg-slate-50 flex flex-col">
                        {/* Image */}
                        {mainImg && (
                          <div className="relative w-full aspect-video bg-slate-100 overflow-hidden">
                            <img
                              src={mainImg}
                              alt="item"
                              className="w-full h-full object-cover"
                            />
                            {desktopImg && (
                              <span className="absolute top-2 left-2 text-[9px] uppercase tracking-widest bg-black/50 text-white px-1.5 py-0.5 rounded-sm">
                                Desktop
                              </span>
                            )}
                          </div>
                        )}

                        {/* Mobile preview strip */}
                        {mobileImg && (
                          <div className="relative w-full h-12 bg-slate-200 overflow-hidden">
                            <img src={mobileImg} alt="mobile" className="w-full h-full object-cover object-top" />
                            <span className="absolute top-1 left-2 text-[9px] uppercase tracking-widest bg-black/50 text-white px-1.5 py-0.5 rounded-sm">
                              Mobile
                            </span>
                          </div>
                        )}

                        {/* Meta */}
                        <div className="px-3 py-2 space-y-0.5">
                          {item.cta_text && (
                            <p className="text-[11px] font-medium text-slate-700 truncate">{item.cta_text}</p>
                          )}
                          {item.cta_link && (
                            <p className="text-[10px] text-slate-400 truncate">{item.cta_link}</p>
                          )}
                          {item.title && (
                            <p className="text-[11px] font-medium text-slate-700 truncate">{item.title}</p>
                          )}
                          {item.link_url && (
                            <p className="text-[10px] text-slate-400 truncate">{item.link_url}</p>
                          )}
                          {item.subcategory_id && (
                            <p className="text-[10px] text-slate-400">Sub ID: {item.subcategory_id}</p>
                          )}
                          <div className="flex items-center gap-1 pt-0.5">
                            <span className={`w-1.5 h-1.5 rounded-full ${item.is_active ? "bg-emerald-400" : "bg-slate-300"}`} />
                            <span className="text-[9px] uppercase tracking-widest text-slate-400">
                              {item.is_active ? "Active" : "Inactive"}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-[11px] text-slate-400 uppercase tracking-widest">No items</p>
              )}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
