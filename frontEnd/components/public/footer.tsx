"use client";

import Link from "next/link";
import Image from "next/image";
import { Facebook, Twitter, Instagram, Linkedin, ArrowUpRight } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="hidden md:block mt-auto bg-[#ffffff] border-t border-slate-100">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-4 space-y-6">
            <Link href="/" className="group flex items-center gap-2">
              <div className="relative h-10 w-20 transition-transform group-hover:scale-105">
                <Image 
                  src="/photo/logoVexa.svg" 
                  alt="LumaCraft Logo" 
                  fill
                  className="object-contain"
                />
              </div>
            </Link>
            <p className="text-sm text-slate-500 leading-relaxed max-w-xs">
              An exceptional shopping experience for electronics and PC parts. We combine high quality with superior performance to fuel your tech passion.
            </p>
            <div className="flex items-center gap-3">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <Link
                  key={i}
                  href="#"
                  className="w-9 h-9 flex items-center justify-center rounded-full border border-slate-100 text-slate-400 transition-all duration-300 hover:border-slate-900 hover:text-slate-900 hover:bg-slate-50"
                >
                  <Icon size={16} />
                </Link>
              ))}
            </div>
          </div>

          <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div className="space-y-4">
              <h3 className="text-[12px] font-bold uppercase tracking-widest text-slate-400">Shopping</h3>
              <ul className="space-y-3">
                {["PC Parts", "Gaming Consoles", "Accessories"].map((item) => (
                  <li key={item}>
                    <Link href="#" className="text-sm text-slate-600 hover:text-slate-900 flex items-center gap-1 group">
                      {item}
                      <ArrowUpRight size={12} className="opacity-0 translate-y-1 transition-all group-hover:opacity-100 group-hover:translate-y-0" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-[12px] font-bold uppercase tracking-widest text-slate-400">Support</h3>
              <ul className="space-y-3">
                {["Shipping & Delivery", "Return Policy", "FAQs"].map((item) => (
                  <li key={item}>
                    <Link href="#" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4 col-span-2 sm:col-span-1">
              <h3 className="text-[12px] font-bold uppercase tracking-widest text-slate-400">Stay Connected</h3>
              <p className="text-[13px] text-slate-500">Subscribe to receive the latest offers and discounts.</p>
              <div className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="w-full bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-slate-300 transition-colors"
                />
                <button className="bg-chart-1 text-white px-4 py-2 rounded-lg text-xs font-medium hover:bg-slate-800 transition-colors">
                  Join
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-6 text-[12px] text-slate-400 font-medium">
            <p>© {currentYear} LumaCraft. All rights reserved.</p>
            <Link href="#" className="hover:text-slate-900">Privacy Policy</Link>
            <Link href="#" className="hover:text-slate-900">Terms of Use</Link>
          </div>
          
          <div className="flex items-center gap-4 grayscale opacity-40">
            <div className="px-2 py-1 border border-slate-200 rounded text-[10px] font-bold">VISA</div>
            <div className="px-2 py-1 border border-slate-200 rounded text-[10px] font-bold">MASTERCARD</div>
            <div className="px-2 py-1 border border-slate-200 rounded text-[10px] font-bold">PAYPAL</div>
          </div>
        </div>
      </div>
    </footer>
  );
}