"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { LayoutGrid } from "lucide-react";

import { useAddHomeSectionMutation } from "../../../../../../redux/features/home/AllsectionsSlice";

export default function AddHomeSectionPage() {
  const [addHomeSection, { isLoading }] = useAddHomeSectionMutation();

  const [form, setForm] = useState({
    name: "",
    type: "",
    order_index: 0,
    content: `{
  "title": "",
  "subtitle": ""
}`,
  });

  const submit = async () => {
    try {
      await addHomeSection({
        name: form.name,
        type: form.type,
        order_index: form.order_index,
        is_active: true,
        content: JSON.parse(form.content),
      }).unwrap();

      toast.success("Section added successfully");

      setForm({
        name: "",
        type: "",
        order_index: 0,
        content: `{
  "title": "",
  "subtitle": ""
}`,
      });
    } catch (err) {
      toast.error("Invalid JSON or server error");
    }
  };

  return (
    <div className="mx-auto space-y-8">
      {/* ================= Page Banner ================= */}
      <div className="relative overflow-hidden mb-10 rounded-md p-10 bg-secondary text-white shadow-lg">
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-[auto_1fr] gap-6 items-center">
          {/* Icon */}
          <div className="flex items-center justify-center w-20 h-20 rounded-xl bg-white/20">
            <LayoutGrid size={32} />
          </div>

          {/* Text Content */}
          <div className="space-y-3">
            <h1 className="text-4xl font-bold tracking-tight">
              Manage Home Sections
            </h1>
            <span className="inline-block text-sm uppercase tracking-widest text-white/70">
              Dynamic Homepage Sections
            </span>
            <p className="max-w-3xl text-white/80 text-base leading-relaxed">
              This page allows you to create and manage dynamic sections for
              the homepage. Each section can have a type, order index, and
              custom JSON content which will be rendered dynamically on the
              frontend.
            </p>
            <p className="max-w-3xl text-white/70 text-sm leading-relaxed">
              Use this interface to add hero sliders, featured products,
              special offers, or newsletter signup sections. Make sure your JSON
              content is valid to avoid rendering errors.
            </p>
          </div>
        </div>
      </div>

      <Separator />

      {/* ================= Form Card ================= */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Add New Section</CardTitle>
          <CardDescription>
            This section will appear dynamically on the homepage
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Section Name</label>
            <Input
              placeholder="Hero Section"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          {/* Type */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Section Type</label>
            <Select
              value={form.type}
              onValueChange={(value) => setForm({ ...form, type: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select section type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hero">Hero Slider</SelectItem>
                <SelectItem value="category">category</SelectItem>
                <SelectItem value="Limited_Offer">Limited Offer</SelectItem>
                <SelectItem value="product_category">products category</SelectItem>
                <SelectItem value="subcategory_banner">Sub Category Banner</SelectItem>
                <SelectItem value="offers">Offers</SelectItem>
                <SelectItem value="newsletter">Newsletter</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Order */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Order Index</label>
            <Input
              type="number"
              value={form.order_index}
              onChange={(e) =>
                setForm({ ...form, order_index: Number(e.target.value) })
              }
            />
          </div>

          {/* Content */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Section Content (JSON)</label>
            <Textarea
              rows={8}
              className="font-mono text-sm"
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
            />
            <p className="text-xs text-muted-foreground">
              Used by frontend to render the section dynamically
            </p>
          </div>

          {/* Action */}
          <Button
            onClick={submit}
            disabled={isLoading}
            className="w-full hover:bg-secondary/90 bg-secondary"
          >
            {isLoading ? "Saving..." : "Create Section"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
