"use client";

import React, { useState } from "react";
import { 
  Plus, MoreVertical, AlertTriangle, ChevronRight, 
  Trash2, Layout, Edit3 
} from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  useGetCategoryAndSubAdminQuery,
  useAddCategoriesMutation,
  useAddSubcategoriesMutation,
  useDeleteCategoryMutation,
  useDeleteSubcategoryMutation,
  useEditCategoryNameMutation,
  useEditSubcategoryNameMutation,
  useToggleCategoryStatusMutation,
  useToggleSubcategoryStatusMutation,
} from "../../../../../redux/features/productAdmin/categoryapiSlice";

export default function AdminCategoryTable() {
  const { data: categories = [], isLoading } = useGetCategoryAndSubAdminQuery(undefined);
  const [addCategory] = useAddCategoriesMutation();
  const [addSubcategory] = useAddSubcategoriesMutation();
  const [deleteCategory] = useDeleteCategoryMutation();
  const [deleteSubcategory] = useDeleteSubcategoryMutation();
  const [editCategory] = useEditCategoryNameMutation();
  const [editSubcategory] = useEditSubcategoryNameMutation();
  const [toggleCategory] = useToggleCategoryStatusMutation();
  const [toggleSubcategory] = useToggleSubcategoryStatusMutation();

  const [isSubcategory, setIsSubcategory] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  const { register, handleSubmit, reset } = useForm();

  const onAddSubmit = async (formData :any) => {
    try {
      if (isSubcategory) {
        await addSubcategory({ name: formData.name, name_ar: formData.name_ar, category_id: selectedCategoryId }).unwrap();
      } else {
        await addCategory({ name: formData.name, name_ar: formData.name_ar }).unwrap();
      }
      toast.success("Success");
      reset();
      setIsAddDialogOpen(false);
    } catch (err) {
      toast.error("Error creating entry");
    }
  };

  const handleStatusToggle = async (id: string, isParent: boolean, currentStatus: boolean) => {
    try {
      if (isParent) {
        await toggleCategory({ id, is_active: !currentStatus }).unwrap();
      } else {
        await toggleSubcategory({ id, is_active: !currentStatus }).unwrap();
      }
      toast.success("Status updated");
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  if (isLoading) return <div className="p-20 text-center text-slate-400 animate-pulse font-medium tracking-wide">Loading Dashboard...</div>;

  return (
    <div className="mx-auto space-y-6 p-6 pb-20 antialiased">
      
      {/* --- Header Section --- */}
      <div className="flex justify-between items-center bg-white p-6 rounded-md border border-slate-100 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-chart-1 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-slate-200">
            <Layout size={22} />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-slate-800 tracking-tight">Product Structure</h1>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-widest">Store Hierarchy</p>
          </div>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-chart-1 hover:bg-chart-1/90 text-white h-10 px-6 font-medium shadow-md transition-all active:scale-95">
              <Plus size={18} className="mr-2" />
              New Entry
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-[28px] p-8 border-none shadow-2xl">
            <DialogHeader><DialogTitle className="font-semibold text-slate-800">Create Category</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit(onAddSubmit)} className="space-y-4 pt-4">
               <div className="flex bg-slate-100 p-1.5 rounded-2xl">
                <button type="button" onClick={() => setIsSubcategory(false)} className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${!isSubcategory ? "bg-white shadow-sm text-slate-900" : "text-slate-500"}`}>Main Category</button>
                <button type="button" onClick={() => setIsSubcategory(true)} className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${isSubcategory ? "bg-white shadow-sm text-slate-900" : "text-slate-500"}`}>Subcategory</button>
              </div>
              <Input {...register("name", { required: true })} placeholder="English Name" className="rounded-xl h-11 border-slate-200 bg-slate-50 focus:bg-white transition-all" />
              <Input {...register("name_ar", { required: true })} placeholder="الاسم بالعربي" dir="rtl" className="rounded-xl h-11 border-slate-200 bg-slate-50 focus:bg-white transition-all" />
              
              {isSubcategory && (
                <select className="w-full h-11 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none font-medium" value={selectedCategoryId} onChange={(e) => setSelectedCategoryId(e.target.value)} required>
                  <option value="">Select Parent...</option>
                  {categories.map((cat :any) => <option key={cat.id} value={cat.id}>{cat.categoryName}</option>)}
                </select>
              )}
              <Button type="submit" className="w-full h-11 bg-slate-900 text-white rounded-xl font-semibold shadow-lg shadow-slate-100">Publish</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* --- Categories Architecture --- */}
      <div className="space-y-3">
        <Accordion type="single" collapsible className="space-y-3">
          {categories.map((cat :any) => (
            <AccordionItem key={cat.id} value={`item-${cat.id}`} className="border bg-white">
              <div className="flex items-center justify-between border border-slate-100 px-4 transition-all group hover:bg-slate-50/50">
                <AccordionTrigger className="flex-1 hover:no-underline py-5 px-2">
                  <div className="flex items-center gap-3">
                    <ChevronRight size={16} className="text-slate-400 transition-transform group-data-[state=open]:rotate-90" />
                    <div className="flex flex-col items-start text-left">
                      <span className="text-[15px] font-medium text-slate-700">{cat.categoryName}</span>
                      <span className="text-[10px] font-medium text-slate-400" dir="rtl">{cat.categoryName_ar}</span>
                    </div>
                  </div>
                </AccordionTrigger>

                <div className="flex items-center gap-6">
                  {/* Category Status Toggle (Main Color) */}
                  <Switch 
                    checked={cat.is_active} 
                    onCheckedChange={() => handleStatusToggle(cat.id, true, cat.is_active)}
                    className="scale-75 data-[state=checked]:bg-chart-1"
                  />
                  
                  <CategoryActions 
                    item={cat} 
                    onDelete={() => deleteCategory(cat.id)} 
                    onEdit={(data: any) => editCategory({ id: cat.id, ...data })} 
                    isParent={true} 
                  />
                </div>
              </div>

              <AccordionContent className="pt-2 pb-10 px-2">
                <div className="ml-8 pl-6 border-l-2 border-slate-100/80 space-y-2 m-2">
                  {cat.items && cat.items.length > 0 ? (
                    cat.items.map((sub :any) => (
                      <div key={sub.id} className="flex items-center justify-between py-3 px-4 border border-gray-50 bg-gray-50/30 hover:bg-gray-50 hover:border-slate-200 transition-all">
                        <div className="flex flex-col text-left">
                          <span className="text-sm font-medium text-slate-500">{sub.name}</span>
                          <span className="text-[10px] font-medium text-slate-300" dir="rtl">{sub.name_ar}</span>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          {/* Subcategory Status Toggle (Different Color - Slate 400) */}
                          <Switch 
                            checked={sub.is_active} 
                            onCheckedChange={() => handleStatusToggle(sub.id, false, sub.is_active)}
                            className="scale-[0.65] data-[state=checked]:bg-cyan-500" 
                          />

                          <CategoryActions 
                            item={sub} 
                            onDelete={() => deleteSubcategory(sub.id)} 
                            onEdit={(data: any) => editSubcategory({ id: sub.id, ...data })} 
                            isParent={false} 
                          />
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-[11px] text-slate-300 italic py-1 pl-2">No subcategories yet</p>
                  )}
                  
                  <button 
                    onClick={() => { setIsAddDialogOpen(true); setIsSubcategory(true); setSelectedCategoryId(cat.id); }}
                    className="flex items-center gap-2 py-2 px-4 text-[11px] font-semibold text-slate-400 hover:text-slate-900 transition-colors"
                  >
                    <Plus size={14} /> Add New Sub
                  </button>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}

// CategoryActions Component
function CategoryActions({ item, onDelete, onEdit, isParent } :any) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  
  const { register, handleSubmit } = useForm({
    defaultValues: {
      name: item.categoryName || item.name,
      name_ar: item.categoryName_ar || item.name_ar || "" 
    }
  });

  const handleEdit = async (data: any) => {
    try {
      await onEdit(data).unwrap();
      toast.success("Updated");
      setIsEditDialogOpen(false);
    } catch {
      toast.error("Update failed");
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await onDelete().unwrap();
      toast.success("Deleted");
      setIsDeleteDialogOpen(false);
    } catch {
      toast.error("Failed");
    }
  };

  const title = item.categoryName || item.name;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-slate-300 hover:text-slate-600 hover:bg-white transition-all">
            <MoreVertical size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40 rounded-xl p-1 shadow-xl border-slate-100">
          <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)} className="rounded-lg cursor-pointer font-medium text-xs py-2 text-slate-700 focus:bg-slate-50">
            <Edit3 size={14} className="mr-2 text-slate-400" /> Edit Names
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsDeleteDialogOpen(true)} className="rounded-lg cursor-pointer font-medium text-xs py-2 text-red-500 focus:text-red-500 focus:bg-red-50">
            <Trash2 size={14} className="mr-2" /> Remove Item
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="rounded-[28px] border-none shadow-2xl p-8 max-w-sm">
           <DialogHeader><DialogTitle className="font-semibold text-slate-800 text-center">Edit Names</DialogTitle></DialogHeader>
           <form onSubmit={handleSubmit(handleEdit)} className="space-y-4 pt-6">
              <Input {...register("name", { required: true })} className="rounded-xl h-11 border-slate-200 bg-slate-50 focus:bg-white transition-all" />
              <Input {...register("name_ar")} dir="rtl" className="rounded-xl h-11 border-slate-200 bg-slate-50 focus:bg-white transition-all" />
              <Button type="submit" className="w-full h-11 bg-slate-900 text-white rounded-xl font-semibold shadow-lg shadow-slate-100">Save Changes</Button>
           </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="rounded-[30px] border-none shadow-2xl p-8 max-w-sm">
          <DialogHeader className="items-center text-center">
            <div className="w-14 h-14 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-4"><AlertTriangle size={28} /></div>
            <DialogTitle className="text-lg font-bold text-slate-900">Are you sure?</DialogTitle>
            <div className="mt-2 space-y-4">
              <p className="text-sm text-slate-500 leading-relaxed font-medium">
                Delete <span className="text-slate-900 font-bold underline">"{title}"</span>? {isParent && " Nested data will be purged."}
              </p>
              <Input value={confirmText} onChange={(e) => setConfirmText(e.target.value)} placeholder={title} className="h-10 text-center rounded-xl bg-slate-50 border-slate-200 text-sm font-medium" />
            </div>
          </DialogHeader>
          <div className="flex flex-col gap-2 mt-6">
            <Button disabled={confirmText !== title} className="w-full h-11 bg-red-500 text-white rounded-xl font-bold shadow-lg" onClick={handleConfirmDelete}>Confirm & Delete</Button>
            <Button variant="ghost" className="text-xs font-semibold text-slate-400 h-10" onClick={() => setIsDeleteDialogOpen(false)}>Go Back</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}