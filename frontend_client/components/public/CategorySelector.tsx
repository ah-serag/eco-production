"use client";

import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useGetCategoryQuery } from "../../redux/features/productAdmin/categoryapiSlice"; // استدعاء الـ RTK Query

export default function CategorySelector() {
  const { register, watch, setValue } = useFormContext(); 
  const selectedCategory = watch("category_id");

  const { data, isLoading, error } = useGetCategoryQuery(undefined); 

  const [categories, setCategories] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);

  // معالجة البيانات بعد جلبها
  useEffect(() => {
    if (data) {
      // Group subcategories by category
      const grouped = data.reduce((acc: any, item: any) => {
        if (!acc[item.category_id]) {
          acc[item.category_id] = {
            category_id: item.category_id,
            category_name: item.category_name,
            subcategories: [],
          };
        }
        acc[item.category_id].subcategories.push({
          subcategory_id: item.subcategory_id,
          subcategory_name: item.subcategory_name,
        });
        return acc;
      }, {});
      setCategories(Object.values(grouped));
    }
  }, [data]);

  // تحديث الـ subcategories عند تغيير الفئة
  useEffect(() => {
    const category = categories.find(c => c.category_id === parseInt(selectedCategory));
    setSubcategories(category ? category.subcategories : []);
    setValue("subcategory_id", ""); // إعادة تعيين القيمة عند تغيير الفئة
  }, [selectedCategory, categories, setValue]);

  if (isLoading) return <p>Loading categories...</p>;
  if (error) return <p className="text-red-500">Failed to load categories</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium mb-1">Category</label>
        <select
          {...register("category_id", { required: "Please select a category" })}
          className="w-full rounded-lg border px-3 py-2"
        >
          <option value="">Select category</option>
          {categories.map(cat => (
            <option key={cat.category_id} value={cat.category_id}>
              {cat.category_name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Subcategory</label>
        <select
          {...register("subcategory_id", { required: "Please select a subcategory" })}
          className="w-full rounded-lg border px-3 py-2"
        >
          <option value="">Select subcategory</option>
          {subcategories.map(sub => (
            <option key={sub.subcategory_id} value={sub.subcategory_id}>
              {sub.subcategory_name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
