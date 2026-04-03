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
import { PlusSquare, Timer } from "lucide-react";

import {
  useGetHomeSectionsQuery,
} from "../../../../../../../redux/features/home/AllsectionsSlice";

import {
  useAddLimitedOfferBannerMutation,
} from "../../../../../../../redux/features/home/limitedOfferSlice";

export default function AddLimitedOfferBannerPage() {
  /* ================= Queries & Mutations ================= */

  const { data, isLoading: sectionsLoading } =
    useGetHomeSectionsQuery({ type: "Limited_Offer" });

  const [addLimitedOfferBanner, { isLoading }] =
    useAddLimitedOfferBannerMutation();

  const sections = data?.sections || [];

  /* ================= Form State ================= */

  const [form, setForm] = useState({
    section_id: "",
    image_url: "",
    link_url: "",
    start_at: "",
    end_at: "",
    is_active: true,
  });

  /* ================= Submit ================= */

  const submit = async () => {
    if (!form.section_id || !form.image_url || !form.link_url) {
      toast.error("Please fill all required fields");
      return;
    }

    if (!form.start_at || !form.end_at) {
      toast.error("Please select start and end time");
      return;
    }

    try {
      await addLimitedOfferBanner({
        section_id: Number(form.section_id),
        image_url: form.image_url,
        link_url: form.link_url,
        start_at: form.start_at,
        end_at: form.end_at,
        is_active: form.is_active,
      }).unwrap();

      toast.success("Limited offer banner added successfully");

      setForm({
        section_id: "",
        image_url: "",
        link_url: "",
        start_at: "",
        end_at: "",
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
                      : "Select section"
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

          {/* Image */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Banner Image URL : 1600 x 900 px </label>
            <Input
              placeholder="/uploads/limited-offer.jpg"
              value={form.image_url}
              onChange={(e) =>
                setForm({ ...form, image_url: e.target.value })
              }
            />
          </div>

          {/* Link */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Redirect Link</label>
            <Input
              placeholder="/product/iphone-15"
              value={form.link_url}
              onChange={(e) =>
                setForm({ ...form, link_url: e.target.value })
              }
            />
          </div>

          {/* Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Start Time</label>
              <Input
                type="datetime-local"
                value={form.start_at}
                onChange={(e) =>
                  setForm({ ...form, start_at: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">End Time</label>
              <Input
                type="datetime-local"
                value={form.end_at}
                onChange={(e) =>
                  setForm({ ...form, end_at: e.target.value })
                }
              />
            </div>
          </div>

          {/* Active */}
          <div className="flex items-center justify-between border rounded-lg p-4">
            <div>
              <p className="font-medium">Active Banner</p>
              <p className="text-sm text-muted-foreground">
                Show or hide this offer on homepage
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
            {isLoading ? "Saving..." : "Create Limited Offer Banner"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
