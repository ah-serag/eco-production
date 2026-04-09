"use client";

import { useSelector, useDispatch } from "react-redux";
import { Link, useRouter } from "@/i18n/navigation";
import { useState, useEffect } from "react";
import { 
  removeFromCart, 
  updateQuantity, 
  prepareCartCheckout 
} from "../../../../redux/features/cartSlice/cartSlice";
import { 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  ShoppingBag,
  ArrowLeft,
  AlertCircle
} from "lucide-react";
import { useTranslations, useLocale } from "next-intl";

interface CartItem {
  id: number;
  image: string;
  price: string | number;
  quantity: number;
  title: string;
  sku?: string;
  stock: number;
}

interface RootState {
  cart: {
    cartItems: CartItem[];
  };
}

export default function CartPage() {
  const t = useTranslations("cart");
  const locale = useLocale();
  const isAr = locale === "ar";
  
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
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6 antialiased" dir={isAr ? "rtl" : "ltr"}>
        <div className="bg-slate-50 p-8 rounded-full mb-6">
          <ShoppingBag size={40} className="text-slate-200" />
        </div>
        <h2 className="text-[14px] font-normal text-slate-800 mb-2 tracking-tight">{t("empty_cart")}</h2>
        <Link href="/" className="text-chart-1 text-[11px] font-normal uppercase tracking-widest hover:underline">
          {t("explore_products")}
        </Link>
      </div>
    );

  return (
    <div className="bg-[#FCFCFC] min-h-screen pb-20 antialiased" dir={isAr ? "rtl" : "ltr"}>
      <div className="max-w-5xl mx-auto px-4 pt-10">
        
        {/* Header */}
        <div className={`mb-5 ${isAr ? "text-right" : "text-left"}`}>
          <Link href="/" className="inline-flex items-center text-slate-400 hover:text-slate-600 transition-colors text-[10px] font-normal uppercase tracking-[0.15em] mb-3 gap-1.5">
            {isAr ? <ArrowRight size={12} /> : <ArrowLeft size={12} />} {t("back_to_shop")}
          </Link>
          <div className="flex items-baseline gap-3">
            <h1 className={` font-semibold text-xl tracking-tight uppercase text-slate-800`}>{t("your_cart")}</h1>
            <span className="text-slate-400 text-[10px] font-normal uppercase tracking-widest">{cart.length} {t("items")}</span>
          </div>
        </div>

        <hr className="border-slate-100" />

        <div className="grid grid-cols-1 mt-5 lg:grid-cols-12 gap-10 items-start">
          
          {/* LEFT: PRODUCTS LIST */}
          <div className="lg:col-span-7 bg-white  space-y-6">
            {cart.map((item: CartItem) => {
              const isMax = item.quantity >= item.stock;

              return (
                <div key={item.id} className="flex gap-4 pb-6 border-b  border-slate-100 last:border-0 items-center">
                  <div className="w-16 h-16 bg-white rounded-lg overflow-hidden shrink-0 border border-slate-100 p-1.5">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className={`flex-1 min-w-0 ${isAr ? "text-right" : "text-left"}`}>
                    <div className="flex justify-between items-start mb-0.5">
                      <h3 className={`${isAr ? "text-[14px]" : "text-[13px]"} font-normal text-slate-800 truncate pe-4`}>
                        {item.title}
                      </h3>
                      <button 
                        onClick={() => handleRemove(item.id)}
                        className="text-slate-300 hover:text-rose-400 transition-colors shrink-0"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                    
                    <div className="flex flex-col gap-1 mt-3">
                      <div className="flex items-center justify-between">
                        {/* Quantity Controls - Fixed LTR for counter logic */}
                        <div className="flex items-center border border-slate-100 rounded-md px-1 py-0.5 scale-90 origin-start" dir="ltr">
                          <button 
                            onClick={() => handleQtyChange(item.id, item.quantity - 1, item.stock)} 
                            className="p-1 text-slate-400 hover:text-slate-900 transition-opacity disabled:opacity-20"
                            disabled={item.quantity <= 1}
                          >
                            <Minus size={10} />
                          </button>
                          
                          <span className="w-6 text-center text-[11px] font-normal text-slate-800">
                            {item.quantity}
                          </span>

                          <button 
                            onClick={() => handleQtyChange(item.id, item.quantity + 1, item.stock)} 
                            className="p-1 text-slate-400 hover:text-slate-900 transition-opacity disabled:opacity-20"
                            disabled={isMax}
                          >
                            <Plus size={10} />
                          </button>
                        </div>

                        <p className={`${isAr ? "text-[14px]" : "text-[13px]"} font-semibold text-slate-900`} dir="ltr">
                          {Math.trunc(Number(item.price) * item.quantity).toLocaleString('en-US', { maximumFractionDigits: 0 })} {t("currency")}
                        </p>
                      </div>

                      {isMax && (
                        <span className="text-[9px] text-rose-500 font-normal uppercase tracking-tighter flex items-center gap-1 animate-pulse">
                          <AlertCircle size={10} /> {t("max_reached")} ({item.stock})
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
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
              <h2 className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-6 text-center">{t("summary")}</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] text-slate-500 font-medium uppercase tracking-widest">{t("subtotal")}</span>
                  <span className="text-[12px] font-semibold text-slate-900" dir="ltr">
                    {Math.trunc(subtotal).toLocaleString('en-US', { maximumFractionDigits: 0 })} {t("currency")}
                  </span>
                </div>

                <div className="h-px bg-slate-100 my-2" />

                <div className="flex justify-between items-center pt-1">
                  <span className="text-[11px] font-semibold text-slate-900 uppercase tracking-widest">{t("total")}</span>
                  <span className="text-[20px] font-semibold text-slate-900 tracking-tight" dir="ltr">
                    {Math.trunc(subtotal).toLocaleString('en-US', { maximumFractionDigits: 0 })}
                    <span className="text-[12px] font-normal text-slate-400 ms-1">{t("currency")}</span>
                  </span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full h-11 rounded-xl text-[10px] font-semibold tracking-widest bg-neutral-900 hover:bg-neutral-700 text-white transition-colors flex items-center justify-center gap-2 uppercase"
              >
                {t("checkout")}
                {isAr ? <ArrowLeft size={13} /> : <ArrowRight size={13} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}