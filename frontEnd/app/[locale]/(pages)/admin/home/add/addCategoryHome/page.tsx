"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { useGetHomeSectionsQuery } from "../../../../../../../redux/features/home/AllsectionsSlice";
import { useGetCategoryOptionsQuery } from "../../../../../../../redux/features/productAdmin/categoryapiSlice";
import { useAddHomeCategoryMutation } from "../../../../../../../redux/features/home/categoryHomeSlice";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Loader2, PlusCircle, ImagePlus, X } from "lucide-react";

export default function AddCategoryHomePage() {
  const [sectionId, setSectionId]   = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [title, setTitle]           = useState("");
  const [file, setFile]             = useState<File | null>(null);
  const [preview, setPreview]       = useState<string | null>(null);
  const inputRef                    = useRef<HTMLInputElement>(null);

  const { data, isLoading: loadingSections } = useGetHomeSectionsQuery({ type: "category" });
  const { data: categories }                 = useGetCategoryOptionsQuery(undefined);
  const [addHomeCategory, { isLoading }]     = useAddHomeCategoryMutation();

  const sections = data?.sections || [];

  const selectFile = (f: File) => {
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const clearFile = () => {
    setFile(null);
    setPreview(null);
  };

  const handleSubmit = async () => {
    if (!sectionId || !categoryId) return toast.error("Please select section and category");
    if (!file)                      return toast.error("Please upload an image");

    const formData = new FormData();
    formData.append("section_id",  sectionId);
    formData.append("category_id", categoryId);
    formData.append("image",       file);
    if (title) formData.append("title", title);

    try {
      await addHomeCategory(formData).unwrap();
      toast.success("Category added to home successfully");
      setSectionId(""); setCategoryId(""); setTitle("");
      clearFile();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to add home category");
    }
  };

  return (
    <div className="w-full mx-auto p-6 font-sans">
      <Card className="border w-full border-slate-100 shadow-sm rounded-2xl overflow-hidden">
        <CardHeader className="bg-slate-50/60 border-b border-slate-100 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white shadow-sm flex items-center justify-center">
              <PlusCircle size={14} className="text-gray-700" />
            </div>
            <div>
              <CardTitle className="text-[13px] font-semibold text-slate-700 tracking-tight">Add Home Category</CardTitle>
              <CardDescription className="text-[11px] mt-0.5">Upload an image and link it to a category</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-4">

          {/* Section */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">Home Section</label>
            <Select value={sectionId} onValueChange={setSectionId} disabled={loadingSections}>
              <SelectTrigger className="h-9 text-[12px] rounded-xl border-slate-200">
                <SelectValue placeholder={loadingSections ? "Loading…" : "Select section"} />
              </SelectTrigger>
              <SelectContent>
                {sections.map((s: any) => (
                  <SelectItem key={s.id} value={String(s.id)} className="text-[12px]">{s.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">Category</label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger className="h-9 text-[12px] rounded-xl border-slate-200">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories?.map((cat: any) => (
                  <SelectItem key={cat.id} value={String(cat.id)} className="text-[12px]">{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Image Upload */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">Image</label>
            <div
              onClick={() => !file && inputRef.current?.click()}
              className={`relative rounded-xl border-2 border-dashed overflow-hidden transition-colors p-3 w-32 aspect-5/3
                ${file ? "border-slate-200 cursor-default" : "border-slate-200 hover:border-slate-400 bg-slate-50 hover:bg-slate-100 cursor-pointer"}`}
            >
              {preview ? (
                <>
                  <img src={preview} alt="preview" className="w-full h-full object-cover" />
                  <button
                    onClick={(e) => { e.stopPropagation(); clearFile(); }}
                    className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center"
                  >
                    <X size={12} />
                  </button>
                </>
              ) : (
                <div className="absolute inset-0 flex flex-col aspect-5/3 items-center justify-center gap-1.5 text-slate-400">
                  <ImagePlus size={22} />
                  <span className="text-[11px] font-medium">Click to upload : 5:3</span>
                  <span className="text-[10px] text-slate-300">JPG, PNG, WEBP</span>
                </div>
              )}
            </div>
            <input
              ref={inputRef} type="file" accept="image/*" className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) selectFile(f); e.target.value = ""; }}
            />
          </div>

          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">Title (optional)</label>
            <Input
              placeholder="Category title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-9 text-[12px] rounded-xl border-slate-200"
            />
          </div>

          <Button onClick={handleSubmit} disabled={isLoading}
            className="w-full h-10 rounded-xl text-[11px] font-semibold uppercase tracking-widest mt-1">
            {isLoading
              ? <><Loader2 size={13} className="animate-spin me-2" />Uploading…</>
              : <><PlusCircle size={13} className="me-2" />Add Category</>
            }
          </Button>

        </CardContent>
      </Card>
    </div>
  );
}
