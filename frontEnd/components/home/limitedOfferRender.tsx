"use client";

import { useState, useEffect } from "react";
import { Flame, ArrowRight } from "lucide-react";
import Link from "next/link";

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
  const [timeLeft, setTimeLeft] = useState<{ [key: number]: any }>({});
  const info = section?.info;
  const banners: LimitedOfferBanner[] = section?.content || [];

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
    <section className="w-full bg-white rounded-3xl    border-gray-50 overflow-hidden">
      {/* ===== Slim Header الموحد ===== */}
        {info?.title && (
        <div className="py-6 px-6 flex items-baseline gap-3 bg-white">
          <h2 className="text-xl md:text-2xl font-medium text-gray-900 tracking-tight">
            {info.title}
          </h2>
          
          {info.subtitle && (
            <div className="flex items-center gap-3 text-gray-400 border-l border-gray-200 pl-3">
              <span className="text-xs md:text-sm font-normal uppercase tracking-[0.2em]">
                {info.subtitle}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Banners Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 md:p-6">
        {banners.map((banner, index) => {
          const time = timeLeft[index];
          const isExpired = time === "Expired";

          return (
            <Link 
              key={index} 
              href={banner.link_url || "#"} 
              className="group relative block aspect-video w-full overflow-hidden rounded-3xl "
            >
              {/* Image with Zoom effect */}
              <img
                src={banner.image_url}
                alt="Limited Offer"
                className="w-full h-full object-cover opacity-90 transition-transform duration-1000 ease-out group-hover:scale-110 group-hover:opacity-100"
              />

              {/* Gradient Overlay - Darker for readability */}
              <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent" />

              {/* العداد التنازلي المطور - Floating Minimal Cards */}
              {!isExpired && time && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-3 md:gap-4 z-20">
                  {[
                    { label: "Days", val: time.d },
                    { label: "Hrs", val: time.h },
                    { label: "Min", val: time.m },
                    { label: "Sec", val: time.s },
                  ].map((unit, i) => (
                    <div key={i} className="flex flex-col items-center">
                      <div className="w-12 h-14 md:w-16 md:h-20  backdrop-blur-xl border rounded-3xl flex items-center justify-center shadow-2xl">
                        <span className="text-2xl md:text-4xl font-black text-white tracking-tighter">
                          {unit.val.toString().padStart(2, "0")}
                        </span>
                      </div>
                      <span className="mt-2 text-[10px] font-bold text-white/60 uppercase tracking-widest">
                        {unit.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* CTA Label - Bottom Right */}
              <div className="absolute bottom-6 right-6 z-30 flex items-center gap-2 bg-white text-black px-4 py-2 rounded-full font-bold text-xs tracking-tighter transition-all group-hover:bg-chart-1 group-hover:text-white">
                SHOP NOW
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>

              {/* Expired State */}
              {isExpired && (
                <div className="absolute inset-0 z-40 bg-black/60 rounded-3xl backdrop-blur-sm flex items-center justify-center">
                  <span className="border-2 border-white/40 px-6 py-2 text-white font-black text-sm uppercase tracking-[0.3em]">
                    Offer Ended
                  </span>
                </div>
              )}

              {/* Live Status Indicator */}
              <div className="absolute top-6 left-6 z-30 flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-chart-1 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-chart-1"></span>
                </span>
                <span className="text-[10px] font-black text-white uppercase tracking-widest shadow-sm">
                  Limited Drop
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}