"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Monitor, Smartphone, PlusSquare, ImagePlus, X } from "lucide-react";
import { useGetHomeSectionsQuery } from "../../../../../../../redux/features/home/AllsectionsSlice";
import { useGetCategoryAndSubAdminQuery } from "../../../../../../../redux/features/productAdmin/categoryapiSlice";
import { useAddSubcategoryBannerMutation } from "../../../../../../../redux/features/home/subCategoryBannerSlice";

function ImagePicker({
  label, hint, aspectStyle, icon: Icon, preview, onSelect, onClear,
}: {
  label: string; hint: string; aspectStyle: React.CSSProperties; icon: any;
  preview: string | null; onSelect: (f: File) => void; onClear: () => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div className="space-y-1.5 w-full">
      <label className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
        <Icon size={12} /> {label}
      </label>
      <div
        onClick={() => !preview && ref.current?.click()}
        className={`relative rounded-xl border-2 border-dashed overflow-hidden transition-colors
          ${preview ? "border-slate-200 cursor-default" : "border-slate-200 hover:border-slate-400 bg-slate-50 hover:bg-slate-100 cursor-pointer"}`}
        style={aspectStyle}
      >
        {preview ? (
          <>
            <img src={preview} alt="preview" className="w-full h-full object-cover" />
            <button
              onClick={(e) => { e.stopPropagation(); onClear(); }}
              className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-colors"
            >
              <X size={12} />
            </button>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 text-slate-400">
            <ImagePlus size={22} />
            <span className="text-[11px] font-medium">Click to upload</span>
            <span className="text-[10px] text-slate-300">{hint}</span>
          </div>
        )}
      </div>
      <input
        ref={ref} type="file" accept="image/*" className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) onSelect(f); e.target.value = ""; }}
      />
    </div>
  );
}

