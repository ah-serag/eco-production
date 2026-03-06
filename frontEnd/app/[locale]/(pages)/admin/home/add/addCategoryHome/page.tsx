"use client";

import { useState } from "react";
import { toast } from "sonner";

import {
  useGetHomeSectionsQuery,
} from "../../../../../../../redux/features/home/AllsectionsSlice";

import {
  useGetCategoryOptionsQuery,
} from "../../../../../../../redux/features/productAdmin/categoryapiSlice";

import {
  useAddHomeCategoryMutation,
} from "../../../../../../../redux/features/home/categoryHomeSlice";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

import { Loader2, PlusCircle } from "lucide-react";

export default function AddCategoryHomePage() {
  const [sectionId, setSectionId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [title, setTitle] = useState("");   // <-- جديد
  const [orderIndex, setOrderIndex] = useState(0);

  const { data, isLoading: loadingSections } =
    useGetHomeSectionsQuery({ type: "category" });
  const sections = data?.sections || [];

  const { data: categories, isLoading: loadingCategories } =
    useGetCategoryOptionsQuery(undefined);

  const [addHomeCategory, { isLoading }] =
    useAddHomeCategoryMutation();

  const handleSubmit = async () => {
    if (!sectionId || !categoryId) {
      toast.error("Please select section and category");
      return;
    }

    try {
      await addHomeCategory({
        section_id: Number(sectionId),
        category_id: Number(categoryId),
        image_url: imageUrl,
        title,                 // <-- جديد
        order_index: orderIndex,
      }).unwrap();

      toast.success("Category added to home successfully");

      setCategoryId("");
      setImageUrl("");
      setTitle("");          // <-- جديد
      setOrderIndex(0);
    } catch (error: any) {
      toast.error(
        error?.data?.message || "Failed to add home category"
      );
    }
  };

  return (
    <div className=" mx-auto ">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <PlusCircle className="w-5 h-5" />
            Add Home Category
          </CardTitle>
          <CardDescription>
            Add category to home section with full control
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Section */}
          <div className="space-y-2">
            <Label>Home Section</Label>
            <Select
              value={sectionId}
              onValueChange={setSectionId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select section" />
              </SelectTrigger>
              <SelectContent>
                {sections?.map((section: any) => (
                  <SelectItem
                    key={section.id}
                    value={String(section.id)}
                  >
                    {section.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label>Category</Label>
            <Select
              value={categoryId}
              onValueChange={setCategoryId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories?.map((cat: any) => (
                  <SelectItem
                    key={cat.id}
                    value={String(cat.id)}
                  >
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Image */}
          <div className="space-y-2">
            <Label>Image URL</Label>
            <Input
              placeholder="https://image.com/category.png"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label>Title (under image)</Label>
            <Input
              placeholder="Category Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>


          {/* Submit */}
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full bg-secondary hover:bg-secondary/90"
          >
            {isLoading && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Add Category
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
