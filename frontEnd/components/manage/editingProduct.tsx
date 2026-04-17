import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const FormSchema = z.object({
  title:         z.string().min(2, "Title is required"),
  title_ar:      z.string().optional(),
  price:         z.string().min(1, "Price required").refine((v) => !Number.isNaN(Number(v)), { message: "Price must be a number" }),
  stock:         z.string().min(1, "Stock required").refine((v) => Number.isInteger(Number(v)), { message: "Stock must be an integer" }),
  description:   z.string().min(5, "Description too short"),
  description_ar: z.string().optional(),
  discount_price: z.string().optional().refine((v) => v === undefined || v === "" || !Number.isNaN(Number(v)), { message: "Discount price must be a number" }),
});

type FormState = z.infer<typeof FormSchema>;

interface EditProductProps {
  product?: {
    id: number;
    title: string;
    title_ar?: string;
    price: number;
    stock: number;
    description: string;
    description_ar?: string;
    discount_price?: number | null;
  } | null;
  open: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void> | void;
}

export default function EditProduct({ product, open, onClose, onSave }: EditProductProps) {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormState>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title:          product?.title || "",
      title_ar:       product?.title_ar || "",
      price:          product?.price != null ? String(product.price) : "",
      stock:          product?.stock != null ? String(product.stock) : "",
      description:    product?.description || "",
      description_ar: product?.description_ar || "",
      discount_price: product?.discount_price != null ? String(product.discount_price) : "",
    },
  });

  React.useEffect(() => {
    reset({
      title:          product?.title || "",
      title_ar:       product?.title_ar || "",
      price:          product?.price != null ? String(product.price) : "",
      stock:          product?.stock != null ? String(product.stock) : "",
      description:    product?.description || "",
      description_ar: product?.description_ar || "",
      discount_price: product?.discount_price != null ? String(product.discount_price) : "",
    });
  }, [product, reset]);

  const onSubmit = async (values: FormState) => {
    await onSave({
      id:             product?.id,
      title:          values.title,
      title_ar:       values.title_ar || null,
      price:          Number(values.price),
      stock:          Number(values.stock),
      description:    values.description,
      description_ar: values.description_ar || null,
      discount_price: values.discount_price === "" ? null : Number(values.discount_price),
    });
    onClose();
  };

  const field = "grid gap-1.5";
  const err   = "text-[11px] text-destructive";

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg p-4 rounded-2xl shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Edit Product</DialogTitle>
        </DialogHeader>

        <Card className="rounded-2xl shadow-md">
          <CardContent className="p-4">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-3">

                {/* Title EN + AR */}
                <div className="grid grid-cols-2 gap-3">
                  <div className={field}>
                    <Label className="text-[11px] text-slate-500 uppercase tracking-wide">Title (EN)</Label>
                    <Input {...register("title")} />
                    {errors.title && <p className={err}>{errors.title.message}</p>}
                  </div>
                  <div className={field}>
                    <Label className="text-[11px] text-slate-500 uppercase tracking-wide">Title (AR)</Label>
                    <Input {...register("title_ar")} dir="rtl" />
                  </div>
                </div>

                {/* Price + Stock + Discount */}
                <div className="grid grid-cols-3 gap-3">
                  <div className={field}>
                    <Label className="text-[11px] text-slate-500 uppercase tracking-wide">Price</Label>
                    <Input type="number" {...register("price")} />
                    {errors.price && <p className={err}>{errors.price.message}</p>}
                  </div>
                  <div className={field}>
                    <Label className="text-[11px] text-slate-500 uppercase tracking-wide">Stock</Label>
                    <Input type="number" {...register("stock")} />
                    {errors.stock && <p className={err}>{errors.stock.message}</p>}
                  </div>
                  <div className={field}>
                    <Label className="text-[11px] text-slate-500 uppercase tracking-wide">Discount</Label>
                    <Input type="number" {...register("discount_price")} />
                    {errors.discount_price && <p className={err}>{errors.discount_price.message}</p>}
                  </div>
                </div>

                {/* Description EN */}
                <div className={field}>
                  <Label className="text-[11px] text-slate-500 uppercase tracking-wide">Description (EN)</Label>
                  <Textarea rows={3} {...register("description")} />
                  {errors.description && <p className={err}>{errors.description.message}</p>}
                </div>

                {/* Description AR */}
                <div className={field}>
                  <Label className="text-[11px] text-slate-500 uppercase tracking-wide">Description (AR)</Label>
                  <Textarea rows={3} {...register("description_ar")} dir="rtl" />
                </div>

              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" type="button" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
                <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving..." : "Save"}</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
