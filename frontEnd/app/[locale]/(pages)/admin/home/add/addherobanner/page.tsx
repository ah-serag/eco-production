"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {  FileSliders } from "lucide-react";

import {
  useGetHomeSectionsQuery,
} from "../../../../../../../redux/features/home/AllsectionsSlice";

import {
  useAddHeroBannerMutation,
} from "../../../../../../../redux/features/home/herroBannerSlice";

export default function AddHeroBannerPage() {
  /* ================= Queries & Mutations ================= */

  const { data, isLoading: sectionsLoading } = useGetHomeSectionsQuery({ type: "hero" });
  const [addHeroBanner, { isLoading }] = useAddHeroBannerMutation();
  const sections = data?.sections || [];

  /* ================= Form State ================= */

  const [form, setForm] = useState({
    section_id: "",
    title: "",
    subtitle: "",
    image_url: "",
    cta_text: "",
    cta_link: "",
    is_active: true,
  });

  /* ================= Submit ================= */

  const submit = async () => {
    if (!form.section_id) {
      toast.error("Please select a hero section");
      return;
    }

    try {
      await addHeroBanner({
        ...form,
        section_id: Number(form.section_id),
      }).unwrap();

      toast.success("Hero banner added successfully");

      setForm({
        section_id: "",
        title: "",
        subtitle: "",
        image_url: "",
        cta_text: "",
        cta_link: "",
        is_active: true,
      });
    } catch {
      toast.error("Something went wrong");
    }
  };

  /* ================= UI ================= */

  return (
    <div className="mx-auto space-y-8">
      {/* ================= Page Banner ================= */}
      <div className="relative overflow-hidden mb-10 rounded-md p-10 
      bg-secondary text-white shadow-lg">
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-[auto_1fr] gap-6 items-center">
          {/* Icon */}
          <div className="flex items-center justify-center w-20 h-20 rounded-xl bg-white/20">
            <FileSliders size={32} />
          </div>

          {/* Text Content */}
          <div className="space-y-3">
            <h1 className="text-4xl font-bold tracking-tight">
              Manage Hero Banners
            </h1>
            <span className="inline-block text-sm uppercase tracking-widest text-white/70">
              Homepage Slider Management
            </span>
            <p className="max-w-3xl text-white/80 text-base leading-relaxed">
              This page allows you to create, edit, and manage all hero banners
              displayed on the homepage. You can select the target section,
              upload an image, add a catchy title and subtitle, and define a
              call-to-action button that drives users to your desired page.
            </p>
     
          </div>
        </div>

     
      </div>



      <Separator />

      {/* ================= Form Card ================= */}
      <Card>
        <CardHeader>
          <CardTitle>Add New Hero Banner</CardTitle>
          <CardDescription>This banner will appear inside the selected hero section</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Section */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Hero Section</label>
            <Select
              value={form.section_id}
              onValueChange={(value) => setForm({ ...form, section_id: value })}
              disabled={sectionsLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder={sectionsLoading ? "Loading sections..." : "Select hero section"} />
              </SelectTrigger>
              <SelectContent>
                {sections.map((section: any) => (
                  <SelectItem key={section.id} value={String(section.id)}>
                    {section.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Title</label>
            <Input
              placeholder="Big Sale"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>

          {/* Subtitle */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Subtitle</label>
            <Input
              placeholder="Up to 50% off"
              value={form.subtitle}
              onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
            />
          </div>

          {/* Image */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Image URL 3780 * 1890 px </label>
            <Input
              placeholder="/uploads/banner.jpg"
              value={form.image_url}
              onChange={(e) => setForm({ ...form, image_url: e.target.value })}
            />
          </div>

          {/* CTA */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">CTA Text</label>
              <Input
                placeholder="Shop Now"
                value={form.cta_text}
                onChange={(e) => setForm({ ...form, cta_text: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">CTA Link</label>
              <Input
                placeholder="/shop"
                value={form.cta_link}
                onChange={(e) => setForm({ ...form, cta_link: e.target.value })}
              />
            </div>
          </div>

          {/* Active */}
          <div className="flex items-center justify-between border rounded-lg p-4">
            <div>
              <p className="font-medium">Active Banner</p>
              <p className="text-sm text-muted-foreground">Toggle visibility on homepage</p>
            </div>
            <Switch
              checked={form.is_active}
              onCheckedChange={(value) => setForm({ ...form, is_active: value })}
            />
          </div>

          {/* Submit */}
          <Button className="w-full  hover:bg-secondary/90  bg-secondary" onClick={submit} disabled={isLoading}>
            {isLoading ? "Saving..." : "Create Hero Banner"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
