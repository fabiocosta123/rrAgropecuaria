"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { redefinirSenha } from "../actions"; 

function ResetarSenhaContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [status, setStatus] = useState<{ tipo: "idle" | "loading" | "success" | "error"; msg: string }>({
    tipo: "idle",
    msg: "",
  });

  
  useEffect(() => {
    if (!token) {
      setStatus({ tipo: "error", msg: "Link de recuperação inválido ou ausente." });
    }
  }, [token]);

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    
    if (novaSenha !== confirmarSenha) {
      setStatus({ tipo: "error", msg: "As senhas não coincidem." });
      return;
    }

    if (novaSenha.length < 5) {
      setStatus({ tipo: "error", msg: "A senha deve ter pelo menos 5 caracteres." });
      return;
    }

    setStatus({ tipo: "loading", msg: "Atualizando sua senha..." });

    try {
      const result = await redefinirSenha(token!, novaSenha);

      if (result?.error) {
        setStatus({ tipo: "error", msg: result.error });
      } else {
        setStatus({ tipo: "success", msg: "Senha alterada com sucesso! Redirecionando..." });
        
        setTimeout(() => {
          router.push("/login");
        }, 2500);
      }
    } catch (error) {
      setStatus({ tipo: "error", msg: "Ocorreu um erro inesperado. Tente novamente." });
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 text-black">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl shadow-blue-100 p-8 md:p-12 border border-gray-100">
        
        {/* HEADER */}
        <div className="text-center mb-8">
          <div className="inline-block bg-green-500 p-3 rounded-2xl mb-4 shadow-lg shadow-green-100">
            <span className="text-white text-2xl">🔒</span>
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tighter uppercase">Nova Senha</h1>
          <p className="text-gray-400 font-medium text-sm mt-1">Crie uma nova credencial de acesso</p>
        </div>

        {/* MENSAGENS DE STATUS */}
        {status.msg && (
          <div className={`p-4 rounded-2xl mb-6 text-xs font-bold border-l-4 animate-in fade-in slide-in-from-top-2 ${
            status.tipo === "error" ? "bg-red-50 border-red-500 text-red-700" : 
            status.tipo === "success" ? "bg-green-50 border-green-500 text-green-700" : 
            "bg-blue-50 border-blue-500 text-blue-700"
          }`}>
            {status.msg}
          </div>
        )}

        {/* FORMULÁRIO */}
        {status.tipo !== "success" && token && (
          <form onSubmit={handleReset} className="space-y-5">
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase ml-2 mb-1 block tracking-widest">Nova Senha</label>
              <input 
                type="password" 
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
                placeholder="••••••••" 
                className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white p-4 rounded-2xl outline-none transition-all font-bold"
                required
              />
            </div>

            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase ml-2 mb-1 block tracking-widest">Confirmar Senha</label>
              <input 
                type="password" 
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                placeholder="••••••••" 
                className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white p-4 rounded-2xl outline-none transition-all font-bold"
                required
              />
            </div>

            <button 
              disabled={status.tipo === "loading"}
              className="w-full bg-gray-900 text-white py-4 rounded-2xl font-black text-lg hover:bg-black shadow-xl transition-all active:scale-95 disabled:opacity-50 mt-4"
            >
              {status.tipo === "loading" ? "Processando..." : "Redefinir Senha"}
            </button>
          </form>
        )}

        {/* LINK VOLTAR */}
        <div className="mt-8 text-center">
          <button 
            onClick={() => router.push("/login")}
            className="text-sm font-bold text-gray-400 hover:text-blue-600 transition"
          >
            Voltar para o Login
          </button>
        </div>
      </div>
    </div>
  );
}


export default function ResetarSenhaPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-bold">Carregando...</div>}>
      <ResetarSenhaContent />
    </Suspense>
  );
}