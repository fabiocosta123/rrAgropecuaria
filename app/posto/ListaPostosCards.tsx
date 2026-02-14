"use client";

import { useState } from "react";
import { Search, Fuel, MapPin, Pencil } from "lucide-react";
import { BotaoExcluir } from "@/app/components/BotaoExcluir";
import Link from "next/link";

export function ListaPostosCards({ postosInitial }: { postosInitial: any[] }) {
  const [filtro, setFiltro] = useState("");

  const filtrados = postosInitial.filter(p =>
    p.nome.toLowerCase().includes(filtro.toLowerCase()) ||
    p.cidade?.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <>
      {/* BUSCA DINÂMICA */}
      <div className="relative mb-8 group">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-green-600 transition-colors" size={20} />
        <input
          type="text"
          placeholder="Buscar posto por nome ou cidade..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="w-full p-5 pl-16 bg-white border-2 border-slate-100 rounded-[2rem] outline-none focus:border-green-600 shadow-xl shadow-slate-200/40 transition-all font-bold text-slate-700"
        />
      </div>

      {/* GRID DE CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtrados.map((p) => (
          <div key={p.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
            <div className="flex justify-between items-start mb-6">
              <div className="bg-slate-900 text-green-500 p-4 rounded-2xl shadow-lg group-hover:bg-green-600 group-hover:text-white transition-all">
                <Fuel size={24} />
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/posto/editar/${p.id}`}
                  className="p-2 bg-slate-50 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-xl transition-colors border border-slate-100"
                >
                  <Pencil size={16} />
                </Link>
                <BotaoExcluir id={p.id} />
              </div>
            </div>

            <h3 className="text-2xl font-black text-slate-800 italic uppercase tracking-tighter leading-tight mb-2">
              {p.nome}
            </h3>

            <p className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em]">
              <MapPin size={12} className="text-green-600" /> {p.cidade || "Posto Homologado"}
            </p>

            <div className="mt-8 pt-6 border-t border-slate-50 flex justify-between items-center">
              <div>
                <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Abastecimentos</span>
                <span className="text-xl font-black text-slate-900">{p._count.abastecimentos}</span>
              </div>
              <span className="text-[10px] font-black text-green-600 bg-green-50 px-3 py-1 rounded-full uppercase tracking-widest">
                Ativo
              </span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}