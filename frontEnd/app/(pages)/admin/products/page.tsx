"use client";

import React, { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Table, TableHeader, TableRow, TableCell, TableBody } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import EditProduct from "@/components/manage/editingProduct";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// اضافة مكونات القائمة المنسدلة
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// اضافة الايقونات
import { Package, MoreHorizontal, Edit, Trash2, Power } from "lucide-react";
import {
  useGetProductsAdminQuery,
  useToggleActiveMutation,
  useEditProductMutation,
  useDeleteProductMutation,
} from "../../../../redux/features/productAdmin/productapiSlice";


type Product = {
  id: number;
  title: string;
  price: number;
  stock: number;
  description: string;
  discount_price?: number | null;
  is_active: boolean;
  image_url: string;
};


type FormValues = {
  status: string;
  limit: number;
  category_id?: number;
  search: string;
  sort_by: "created_at" | "price" | "oldest";
};

const categories = [
  { id: 1, name: "Electronics" },
  { id: 2, name: "Fashion" },
  { id: 3, name: "Beauty & Personal Care" },
  { id: 4, name: "Home & Kitchen" },
  { id: 5, name: "Sports & Outdoors" },
  { id: 6, name: "Grocery" },
  { id: 7, name: "Baby Products" },
  { id: 8, name: "Automotive" },
  { id: 9, name: "Computers & Accessories" },
];

export default function ProductsAdmin() {
  const [page, setPage] = useState(1);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<any>(null);

  const methods = useForm<FormValues>({
    defaultValues: {
         status : "",
         limit: 10,
         category_id: undefined,
         search: "",
         sort_by: "created_at",
    },
  });

  const { watch, setValue } = methods;
  const status = watch("status");
  const limit = watch("limit");
  const category_id = watch("category_id");
  const search = watch("search");
  const sort_by = watch("sort_by");

  // RTK Query hooks
  const { data, isLoading, refetch } = useGetProductsAdminQuery({
    page,
    limit,
    status,
    category_id,
    search,
    sort_by,
  });

  const [toggleActive] = useToggleActiveMutation();
  const [editProduct] = useEditProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  const totalPages = data ? Math.ceil(data.total / limit) : 1;

  // Handlers
  const handleToggleActive = async (id: number) => {
    await toggleActive(id);
  };

  const handleDeleteConfirmed = async () => {
    if (!productToDelete) return;
    await deleteProduct(productToDelete.id);
    setDeleteDialogOpen(false);
    setProductToDelete(null);
  };

  const handleEditProduct = (p: any) => {
    setEditingProduct(p);
    setIsEditOpen(true);
  };

  const handleSave = async (payload: any) => {
    await editProduct({ id: payload.id, data: payload });
    setIsEditOpen(false);
    setEditingProduct(null);
  };

  useEffect(() => {
    refetch();
  }, [status, limit, category_id, search, sort_by, page, refetch]);

  return (
    <FormProvider {...methods}>
      <div className="">
        {/* Banner */} 
        <div className="relative overflow-hidden  rounded-md  p-6 md:p-10  text-white bg-secondary mb-4">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div className="flex items-start md:items-center gap-4 md:gap-6 max-w-xl">
              <div className="flex items-center justify-center p-4  w-16 h-16rounded-xl  bg-chart-1">
                <Package  />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Products Manager</h2>
                <p className="text-sm text-gray-300">
                  Manage products efficiently, update status, edit or delete entries, and keep your inventory organized.
                </p>
                <p className="text-sm text-gray-400">Total Products: {data?.total || 0}</p>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 md:gap-6 items-end">
              <Input
                placeholder="Search by title..."
                value={search}
                onChange={(e) => {
                  setPage(1);
                  setValue("search", e.target.value);
                }}
                className="w-64  bg-white text-black placeholder:text-gray-400"
              />

              <Select
                value={limit.toString()}
                onValueChange={(val) => {
                  setPage(1);
                  setValue("limit", Number(val));
                }}
              >
                <SelectTrigger className="w-24  bg-white text-black">
                  <SelectValue placeholder="Limit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={status}
                onValueChange={(val) => {
                  setPage(1);
                  setValue("status", val as "active" | "inactive");
                }}
              >
                <SelectTrigger className="w-28  bg-white text-black">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={category_id ? category_id.toString() : "all"}
                onValueChange={(val) => {
                  setPage(1);
                  setValue("category_id", val === "all" ? undefined : Number(val));
                }}
              >
                <SelectTrigger className="w-44  bg-white text-black">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id.toString()}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={sort_by}
                onValueChange={(val) => {
                  setPage(1);
                  setValue("sort_by", val as "created_at" | "price" | "oldest");
                }}
              >
                <SelectTrigger className="w-32 bg-white text-black">
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="created_at">Newest</SelectItem>
                  <SelectItem value="oldest">Oldest</SelectItem>
                  <SelectItem value="price">Price</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="p-3 ">
           <Table className="border " >
          <TableHeader>
            <TableRow className="bg-gray-100 ">
              <TableCell>Image</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Active</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.products.map((p : Product) => (
              <TableRow key={p.id} className="border items-center">
                <TableCell>
                  <img src={p.image_url} alt={p.title} className="w-12 h-12 object-contain rounded" />
                </TableCell>
                <TableCell>{p.title}</TableCell>
                <TableCell>${p.discount_price}</TableCell>
                <TableCell>{p.stock}</TableCell>
                <TableCell>
                  <div className={`w-2 h-2 rounded-full ${p.is_active ? "bg-green-500" : "bg-red-500"}`}></div>
                </TableCell>
                
                {/* --- التعديل هنا فقط --- */}
                <TableCell>
                  <div className="flex justify-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleEditProduct(p)} className="cursor-pointer">
                          <Edit className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleToggleActive(p.id)} className="cursor-pointer">
                          <Power className="mr-2 h-4 w-4" /> 
                          {p.is_active ? "Deactivate" : "Activate"}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-red-600 focus:text-red-600 cursor-pointer"
                          onClick={() => {
                            setProductToDelete(p);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
                {/* ---------------------- */}

              </TableRow>
            ))}
          </TableBody>
        </Table>
        </div>
      
        {/* Pagination */}
        <div className="flex justify-between p-4  mt-4 items-center">
          <Button variant="outline" disabled={page <= 1} onClick={() => setPage(page - 1)}>
            Previous
          </Button>
          <span>
            Page {page} of {totalPages}
          </span>
          <Button variant="outline" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
            Next
          </Button>
        </div>

        {/* Edit Dialog */}
        {editingProduct && (
          <EditProduct
            product={editingProduct}
            open={isEditOpen}
            onClose={() => {
              setIsEditOpen(false);
              setEditingProduct(null);
            }}
            onSave={(payload) => handleSave(payload)}
          />
        )}

        {/* Delete Dialog */}
        {productToDelete && (
          <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <DialogContent className="max-w-sm p-4">
              <DialogHeader>
                <DialogTitle>Delete Product</DialogTitle>
              </DialogHeader>
              <p>
                Are you sure you want to delete <strong>{productToDelete.title}</strong>?
              </p>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleDeleteConfirmed}>
                  Delete
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </FormProvider>
  );
}