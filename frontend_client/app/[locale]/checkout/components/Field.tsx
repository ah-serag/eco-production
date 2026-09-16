"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const FIELD_CLASS =
  "h-10 text-[12px] font-normal rounded-xl border-slate-200 focus-visible:ring-slate-300 bg-white";
const AUTO_FILL = "bg-blue-50/60 border-blue-100";

interface FieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string;
  autoFilled?: boolean;
  disabled?: boolean;
  children?: React.ReactNode;
}

export default function Field({
  label,
  name,
  value,
  onChange,
  placeholder,
  error,
  autoFilled,
  disabled,
  children,
}: FieldProps) {
  return (
    <div className="space-y-1.5">
      <Label className="text-[10px] uppercase tracking-widest text-slate-400 font-medium">
        {label}
      </Label>
      <div className="relative">
        <Input
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            FIELD_CLASS,
            children && "ps-10",
            autoFilled && AUTO_FILL,
            disabled && "opacity-40 animate-pulse"
          )}
        />
        {children}
      </div>
      {error && <p className="text-[10px] text-red-400 ms-1">{error}</p>}
    </div>
  );
}