export default function AddSubcategoryBannerPage() {
  const { data, isLoading: sectionsLoading } = useGetHomeSectionsQuery({ type: "subcategory_banner" });
  const { data: catData } = useGetCategoryAndSubAdminQuery(undefined);
  const [addSubcategoryBanner, { isLoading }] = useAddSubcategoryBannerMutation();

  const sections   = data?.sections || [];
  const categories = catData || [];

  const [sectionId, setSectionId]         = useState("");
  const [categoryId, setCategoryId]       = useState("");
  const [subcategoryId, setSubcategoryId] = useState("");
  const [directImage, setDirectImage]     = useState("false");

  const filteredSubs = categories.find((c: any) => String(c.id) === categoryId)?.items || [];
  const [desktopFile, setDesktopFile]     = useState<File | null>(null);
  const [desktopPreview, setDesktopPreview] = useState<string | null>(null);
  const [mobileFile, setMobileFile]       = useState<File | null>(null);
  const [mobilePreview, setMobilePreview] = useState<string | null>(null);

  const selectFile = (file: File, setFile: any, setPreview: any) => {
    setFile(file);
    setPreview(URL.createObjectURL(file));
  };
  const clearFile = (setFile: any, setPreview: any) => {
    setFile(null); setPreview(null);
  };

  const submit = async () => {
    if (!sectionId)     return toast.error("Please select a section");
    if (!categoryId)    return toast.error("Please select a category");
    if (!subcategoryId) return toast.error("Please select a subcategory");
    if (!desktopFile)   return toast.error("Please upload the desktop image");
    if (!mobileFile)    return toast.error("Please upload the mobile image");

    const formData = new FormData();
    formData.append("section_id",     sectionId);
    formData.append("category_id",    categoryId);
    formData.append("subcategory_id", subcategoryId);
    formData.append("desktop_image",  desktopFile);
    formData.append("mobile_image",   mobileFile);
    formData.append("direct_image",   directImage);

    try {
      await addSubcategoryBanner(formData).unwrap();
      toast.success("Subcategory banner added successfully");
      setSectionId(""); setCategoryId(""); setSubcategoryId(""); setDirectImage("false");
      clearFile(setDesktopFile, setDesktopPreview);
      clearFile(setMobileFile, setMobilePreview);
    } catch (err: any) {
      toast.error(err?.data?.error || "Something went wrong");
    }
  };

  return (
    <div className=" w-full mx-auto p-6 space-y-5">
      <Card className="border w-full border-slate-100 shadow-sm rounded-2xl overflow-hidden">
        <CardHeader className="bg-slate-50/60 border-b border-slate-100 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white shadow-sm flex items-center justify-center">
              <PlusSquare size={14} className="text-gray-700" />
            </div>
            <div>
              <CardTitle className="text-[13px] font-semibold text-slate-700 tracking-tight">Add Subcategory Banner</CardTitle>
              <CardDescription className="text-[11px] mt-0.5">Upload desktop & mobile images linked to a subcategory</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-5">

          {/* Section */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">Section</label>
            <Select value={sectionId} onValueChange={setSectionId} disabled={sectionsLoading}>
              <SelectTrigger className="h-9 text-[12px] rounded-xl border-slate-200">
                <SelectValue placeholder={sectionsLoading ? "Loading…" : "Select section"} />
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
            <Select value={categoryId} onValueChange={(v) => { setCategoryId(v); setSubcategoryId(""); }}>
              <SelectTrigger className="h-9 text-[12px] rounded-xl border-slate-200">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c: any) => (
                  <SelectItem key={c.id} value={String(c.id)} className="text-[12px]">{c.categoryName}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Subcategory — filtered */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">Subcategory</label>
            <Select value={subcategoryId} onValueChange={setSubcategoryId} disabled={!categoryId}>
              <SelectTrigger className="h-9 text-[12px] rounded-xl border-slate-200">
                <SelectValue placeholder={!categoryId ? "Select a category first" : "Select subcategory"} />
              </SelectTrigger>
              <SelectContent>
                {filteredSubs.map((sub: any) => (
                  <SelectItem key={sub.id} value={String(sub.id)} className="text-[12px]">{sub.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Desktop Image — 16:6 */}
          <ImagePicker
            label="Desktop Image"
            hint="Ratio 4:1 — landscape banner"
            aspectStyle={{ aspectRatio: "4/1" }}
            icon={Monitor}
            preview={desktopPreview}
            onSelect={(f) => selectFile(f, setDesktopFile, setDesktopPreview)}
            onClear={() => clearFile(setDesktopFile, setDesktopPreview)}
          />

          {/* Mobile Image — 2:3 */}
          <div className="flex justify-center">
            <div className="w-48">
              <ImagePicker
                label="Mobile Image"
                hint="Ratio 4:2 — portrait"
                aspectStyle={{ aspectRatio: "4/2" }}
                icon={Smartphone}
                preview={mobilePreview}
                onSelect={(f) => selectFile(f, setMobileFile, setMobilePreview)}
                onClear={() => clearFile(setMobileFile, setMobilePreview)}
              />
            </div>
          </div>

          {/* Direct Image */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">Image Position</label>
            <Select value={directImage} onValueChange={setDirectImage}>
              <SelectTrigger className="h-9 text-[12px] rounded-xl border-slate-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="false" className="text-[12px]">Left (default)</SelectItem>
                <SelectItem value="true"  className="text-[12px]">Right</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Submit */}
          <button
            onClick={submit}
            disabled={isLoading}
            className="w-full h-10 rounded-xl text-[11px] font-semibold uppercase tracking-widest bg-slate-900 hover:bg-slate-700 text-white transition-colors flex items-center justify-center gap-2 mt-1 disabled:opacity-50"
          >
            {isLoading
              ? <><Loader2 size={13} className="animate-spin" />Uploading…</>
              : <><PlusSquare size={13} />Create Banner</>
            }
          </button>

        </CardContent>
      </Card>
    </div>
  );
}
