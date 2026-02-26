"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FileSpreadsheet, Download, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import { useAddProductsFromExcelMutation } from "../../../../redux/features/productAdmin/productapiSlice";


export default function ExcelUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const[addprodectExel] = useAddProductsFromExcelMutation()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return toast.error("Please select a file first");

    const formData = new FormData();
    formData.append("excelFile", file);

    try {
      setLoading(true);
      const res = await addprodectExel(formData).unwrap()


      toast.success("Products imported successfully");
    } catch {
      toast.error("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white ">
      <div className="mx-auto space-y-6">

 {/* ================= Banner ================= */}

    <div className="relative overflow-hidden mb-10 border rounded-md  p-10 bg-secondary text-white">

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-[auto_1fr] gap-6 items-center">
          <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-chart-1">
            <FileSpreadsheet/>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">
             Import Products from Excel
            </h1>
            <span className="inline-block text-xs uppercase tracking-widest ">
            Excel Data Import
            </span>
            <p className="max-w-2xl text-slate-300 text-sm leading-relaxed">
             Upload multiple products at once using an Excel file.
             Ensure your spreadsheet follows the required format
             to avoid validation errors during import.
            </p>
          </div>
        </div>
      </div>
          



        {/* ================= Instructions ================= */}
 <div className="rounded-xl border  bg-white p-6">
  <h2 className="mb-1 text-lg font-semibold text-gray-900">
    Excel File Guidelines
  </h2>

  <p className="mb-4 text-sm text-gray-600">
    Please review the following rules before uploading your Excel file.
  </p>

  <ul className="grid gap-3 text-sm text-gray-700 md:grid-cols-2">
    <li className="flex items-start gap-2">
      <span className="mt-1 h-2 w-2 rounded-full bg-secondary" />
      File format must be <b>.xlsx</b>
    </li>

    <li className="flex items-start gap-2">
      <span className="mt-1 h-2 w-2 rounded-full bg-secondary" />
      Column names must match exactly
    </li>

    <li className="flex items-start gap-2">
      <span className="mt-1 h-2 w-2 rounded-full bg-secondary" />
      <b>mainImage</b> must be a valid image URL
    </li>

    <li className="flex items-start gap-2">
      <span className="mt-1 h-2 w-2 rounded-full bg-secondary" />
      <b>images</b> should be comma-separated URLs
    </li>

    <li className="flex items-start gap-2">
      <span className="mt-1 h-2 w-2 rounded-full bg-secondary" />
      <b>is_active</b> must be TRUE or FALSE
    </li>

    <li className="flex items-start gap-2">
      <span className="mt-1 h-2 w-2 rounded-full bg-secondary" />
      <b>subcategory</b> must already exist
    </li>
  </ul>

  <a
    href="/templetExcel/products_templete.xlsx"
    download
    className="mt-6 inline-flex items-center gap-2 rounded-md border   px-4 py-2 text-sm font-medium text-secondary/80 hover:bg-cyan-50"
  >
    <Download className="h-4 w-4" />
    Download Excel Template
  </a>
</div>

        {/* ================= Table ================= */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            Required Excel Columns
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full border border-gray-200 text-sm">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  {["Column", "Required", "Type", "Description", "Example"].map(
                    (h) => (
                      <th
                        key={h}
                        className="border border-gray-200 px-4 py-2 text-left font-medium"
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>

              <tbody>
                {[
                  ["title", "Yes", "String", "Product name", "Laptop"],
                  ["slug", "Yes", "String", "URL friendly name", "gaming-laptop"],
                  ["price", "Yes", "Number", "Product price", "15000"],
                  ["stock", "Yes", "Number", "Available stock", "20"],
                  ["subcategory", "Yes", "String", "Subcategory name", "PC Components"],
                  ["is_active", "Yes", "Boolean", "Product status", "TRUE"],
                  ["mainImage", "Yes", "URL", "Main image", "https://..."],
                  ["images", "No", "URLs", "Additional images", "url1,url2"],
                ].map((row) => (
                  <tr key={row[0]} className="hover:bg-gray-50">
                    {row.map((cell, i) => (
                      <td
                        key={i}
                        className="border border-gray-200 px-4 py-2 text-gray-700"
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ================= Upload ================= */}
        <div className="rounded-xl border border-gray-200 bg-white p-8">
          <Label className="text-sm text-gray-700">
            Select Excel File
          </Label>

          <label className="mt-4 flex cursor-pointer items-center gap-4 rounded-lg border border-dashed border-gray-300 p-5 hover:bg-gray-50">
            <UploadCloud className="h-6 w-6 text-gray-500" />
            <span className="text-sm text-gray-700">
              {file ? file.name : "Click to choose .xlsx file"}
            </span>
            <input
              type="file"
              accept=".xlsx"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>

          <Button
            onClick={handleUpload}
            disabled={loading}
            className="mt-6 w-full bg-secondary hover:bg-secondary/90 transition-all"
          >
            {loading ? "Uploading..." : "Upload Excel File"}
          </Button>
        </div>
      </div>
    </div>
  );
}
