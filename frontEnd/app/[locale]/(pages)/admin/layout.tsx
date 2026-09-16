import { AdminNav } from "@/components/admin/adminNav";

export default function ManageLayout({ children }: { children: React.ReactNode }) {
  return (
    // 1. استخدام flex-row في شاشات الكمبيوتر يضع الشريط والمحتوى جنباً إلى جنب
    // 2. استخدام flex-col في الجوال يضع الهيدر فوق والمحتوى تحته
    <div className="admin-theme min-h-screen flex flex-col lg:flex-row bg-[#F8FAFC]">
      
      {/* الناف بار (يأخذ مساحته الطبيعية ولن يغطي الصفحة) */}
      <AdminNav />
      
      {/* المحتوى الرئيسي يأخذ باقي المساحة المتاحة (flex-1) */}
      <main className="flex-1 w-full min-h-screen">
        <div className="p-4 md:p-6 w-full mx-auto">
          {children}
        </div>
      </main>
      
    </div>
  );
}