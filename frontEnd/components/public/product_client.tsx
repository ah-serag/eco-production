"use client";

import { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux"; 
import { setDirectCheckout, addToCart } from "../../redux/features/cartSlice/cartSlice"; 
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Zap, Plus, Minus, Box, Check, AlertCircle, Truck, ShieldCheck, HandCoins, PlayCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "@/i18n/navigation";
import { useTranslations, useLocale } from "next-intl";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";

interface ProductVideo {
  url: string;
  is_main: boolean;
}

interface ProductImage {
  url: string;
  is_main: boolean;
}

interface Product {
  id: number;
  title: string;
  title_ar?: string;
  price: number;
  discount_price: number;
  description: string;
  description_ar?: string;
  sku: string;
  category_name: string;
  category_name_ar?: string;
  subcategory_name: string;
  subcategory_name_ar?: string;
  images_list: ProductImage[];
  videos_list?: ProductVideo[];
  stock: string;
}

// Combined type for the unified media gallery
type MediaType = "image" | "video";
interface MediaItem {
  url: string;
  type: MediaType;
  is_main: boolean;
}

export default function ProductPreview({ product }: { product: Product }) {
  const t = useTranslations("product_preview");
  const locale = useLocale();
  const isArabic = locale === "ar";
  
  const router = useRouter();
  const dispatch = useDispatch(); 
  
  const displayTitle = isArabic ? (product.title_ar || product.title) : product.title;
  const displayDescription = isArabic ? (product.description_ar || product.description) : product.description;
  const displayCategory = isArabic ? (product.category_name_ar || product.category_name) : product.category_name;

  const stockCount = Number(product.stock) || 0;

  // 1. Prepare Unified Media Array (Images + Videos)
  const imagesWithTypes: MediaItem[] = (product.images_list || []).map(img => ({ ...img, type: "image" }));
  const videosWithTypes: MediaItem[] = (product.videos_list || []).map(vid => ({ ...vid, type: "video" }));

  const mainImage = imagesWithTypes.find((img) => img.is_main) || imagesWithTypes[0];
  const otherImages = imagesWithTypes.filter((img) => img !== mainImage);
  
  // Create final array: Main Image first, then other images, then videos
  const allMedia: MediaItem[] = mainImage 
    ? [mainImage, ...otherImages, ...videosWithTypes] 
    : [...videosWithTypes];

  // 2. Selected Media State (defaults to main image or first available media)
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(allMedia[0] || null);
  
  const [zoom, setZoom] = useState({ x: 0, y: 0, active: false });
  const [isAdding, setIsAdding] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isMaxStock, setIsMaxStock] = useState(false); 
  
  const imgRef = useRef<HTMLDivElement>(null);

  const increaseQuantity = () => {
    if (quantity < stockCount) {
      setQuantity((prev) => prev + 1);
      setIsMaxStock(false);
    } else {
      setIsMaxStock(true);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
      setIsMaxStock(false);
    }
  };

  const getProductData = () => ({
    id: product.id,
    title: displayTitle,
    price: product.discount_price || product.price,
    image: mainImage?.url,
    stock: product.stock,
    quantity: quantity,
  });

  const handleAddToCart = () => {
    setIsAdding(true);
    dispatch(addToCart(getProductData()));
    setTimeout(() => {
      setIsAdding(false);
    }, 1200);
  };

  const handleBuyNow = () => {
    dispatch(setDirectCheckout(getProductData()));
    router.push(`/checkout`);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!imgRef.current || selectedMedia?.type !== 'image') return; // Only zoom for images
    const rect = imgRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoom({ x, y, active: true });
  };

  const hasDiscount    = product.discount_price && product.discount_price < product.price;
  const activePrice    = hasDiscount ? product.discount_price : product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.discount_price) / product.price) * 100)
    : 0;

  return (
    <div className="p-2 md:p-8 max-w-7xl mx-auto antialiased">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" style={{ direction: 'ltr' }}>
        
        {/* LEFT SIDE — IMAGES & VIDEOS GALLERY */}
        <div className="col-span-2 flex flex-col sm:flex-row gap-4">
          
          {/* Thumbnails Container using ScrollArea */}
          <ScrollArea className="order-2 sm:order-1 w-full sm:w-24 h-[100px] sm:h-[520px]">
            <div className="flex flex-row sm:flex-col sm:pr-4 gap-3 p-1">
              {allMedia.map((media, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedMedia(media)}
                  className={cn(
                    "relative aspect-square h-16 w-16 sm:h-20 sm:w-20 shrink-0 overflow-hidden cursor-pointer rounded-lg border-2 transition-all duration-200 bg-gray-50 flex items-center justify-center group",
                    selectedMedia?.url === media.url 
                      ? "border-primary shadow-sm" 
                      : "border-transparent hover:border-gray-200"
                  )}
                >
                  {media.type === 'image' ? (
                    <img src={media.url} alt="thumbnail" className="w-full h-full object-contain p-1" />
                  ) : (
                    <>
                      <video src={media.url} className="absolute inset-0 w-full h-full object-cover opacity-60" />
                      <PlayCircle className="text-slate-700 w-6 h-6 relative z-10 opacity-80 group-hover:opacity-100 transition-opacity" />
                    </>
                  )}
                </div>
              ))}
            </div>
            {/* ScrollBars */}
            <ScrollBar orientation="horizontal" className="sm:hidden " />
            <ScrollBar orientation="vertical" className="hidden sm:block w-1.5" />
          </ScrollArea>

          {/* Main Display View (Image or Video) */}
          <div
            ref={imgRef}
            className={cn(
              "relative w-full order-1 sm:order-2 overflow-hidden h-[350px] md:h-[520px] border border-slate-100 rounded-2xl bg-[#fafafa]",
              selectedMedia?.type === 'image' ? "cursor-zoom-in" : ""
            )}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setZoom({ ...zoom, active: false })}
          >
            {selectedMedia?.type === 'image' ? (
              <>
                <img 
                  src={selectedMedia.url} 
                  alt={displayTitle} 
                  className="object-contain py-6 w-full h-full transition-transform duration-500" 
                />
                
                {zoom.active && (
                  <div className="absolute inset-0 pointer-events-none overflow-hidden hidden md:block z-10 bg-white">
                    <div 
                      className="absolute inset-0 w-full h-full" 
                      style={{ 
                        backgroundImage: `url(${selectedMedia.url})`, 
                        backgroundPosition: `${zoom.x}% ${zoom.y}%`, 
                        backgroundSize: "220%",
                        backgroundRepeat: "no-repeat"
                      }} 
                    />
                  </div>
                )}
              </>
            ) : selectedMedia?.type === 'video' ? (
              <video 
                src={selectedMedia.url} 
                controls 
                autoPlay
                className="w-full h-full object-contain bg-black/5 rounded-2xl"
              />
            ) : null}
          </div>
        </div>

        {/* RIGHT SIDE — INFO (Unchanged) */}
        <div 
          className={cn("flex flex-col space-y-6", isArabic ? "text-right" : "text-left")} 
          style={{ direction: isArabic ? 'rtl' : 'ltr' }}
        >
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="bg-slate-100 text-slate-600 border-none text-[10px] font-normal tracking-tight">
                {displayCategory}
              </Badge>
              <div className="flex items-center gap-1 px-2 py-0.5 bg-slate-100 text-slate-600 rounded-2xl">
                 <Box size={8} />
                 <span className="sm:text-[11px] text-[10px] font-normal">
                    {t('available_stock', { count : stockCount } )}
                 </span>
              </div>
            </div>

            <h1 className={cn("text-xl md:text-2xl text-slate-900 tracking-tight leading-snug font-normal", isArabic && "font-tajawal")}>
              {displayTitle}
            </h1>
            <p className="text-[11px] text-slate-500 font-normal tracking-widest uppercase">
              {t('sku')}: {product.sku}
            </p>
          </div>

          <Separator className="bg-slate-100" />

          <div className="flex flex-col gap-1" dir={isArabic ? "rtl" : "ltr"}>
            {/* active price */}
            <div className="flex items-baseline gap-2" >
              <span className="text-[28px] sm:text-[32px] font-semibold text-neutral-900 tracking-tight leading-none">
                {Math.trunc(Number(activePrice)).toLocaleString("en-US")}
              </span>
              <span className="text-[13px] font-normal text-slate-400">
                {t("currency")}
              </span>
            </div>

            {/* original price + badge */}
            {hasDiscount && (
              <div className="flex items-center gap-2" >
                <span className="text-[13px] text-slate-400 line-through font-normal">
                  {Math.trunc(Number(product.price)).toLocaleString("en-US")} {t("currency")}
                </span>
                <span className="text-[9px] uppercase tracking-widest font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  -{discountPercent}% {t("off")}
                </span>
              </div>
            )}
          </div>

          <Separator className="bg-slate-100" />

          <div className="space-y-2 w-full ">
            <h3 className="text-[10px] font-normal text-slate-500 uppercase tracking-widest">
              {t('details_title')}
            </h3>
            <p className={cn("text-sm text-slate-600 w-full text-wrap leading-relaxed font-normal", isArabic && "font-tajawal")}>
              {displayDescription}
            </p>
          </div>

          <Separator className="bg-slate-100" />

          <div className="flex flex-col gap-4 pt-2">
            <div className="flex flex-col sm:flex-row gap-2 mb-2">
               <div className="flex items-center gap-3 p-2.5 rounded-xl border border-slate-100 bg-slate-50/50 flex-1">
                  <div className="bg-white p-1.5 rounded-lg shadow-sm shrink-0">
                     <Truck size={14} className="text-blue-950" />
                  </div>
                  <div className="flex flex-col min-w-0">
                     <span className="text-[10.5px] font-bold text-slate-700 truncate">{t("freeShippingTitle")}</span>
                     <span className="text-[9px] text-slate-400 truncate">{t("freeShippingDesc")}</span>
                  </div>
               </div>
               <div className="flex items-center gap-3 p-2.5 rounded-xl border border-slate-100 bg-slate-50/50 flex-1">
                  <div className="bg-white p-1.5 rounded-lg shadow-sm shrink-0">
                     <ShieldCheck size={14} className="text-emerald-500" />
                  </div>
                  <div className="flex flex-col min-w-0">
                     <span className="text-[10.5px] font-bold text-slate-700 truncate">{t("securePayTitle")}</span>
                     <span className="text-[9px] text-slate-400 truncate">{t("securePayDesc")}</span>
                  </div>
               </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-4">
                <span className="text-xs font-normal text-slate-500">{t('quantity')}</span>
                <div className="flex items-center border rounded-xl overflow-hidden bg-white">
                  <button onClick={decreaseQuantity} disabled={quantity <= 1} className="w-10 h-10 flex items-center justify-center hover:bg-slate-100 transition-colors"><Minus size={14} /></button>
                  <span className="w-10 text-center font-normal text-sm">{quantity}</span>
                  <button onClick={increaseQuantity} disabled={quantity >= stockCount} className="w-10 h-10 flex items-center justify-center hover:bg-slate-100 transition-colors"><Plus size={14} /></button>
                </div>
              </div>

              <div className={cn(
                "flex items-center gap-1.5 text-rose-500 transition-all duration-300 overflow-hidden",
                isMaxStock ? "max-h-10 opacity-100 mt-1" : "max-h-0 opacity-0"
              )}>
                <AlertCircle size={12} />
                <span className="text-[10px] font-normal uppercase tracking-tight">{t('max_stock_reached')}</span>
              </div>
            </div>

            <div className="flex flex-row gap-2">
              <Button
                onClick={handleAddToCart}
                variant="outline"
                disabled={isAdding || stockCount === 0}
                className={cn(
                  "flex-1 h-12 text-[11px] font-normal transition-all duration-300 border-slate-200 shadow-none",
                  isAdding ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "text-slate-700 hover:bg-slate-50"
                )}
              >
                {isAdding ? <Check className="mr-1.5 h-4 w-4 animate-bounce" /> : <ShoppingCart className="mr-1.5 h-4 w-4" />}
                {isAdding ? t('added') : t('add_to_cart')}
              </Button>

              <Button
                onClick={handleBuyNow}
                disabled={stockCount === 0}
                className="flex-[1.5] items-center text-white h-12  bg-primary text-[13px] font-semibold shadow-none hover:bg-primary/80"
              >
                <HandCoins size={20} className="mr-1.5 h-7 w-7 " />
                {stockCount === 0 ? t('out_of_stock') : t('buy_now')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}