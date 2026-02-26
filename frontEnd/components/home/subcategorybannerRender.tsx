"use client";

import { useEffect, useState } from "react";
import ProductCard from "../public/productCard";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

import {
  useGetProductsBySubcategoryQuery,
} from "../../redux/features/home/homeclientslice";

interface Product {
  id: number;
  title: string;
  price: number;
  discount_price?: number;
  description?: string;
  image_url: string;
  rating?: number;
  qty?: number;
}

export default function SubcategoryBannerRender({ section }: any) {
  const subcategoryId = section?.content[0]?.subcategory_id;
  const bannerImage = section?.content[0]?.image_url;
  const isImageRight = section?.content?.direct_image === true;
  const info = section?.info;

  const [page, setPage] = useState(1);
  const [products, setProducts] = useState<Product[]>([]);

  const { data, isFetching } = useGetProductsBySubcategoryQuery(
    {
      subcategoryId,
      page,
      limit: 6,
    },
    {
      skip: !subcategoryId,
    }
  );

  useEffect(() => {
    if (data?.data) {
      setProducts((prev) =>
        page === 1 ? data.data : [...prev, ...data.data]
      );
    }
  }, [data, page]);

  if (!subcategoryId) return null;

  const hasMore = data?.pagination?.page < data?.pagination?.totalPages;

  return (
    <section className="w-full bg-white border-y rounded-3xl border-gray-100 overflow-hidden my-12">
      
      {/* ===== Minimal Header الموحد والمعدل ===== */}
      {info?.title && (
        <div className="py-6 px-6 flex items-baseline gap-3 bg-white">
          <h2 className="text-xl md:text-2xl font-medium text-gray-900 tracking-tight">
            {info.title}
          </h2>

          {info.subtitle && (
            <div className="flex items-center gap-3 text-gray-400">
              <span className="text-gray-200">|</span>
              <span className="text-xs md:text-sm font-normal uppercase tracking-[0.2em]">
                {info.subtitle}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-stretch">
        
        {/* Banner Section */}
        {bannerImage && (
          <div
            className={`
              lg:col-span-4 relative w-full min-h-[350px] lg:min-h-full
              overflow-hidden group px-6 py-3 
              ${isImageRight ? "lg:order-2" : "lg:order-1"}
            `}
          >
            <img
              src={bannerImage}
              alt="Promotion Banner"
              className="w-full h-full object-cover  rounded-md transition-transform duration-1000 group-hover:scale-105"
            />
          </div>
        )}

        {/* Products Scroll Area */}
        <div
          className={`
            lg:col-span-8 w-full bg-white flex items-center
            ${isImageRight ? "lg:order-1" : "lg:order-2"}
          `}
        >
          <ScrollArea className="w-full">
            <div className="flex gap-4 md:gap-6 p-8 w-max">
              {products.map((product : any, index) => (
                <div 
                  key={index} 
                  className="w-[190px] md:w-[230px] shrink-0 transition-opacity duration-300"
                >
                  <ProductCard product={product} />
                </div>
              ))}

              {/* Load More Trigger - بشكل أبسط */}
              {hasMore && (
                <div className="flex items-center justify-center px-10">
                  <Button
                    variant="ghost"
                    disabled={isFetching}
                    onClick={() => setPage((prev) => prev + 1)}
                    className="group flex flex-col items-center gap-3 h-auto py-12 px-6 rounded-3xl hover:bg-gray-50 transition-all border border-dashed border-gray-100"
                  >
                    <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-white transition-transform group-hover:scale-110">
                      {isFetching ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <ChevronRight className="w-5 h-5" />
                      )}
                    </div>
                    <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-400">
                      View More
                    </span>
                  </Button>
                </div>
              )}
            </div>
            <ScrollBar orientation="horizontal" className="h-1.5" />
          </ScrollArea>
        </div>
      </div>
    </section>
  );
}