"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Monitor, Smartphone, PlusSquare, ImagePlus, X } from "lucide-react";
import { useGetHomeSectionsQuery } from "../../../../../../../redux/features/home/AllsectionsSlice";
import { useAddHeroBannerMutation } from "../../../../../../../redux/features/home/herroBannerSlice";

function ImagePicker({
  label, hint, icon: Icon, file, preview, onSelect, onClear,
}: {
  label: string; hint: string; icon: any;
  file: File | null; preview: string | null;
  onSelect: (f: File) => void; onClear: () => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div className="space-y-2 w-full">
      <label className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
        <Icon size={12} /> {label}
      </label>
      <div
        onClick={() => !file && ref.current?.click()}
        className={`relative rounded-xl border-2 border-dashed overflow-hidden transition-colors cursor-pointer
          ${file ? "border-slate-200 cursor-default" : "border-slate-200 hover:border-slate-400 bg-slate-50 hover:bg-slate-100"}`}
        style={{ aspectRatio: "7/2" }}
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

export default function AddHeroBannerPage() {
  const { data, isLoading: sectionsLoading } = useGetHomeSectionsQuery({ type: "hero" });
  const [addHeroBanner, { isLoading }] = useAddHeroBannerMutation();
  const sections = data?.sections || [];

  const [sectionId, setSectionId]         = useState("");
  const [ctaText, setCtaText]             = useState("");
  const [ctaLink, setCtaLink]             = useState("");
  const [desktopFile, setDesktopFile]     = useState<File | null>(null);
  const [desktopPreview, setDesktopPreview] = useState<string | null>(null);
  const [mobileFile, setMobileFile]       = useState<File | null>(null);
  const [mobilePreview, setMobilePreview] = useState<string | null>(null);

  const selectFile = (
    file: File,
    setFile: (f: File) => void,
    setPreview: (p: string) => void
  ) => {
    setFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const clearFile = (
    setFile: (f: null) => void,
    setPreview: (p: null) => void
  ) => {
    setFile(null);
    setPreview(null);
  };

  const submit = async () => {
    if (!sectionId)    return toast.error("Please select a hero section");
    if (!desktopFile)  return toast.error("Please upload the desktop image");
    if (!mobileFile)   return toast.error("Please upload the mobile image");

    const formData = new FormData();
    formData.append("section_id",     sectionId);
    formData.append("desktop_image",  desktopFile);
    formData.append("mobile_image",   mobileFile);
    if (ctaText) formData.append("cta_text", ctaText);
    if (ctaLink) formData.append("cta_link", ctaLink);

    try {
      await addHeroBanner(formData).unwrap();
      toast.success("Hero banner added successfully");
      setSectionId(""); setCtaText(""); setCtaLink("");
      clearFile(setDesktopFile, setDesktopPreview);
      clearFile(setMobileFile, setMobilePreview);
    } catch (err: any) {
      toast.error(err?.data?.error || "Something went wrong");
    }
  };

  return (
    <div className="w-full mx-auto p-6 space-y-5 font-sans">

      <Card className="border w-full border-slate-100 shadow-sm rounded-2xl overflow-hidden">
        <CardHeader className="bg-slate-50/60 border-b border-slate-100 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white shadow-sm flex items-center justify-center">
              <PlusSquare size={14} className="text-gray-700" />
            </div>
            <div>
              <CardTitle className="text-[13px] font-semibold text-slate-700 tracking-tight">Add Hero Banner</CardTitle>
              <CardDescription className="text-[11px] mt-0.5">Upload desktop & mobile images for the slider</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-5">

          {/* Section */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">Hero Section</label>
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

          {/* Desktop Image */}
          <ImagePicker
            label="Desktop Image" hint="Ratio 3:1 — JPG, PNG, WEBP"
            icon={Monitor}
            file={desktopFile} preview={desktopPreview}
            onSelect={(f) => selectFile(f, setDesktopFile, setDesktopPreview)}
            onClear={() => clearFile(setDesktopFile, setDesktopPreview)}
          />

          {/* Mobile Image */}
          <ImagePicker
            label="Mobile Image" hint="Ration 4:5 — JPG, PNG, WEBP"
            icon={Smartphone}
            file={mobileFile} preview={mobilePreview}
            onSelect={(f) => selectFile(f, setMobileFile, setMobilePreview)}
            onClear={() => clearFile(setMobileFile, setMobilePreview)}
          />

          {/* CTA */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">CTA Text</label>
              <Input
                placeholder="Shop Now"
                value={ctaText}
                onChange={(e) => setCtaText(e.target.value)}
                className="h-9 text-[12px] rounded-xl border-slate-200"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">CTA Link</label>
              <Input
                placeholder="/shop"
                value={ctaLink}
                onChange={(e) => setCtaLink(e.target.value)}
                className="h-9 text-[12px] rounded-xl border-slate-200"
              />
            </div>
          </div>

          <Button
            onClick={submit} disabled={isLoading}
            className="w-full h-10 rounded-xl text-[11px] font-semibold uppercase tracking-widest mt-1"
          >
            {isLoading
              ? <><Loader2 size={13} className="animate-spin me-2" />Uploading…</>
              : <><PlusSquare size={13} className="me-2" />Create Hero Banner</>
            }
          </Button>

        </CardContent>
      </Card>
    </div>
  );
}
