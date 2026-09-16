"use client";

import CategorySection from "@/components/home/categoryHomeRender";
import HeroSlider from "@/components/home/heroslider";
import ProductsHomeRender from "@/components/home/productsHomeRender";
import LimitedOfferSection from "@/components/home/limitedOfferRender";
import SubcategorybannerRender from "@/components/home/subcategorybannerRender";
import HomeLoading from "@/components/home/HomeLoding";
import { useGetHomePageQuery } from "@/redux/features/home/homeclientslice";

export default function HomeClientContent() {
  const { data, isLoading } = useGetHomePageQuery(undefined);

  if (isLoading) return <HomeLoading />;

  return (
    <div className="space-y-3 bg-white rounded-md pb-10 scroll-smooth">
      {data?.sections.map((section: any) => {
        switch (section.type) {
          case "hero":
            return <HeroSlider key={section.id} section={section.content} />;
          case "category":
            return <CategorySection key={section.id} section={section} />;
          case "product_category":
            return <ProductsHomeRender key={section.id} section={section} />;
          case "Limited_Offer":
            return <LimitedOfferSection key={section.id} section={section} />;
          case "subcategory_banner":
            return <SubcategorybannerRender key={section.id} section={section} />;
          default:
            return null;
        }
      })}
    </div>
  );
}