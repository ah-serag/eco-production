"use client";

import { useState, useEffect } from "react";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { cn } from "@/lib/utils";

interface LimitedOfferBanner {
  image_url: string;
  link_url: string;
  start_at: string;
  end_at: string;
}

interface Props {
  section: any;
}

export default function LimitedOfferSection({ section }: Props) {
  const locale = useLocale();
  const isAr = locale === "ar";
  const [timeLeft, setTimeLeft] = useState<{ [key: number]: any }>({});
  const info = section?.info;
  const banners: LimitedOfferBanner[] = section?.content || [];

  const displayTitle = isAr ? info?.title_ar : info?.title;
  const displaySubtitle = isAr ? info?.subtitle_ar : info?.subtitle;

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const newTimes: { [key: number]: any } = {};

      banners.forEach((banner, index) => {
        const endTime = new Date(banner.end_at).getTime();
        const diff = endTime - now;

        if (diff > 0) {
          newTimes[index] = {
            d: Math.floor(diff / (1000 * 60 * 60 * 24)),
            h: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            m: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
            s: Math.floor((diff % (1000 * 60)) / 1000),
          };
        } else {
          newTimes[index] = "Expired";
        }
      });
      setTimeLeft(newTimes);
    }, 1000);

    return () => clearInterval(interval);
  }, [banners]);

  if (!banners.length) return null;

  return (
    <section dir={isAr ? "rtl" : "ltr"} className="w-full border-none bg-transparent my-12 text-start px-4 md:px-8">
      
      {displayTitle && (
        <div className="mb-8 flex flex-col gap-1">
          <h2 className="font-normal text-gray-900 text-lg md:text-xl tracking-tight">
            {displayTitle}
          </h2>
          {displaySubtitle && (
            <span className="font-normal uppercase text-slate-400 text-[10px] tracking-[0.2em]">
              {displaySubtitle}
            </span>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {banners.map((banner, index) => {
          const time = timeLeft[index];
          const isExpired = time === "Expired";

          return (
            <div key={index} className="flex flex-col gap-4">
              <Link 
                href={banner.link_url || "#"} 
                className="group relative block aspect-[16/8] w-full overflow-hidden rounded-2xl bg-gray-50 border border-gray-100"
              >
                <img
                  src={banner.image_url}
                  alt="Offer"
                  className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
                />

                <div className={`absolute top-4 ${isAr ? "right-4" : "left-4"} flex items-center gap-1.5 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full border border-gray-100 z-20`}>
                  <span className="relative flex h-1.5 w-1.5">
                    {!isExpired && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>}
                    <span className={cn("relative inline-flex rounded-full h-1.5 w-1.5", isExpired ? "bg-gray-400" : "bg-rose-500")}></span>
                  </span>
                  <span className="text-[8px] font-normal text-gray-600 uppercase tracking-wider">
                    {isExpired ? (isAr ? "انتهى" : "Ended") : (isAr ? "مباشر" : "Live")}
                  </span>
                </div>

                {isExpired && (
                  <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] flex items-center justify-center z-10 transition-all duration-500">
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-gray-900 text-[11px] font-normal uppercase tracking-[0.4em] border-y border-gray-900/10 py-2 px-4">
                        {isAr ? "انتهى العرض" : "Offer Ended"}
                      </span>
                    </div>
                  </div>
                )}
              </Link>

              {!isExpired && time && (
                <div className="flex items-center justify-between px-1">
                  <div className="flex gap-4" dir="ltr">
                    {[
                      { label: isAr ? "يوم" : "D", val: time.d },
                      { label: isAr ? "ساعة" : "H", val: time.h },
                      { label: isAr ? "دقيقة" : "M", val: time.m },
                      { label: isAr ? "ثانية" : "S", val: time.s },
                    ].map((unit, i) => (
                      <div key={i} className="flex flex-col items-start">
                        <span className="text-sm font-normal text-gray-900 tabular-nums">
                          {unit.val.toString().padStart(2, "0")}
                        </span>
                        <span className="text-[8px] text-gray-400 uppercase font-normal">{unit.label}</span>
                      </div>
                    ))}
                  </div>

                  <Link 
                    href={banner.link_url || "#"}
                    className="flex items-center gap-1.5 text-[10px] font-normal uppercase tracking-widest text-gray-900 hover:gap-3 transition-all underline underline-offset-4 decoration-gray-200 hover:decoration-gray-900"
                  >
                    {isAr ? "اكتشف الآن" : "Explore"}
                    {isAr ? <ArrowLeft size={12} /> : <ArrowRight size={12} />}
                  </Link>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}