"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useLocale } from "next-intl";

export default function CategorySection({ section }: any) {
  const locale     = useLocale();
  const isAr       = locale === "ar";
  const categories = (section?.content ?? []).filter((cat: any) => cat?.category_id);
  const info       = section?.info;

  if (categories.length === 0) return null;

  const sectionTitle    = isAr ? info?.title_ar    : info?.title;
  const sectionSubtitle = isAr ? info?.subtitle_ar : info?.subtitle;

  const isOdd      = categories.length % 2 !== 0;

  return (
    <section className="my-2" dir={isAr ? "rtl" : "ltr"}>

      {sectionTitle && (
        <div className="mb-4 flex px-4 flex-col gap-1">
          <h2 className="font-normal text-gray-900 text-lg md:text-xl uppercase tracking-tight">
            {sectionTitle}
          </h2>
          {sectionSubtitle && (
            <span className="font-normal uppercase text-slate-400 text-[10px] tracking-[0.2em]">
              {sectionSubtitle}
            </span>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-0.5 px-4">
        {categories.map((cat: any, index: number) => {
          const label      = isAr ? cat.name_ar : cat.name;
          const isLastOdd  = isOdd && index === categories.length - 1;

          return (
            <Link
              key={index}
              href={`/products/${cat.category_id}`}
              className={`group/card relative block overflow-hidden bg-slate-100 active:scale-[0.99] transition-transform duration-200
                ${isLastOdd ? "sm:col-span-2 aspect-16/7" : "aspect-4/5"}`}
            >
              {cat.image_url ? (
                <Image
                  src={cat.image_url}
                  alt={label || "category"}
                  fill
                  sizes={isLastOdd ? "100vw" : "(max-width: 640px) 100vw, 50vw"}
                  className="object-cover transition-transform duration-500 group-hover/card:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[9px] text-slate-300 uppercase tracking-widest">
                  N/A
                </div>
              )}

              <div className="absolute inset-0 bg-linear-to-t from-black/65 via-black/10 to-transparent" />

              <div className="absolute bottom-0 inset-x-0 px-4 pb-4">
                <p className={`text-white font-semibold text-center leading-tight drop-shadow tracking-wide truncate
                  ${isLastOdd ? "text-base" : "text-sm"}`}>
                  {label}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
