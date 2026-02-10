"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Calendar as CalendarIcon, X } from "lucide-react";

export function FiltroData() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const dataInicio = searchParams.get("inicio") || "";
  const dataFim = searchParams.get("fim") || "";

  const atualizarFiltro = (chave: string, valor: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (valor) {
      params.set(chave, valor);
    } else {
      params.delete(chave);
    }
    router.push(`/historico?${params.toString()}`);
  };

  const limparFiltros = () => {
    router.push("/historico");
  };

  return (
    <div className="flex flex-wrap items-center gap-3 bg-white p-3 rounded-[2rem] border border-gray-100 shadow-sm">
      <div className="flex items-center gap-2 px-4 border-r border-gray-100">
        <CalendarIcon size={16} className="text-blue-600" />
        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Período</span>
      </div>
      
      <input
        type="date"
        value={dataInicio}
        onChange={(e) => atualizarFiltro("inicio", e.target.value)}
        className="bg-transparent text-sm font-bold outline-none focus:text-blue-600 transition-colors"
      />
      
      <span className="text-gray-300 font-black">→</span>
      
      <input
        type="date"
        value={dataFim}
        onChange={(e) => atualizarFiltro("fim", e.target.value)}
        className="bg-transparent text-sm font-bold outline-none focus:text-blue-600 transition-colors"
      />

      {(dataInicio || dataFim) && (
        <button 
          onClick={limparFiltros}
          className="ml-2 p-1.5 bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-full transition-all"
        >
          <X size={14} strokeWidth={3} />
        </button>
      )}
    </div>
  );
}