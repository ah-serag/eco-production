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


import { useAddHomeSectionMutation } from "../../../../../../../redux/features/home/AllsectionsSlice";

export default function AddHomeSectionPage() {
  const [addHomeSection, { isLoading }] = useAddHomeSectionMutation();

  const [form, setForm] = useState({
    name: "",
    type: "",
    order_index: 0,
    content: `{
      "title": "",
      "subtitle": "" ,
      "title_ar": "",
      "subtitle_ar": "" 
    }`,
  });

  const handleTypeChange = (value: string) => {
    let newContent = "";

    if (value === "wide_banner") {
      newContent = `{
      "wideBinner_items" : [
        {"url_image" : "" , "link" : "/"},
        {"url_image" : "" , "link" : "/"}
      ]
    }`;
    } else if (value === "strip_banner") {
      newContent = `{
      "strip_images" : [""]
    }`;
    } else {
      newContent = `{
      "title": "",
      "subtitle": "" ,
      "title_ar": "",
      "subtitle_ar": "" 
    }`;
    }

    setForm({ ...form, type: value, content: newContent });
  };

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
          "subtitle": "" ,
          "title_ar": "",
          "subtitle_ar": "" 
        }`,
      });
    } catch (err) {
      toast.error("Invalid JSON or server error");
    }
  };

  return (
    <div className="mx-auto  space-y-8">
      {/* ================= Form Card ================= */}
      <Card className="shadow-sm rounded-none ">
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
              onValueChange={handleTypeChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select section type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hero">Hero Slider (7 : 2)</SelectItem>
                <SelectItem value="category">category</SelectItem>
                <SelectItem value="Limited_Offer">Limited Offer</SelectItem>
                <SelectItem value="product_category">products category</SelectItem>
                <SelectItem value="subcategory_banner">SubCategory products</SelectItem>
                <SelectItem value="wide_banner">wide_banner  (4 : 1) </SelectItem>
                <SelectItem value="strip_banner">strip_banner (5: 1)</SelectItem>
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
              rows={10}
              className="font-mono bg-slate-800 text-slate-100 text-sm"
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