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
import {  FileSliders, PlusSquare } from "lucide-react";

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
 
      {/* ================= Form Card ================= */}
      <Card className="rounded-none">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
          <PlusSquare  size={30} />
          Add New Hero Banner
          </CardTitle>
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


          {/* Image */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Image URL size : 7 : 2 </label>
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
