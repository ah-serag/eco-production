"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription,
} from "@/components/ui/card";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { PlusSquare } from "lucide-react";
import { useGetHomeSectionsQuery } from "../../../../../../../redux/features/home/AllsectionsSlice";
import { useAddLimitedOfferBannerMutation } from "../../../../../../../redux/features/home/limitedOfferSlice";

export default function AddLimitedOfferBannerPage() {
  const { data, isLoading: sectionsLoading } = useGetHomeSectionsQuery({ type: "Limited_Offer" });
  const [addLimitedOfferBanner, { isLoading }] = useAddLimitedOfferBannerMutation();
  const sections = data?.sections || [];

  // ← كل field ليه state لوحده
  const [sectionId, setSectionId]   = useState("");
  const [imageFile, setImageFile]   = useState<File | null>(null);
  const [preview,   setPreview]     = useState<string | null>(null);
  const [linkUrl,   setLinkUrl]     = useState("");
  const [startAt,   setStartAt]     = useState("");
  const [endAt,     setEndAt]       = useState("");
  const [isActive,  setIsActive]    = useState(true);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    setPreview(file ? URL.createObjectURL(file) : null);
  };

  const reset = () => {
    setSectionId("");
    setImageFile(null);
    setPreview(null);
    setLinkUrl("");
    setStartAt("");
    setEndAt("");
    setIsActive(true);
  };

  const submit = async () => {
    if (!sectionId || !imageFile || !linkUrl) {
      toast.error("Please fill all required fields");
      return;
    }
    if (!startAt || !endAt) {
      toast.error("Please select start and end time");
      return;
    }

    const formData = new FormData();
    formData.append("section_id", sectionId);
    formData.append("image",      imageFile);
    formData.append("link_url",   linkUrl);
    formData.append("start_at",   startAt);
    formData.append("end_at",     endAt);
    formData.append("is_active",  String(isActive));

    try {
      await addLimitedOfferBanner(formData).unwrap();
      toast.success("Limited offer banner added successfully");
      reset();
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="mx-auto space-y-8">
      <Card className="rounded-none">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <PlusSquare size={30} />
            Add Limited Offer Banner
          </CardTitle>
          <CardDescription>
            This banner will appear in the selected homepage section
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">

          {/* Section */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Target Section</label>
            <Select value={sectionId} onValueChange={setSectionId} disabled={sectionsLoading}>
              <SelectTrigger>
                <SelectValue placeholder={sectionsLoading ? "Loading sections..." : "Select section"} />
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
            <label className="text-sm font-medium">Banner Image — 1600 × 900 px</label>
            <Input type="file" accept="image/*" onChange={handleFileChange} />
            {preview && (
              <img src={preview} alt="preview"
                className="mt-2 rounded-md w-full max-h-48 object-cover border" />
            )}
          </div>

          {/* Link */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Redirect Link</label>
            <Input
              placeholder="/product/iphone-15"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
            />
          </div>

          {/* Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Start Time</label>
              <Input type="datetime-local" value={startAt} onChange={(e) => setStartAt(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">End Time</label>
              <Input type="datetime-local" value={endAt} onChange={(e) => setEndAt(e.target.value)} />
            </div>
          </div>

          {/* Active */}
          <div className="flex items-center justify-between border rounded-lg p-4">
            <div>
              <p className="font-medium">Active Banner</p>
              <p className="text-sm text-muted-foreground">Show or hide this offer on homepage</p>
            </div>
            <Switch checked={isActive} onCheckedChange={setIsActive} />
          </div>

          {/* Submit */}
          <Button
            className="w-full bg-secondary hover:bg-secondary/90"
            onClick={submit}
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Create Limited Offer Banner"}
          </Button>

        </CardContent>
      </Card>
    </div>
  );
}