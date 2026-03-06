"use client";

import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { 
  removeFromCart, 
  updateQuantity, 
  prepareCartCheckout 
} from "../../../../redux/features/cartSlice/cartSlice";
import { Button } from "@/components/ui/button";
import { 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  ShoppingBag,
  ArrowLeft,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CartItem {
  id: number;
  image: string;
  price: string | number;
  quantity: number;
  title: string;
  sku?: string;
  stock: number; // تأكد من تمرير الـ stock من صفحة المنتج إلى السلة
}

interface RootState {
  cart: {
    cartItems: CartItem[];
  };
}

export default function CartPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const cart = useSelector((state: RootState) => state.cart.cartItems);

  const subtotal = cart.reduce(
    (acc: number, item: CartItem) => {
      const price = typeof item.price === "string" ? parseFloat(item.price) : item.price;
      return acc + price * (item.quantity || 1);
    },
    0
  );

  const handleRemove = (id: number) => {
    dispatch(removeFromCart(id));
  };

  // تعديل الدالة لمنع التجاوز
  const handleQtyChange = (id: number, newQty: number, stock: number) => {
    if (newQty > 0 && newQty <= stock) {
      dispatch(updateQuantity({ id, quantity: newQty }));
    }
  };

  const handleCheckout = () => {
    dispatch(prepareCartCheckout());
    router.push("/checkout");
  };

  if (!mounted) {
    return <div className="bg-[#FCFCFC] min-h-screen antialiased" />;
  }

  if (cart.length === 0)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6 antialiased">
        <div className="bg-slate-50 p-8 rounded-full mb-6">
          <ShoppingBag size={40} className="text-slate-200" />
        </div>
        <h2 className="text-sm font-medium text-slate-800 mb-2 tracking-tight">Your shopping bag is empty</h2>
        <Button asChild variant="link" className="text-chart-1 text-xs font-semibold uppercase tracking-widest">
          <Link href="/">Explore Products</Link>
        </Button>
      </div>
    );

  return (
    <div className="bg-[#FCFCFC] min-h-screen pb-20 antialiased font-sans">
      <div className="max-w-5xl mx-auto px-4 pt-10">
        
        {/* Header */}
        <div className="mb-5">
          <Link href="/" className="flex items-center text-slate-400 hover:text-slate-600 transition-colors text-[10px] font-medium uppercase tracking-[0.15em] mb-3 gap-1.5">
            <ArrowLeft size={12} /> Back to shop
          </Link>
          <div className="flex items-baseline gap-3">
            <h1 className="text-lg font-medium text-slate-900 tracking-tight">Your Cart</h1>
            <span className="text-slate-400 text-[10px] font-normal uppercase tracking-widest">{cart.length} items</span>
          </div>
        </div>

         <hr />

        <div className="grid grid-cols-1 mt-5 lg:grid-cols-12 gap-10 items-start">
          
          {/* LEFT: PRODUCTS LIST */}
          <div className="lg:col-span-7 space-y-6">
            {cart.map((item: CartItem) => {
              const isMax = item.quantity >= item.stock;

              return (
                <div key={item.id} className="flex gap-4 pb-6 border-b border-slate-200 last:border-0 items-center">
                  <div className="w-16 h-16 bg-white rounded-lg overflow-hidden shrink-0 border border-slate-100 p-1.5">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-0.5">
                      <h3 className="font-medium text-slate-800 text-[13px] truncate pr-4">
                        {item.title}
                      </h3>
                      <button 
                        onClick={() => handleRemove(item.id)}
                        className="text-slate-300 hover:text-red-400 transition-colors shrink-0"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                    
                    <div className="flex flex-col gap-1 mt-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center border border-slate-100 rounded-md px-1 py-0.5 scale-90 origin-left">
                          {/* زر الناقص */}
                          <button 
                            onClick={() => handleQtyChange(item.id, item.quantity - 1, item.stock)} 
                            className="p-1 text-slate-400 hover:text-slate-900 transition-opacity disabled:opacity-20"
                            disabled={item.quantity <= 1}
                          >
                            <Minus size={10} />
                          </button>
                          
                          <span className="w-6 text-center text-[11px] font-medium text-slate-800">
                            {item.quantity}
                          </span>

                          {/* زر الزائد - يغلق عند الوصول للمخزن */}
                          <button 
                            onClick={() => handleQtyChange(item.id, item.quantity + 1, item.stock)} 
                            className="p-1 text-slate-400 hover:text-slate-900 transition-opacity disabled:opacity-20"
                            disabled={isMax}
                          >
                            <Plus size={10} />
                          </button>
                        </div>

                        <p className="text-[13px] font-medium text-slate-900">
                          {(Number(item.price) * item.quantity).toFixed(2)} EGP
                        </p>
                      </div>

                      {/* رسالة تنبيه صغيرة عند الوصول للحد الأقصى */}
                      {isMax && (
                        <span className="text-[9px] text-rose-500 font-bold uppercase tracking-tighter flex items-center gap-1 animate-pulse">
                          <AlertCircle size={10} /> Max available reached ({item.stock})
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* RIGHT: ORDER SUMMARY */}
          <div className="lg:col-span-5 lg:sticky lg:top-10">
            <div className="bg-white border border-slate-50 rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
              <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6 text-center">Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-[11px] text-slate-500 uppercase tracking-tighter">Subtotal</span>
                  <span className="text-[12px] font-medium text-slate-900">{subtotal.toFixed(2)} EGP</span>
                </div>
         
                <div className="h-px bg-slate-50 my-2" />
                <div className="flex justify-between items-center pt-2">
                  <span className="text-xs font-medium text-slate-900 uppercase">Total</span>
                  <span className="text-xl font-semibold text-slate-900 tracking-tighter">{subtotal.toFixed(2)} EGP</span>
                </div>
              </div>

              <Button 
                onClick={handleCheckout}
                className="w-full h-11 rounded-lg text-[10px] font-bold tracking-widest bg-chart-1 hover:brightness-105 text-white border-none transition-all gap-2 uppercase"
              >
                Checkout
                <ArrowRight size={14} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}