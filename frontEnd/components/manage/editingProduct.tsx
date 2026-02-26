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

const FormSchema =
 z.object({
  title: z.string().min(2, "Title is required"),
  price: z
    .string()
    .min(1, "Price required")
    .refine((v) => !Number.isNaN(Number(v)), { message: "Price must be a number" }),
  stock: z
    .string()
    .min(1, "Stock required")
    .refine((v) => Number.isInteger(Number(v)), { message: "Stock must be an integer" }),
  description: z.string().min(5, "Description too short"),
  discount_price: z
    .string()
    .optional()
    .refine((v) => v === undefined || v === "" || !Number.isNaN(Number(v)), {
      message: "Discount price must be a number",
    }),
});

type FormState = z.infer<typeof FormSchema>  ;

interface EditProductProps {
  product?: {
    id: number;
    title: string;
    price: number;
    stock: number;
    description: string;
    discount_price?: number | null;
  } | null;
  open: boolean;
  onClose: () => void;
  onSave: (data: {
    id?: number;
    title: string;
    price: number;
    stock: number;
    description: string;
    discount_price?: number | null;
  }) => Promise<void> | void;
}







export default function EditProduct({ product, open, onClose, onSave }: EditProductProps) {
  const formMethods = useForm<FormState>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: product?.title || "",
      price: product?.price != null ? String(product.price) : "",
      stock: product?.stock != null ? String(product.stock) : "",
      description: product?.description || "",
      discount_price:
        product?.discount_price != null ? String(product.discount_price) : "",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = formMethods;

  React.useEffect(() => {
    reset({
      title: product?.title || "",
      price: product?.price != null ? String(product.price) : "",
      stock: product?.stock != null ? String(product.stock) : "",
      description: product?.description || "",
      discount_price:
        product?.discount_price != null ? String(product.discount_price) : "",
    });
  }, [product, reset]);

  const onSubmit = async (values: FormState) => {

    const payload = {
      id: product?.id ,
      title: values.title,
      price: Number(values.price),
      stock: Number(values.stock),
      description: values.description,
      discount_price: values.discount_price === "" ? null : Number(values.discount_price),
    };

    await onSave(payload);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg p-4 rounded-2xl shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Edit Product</DialogTitle>
        </DialogHeader>

        <Card className="rounded-2xl shadow-md">
          <CardContent className="space-y-6 p-4">
            <form  onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-3">
   <div className="grid gap-3">
                <Label>Title</Label>
                <Input {...register("title")} aria-invalid={!!errors.title} />
                {errors.title && (
                  <p className="text-sm text-destructive">{errors.title.message}</p>
                )}
              </div>

              <div className="grid gap-3">
                <Label>Price</Label>
                <Input type="number" {...register("price")} aria-invalid={!!errors.price} />
                {errors.price && (
                  <p className="text-sm text-destructive">{errors.price.message}</p>
                )}
              </div>

              <div className="grid gap-3">
                <Label>Stock</Label>
                <Input type="number" {...register("stock")} aria-invalid={!!errors.stock} />
                {errors.stock && (
                  <p className="text-sm text-destructive">{errors.stock.message}</p>
                )}
              </div>

              <div className="grid gap-3">
                <Label>Description</Label>
                <Textarea {...register("description")} aria-invalid={!!errors.description} />
                {errors.description && (
                  <p className="text-sm text-destructive">{errors.description.message}</p>
                )}
              </div>

              <div className="grid gap-3">
                <Label>Discount Price</Label>
                <Input type="number" {...register("discount_price")} aria-invalid={!!errors.discount_price} />
                {errors.discount_price && (
                  <p className="text-sm text-destructive">{errors.discount_price.message}</p>
                )}
              </div>


              </div>
           
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" type="button" onClick={onClose} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
