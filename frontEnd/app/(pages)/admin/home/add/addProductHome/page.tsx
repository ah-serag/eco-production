"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
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
import { Layers } from "lucide-react";

/* ================= Queries ================= */

import {
  useGetHomeSectionsQuery,
} from "../../../../../../redux/features/home/AllsectionsSlice";

import {
  useGetCategoryOptionsQuery,
} from "../../../../../../redux/features/productAdmin/categoryapiSlice";

import {
  useAddHomeProductMutation,
} from "../../../../../../redux/features/home/productHomeSlice";

export default function AddHomeProductPage() {

  const { data: sectionsData, isLoading: sectionsLoading } =
    useGetHomeSectionsQuery({ type: "product_category" });

  const { data: categories, isLoading: categoriesLoading } =
    useGetCategoryOptionsQuery(undefined);

  const [addHomeProduct, { isLoading }] = useAddHomeProductMutation();

  const sections = sectionsData?.sections || [];


  const [form, setForm] = useState({
    section_id: "",
    category_id: "",
    is_active: true,
  });

  /* ================= Submit ================= */

  const submit = async () => {
    if (!form.section_id || !form.category_id) {
      toast.error("Please select section and category");
      return;
    }

    try {
      await addHomeProduct({
        section_id: Number(form.section_id),
        category_id: Number(form.category_id),
        is_active: form.is_active,
      }).unwrap();

      toast.success("Home category added successfully");

      setForm({
        section_id: "",
        category_id: "",
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
      <div
        className="relative overflow-hidden mb-10 rounded-md p-10 
        bg-secondary text-white shadow-lg"
      >
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-[auto_1fr] gap-6 items-center">
          <div className="flex items-center justify-center w-20 h-20 rounded-xl bg-white/20">
            <Layers size={32} />
          </div>

          <div className="space-y-3">
            <h1 className="text-4xl font-bold tracking-tight">
              Manage Home Products
            </h1>
            <span className="inline-block text-sm uppercase tracking-widest text-white/70">
              Homepage Category Sections
            </span>
            <p className="max-w-3xl text-white/80 text-base leading-relaxed">
              Assign product categories to homepage sections. Each section will
              automatically display a limited number of products from the
              selected category based on the section configuration.
            </p>
          </div>
        </div>
      </div>

      <Separator />

      {/* ================= Form Card ================= */}
      <Card>
        <CardHeader>
          <CardTitle>Add Home Category</CardTitle>
          <CardDescription>
            Products will be loaded dynamically from the selected category
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Section */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Home Section</label>
            <Select
              value={form.section_id}
              onValueChange={(value) =>
                setForm({ ...form, section_id: value })
              }
              disabled={sectionsLoading}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    sectionsLoading
                      ? "Loading sections..."
                      : "Select home section"
                  }
                />
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

          {/* Category */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Category</label>
            <Select
              value={form.category_id}
              onValueChange={(value) =>
                setForm({ ...form, category_id: value })
              }
              disabled={categoriesLoading}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    categoriesLoading
                      ? "Loading categories..."
                      : "Select category"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {categories?.map((cat: any) => (
                  <SelectItem key={cat.id} value={String(cat.id)}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Active */}
          <div className="flex items-center justify-between border rounded-lg p-4">
            <div>
              <p className="font-medium">Active Section</p>
              <p className="text-sm text-muted-foreground">
                Toggle visibility on homepage
              </p>
            </div>
            <Switch
              checked={form.is_active}
              onCheckedChange={(value) =>
                setForm({ ...form, is_active: value })
              }
            />
          </div>

          {/* Submit */}
          <Button
            className="w-full bg-secondary hover:bg-secondary/90"
            onClick={submit}
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Add Home Category"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
