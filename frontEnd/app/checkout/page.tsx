"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, CreditCard, MapPin, User, ShoppingBag } from "lucide-react";
import { useCheckoutMutation } from "@/redux/features/paybom/paybomSlice";
import {
  checkoutSchema,
  type CheckoutFormData,
} from "@/lib/checkout.schema";

export default function CheckoutPage() {
  // Get cart items from Redux

  const checkoutItems = useSelector((state: any) => state.cart.checkoutItems);

  const [checkout, { isLoading }] = useCheckoutMutation();

  const [form, setForm] = useState<CheckoutFormData>({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    city: "",
    state: "",
    street: "",
    building: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CheckoutFormData, string>>>({});

  const totalPrice = checkoutItems.reduce(
    (acc: number, item: any) => acc + Number(item.price) * item.quantity,
    0
  );

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name as keyof CheckoutFormData]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[e.target.name as keyof CheckoutFormData];
        return copy;
      });
    }
  }

  async function handleCheckout() {
    if (checkoutItems.length === 0) {
      alert("سلة المشتريات فارغة!");
      return;
    }

    const result = checkoutSchema.safeParse(form);

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof CheckoutFormData, string>> = {};
      result.error?.issues.forEach((err: any) => {
        const field = err.path[0] as keyof CheckoutFormData;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});

    try {
      // Prepare items array for API
      const itemsPayload = checkoutItems.map((item: any) => ({
        id: item.id,
        quantity: item.quantity,
      }));

      // Send payload to backend
      const res = await checkout({
        items: itemsPayload,     
        billingData: result.data,
      }).unwrap();

      window.location.href = res.iframeUrl;
    } catch (err) {
      console.error("Checkout Error:", err);
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10 px-4 antialiased">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* LEFT — FULL FORM */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Contact Information */}
          <Card className="rounded-2xl border border-slate-100 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-md font-medium text-slate-800">
                <User size={16} className="text-slate-400" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-[11px] uppercase tracking-wider text-slate-500">First Name</Label>
                  <Input name="first_name" value={form.first_name} onChange={handleChange} className="h-10 text-sm" placeholder="Ahmed" />
                  {errors.first_name && <p className="text-[10px] text-red-500">{errors.first_name}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[11px] uppercase tracking-wider text-slate-500">Last Name</Label>
                  <Input name="last_name" value={form.last_name} onChange={handleChange} className="h-10 text-sm" placeholder="Serag" />
                  {errors.last_name && <p className="text-[10px] text-red-500">{errors.last_name}</p>}
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-[11px] uppercase tracking-wider text-slate-500">Email Address</Label>
                <Input name="email" value={form.email} onChange={handleChange} className="h-10 text-sm" placeholder="you@email.com" />
                {errors.email && <p className="text-[10px] text-red-500">{errors.email}</p>}
              </div>
              <div className="space-y-1.5">
                <Label className="text-[11px] uppercase tracking-wider text-slate-500">Phone Number</Label>
                <Input name="phone_number" value={form.phone_number} onChange={handleChange} className="h-10 text-sm" placeholder="01000000000" />
                {errors.phone_number && <p className="text-[10px] text-red-500">{errors.phone_number}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <Card className="rounded-2xl border border-slate-100 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-md font-medium text-slate-800">
                <MapPin size={16} className="text-slate-400" />
                Shipping Address
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-[11px] uppercase tracking-wider text-slate-500">City</Label>
                  <Input name="city" value={form.city} onChange={handleChange} className="h-10 text-sm" placeholder="Cairo" />
                  {errors.city && <p className="text-[10px] text-red-500">{errors.city}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[11px] uppercase tracking-wider text-slate-500">State / Governorate</Label>
                  <Input name="state" value={form.state} onChange={handleChange} className="h-10 text-sm" placeholder="Cairo" />
                  {errors.state && <p className="text-[10px] text-red-500">{errors.state}</p>}
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-[11px] uppercase tracking-wider text-slate-500">Street Address</Label>
                <Input name="street" value={form.street} onChange={handleChange} className="h-10 text-sm" placeholder="Street name" />
                {errors.street && <p className="text-[10px] text-red-500">{errors.street}</p>}
              </div>
              <div className="space-y-1.5">
                <Label className="text-[11px] uppercase tracking-wider text-slate-500">Building / Apartment</Label>
                <Input name="building" value={form.building} onChange={handleChange} className="h-10 text-sm" placeholder="Building, apartment..." />
                {errors.building && <p className="text-[10px] text-red-500">{errors.building}</p>}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT SUMMARY */}
        <div className="lg:col-span-5 ">
          <Card className="rounded-2xl border border-slate-100 shadow-sm sticky top-6 overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100">
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-500">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              
              <div className="max-h-[350px] overflow-y-auto space-y-4 pr-2  pt-2 custom-scrollbar">
                {checkoutItems.length > 0 ? (
                  checkoutItems.map((item: any) => (
                    <div key={item.id} className="flex gap-4 items-center">
                      <div className="relative w-14 h-14 shrink-0 bg-white border border-slate-100 rounded-lg p-1">
                        <img src={item.image} alt={item.title} className="w-full h-full object-contain" />
                        <span className="absolute -top-2 -right-2 w-5 h-5 bg-slate-200 text-slate-600  text-[10px] flex items-center justify-center rounded-full font-bold">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-[13px] font-medium text-slate-800 truncate">{item.title}</h3>
                        <p className="text-[11px] text-slate-400 font-semibold mt-0.5">${(Number(item.price) * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-slate-400">
                    <ShoppingBag className="mx-auto mb-2 opacity-20" size={32} />
                    <p className="text-xs">No products selected</p>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-3">
                <div className="flex justify-between text-xs text-slate-500 uppercase tracking-tighter">
                  <span>Subtotal</span>
                  <span className="font-medium text-slate-900">${totalPrice.toFixed(2)}</span>
                </div>
         
                <div className="flex justify-between items-center pt-2 border-t border-slate-50">
                  <span className="text-sm font-semibold text-slate-900 uppercase">Total</span>
                  <span className="text-xl font-semibold text-slate-900 tracking-tighter">${totalPrice.toFixed(2)}</span>
                </div>
              </div>

              <Button
                onClick={handleCheckout}
                disabled={isLoading || checkoutItems.length === 0}
                className="w-full h-12 rounded-xl font-bold bg-chart-1 hover:brightness-110 text-white shadow-lg shadow-chart-1/20 transition-all  text-[12px] tracking-widest gap-2"
              >
                {isLoading ? (
                  <><Loader2 className="animate-spin mr-2" size={18} /> Processing...</>
                ) : (
                  <><CreditCard size={18} className="mr-2" /> Pay now</>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}