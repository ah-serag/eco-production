'use client';

import { useLocale } from 'next-intl';
import React, { useState } from 'react';

export default function TextStripRender({ section }: { section: any }) {
  const [isVisible, setIsVisible] = useState(true);
  const locale = useLocale();
  const isAr = locale === 'ar';

  const { title, text, title_ar, text_ar, bg_color, text_color } = section.info;

  if (!isVisible) return null;

  const displayTitle = isAr ? title_ar : title;
  const displayText = isAr ? text_ar : text;

  return (
    <div
      style={{ backgroundColor: bg_color, color: text_color }}
      className="w-full relative mt-1 sm:mt-0  "
      dir={isAr ? 'rtl' : 'ltr'}
    >
      <div className="w-full  mx-auto px-2 py-2.5 flex items-center justify-between min-h-[32px]">
        
        {/* Container للنص في سطر واحد تماماً */}
        <div className="flex-1 flex items-center justify-center gap-1.5 text-[9px] md:text-[12px] tracking-wide uppercase font-medium">
          <span className="font-bold">{displayTitle}</span>
          <span className="opacity-50">—</span>
          <span className="opacity-90">{displayText}</span>
        </div>

        {/* زر الإغلاق بحجم متناسب مع نحافة الشريط */}
        <button
          onClick={() => setIsVisible(false)}
          className="hover:opacity-50 transition-opacity p-1"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}