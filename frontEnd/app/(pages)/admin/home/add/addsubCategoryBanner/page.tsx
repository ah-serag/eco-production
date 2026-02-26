"use client";

import { useState } from "react";
import { toast } from "sonner";

import {
  useGetHomeSectionsQuery,
} from "../../../../../../redux/features/home/AllsectionsSlice";

import {
  useGetSubcategoryOptionsQuery,
} from "../../../../../../redux/features/productAdmin/categoryapiSlice";

import {
  useAddSubcategoryBannerMutation,
} from "../../../../../../redux/features/home/subCategoryBannerSlice";

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

export default function AddSubcategoryBannerPage() {
  const [sectionId, setSectionId] = useState("");
  const [subcategoryId, setSubcategoryId] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [directImage, setDirectImage] = useState<boolean>(false);
  const [isActive, setIsActive] = useState<boolean>(true);

  // Sections
  const { data } = useGetHomeSectionsQuery({
    type: "subcategory_banner",
  });
  const sections = data?.sections || [];

  // Subcategories
  const { data: subcategories } =
    useGetSubcategoryOptionsQuery(undefined);

  // Mutation
  const [addSubcategoryBanner, { isLoading }] =
    useAddSubcategoryBannerMutation();

  const handleSubmit = async () => {
    if (!sectionId || !subcategoryId || !imageUrl) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      await addSubcategoryBanner({
        section_id: Number(sectionId),
        subcategory_id: Number(subcategoryId),
        image_url: imageUrl,
        direct_image: directImage,
        is_active: isActive,
      }).unwrap();

      toast.success("Subcategory banner added successfully");

      setSubcategoryId("");
      setImageUrl("");
      setDirectImage(false);
      setIsActive(true);
    } catch (error: any) {
      toast.error(
        error?.data?.message || "Failed to add subcategory banner"
      );
    }
  };

  return (
    <div className="mx-auto">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <PlusCircle className="w-5 h-5" />
            Add Subcategory Banner
          </CardTitle>
          <CardDescription>
            Create a banner linked to a specific subcategory
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Section */}
          <div className="space-y-2">
            <Label>Home Section</Label>
            <Select value={sectionId} onValueChange={setSectionId}>
              <SelectTrigger>
                <SelectValue placeholder="Select section" />
              </SelectTrigger>
              <SelectContent>
                {sections.map((section: any) => (
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

          {/* Subcategory */}
          <div className="space-y-2">
            <Label>Subcategory</Label>
            <Select
              value={subcategoryId}
              onValueChange={setSubcategoryId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select subcategory" />
              </SelectTrigger>
              <SelectContent>
                {subcategories?.map((sub: any) => (
                  <SelectItem
                    key={sub.id}
                    value={String(sub.id)}
                  >
                    {sub.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Image */}
          <div className="space-y-2">
            <Label>Banner Image URL</Label>
            <Input
              placeholder="https://image.com/banner.png"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
          </div>

          {/* Direct Image */}
          <div className="space-y-2">
            <Label>Direct Image</Label>
            <Select
              value={directImage ? "true" : "false"}
              onValueChange={(v) => setDirectImage(v === "true")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="false">
                  Normal (with link)
                </SelectItem>
                <SelectItem value="true">
                  Direct Image
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Active */}
          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={isActive ? "true" : "false"}
              onValueChange={(v) => setIsActive(v === "true")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Active</SelectItem>
                <SelectItem value="false">Inactive</SelectItem>
              </SelectContent>
            </Select>
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
            Add Subcategory Banner
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
