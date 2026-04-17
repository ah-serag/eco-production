"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast, Toaster } from "sonner";
import {
  Tag, Plus, Trash2, MoreHorizontal,
  Percent, DollarSign, CalendarClock, ShieldAlert,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Table, TableHeader, TableRow, TableHead,
  TableBody, TableCell,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogTrigger, DialogClose,
} from "@/components/ui/dialog";
import {
  DropdownMenu, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select";

import {
  useGetCouponsQuery,
  useAddCouponMutation,
  useDeleteCouponMutation,
  useToggleCouponStatusMutation,
} from "../../../../../redux/features/coupons/couponsApiSlice";

/* ─────────────── types ─────────────── */
interface Coupon {
  id: number;
  code: string;
  description: string | null;
  discount_type: "percentage" | "fixed";
  discount_value: number;
  min_order_value: number;
  max_discount_amount: number | null;
  usage_limit: number | null;
  used_count: number;
  expiry_date: string;
  is_active: boolean;
  created_at: string;
}

/* ─────────────── helpers ─────────────── */
function isExpired(date: string) {
  return new Date(date) < new Date();
}

function StatusBadge({ coupon }: { coupon: Coupon }) {
  if (isExpired(coupon.expiry_date))
    return <Badge variant="outline" className="text-slate-400 border-slate-200 text-[10px]">Expired</Badge>;
  if (!coupon.is_active)
    return <Badge variant="outline" className="text-rose-500 border-rose-200 bg-rose-50 text-[10px]">Inactive</Badge>;
  return <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50 text-[10px]">Active</Badge>;
}

/* ─────────────── page ─────────────── */
export default function AdminCouponsPage() {
  const { data, isLoading } = useGetCouponsQuery(undefined);
  const [addCoupon]         = useAddCouponMutation();
  const [deleteCoupon]      = useDeleteCouponMutation();
  const [toggleStatus]      = useToggleCouponStatusMutation();

  const coupons: Coupon[] = data?.data ?? [];

  /* add dialog */
  const [addOpen, setAddOpen] = useState(false);
  const [discountType, setDiscountType] = useState<"percentage" | "fixed">("percentage");
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();

  /* delete confirm dialog */
  const [deleteTarget, setDeleteTarget] = useState<Coupon | null>(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  /* ── add coupon ── */
  const onAdd = async (values: any) => {
    try {
      await addCoupon({ ...values, discount_type: discountType }).unwrap();
      toast.success("Coupon added");
      reset();
      setAddOpen(false);
    } catch (err: any) {
      toast.error(err?.data?.message ?? "Failed to add coupon");
    }
  };

  /* ── toggle active ── */
  const handleToggle = async (coupon: Coupon) => {
    try {
      await toggleStatus({ id: coupon.id, is_active: !coupon.is_active }).unwrap();
      toast.success(`Coupon ${!coupon.is_active ? "activated" : "deactivated"}`);
    } catch {
      toast.error("Failed to update status");
    }
  };

  /* ── delete ── */
  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteCoupon(deleteTarget.id).unwrap();
      toast.success("Coupon deleted");
      setDeleteTarget(null);
      setDeleteConfirmText("");
    } catch {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="space-y-4">
      <Toaster richColors position="top-right" />

      {/* ── Header ── */}
      <div className="flex items-center justify-between bg-white rounded-2xl px-5 py-4 shadow-sm border border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center">
            <Tag size={16} className="text-violet-500" />
          </div>
          <div>
            <h1 className="text-[15px] font-semibold text-slate-800">Coupons</h1>
            <p className="text-[11px] text-slate-400">{coupons.length} coupon{coupons.length !== 1 && "s"}</p>
          </div>
        </div>

        {/* Add Dialog */}
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1.5 text-[12px] rounded-xl shadow-none">
              <Plus size={14} /> Add Coupon
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-lg rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-[15px] font-semibold">New Coupon</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit(onAdd)} className="space-y-4 pt-1">
              {/* Code */}
              <div className="space-y-1.5">
                <Label className="text-[11px] uppercase tracking-wider text-slate-500">Code *</Label>
                <Input
                  {...register("code", { required: true })}
                  placeholder="e.g. SAVE20"
                  className="uppercase rounded-xl text-[13px]"
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <Label className="text-[11px] uppercase tracking-wider text-slate-500">Description</Label>
                <Textarea
                  {...register("description")}
                  placeholder="Optional description..."
                  className="rounded-xl text-[13px] resize-none"
                  rows={2}
                />
              </div>

              {/* Discount Type + Value */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-[11px] uppercase tracking-wider text-slate-500">Type *</Label>
                  <Select value={discountType} onValueChange={(v: any) => setDiscountType(v)}>
                    <SelectTrigger className="rounded-xl text-[13px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">
                        <span className="flex items-center gap-1.5"><Percent size={12} /> Percentage</span>
                      </SelectItem>
                      <SelectItem value="fixed">
                        <span className="flex items-center gap-1.5"><DollarSign size={12} /> Fixed</span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[11px] uppercase tracking-wider text-slate-500">
                    Value * {discountType === "percentage" ? "(%)" : "(EGP)"}
                  </Label>
                  <Input
                    {...register("discount_value", { required: true, valueAsNumber: true })}
                    type="number"
                    min={0}
                    step="0.01"
                    placeholder="0.00"
                    className="rounded-xl text-[13px]"
                  />
                </div>
              </div>

              {/* Min order + Max discount */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-[11px] uppercase tracking-wider text-slate-500">Min Order (EGP)</Label>
                  <Input
                    {...register("min_order_value", { valueAsNumber: true })}
                    type="number"
                    min={0}
                    step="0.01"
                    placeholder="0.00"
                    className="rounded-xl text-[13px]"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[11px] uppercase tracking-wider text-slate-500">Max Discount (EGP)</Label>
                  <Input
                    {...register("max_discount_amount", { valueAsNumber: true })}
                    type="number"
                    min={0}
                    step="0.01"
                    placeholder="No limit"
                    className="rounded-xl text-[13px]"
                  />
                </div>
              </div>

              {/* Usage limit + Expiry */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-[11px] uppercase tracking-wider text-slate-500">Usage Limit</Label>
                  <Input
                    {...register("usage_limit", { valueAsNumber: true })}
                    type="number"
                    min={1}
                    placeholder="Unlimited"
                    className="rounded-xl text-[13px]"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[11px] uppercase tracking-wider text-slate-500">Expiry Date *</Label>
                  <Input
                    {...register("expiry_date", { required: true })}
                    type="datetime-local"
                    className="rounded-xl text-[13px]"
                  />
                </div>
              </div>

              {/* Active toggle */}
              <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
                <div>
                  <p className="text-[12px] font-medium text-slate-700">Active on creation</p>
                  <p className="text-[10px] text-slate-400">Coupon will be usable immediately</p>
                </div>
                <Switch defaultChecked {...register("is_active")} />
              </div>

              <div className="flex gap-2 pt-1">
                <DialogClose asChild>
                  <Button type="button" variant="outline" className="flex-1 rounded-xl text-[12px]">Cancel</Button>
                </DialogClose>
                <Button type="submit" disabled={isSubmitting} className="flex-1 rounded-xl text-[12px]">
                  {isSubmitting ? "Adding..." : "Add Coupon"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* ── Table ── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 hover:bg-slate-50">
              <TableHead className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">Code</TableHead>
              <TableHead className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">Discount</TableHead>
              <TableHead className="text-[11px] uppercase tracking-wider text-slate-400 font-medium hidden md:table-cell">Min Order</TableHead>
              <TableHead className="text-[11px] uppercase tracking-wider text-slate-400 font-medium hidden md:table-cell">Usage</TableHead>
              <TableHead className="text-[11px] uppercase tracking-wider text-slate-400 font-medium hidden lg:table-cell">Expiry</TableHead>
              <TableHead className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">Status</TableHead>
              <TableHead className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">Active</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 8 }).map((__, j) => (
                    <TableCell key={j}>
                      <div className="h-4 rounded bg-slate-100 animate-pulse w-20" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : coupons.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-16 text-slate-400 text-[13px]">
                  No coupons yet
                </TableCell>
              </TableRow>
            ) : (
              coupons.map((coupon) => (
                <TableRow key={coupon.id} className="hover:bg-slate-50/60">

                  {/* Code */}
                  <TableCell>
                    <span className="font-mono font-semibold text-[12px] text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md tracking-wider">
                      {coupon.code}
                    </span>
                  </TableCell>

                  {/* Discount */}
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center
                        ${coupon.discount_type === "percentage" ? "bg-violet-50" : "bg-amber-50"}`}>
                        {coupon.discount_type === "percentage"
                          ? <Percent size={11} className="text-violet-500" />
                          : <DollarSign size={11} className="text-amber-500" />}
                      </div>
                      <span className="text-[13px] font-semibold text-slate-800">
                        {coupon.discount_type === "percentage"
                          ? `${coupon.discount_value}%`
                          : `${Number(coupon.discount_value).toLocaleString()} EGP`}
                      </span>
                    </div>
                  </TableCell>

                  {/* Min order */}
                  <TableCell className="hidden md:table-cell text-[12px] text-slate-500">
                    {Number(coupon.min_order_value) > 0
                      ? `${Number(coupon.min_order_value).toLocaleString()} EGP`
                      : <span className="text-slate-300">—</span>}
                  </TableCell>

                  {/* Usage */}
                  <TableCell className="hidden md:table-cell">
                    <span className="text-[12px] text-slate-600">
                      {coupon.used_count}
                      {coupon.usage_limit ? (
                        <span className="text-slate-300"> / {coupon.usage_limit}</span>
                      ) : (
                        <span className="text-slate-300"> / ∞</span>
                      )}
                    </span>
                  </TableCell>

                  {/* Expiry */}
                  <TableCell className="hidden lg:table-cell">
                    <div className="flex items-center gap-1.5 text-[12px] text-slate-500">
                      <CalendarClock size={12} className={isExpired(coupon.expiry_date) ? "text-rose-400" : "text-slate-300"} />
                      <span className={isExpired(coupon.expiry_date) ? "text-rose-400" : ""}>
                        {new Date(coupon.expiry_date).toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  </TableCell>

                  {/* Status badge */}
                  <TableCell>
                    <StatusBadge coupon={coupon} />
                  </TableCell>

                  {/* Toggle */}
                  <TableCell>
                    <Switch
                      checked={coupon.is_active}
                      onCheckedChange={() => handleToggle(coupon)}
                      disabled={isExpired(coupon.expiry_date)}
                      className="data-[state=checked]:bg-emerald-500"
                    />
                  </TableCell>

                  {/* Actions */}
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg">
                          <MoreHorizontal size={14} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-xl text-[12px] w-40">
                        <DropdownMenuItem
                          onClick={() => handleToggle(coupon)}
                          disabled={isExpired(coupon.expiry_date)}
                          className="gap-2"
                        >
                          {coupon.is_active ? <ShieldAlert size={13} className="text-amber-500" /> : <ShieldAlert size={13} className="text-emerald-500" />}
                          {coupon.is_active ? "Deactivate" : "Activate"}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => { setDeleteTarget(coupon); setDeleteConfirmText(""); }}
                          className="gap-2 text-rose-500 focus:text-rose-600 focus:bg-rose-50"
                        >
                          <Trash2 size={13} /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>

                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* ── Delete Confirm Dialog ── */}
      <Dialog open={!!deleteTarget} onOpenChange={(o) => { if (!o) { setDeleteTarget(null); setDeleteConfirmText(""); } }}>
        <DialogContent className="max-w-sm rounded-2xl">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-9 h-9 rounded-xl bg-rose-50 flex items-center justify-center">
                <ShieldAlert size={16} className="text-rose-500" />
              </div>
              <DialogTitle className="text-[15px] font-semibold text-slate-800">Delete Coupon</DialogTitle>
            </div>
          </DialogHeader>

          <p className="text-[12px] text-slate-500 leading-relaxed">
            This will permanently delete coupon{" "}
            <span className="font-mono font-semibold text-slate-800">{deleteTarget?.code}</span>.
            Type <span className="font-semibold text-rose-500">{deleteTarget?.code}</span> to confirm.
          </p>

          <Input
            value={deleteConfirmText}
            onChange={(e) => setDeleteConfirmText(e.target.value.toUpperCase())}
            placeholder={deleteTarget?.code}
            className="rounded-xl text-[13px] font-mono uppercase"
          />

          <div className="flex gap-2 pt-1">
            <DialogClose asChild>
              <Button variant="outline" className="flex-1 rounded-xl text-[12px]">Cancel</Button>
            </DialogClose>
            <Button
              variant="destructive"
              disabled={deleteConfirmText !== deleteTarget?.code}
              onClick={handleDelete}
              className="flex-1 rounded-xl text-[12px]"
            >
              <Trash2 size={13} className="mr-1" /> Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
