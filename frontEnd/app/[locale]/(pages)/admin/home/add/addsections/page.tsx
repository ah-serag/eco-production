"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LayoutTemplate, Loader2 } from "lucide-react";
import { useAddHomeSectionMutation } from "../../../../../../../redux/features/home/AllsectionsSlice";

const DEFAULT_CONTENT = `{
  "title": "",
  "subtitle": "",
  "title_ar": "",
  "subtitle_ar": ""
}`;

const WIDE_BANNER_CONTENT = `{
  "wideBinner_items": [
    { "url_image": "", "link": "/" },
    { "url_image": "", "link": "/" }
  ]
}`;

const STRIP_BANNER_CONTENT = `{
  "strip_images": [""]
}`;

const SECTION_TYPES = [
  { value: "hero",               label: "Hero Slider",          hint: "auto" },
  { value: "category",           label: "Category",             hint: null },
  { value: "Limited_Offer",      label: "Limited Offer",        hint: null },
  { value: "product_category",   label: "Products Category",    hint: null },
  { value: "subcategory_banner", label: "SubCategory Products", hint: null },
  { value: "wide_banner",        label: "Wide Banner",          hint: "4 : 1" },
  { value: "strip_banner",       label: "Strip Banner",         hint: "5 : 1" },
];

export default function AddHomeSectionPage() {
  const [addHomeSection, { isLoading }] = useAddHomeSectionMutation();

  const [name, setName]             = useState("");
  const [type, setType]             = useState("");
  const [orderIndex, setOrderIndex] = useState(0);
  const [content, setContent]       = useState(DEFAULT_CONTENT);

  const handleTypeChange = (value: string) => {
    setType(value);
    if (value === "wide_banner")        setContent(WIDE_BANNER_CONTENT);
    else if (value === "strip_banner")  setContent(STRIP_BANNER_CONTENT);
    else                                setContent(DEFAULT_CONTENT);
  };

  const submit = async () => {
    if (!name.trim()) return toast.error("Section name is required");
    if (!type)        return toast.error("Please select a section type");

    try {
      await addHomeSection({
        name,
        type,
        order_index: orderIndex,
        is_active: true,
        content: JSON.parse(content),
      }).unwrap();

      toast.success("Section created successfully");
      setName(""); setType(""); setOrderIndex(0); setContent(DEFAULT_CONTENT);
    } catch {
      toast.error("Invalid JSON or server error");
    }
  };

  return (
    <div className="w-full">
      <Card className="w-full border border-slate-100 shadow-sm rounded-2xl overflow-hidden">

        <CardHeader className="bg-slate-50/60 border-b border-slate-100 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white shadow-sm flex items-center justify-center">
              <LayoutTemplate size={14} className="text-gray-700" />
            </div>
            <div>
              <CardTitle className="text-[13px] font-semibold text-slate-700 tracking-tight">Add Home Section</CardTitle>
              <CardDescription className="text-[11px] mt-0.5">This section will appear dynamically on the homepage</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-5">

          {/* Name + Order — same row */}
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2 space-y-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">Section Name</label>
              <Input
                placeholder="e.g. Hero Section"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-9 text-[12px] rounded-xl border-slate-200"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">Order</label>
              <Input
                type="number"
                value={orderIndex}
                onChange={(e) => setOrderIndex(Number(e.target.value))}
                className="h-9 text-[12px] rounded-xl border-slate-200"
              />
            </div>
          </div>

          {/* Type */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">Section Type</label>
            <Select value={type} onValueChange={handleTypeChange}>
              <SelectTrigger className="h-9 text-[12px] rounded-xl border-slate-200">
                <SelectValue placeholder="Select section type" />
              </SelectTrigger>
              <SelectContent>
                {SECTION_TYPES.map((s) => (
                  <SelectItem key={s.value} value={s.value} className="text-[12px]">
                    <span>{s.label}</span>
                    {s.hint && <span className="ms-2 text-slate-400 text-[10px]">({s.hint})</span>}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* JSON Content */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">Content JSON</label>
            <Textarea
              rows={8}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="font-mono text-[12px] bg-slate-900 text-slate-100 rounded-xl border-0 resize-none leading-relaxed"
            />
            <p className="text-[10px] text-slate-400">Used by the frontend to render the section dynamically</p>
          </div>

          {/* Submit */}
          <button
            onClick={submit}
            disabled={isLoading}
            className="w-full h-10 rounded-xl text-[11px] font-semibold uppercase tracking-widest bg-slate-900 hover:bg-slate-700 text-white transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading
              ? <><Loader2 size={13} className="animate-spin" />Saving…</>
              : <><LayoutTemplate size={13} />Create Section</>
            }
          </button>

        </CardContent>
      </Card>
    </div>
  );
}
