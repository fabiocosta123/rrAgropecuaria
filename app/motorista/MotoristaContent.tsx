"use client";

import { useState } from "react";
import { Search, User, ShieldCheck, Pencil } from "lucide-react";
import Link from "next/link";
import { BotaoExcluir } from "@/app/components/BotaoExcluir";

export default function MotoristasContent({ motoristasIniciais }: { motoristasIniciais: any[] }) {
  const [filtro, setFiltro] = useState("");

  const filtrados = motoristasIniciais.filter(m => 
    m.nome.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <>
      {/* BUSCA DINÂMICA */}
      <div className="relative mb-8 group">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
        <input 
          type="text"
          placeholder="Pesquisar motorista da frota..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="w-full p-5 pl-16 bg-white border-2 border-slate-100 rounded-[2rem] outline-none focus:border-blue-600 shadow-xl shadow-slate-200/40 transition-all font-bold text-slate-700"
        />
      </div>

      {/* GRID DE CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtrados.map((m) => (
          <div key={m.id} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-5 hover:shadow-xl transition-all group">
            <div className="bg-slate-900 w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-2xl text-blue-500 font-black italic shadow-xl group-hover:scale-105 transition-transform">
              {m.nome.charAt(0).toUpperCase()}
            </div>
            
            <div className="flex-1">
              <h3 className="font-black text-slate-800 text-xl italic uppercase tracking-tighter leading-none">{m.nome}</h3>
              <div className="flex items-center gap-1 mt-2">
                <ShieldCheck size={12} className="text-blue-600" />
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Condutor RR</p>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Link href={`/motorista/editar/${m.id}`} className="p-2 bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors border border-slate-100 flex justify-center">
                <Pencil size={16} />
              </Link>
              <BotaoExcluir id={m.id} />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}