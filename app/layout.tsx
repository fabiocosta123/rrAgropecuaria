import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import { cookies } from "next/headers"; 
import { LayoutDashboard, Car, Users, Fuel, History, PlusCircle } from "lucide-react";
import Link from "next/link";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RR Agro - Gestão de Frota",
  description: "Sistema de controle de combustível e manutenção",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const isLogged = (await cookies()).has("auth_token");

  return (
    <html lang="pt-br">
      <body className={`${inter.className} bg-slate-50 text-slate-900`}>
        <Toaster position="top-right" richColors closeButton /> 

        {isLogged && (
          <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-6 py-3">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              {/* LOGO */}
              <Link href="/dashboard" className="flex items-center gap-3 group">
                <div className="bg-blue-600 p-2 rounded-xl italic font-black text-white group-hover:scale-110 transition-transform">RR</div>
                <span className="font-black text-xl tracking-tighter text-white italic uppercase hidden md:block">
                  Agro<span className="text-blue-500">pecuária</span>
                </span>
              </Link>

              {/* LINKS CENTRAIS */}
              <div className="hidden lg:flex items-center gap-2 bg-slate-800/50 p-1 rounded-2xl border border-slate-700/50">
                <NavLink href="/dashboard" icon={<LayoutDashboard size={18} />} label="Início" />
                <NavLink href="/veiculo" icon={<Car size={18} />} label="Frota" />
                <NavLink href="/motorista" icon={<Users size={18} />} label="Equipe" />
                <NavLink href="/posto" icon={<Fuel size={18} />} label="Postos" />
                <NavLink href="/historico" icon={<History size={18} />} label="Histórico" />
              </div>

              {/* BOTÃO AÇÃO */}
              <Link href="/abastecimento" className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2 shadow-lg shadow-blue-600/20 active:scale-95">
                <PlusCircle size={18} /> <span className="hidden sm:inline">Lançamento</span>
              </Link>
            </div>
          </nav>
        )}

        <main className={`${isLogged ? "pt-24" : ""} min-h-screen`}>
          {children}
        </main>
      </body>
    </html>
  );
}

// Sub-componente para os links da Navbar
function NavLink({ href, icon, label }: { href: string, icon: React.ReactNode, label: string }) {
  return (
    <Link href={href} className="flex items-center gap-2 px-4 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-700 transition-all text-xs font-black uppercase tracking-wider">
      {icon} {label}
    </Link>
  );
}