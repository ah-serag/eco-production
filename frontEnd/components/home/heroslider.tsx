"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, ChevronsRight, ShoppingBag } from "lucide-react";

export default function HeroSlider({ section }: any) {
  const [current, setCurrent] = useState(0);
  const banners = section ?? [];
  const length = banners.length;

  useEffect(() => {
    if (!length) return;

    const timer = setInterval(() => {
      setCurrent((prev) => (prev === length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(timer);
  }, [length]);

  if (!Array.isArray(banners) || length === 0) return null;

  const prevSlide = () =>
    setCurrent((prev) => (prev === 0 ? length - 1 : prev - 1));

  const nextSlide = () =>
    setCurrent((prev) => (prev === length - 1 ? 0 : prev + 1));

  return (
    <section
      className="
        relative
        w-full
        aspect-2/1
        bg-neutral-900
        overflow-hidden
        rounded-3xl
      "
    >
      {banners.map((banner: any, index: number) => (
        <div
          key={index}
          className={cn(
            "absolute inset-0 transition-opacity duration-1000 ease-in-out",
            index === current ? "opacity-100 z-20" : "opacity-0 z-10"
          )}
          style={{
            backgroundImage: `url(${banner.image_url})`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            backgroundSize: "100% 100%",
          }}
        >
          <div className="absolute inset-0 bg-black/10" />

          <div className="relative h-full flex flex-col justify-end pb-8 sm:pb-20 px-6 sm:px-12 lg:px-24 text-white">
            {banner.cta_link && banner.cta_text && (
              <Button
                asChild
                variant="outline"
                className="
                  w-fit
                  flex
                  items-center
                  gap-2
                  px-6
                  sm:px-10
                  py-2
                  sm:py-7
                  text-[10px]
                  sm:text-xl
                  font-medium
                  rounded-full
                  bg-white/10
                  hover:bg-white/20
                  text-white
                  border-white/40
                  backdrop-blur-md
                  transition-all
                  shadow-2xl
                "
              >
                <a href={banner.cta_link}>
                  <ChevronsRight  className="h-4 w-4 sm:h-6 sm:w-6" />
                  {banner.cta_text}
                </a>
              </Button>
            )}
          </div>
        </div>
      ))}

      <button
        onClick={prevSlide}
        className="
          absolute left-2 sm:left-6
          top-1/2 -translate-y-1/2
          z-30
          p-1.5 sm:p-3
          rounded-full
          bg-black/5
          hover:bg-black/20
          text-white/50
          hover:text-white
          backdrop-blur-sm
          transition
        "
      >
        <ChevronLeft className="h-4 w-4 sm:h-8 sm:w-8" />
      </button>

      <button
        onClick={nextSlide}
        className="
          absolute right-2 sm:right-6
          top-1/2 -translate-y-1/2
          z-30
          p-1.5 sm:p-3
          rounded-full
          bg-black/5
          hover:bg-black/20
          text-white/50
          hover:text-white
          backdrop-blur-sm
          transition
        "
      >
        <ChevronRight className="h-4 w-4 sm:h-8 sm:w-8" />
      </button>

      <div className="absolute bottom-3 sm:bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-1.5 sm:gap-3">
        {banners.map((_: any, index: number) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={cn(
              "h-1 sm:h-1.5 transition-all duration-300 rounded-full",
              index === current
                ? "w-6 sm:w-12 bg-white"
                : "w-1.5 sm:w-3 bg-white/30 hover:bg-white/60"
            )}
          />
        ))}
      </div>
    </section>
  );
}