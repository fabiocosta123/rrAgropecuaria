import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import { cookies } from "next/headers"; 
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RR Agro - Gestão de Frota",
  description: "Sistema de controle de combustível e manutenção",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Verifica se o usuário está logado através do cookie
  const isLogged = (await cookies()).has("auth_token");

  return (
    <html lang="pt-br">
      <body className={inter.className}>
        <Toaster position="top-right" richColors closeButton /> 

        {/* O Menu só aparece se isLogged for verdadeiro */}
        {isLogged && (
          <nav className="bg-gray-900 p-4 text-white flex gap-6 items-center shadow-lg">
            <span className="font-black text-xl tracking-tighter text-green-400">
              <a href="/dashboard" className="hover:text-green-300 transition">RR Agro</a>
            </span>
            <div className="h-6 w-px bg-gray-700 mx-2"></div>
            <div className="flex gap-4">
              <a href="/veiculo" className="hover:text-blue-300 transition text-sm font-medium">Veículos</a>
              <a href="/motorista" className="hover:text-blue-300 transition text-sm font-medium">Motoristas</a>
              <a href="/posto" className="hover:text-blue-300 transition text-sm font-medium">Postos</a>
              <a href="/historico" className="hover:text-blue-300 transition text-sm font-medium">Histórico</a>
            </div>
            <a href="/abastecimento" className="ml-auto bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg font-bold text-sm transition-colors">
              + Novo Registro
            </a>
          </nav>
        )}

        <main className="min-h-screen bg-gray-50">
          {children}
        </main>
      </body>
    </html>
  );
}