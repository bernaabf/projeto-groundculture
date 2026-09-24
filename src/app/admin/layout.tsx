import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, ShoppingBag, Settings, LogOut } from "lucide-react";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login?redirectTo=/admin");
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-neutral-200 hidden md:flex flex-col">
        <div className="p-6 border-b border-neutral-200">
          <Link href="/" className="text-xl font-display font-bold tracking-tight">
            GROUND CULTURE
          </Link>
          <p className="text-xs text-neutral-500 uppercase tracking-widest mt-1">Admin Panel</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 bg-black text-white rounded-lg font-medium text-sm">
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </Link>
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 text-neutral-600 hover:bg-neutral-100 rounded-lg font-medium text-sm transition-colors">
            <ShoppingBag className="w-4 h-4" />
            Pedidos
          </Link>
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 text-neutral-600 hover:bg-neutral-100 rounded-lg font-medium text-sm transition-colors">
            <Settings className="w-4 h-4" />
            Configurações
          </Link>
        </nav>

        <div className="p-4 border-t border-neutral-200">
          <div className="flex items-center gap-3 px-4 py-3 text-neutral-600 hover:bg-neutral-100 rounded-lg font-medium text-sm transition-colors cursor-pointer">
            <LogOut className="w-4 h-4" />
            Sair
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b border-neutral-200 flex items-center justify-between px-8 md:hidden">
           <span className="font-display font-bold">GC ADMIN</span>
        </header>
        <div className="flex-1 overflow-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
