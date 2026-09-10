"use client";

import { useState, useMemo } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LayoutTemplate, Loader2, Plus, Trash2 } from "lucide-react";
import { useAddHomeSectionMutation } from "../../../../../../../redux/features/home/AllsectionsSlice";

const SECTION_TYPES = [
  { value: "text_strip",         label: "Text Strip",           hint: "Simple Text Strip" },
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

  // Basic fields
  const [name, setName]             = useState("");
  const [type, setType]             = useState("");
  const [orderIndex, setOrderIndex] = useState(0);

  // Dynamic form state for different section types
  const [formData, setFormData] = useState({
    // text_strip fields
    text_strip_title: "",
    text_strip_title_ar: "",
    text_strip_text: "",
    text_strip_text_ar: "",
    text_strip_bg_color: "#000000",
    text_strip_text_color: "#FFFFFF",

    // hero, category, limited_offer, product_category, subcategory_banner
    title: "",
    subtitle: "",
    title_ar: "",
    subtitle_ar: "",

    // wide_banner
    wide_banner_items: [
      { url_image: "", link: "/" },
    ],

    // strip_banner
    strip_images: [""],
  });

  // Handle text field changes
  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle wide banner item changes
  const handleWideBannerItemChange = (index: number, field: string, value: string) => {
    const updated = [...formData.wide_banner_items];
    updated[index] = { ...updated[index], [field]: value };
    setFormData((prev) => ({
      ...prev,
      wide_banner_items: updated,
    }));
  };

  // Add new wide banner item
  const addWideBannerItem = () => {
    setFormData((prev) => ({
      ...prev,
      wide_banner_items: [...prev.wide_banner_items, { url_image: "", link: "/" }],
    }));
  };

  // Remove wide banner item
  const removeWideBannerItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      wide_banner_items: prev.wide_banner_items.filter((_, i) => i !== index),
    }));
  };

  // Handle strip banner image changes
  const handleStripBannerImageChange = (index: number, value: string) => {
    const updated = [...formData.strip_images];
    updated[index] = value;
    setFormData((prev) => ({
      ...prev,
      strip_images: updated,
    }));
  };

  // Add new strip banner image
  const addStripBannerImage = () => {
    setFormData((prev) => ({
      ...prev,
      strip_images: [...prev.strip_images, ""],
    }));
  };

  // Remove strip banner image
  const removeStripBannerImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      strip_images: prev.strip_images.filter((_, i) => i !== index),
    }));
  };

  // Build content JSON based on section type
  const buildContent = () => {
    switch (type) {
      case "text_strip":
        return {
          title: formData.text_strip_title,
          title_ar: formData.text_strip_title_ar,
          text: formData.text_strip_text,
          text_ar: formData.text_strip_text_ar,
          bg_color: formData.text_strip_bg_color,
          text_color: formData.text_strip_text_color,
        };

      case "wide_banner":
        return {
          wideBinner_items: formData.wide_banner_items,
        };

      case "strip_banner":
        return {
          strip_images: formData.strip_images,
        };

      default:
        return {
          title: formData.title,
          subtitle: formData.subtitle,
          title_ar: formData.title_ar,
          subtitle_ar: formData.subtitle_ar,
        };
    }
  };

  const handleTypeChange = (value: string) => {
    setType(value);
  };

  const submit = async () => {
    if (!name.trim()) return toast.error("Section name is required");
    if (!type) return toast.error("Please select a section type");

    try {
      const content = buildContent();

      await addHomeSection({
        name,
        type,
        order_index: orderIndex,
        is_active: true,
        content,
      }).unwrap();

      toast.success("Section created successfully");

      setName("");
      setType("");
      setOrderIndex(0);

      setFormData({
        text_strip_title: "",
        text_strip_title_ar: "",
        text_strip_text: "",
        text_strip_text_ar: "",
        text_strip_bg_color: "#000000",
        text_strip_text_color: "#FFFFFF",
        title: "",
        subtitle: "",
        title_ar: "",
        subtitle_ar: "",
        wide_banner_items: [
          { url_image: "", link: "/" },
          { url_image: "", link: "/" },
        ],
        strip_images: [""],
      });

    } catch {
      toast.error("An error occurred while saving");
    }
  };

  return (
    <div className="w-full  mx-auto">
      <Card className="w-full border border-slate-100 shadow-sm rounded-2xl overflow-hidden">

        <CardHeader className="bg-slate-50/60 border-b border-slate-100 px-6 py-4">
          <div className="flex items-center gap-2.5">

            <div className="w-8 h-8 rounded-xl bg-white shadow-sm flex items-center justify-center">
              <LayoutTemplate size={14} className="text-gray-700" />
            </div>

            <div>
              <CardTitle className="text-[13px] font-semibold text-slate-700 tracking-tight">
                Add New Section
              </CardTitle>

              <CardDescription className="text-[11px] mt-0.5">
                This section will appear dynamically on the homepage
              </CardDescription>
            </div>

          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">

          {/* Name + Order */}
          <div className="grid grid-cols-3 gap-4">

            <div className="col-span-2 space-y-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
                Section Name
              </label>

              <Input
                placeholder="Example: Hero Section"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-9 text-[12px] rounded-xl border-slate-200"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
                Order
              </label>

              <Input
                type="number"
                value={orderIndex}
                onChange={(e) => setOrderIndex(Number(e.target.value))}
                className="h-9 text-[12px] rounded-xl border-slate-200"
              />
            </div>

          </div>

          {/* Type Select */}
          <div className="space-y-1.5">

            <label className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
              Section Type
            </label>

            <Select value={type} onValueChange={handleTypeChange}>
              <SelectTrigger className="h-9 text-[12px] rounded-xl border-slate-200">
                <SelectValue placeholder="Select section type" />
              </SelectTrigger>

              <SelectContent>
                {SECTION_TYPES.map((s) => (
                  <SelectItem key={s.value} value={s.value} className="text-[12px]">
                    <span>{s.label}</span>

                    {s.hint && (
                      <span className="ms-2 text-slate-400 text-[10px]">
                        ({s.hint})
                      </span>
                    )}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

          </div>

          {/* Dynamic Form Fields Based on Type */}
          {type === "text_strip" && (
            <div className="space-y-4 p-4 bg-blue-50/50 rounded-xl border border-blue-50">

              <h3 className="text-sm font-semibold text-slate-700">
                Text Strip
              </h3>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
                  Title (English)
                </label>

                <Input
                  placeholder="English title"
                  value={formData.text_strip_title}
                  onChange={(e) => handleInputChange("text_strip_title", e.target.value)}
                  className="h-9 text-[12px] rounded-xl border-slate-200"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
                  Title (Arabic)
                </label>

                <Input
                  placeholder="Arabic title"
                  value={formData.text_strip_title_ar}
                  onChange={(e) => handleInputChange("text_strip_title_ar", e.target.value)}
                  className="h-9 text-[12px] rounded-xl border-slate-200"
                  dir="rtl"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
                  Text (English)
                </label>

                <Textarea
                  placeholder="Text that will appear in the strip"
                  value={formData.text_strip_text}
                  onChange={(e) => handleInputChange("text_strip_text", e.target.value)}
                  rows={2}
                  className="text-[12px] rounded-xl border-slate-200 resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
                  Text (Arabic)
                </label>

                <Textarea
                  placeholder="Arabic text"
                  value={formData.text_strip_text_ar}
                  onChange={(e) => handleInputChange("text_strip_text_ar", e.target.value)}
                  rows={2}
                  className="text-[12px] rounded-xl border-slate-200 resize-none"
                  dir="rtl"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">

                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
                    Background Color
                  </label>

                  <div className="flex items-center gap-2">
                    <Input
                      type="color"
                      value={formData.text_strip_bg_color}
                      onChange={(e) => handleInputChange("text_strip_bg_color", e.target.value)}
                      className="h-9 w-16 cursor-pointer rounded-xl border-slate-200"
                    />

                    <Input
                      type="text"
                      value={formData.text_strip_bg_color}
                      onChange={(e) => handleInputChange("text_strip_bg_color", e.target.value)}
                      className="h-9 text-[12px] rounded-xl border-slate-200 flex-1 font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
                    Text Color
                  </label>

                  <div className="flex items-center gap-2">
                    <Input
                      type="color"
                      value={formData.text_strip_text_color}
                      onChange={(e) => handleInputChange("text_strip_text_color", e.target.value)}
                      className="h-9 w-16 cursor-pointer rounded-xl border-slate-200"
                    />

                    <Input
                      type="text"
                      value={formData.text_strip_text_color}
                      onChange={(e) => handleInputChange("text_strip_text_color", e.target.value)}
                      className="h-9 text-[12px] rounded-xl border-slate-200 flex-1 font-mono"
                    />
                  </div>
                </div>

              </div>
            </div>
          )}

          {(type === "hero" ||
            type === "category" ||
            type === "Limited_Offer" ||
            type === "product_category" ||
            type === "subcategory_banner") && (
            <div className="space-y-4 p-4 bg-green-50 rounded-xl border border-green-100">

              <h3 className="text-sm font-semibold text-slate-700">
                Form Content
              </h3>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
                  Title (English)
                </label>

                <Input
                  placeholder="Main title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className="h-9 text-[12px] rounded-xl border-slate-200"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
                  Subtitle (English)
                </label>

                <Input
                  placeholder="Secondary subtitle"
                  value={formData.subtitle}
                  onChange={(e) => handleInputChange("subtitle", e.target.value)}
                  className="h-9 text-[12px] rounded-xl border-slate-200"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
                  Title (Arabic)
                </label>

                <Input
                  placeholder="Arabic title"
                  value={formData.title_ar}
                  onChange={(e) => handleInputChange("title_ar", e.target.value)}
                  className="h-9 text-[12px] rounded-xl border-slate-200"
                  dir="rtl"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
                  Subtitle (Arabic)
                </label>

                <Input
                  placeholder="Arabic subtitle"
                  value={formData.subtitle_ar}
                  onChange={(e) => handleInputChange("subtitle_ar", e.target.value)}
                  className="h-9 text-[12px] rounded-xl border-slate-200"
                  dir="rtl"
                />
              </div>

            </div>
          )}

          {type === "wide_banner" && (
            <div className="space-y-4 p-4 bg-purple-50 rounded-xl border border-purple-100">

              <h3 className="text-sm font-semibold text-slate-700">
                Wide Banner Items (Ratio 4:1)
              </h3>

              {formData.wide_banner_items.map((item, index) => (
                <div
                  key={index}
                  className="space-y-3 p-3 bg-white rounded-lg border border-purple-200"
                >

                  <div className="flex items-center justify-between mb-2">

                    <span className="text-xs font-medium text-slate-600">
                      Item {index + 1}
                    </span>

                    {formData.wide_banner_items.length > 2 && (
                      <button
                        onClick={() => removeWideBannerItem(index)}
                        className="p-1.5 hover:bg-red-100 rounded-lg transition-colors"
                      >
                        <Trash2 size={14} className="text-red-500" />
                      </button>
                    )}

                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
                      Image URL
                    </label>

                    <Input
                      placeholder="https://example.com/image.jpg"
                      value={item.url_image}
                      onChange={(e) =>
                        handleWideBannerItemChange(index, "url_image", e.target.value)
                      }
                      className="h-9 text-[12px] rounded-xl border-slate-200"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
                      Link
                    </label>

                    <Input
                      placeholder="/products"
                      value={item.link}
                      onChange={(e) =>
                        handleWideBannerItemChange(index, "link", e.target.value)
                      }
                      className="h-9 text-[12px] rounded-xl border-slate-200"
                    />
                  </div>

                </div>
              ))}

              <button
                onClick={addWideBannerItem}
                className="w-full h-9 rounded-xl text-[11px] font-semibold uppercase tracking-widest border border-dashed border-purple-300 text-purple-600 hover:bg-purple-50 transition-colors flex items-center justify-center gap-2"
              >
                <Plus size={13} />
                Add New Item
              </button>

            </div>
          )}

          {type === "strip_banner" && (
            <div className="space-y-4 p-4 bg-orange-50 rounded-xl border border-orange-100">

              <h3 className="text-sm font-semibold text-slate-700">
                Strip Images (Ratio 5:1)
              </h3>

              {formData.strip_images.map((image, index) => (
                <div
                  key={index}
                  className="space-y-2 p-3 bg-white rounded-lg border border-orange-200"
                >

                  <div className="flex items-center justify-between mb-2">

                    <span className="text-xs font-medium text-slate-600">
                      Image {index + 1}
                    </span>

                    {formData.strip_images.length > 1 && (
                      <button
                        onClick={() => removeStripBannerImage(index)}
                        className="p-1.5 hover:bg-red-100 rounded-lg transition-colors"
                      >
                        <Trash2 size={14} className="text-red-500" />
                      </button>
                    )}

                  </div>

                  <Input
                    placeholder="https://example.com/image.jpg"
                    value={image}
                    onChange={(e) =>
                      handleStripBannerImageChange(index, e.target.value)
                    }
                    className="h-9 text-[12px] rounded-xl border-slate-200"
                  />

                </div>
              ))}

              <button
                onClick={addStripBannerImage}
                className="w-full h-9 rounded-xl text-[11px] font-semibold uppercase tracking-widest border border-dashed border-orange-300 text-orange-600 hover:bg-orange-50 transition-colors flex items-center justify-center gap-2"
              >
                <Plus size={13} />
                Add New Image
              </button>

            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={submit}
            disabled={isLoading}
            className="w-full h-10 rounded-xl text-[11px] font-semibold uppercase tracking-widest bg-slate-900 hover:bg-slate-700 text-white transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 size={13} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <LayoutTemplate size={13} />
                Create Section
              </>
            )}
          </button>

        </CardContent>
      </Card>
    </div>
  );
}