// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  theme: {
    extend: {
      fontFamily: {
        ar: ["var(--font-tajawal)", "sans-serif"], 
        en: ["var(--font-geist-sans)", "sans-serif"],
      },
    },
  },
  // ...
};
export default config;