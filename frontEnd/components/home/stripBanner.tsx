"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface StripBannerProps {
  section: {
    info: {
     strip_images: string[]; 
    };
  };
}

export default function StripBannerRender({ section }: StripBannerProps) {
  const [current, setCurrent] = useState(0);
  const banners = section.info.strip_images ?? [];
  const length = banners.length;
  console.log(banners)

  useEffect(() => {
    if (length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === length - 1 ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(timer);
  }, [length]);

  if (!banners || length === 0) return null;

  return (
    <section className=" w-full py-4 ">
      <div className="relative w-full  aspect-4/1 overflow-hidden  bg-white ">
        
        {banners.map((url, index) => (
            
          <div
            key={index}
            className={cn(
              "absolute inset-0 transition-all  duration-1000 ease-in-out",
              index === current 
                ? "opacity-100 translate-x-0" 
                : "opacity-0 translate-x-4"
            )}
          >
            <Image
              src={url}
              alt={`Info Strip ${index + 1}`}
              fill
              priority={index === 0}
              className="object-cover  "
              sizes="(max-w-1400px) 100vw, 1400px"
            />
          </div>
        ))}

        {/* مؤشرات نحيفة جداً - تظهر فقط لو وجد أكثر من صورة */}
        {length > 1 && (
          <div className="absolute bottom-1 right-4 z-20 flex gap-1">
            {banners.map((_, index) => (
              <div
                key={index}
                className={cn(
                  "h-0.5 transition-all duration-500 rounded-full",
                  index === current ? "w-4 bg-white" : "w-1 bg-slate-400"
                )}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}