"use client";

import { Link } from "@/i18n/navigation";
import { useLocale } from "next-intl";

interface Product {
  id: number;
  title: string;
  title_ar?: string;
  image_url: string;
  slug: string;
  price: number;
  discount_price?: number;
}

export default function ProductCardHome({ product }: { product: Product }) {
  const locale = useLocale();
  const isAr = locale === "ar";
  const slug = product?.slug;
  const label = isAr && product.title_ar ? product.title_ar : product.title;

  const hasDiscount = product.discount_price && product.discount_price < product.price;

  return (
    <Link
      href={`/product/${slug}`}
      className="block group"
    >
      {/* Image */}
      <div className="w-[100px] md:w-[130px] aspect-square flex items-center justify-center overflow-hidden transition-transform duration-500 ease-in-out group-hover:scale-105">
        <img
          src={product.image_url}
          alt={label}
          className="max-w-full max-h-full object-contain"
        />
      </div>

      {/* Info */}
      <div className="mt-2 w-[100px] md:w-[130px] flex flex-col gap-0.5" dir={isAr ? "rtl" : "ltr"}>
        <p className="text-[10px] md:text-[11px] text-gray-600 font-normal leading-tight line-clamp-2 text-start">
          {label}
        </p>

        <div className="flex items-center gap-1.5 flex-wrap">
          {hasDiscount ? (
            <>
              <span className="text-[11px] md:text-[12px] font-semibold text-gray-900">
                {product.discount_price?.toLocaleString()} EGP
              </span>
              <span className="text-[9px] md:text-[10px] text-slate-400 line-through">
                {product.price.toLocaleString()}
              </span>
            </>
          ) : (
            <span className="text-[11px] md:text-[12px] font-semibold text-gray-900">
              {product.discount_price?.toLocaleString()} EGP
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}