"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const usuario = formData.get("usuario");
    const senha = formData.get("senha");

    // Validação
    if (usuario === "rragro" && senha === "admin") {
      // 1. Criar o cookie no lado do cliente
      document.cookie = "auth_token=logado; path=/; max-age=86400";
      
      toast.success("Login realizado com sucesso! Bem-vindo.");

      // 2. Pequeno delay para o toast aparecer e o cookie ser registrado
      setTimeout(() => {
        router.push("/dashboard");
        router.refresh(); // Força o Next.js a atualizar o Layout e mostrar o menu
      }, 1000);
    } else {
      toast.error("Usuário ou senha incorretos.");
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 text-black">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-8 border border-gray-100">
        <div className="text-center mb-10">
          <div className="inline-block bg-blue-600 p-3 rounded-2xl mb-4 shadow-lg shadow-blue-200">
            <span className="text-white text-2xl font-black">RR</span>
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tighter uppercase">RR AGRO</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-[10px] font-black text-gray-400 uppercase ml-2 mb-1 block">Usuário</label>
            <input 
              name="usuario"
              type="text" 
              className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-500 p-4 rounded-2xl outline-none"
              required
            />
          </div>

          <div>
            <label className="text-[10px] font-black text-gray-400 uppercase ml-2 mb-1 block">Senha</label>
            <input 
              name="senha"
              type="password" 
              className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-500 p-4 rounded-2xl outline-none"
              required
            />
          </div>

          <button 
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-blue-700 transition-all disabled:opacity-50"
          >
            {isLoading ? "Entrando..." : "Entrar na Conta"}
          </button>
        </form>
      </div>
    </div>
  );
}