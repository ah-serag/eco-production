"use client";

import { useState, useRef } from "react";
import { useDispatch } from "react-redux"; 
import { setDirectCheckout, addToCart } from "../../redux/features/cartSlice/cartSlice"; 
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Zap, Plus, Minus, Box, Check, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "@/i18n/navigation";
import { useTranslations, useLocale } from "next-intl";

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
  stock: string;
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
  const mainImage = product.images_list.find((img) => img.is_main) || product.images_list[0];
  const secondaryImages = product.images_list.filter((img) => img !== mainImage);

  const [selectedImage, setSelectedImage] = useState(mainImage?.url);
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
    image: mainImage.url,
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
    if (!imgRef.current) return;
    const rect = imgRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoom({ x, y, active: true });
  };

  const discountPercent = product.discount_price < product.price
      ? Math.round(((product.price - product.discount_price) / product.price) * 100)
      : 0;

  return (
    <div className="p-2 md:p-8 max-w-7xl mx-auto antialiased">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" style={{ direction: 'ltr' }}>
        
        {/* LEFT SIDE — IMAGES */}
        <div className="col-span-2 sm:flex-row flex-col flex gap-4">
          <div className="flex flex-col sm:order-1 order-2 gap-3 w-20 shrink-0">
            {[mainImage, ...secondaryImages].map((img, index) => (
              <div
                key={index}
                onClick={() => setSelectedImage(img.url)}
                className={cn(
                  "aspect-square overflow-hidden cursor-pointer rounded-lg border-2 transition-all duration-200",
                  selectedImage === img.url ? "border-chart-1" : "border-transparent bg-gray-50 hover:border-gray-200"
                )}
              >
                <img src={img?.url} alt="thumbnail" className="w-full h-full object-contain p-1" />
              </div>
            ))}
          </div>

          <div
            ref={imgRef}
            className="relative w-full overflow-hidden sm:order-2 border border-slate-100 rounded-2xl bg-[#fafafa] cursor-zoom-in"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setZoom({ ...zoom, active: false })}
          >
            <img src={selectedImage} alt={displayTitle} className="object-contain py-6 w-full h-[400px] md:h-[520px] transition-transform duration-500" />
            {zoom.active && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden hidden md:block">
                <div className="absolute inset-0 w-full h-full" style={{ backgroundImage: `url(${selectedImage})`, backgroundPosition: `${zoom.x}% ${zoom.y}%`, backgroundSize: "220%" }} />
              </div>
            )}
          </div>
        </div>

        {/* RIGHT SIDE — INFO */}
        <div 
          className={cn("flex flex-col space-y-6", isArabic ? "text-right" : "text-left")} 
          style={{ direction: isArabic ? 'rtl' : 'ltr' }}
        >
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="bg-slate-100 text-slate-600 border-none text-[10px] font-normal tracking-tight">
                {displayCategory}
              </Badge>
              <div className="flex items-center gap-1 px-2 py-0.5 bg-chart-1 border rounded-2xl">
                 <Box size={8} className="text-white" />
                 <span className="sm:text-[11px] text-[10px] font-normal  text-white">
                    {t('available_stock', { count : stockCount } )}
                 </span>
              </div>
            </div>

            <h1 className={cn("text-2xl md:text-2xl text-slate-900 tracking-tight leading-snug font-normal", isArabic && "font-tajawal")}>
              {displayTitle}
            </h1>
            <p className="text-[11px] text-slate-400 font-normal tracking-widest uppercase">
              {t('sku')}: {product.sku}
            </p>
          </div>

          <Separator className="bg-slate-100" />

          <div className="flex  text-nowrap items-center gap-3">
            <span className="text-xl  font-normal text-slate-900">{product.discount_price} {t('currency')}</span>
            {product.discount_price < product.price && (
              <div className="flex items-center gap-2">
                <span className="line-through text-[11px] sm:text-[15px] text-slate-300 text-sm font-normal">{product.price} {t('currency')}</span>
                <span className="bg-secondary text-amber-50 text-nowrap text-[8px] sm:text-[10px] px-3 py-1 rounded-2xl font-normal">{discountPercent}% {t('off')}</span>
              </div>
            )}
          </div>

          <Separator className="bg-slate-100" />

          <div className="space-y-2">
            <h3 className="text-[11px] font-normal text-slate-400 uppercase tracking-widest">
              {t('details_title')}
            </h3>
            <p className={cn("text-sm text-slate-600 leading-relaxed font-normal", isArabic && "font-tajawal")}>
              {displayDescription}
            </p>
          </div>

          <Separator className="bg-slate-100" />

          <div className="flex flex-col gap-3 pt-2">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-4">
                <span className="text-xs font-normal text-slate-500">{t('quantity')}</span>
                <div className="flex items-center border rounded-xl overflow-hidden bg-white">
                  <button onClick={decreaseQuantity} disabled={quantity <= 1} className="w-10 h-10 flex items-center justify-center hover:bg-slate-100 transition-colors"><Minus size={16} /></button>
                  <span className="w-12 text-center font-normal text-sm">{quantity}</span>
                  <button onClick={increaseQuantity} disabled={quantity >= stockCount} className="w-10 h-10 flex items-center justify-center hover:bg-slate-100 transition-colors"><Plus size={16} /></button>
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

            <div className="flex flex-row gap-3">
              <Button
                onClick={handleAddToCart}
                variant="outline"
                disabled={isAdding || stockCount === 0}
                className={cn(
                  "flex-1 h-12 rounded-xl text-xs font-normal transition-all duration-300 border-slate-200 shadow-none",
                  isAdding ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "text-slate-700 hover:bg-slate-50"
                )}
              >
                {isAdding ? <Check className="mr-2 h-4 w-4 animate-bounce" /> : <ShoppingCart className="mr-2 h-4 w-4" />}
                {isAdding ? t('added') : t('add_to_cart')}
              </Button>

              <Button
                onClick={handleBuyNow}
                disabled={stockCount === 0}
                className="flex-[1.8] h-12 rounded-xl bg-chart-1 text-white text-xs font-normal shadow-none hover:bg-chart-1/90"
              >
                <Zap className="mr-2 h-4 w-4 fill-current" />
                {stockCount === 0 ? t('out_of_stock') : t('buy_now')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}