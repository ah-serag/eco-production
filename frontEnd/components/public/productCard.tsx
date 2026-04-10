"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Check, ShoppingCart } from "lucide-react";
import { useState } from "react"; 
import { cn } from "@/lib/utils";
import { useDispatch, useSelector } from "react-redux"; 
import { addToCart } from "../../redux/features/cartSlice/cartSlice"; 
import { Link } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";

interface Product {
  id: number;
  title: string;
  title_ar?: string;
  price: number;
  discount_price: number;
  description?: string;
  description_ar?: string;
  image_url: string;
  stock : number ;
  slug: string;
  rating?: number;
}

export default function ProductCard({ product }: { product: Product }) {
  const [isAdded, setIsAdded] = useState(false);
  const dispatch = useDispatch(); 
  const locale = useLocale();
  const t = useTranslations("cart");
  const isAr = locale === "ar";

  const cartItems = useSelector((state: any) => state.cart.cartItems);
  const currentItemInCart = cartItems.find((item: any) => item.id === product.id);
  const quantityInCart = currentItemInCart ? currentItemInCart.quantity : 0;

  const isOutOfStock = product.stock <= 0;
  const isLimitReached = quantityInCart >= product.stock;

  if (!product) return null;

  const displayTitle = isAr ? (product.title_ar || product.title) : product.title;
  const displayDescription = isAr ? (product.description_ar || product.description) : product.description;

  const activePrice = product.discount_price && product.discount_price < product.price
    ? product.discount_price
    : product.price;

  const discountPercent =
    product.discount_price && product.discount_price < product.price
      ? Math.round(((product.price - product.discount_price) / product.price) * 100)
      : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isLimitReached || isOutOfStock) return;

    try {
      const itemToAdd = {
        id: product.id,
        title: displayTitle,
        price: product.discount_price || product.price,
        image: product.image_url, 
        stock : product.stock ,
        quantity: 1
      };
      dispatch(addToCart(itemToAdd));
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2000);
    } catch (error) {
      console.error("Redux Cart Error:", error);
    }
  };

  const slug = product?.slug;



  return (
    <Card
      dir={isAr ? "rtl" : "ltr"}
      className="group relative gap-0 flex flex-col h-full w-full rounded-none border-0 shadow-none bg-white"
    >
      {/* Out of stock overlay */}
      {isOutOfStock && (
        <div className="absolute inset-0 bg-white/70 z-20 flex items-center justify-center">
          <span className="text-[9px] uppercase tracking-[0.2em] text-slate-400 font-medium">
            {isAr ? "نفدت الكمية" : "Out of Stock"}
          </span>
        </div>
      )}

      {/* Image */}
      <Link href={`/product/${slug}`} className="block relative">
        {discountPercent > 0 && (
          <span className={cn(
            "absolute top-2 z-10 text-[8px] font-medium text-white bg-neutral-800 px-1.5 py-0.5 tracking-wide",
            isAr ? "right-2" : "left-2"
          )}>
            -{discountPercent}%
          </span>
        )}
        <div className="w-full aspect-square flex items-center justify-center overflow-hidden bg-slate-50 p-3">
          <img
            src={product.image_url || "/placeholder-image.png"}
            alt={displayTitle}
            className="max-h-[80%] max-w-[80%] object-contain transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      </Link>

      {/* Content */}
      <CardContent
        dir={isAr ? "rtl" : "ltr"}
        className="flex flex-col flex-1 px-2 py-2 bg-white text-start"
      >
        <Link href={`/product/${slug}`}>
          <p className="text-[11px] md:text-[13px] font-medium text-neutral-800 truncate leading-snug">
            {displayTitle}
          </p>
        </Link>

        {displayDescription && (
          <Link href={`/product/${slug}`}>
            <p className="text-[9px] md:text-[10px] text-slate-400 font-normal line-clamp-1 mt-1">
              {displayDescription}
            </p>
          </Link>
        )}

        {/* Price */}
        <div className="flex items-baseline gap-1.5  pt-1">
          <span className="text-[13px] md:text-[17px] font-semibold text-neutral-900" dir="ltr">
            {Math.trunc(activePrice).toLocaleString("en-US")}
            <span className="text-[10px] font-normal text-slate-400 ms-0.5">ُEGP</span>
          </span>
          {discountPercent > 0 && (
            <span className="text-[10px] text-slate-300 line-through font-normal" dir="ltr">
              {Math.trunc(product.price).toLocaleString("en-US")}
            </span>
          )}
        </div>

        {/* Add to cart */}
        <button
          disabled={isAdded || isLimitReached || isOutOfStock}
          onClick={handleAddToCart}
          className={cn(
            "w-full mt-2 pt-2 border-t border-slate-100",
            "flex items-center gap-1.5",
            isAr ? "flex-row-reverse justify-end" : "justify-start",
            "text-[9px] md:text-[10px] uppercase tracking-[0.18em] font-medium",
            "transition-colors duration-300",
            isAdded ? "text-green-500" :
            isLimitReached ? "text-amber-400" :
            "text-slate-500 hover:text-neutral-800"
          )}
        >
          {isAdded ? (
            <><Check size={9} strokeWidth={2} /><span>{isAr ? "تمت الإضافة" : "Added"}</span></>
          ) : isLimitReached ? (
            <span>{isAr ? "الحد الأقصى" : "Limit Reached"}</span>
          ) : (
            <><ShoppingCart size={9} strokeWidth={1.5} /><span>{isAr ? "أضف للسلة" : "Add to Cart"}</span></>
          )}
        </button>

      </CardContent>
    </Card>
  );
}