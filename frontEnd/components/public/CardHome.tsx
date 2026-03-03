"use client";

import Link from "next/link";

interface Product {
  id: number;
  title: string;
  image_url: string;
  slug : string
}



export default function ProductCardHome({ product }: { product: Product }) {

  const slug = product?.slug;
   return (
    <Link 
      href={`/product/${slug}`} 
      className="block group relative overflow-visible"
    >
      <div className="w-[100px] md:w-[130px] aspect-square flex items-center justify-center transition-all duration-500 ease-in-out group-hover:scale-110">
        
        {/* الصورة فقط */}
        <img
          src={product.image_url}
          alt={product.title}
          className="max-w-full max-h-full object-contain transition-all duration-500"
        />

        <div className="absolute -bottom-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
           <span className="text-[10px] text-gray-400 font-light uppercase tracking-[0.2em]">
             View
           </span>
        </div>
      </div>
    </Link>
  );
}