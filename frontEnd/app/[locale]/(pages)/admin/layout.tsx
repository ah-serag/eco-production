import { AdminNav } from "@/components/admin/adminNav";

export default function ManageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div  className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <AdminNav />
      <main className="flex-1 flex flex-col">
        <div className="flex-1 p-3 md:p-4  w-full mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}