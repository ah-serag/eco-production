"use client";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Star, ArrowUpRight, Check, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react"; 
import { cn } from "@/lib/utils";
import { useDispatch } from "react-redux"; 
import { addToCart } from "../../redux/features/cartSlice/cartSlice"; 
import { Link } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";

interface Product {
  id: number;
  title: string;
  title_ar?: string;
  price: number;
  discount_price?: number;
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

  if (!product) return null;

  const displayTitle = isAr ? (product.title_ar || product.title) : product.title;
  const displayDescription = isAr ? (product.description_ar || product.description) : product.description;

  const discountPercent =
    product.discount_price && product.discount_price < product.price
      ? Math.round(((product.price - product.discount_price) / product.price) * 100)
      : 0;

  const rating = Number(product.rating) || 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
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
      className="group relative flex flex-col h-full w-full rounded-md overflow-hidden border border-neutral-100 hover:shadow-md transition-all duration-300 p-1.5 md:p-2 bg-white"
    >
      {discountPercent > 0 && (
        <div className={cn(
          "absolute top-2 z-10 px-2 py-0.5  text-[8px] text-gray-600  sm:text-[12px] rounded-2xl font-normal tracking-tighter bg-transparent  ",
          isAr ? "right-1" : "left-1"
        )}>
          {discountPercent}% {isAr ? "خصم" : "OFF"}
        </div>
      )}

      <Link href={`/product/${slug}`} className="block">
        <div className="relative w-full aspect-square md:aspect-4/3 flex items-center justify-center rounded-sm overflow-hidden mb-1">
          <img
            src={product.image_url || "/placeholder-image.png"} 
            alt={displayTitle}
            className="max-h-[85%] max-w-[85%] object-contain transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      </Link>

      <CardContent className="flex flex-col flex-1 px-1 md:px-1.5 py-0 text-start">
        <Link href={`/product/${slug}`}>
          <CardTitle className="text-[11px] md:text-sm font-normal truncate text-neutral-900">
            {displayTitle}
          </CardTitle>
        </Link>
          
          {/* block rating products  */}
        {/* <div className="flex items-center gap-0.5 mt-0.5">
           <Star size={10} className="fill-neutral-900 text-neutral-900" />
           <span className="text-neutral-400 text-[9px] md:text-[10px] font-normal">{rating.toFixed(1)}</span>
        </div> */}

        <Link href={`/product/${slug}`}>
          <p className="text-neutral-500 text-[9px] md:text-[12px] line-clamp-3 mt-1 leading-snug underline underline-offset-2 md:underline-offset-[3px] decoration-neutral-100 font-normal">
            {displayDescription}
          </p>
        </Link>

        <div className="mt-auto pt-2 md:pt-3 mb-1.5 md:mb-2">
          {discountPercent > 0 ? (
            <div className="flex flex-col gap-0.5">
              <div className="flex items-baseline gap-1.5">
                <span className="text-primary font-semibold text-[15px] md:text-base">
                  {product.discount_price} {t("currency")}
                </span>
                <span className="text-gray-500 line-through text-[9px] md:text-[11px]  font-semibold">
                  {product.price} {t("currency")}
                </span>
              </div>
            </div>
          ) : (
            <span className="text-neutral-900 font-semibold text-[12px] md:text-base">
              {product.price} {t("currency")}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between pt-1.5 md:pt-2 border-t border-neutral-50">
          <Button 
            variant="outline"
            size="sm"
            disabled={isAdded} 
            className={cn(
              "h-6 md:h-7 px-2 md:px-3 border-neutral-200 transition-all text-gray-500 duration-300",
              "text-[8px] md:text-[9px] font-normal uppercase tracking-tight rounded-full flex items-center gap-0.5 md:gap-1",
              isAr ? "flex-row-reverse" : "",
              isAdded ? "bg-green-500 border-green-500 text-white" : " hover:text-green-500 "
            )}
            onClick={handleAddToCart}
          >
            {isAdded ? (
              <Check size={10} strokeWidth={2} />
            ) : (
              <ShoppingCart size={9} strokeWidth={2} />
            )}
          </Button>

          <Link 
            href={`/product/${slug}`}
            className={cn(
                "group/btn flex items-center gap-0.5 text-[8px] md:text-[10px] font-normal uppercase  text-gray-600 hover:text-secondary",
                isAr ? "flex-row-reverse" : ""
            )}
          >
            <span>{isAr ? "التفاصيل" : "Details"}</span>
            <ArrowUpRight size={10} className={isAr ? "-rotate-90" : ""} />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}