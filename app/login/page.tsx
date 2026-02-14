"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Lock, User, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const usuario = formData.get("usuario");
    const senha = formData.get("senha");

    if (usuario === "rragro" && senha === "admin") {
      document.cookie = "auth_token=logado; path=/; max-age=86400";
      toast.success("Acesso autorizado. Carregando frota...");

      setTimeout(() => {
        router.push("/dashboard");
        router.refresh();
      }, 800);
    } else {
      toast.error("Credenciais inválidas no sistema.");
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Detalhes de Background */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex bg-blue-600 p-5 rounded-[2rem] mb-6 shadow-2xl shadow-blue-600/40 rotate-3 group hover:rotate-0 transition-transform duration-500">
            <ShieldCheck size={40} className="text-white" />
          </div>
          <h1 className="text-5xl font-black text-white italic tracking-tighter uppercase leading-none">
            RR <span className="text-blue-500">AGRO</span>
          </h1>
          <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.4em] mt-4">Sistema de Gestão de Ativos</p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-xl p-8 rounded-[3rem] border border-white/5 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase ml-2 tracking-widest">Identificação</label>
              <div className="relative">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                <input 
                  name="usuario"
                  placeholder="Usuário"
                  className="w-full bg-slate-900/50 border border-slate-700 focus:border-blue-500 p-5 pl-14 rounded-2xl text-white font-bold outline-none transition-all placeholder:text-slate-600"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase ml-2 tracking-widest">Chave de Acesso</label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                <input 
                  name="senha"
                  type="password" 
                  placeholder="••••••••"
                  className="w-full bg-slate-900/50 border border-slate-700 focus:border-blue-500 p-5 pl-14 rounded-2xl text-white font-bold outline-none transition-all placeholder:text-slate-600"
                  required
                />
              </div>
            </div>

            <button 
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {isLoading ? "Validando..." : "Autenticar no Sistema"}
            </button>
          </form>
        </div>
        
        <p className="text-center mt-8 text-slate-600 text-[10px] font-black uppercase tracking-widest">
          Propriedade Privada • RR Agropecuária v1.0
        </p>
      </div>
    </div>
  );
}