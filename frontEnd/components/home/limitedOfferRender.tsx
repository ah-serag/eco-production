"use client";

import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
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
    <section className="w-full bg-transparent rounded-[2.5rem] border-b border-gray-100 overflow-hidden my-6">
      
      {/* ===== Header المتناسق والمصغر ===== */}
      {info?.title && (
        <div className="pt-6 px-8 flex flex-col gap-0.5">
          <h2 className="text-[14px] md:text-[20px] font-semibold text-gray-900 tracking-tight">
            {info.title}
          </h2>
          {info.subtitle && (
            <span className="text-[8px] md:text-[9px]  font-medium uppercase tracking-[0.3em] mt-1">
              {info.subtitle}
            </span>
          )}
        </div>
      )}

      {/* Banners Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5 md:p-8">
        {banners.map((banner, index) => {
          const time = timeLeft[index];
          const isExpired = time === "Expired";

          return (
            <Link 
              key={index} 
              href={banner.link_url || "#"} 
              className="group relative block aspect-[16/9] w-full overflow-hidden rounded-[2rem] bg-gray-50"
            >
              {/* Image with Ultra-Smooth Zoom */}
              <img
                src={banner.image_url}
                alt="Limited Offer"
                className="w-full h-full object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-105"
              />

              {/* Overlay ناعم جداً */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

              {/* العداد التنازلي - Glassmorphism Style */}
              {!isExpired && time && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="flex gap-2 md:gap-3 px-4 py-3 rounded-3xl backdrop-blur-md bg-white/5 border border-white/10">
                    {[
                      { label: "D", val: time.d },
                      { label: "H", val: time.h },
                      { label: "M", val: time.m },
                      { label: "S", val: time.s },
                    ].map((unit, i) => (
                      <div key={i} className="flex flex-col items-center min-w-[35px] md:min-w-[45px]">
                        <span className="text-xl md:text-2xl font-bold text-white tracking-tighter leading-none">
                          {unit.val.toString().padStart(2, "0")}
                        </span>
                        <span className="text-[7px] md:text-[8px] font-bold text-white/50 uppercase tracking-widest mt-1">
                          {unit.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Status Indicator - Top Left */}
              <div className="absolute top-5 left-5 flex items-center gap-2 bg-black/20 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
                </span>
                <span className="text-[8px] font-bold text-white uppercase tracking-[0.15em]">
                  Live Offer
                </span>
              </div>

              {/* SHOP NOW Button - Minimalist */}
              <div className="absolute bottom-5 right-5 flex items-center gap-2 bg-white text-black pl-4 pr-3 py-2 rounded-full font-bold text-[9px] tracking-widest transition-all duration-300 group-hover:bg-black group-hover:text-white group-active:scale-95">
                SHOP NOW
                <div className="bg-gray-100 group-hover:bg-white/20 w-5 h-5 rounded-full flex items-center justify-center transition-colors">
                  <ArrowRight size={10} className="group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>

              {/* Expired Mask */}
              {isExpired && (
                <div className="absolute inset-0 z-40 bg-black/40 backdrop-blur-md rounded-[2.5rem]  flex items-center justify-center">
                  <span className="bg-white/10 border border-white/20 px-5 py-2 text-white font-bold text-[10px] uppercase tracking-[0.3em] rounded-full">
                    Offer Ended
                  </span>
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </section>
  );
}