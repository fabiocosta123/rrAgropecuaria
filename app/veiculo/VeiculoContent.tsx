"use client";

import { useState } from "react";
import { Search, Gauge, Wrench, Car, Pencil } from "lucide-react";
import Link from "next/link";
import { BotaoExcluir } from "@/app/components/BotaoExlcuir";

export default function VeiculosContent({ veiculosIniciais }: { veiculosIniciais: any[] }) {
  const [filtro, setFiltro] = useState("");

  const filtrados = veiculosIniciais.filter(v => 
    v.placa.toLowerCase().includes(filtro.toLowerCase()) ||
    v.modelo.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <>
      {/* BUSCA DINÂMICA COM MARGEM REDUZIDA */}
      <div className="relative mb-8 group">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
        <input 
          type="text"
          placeholder="Pesquisar por placa ou modelo..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="w-full p-5 pl-16 bg-white border-2 border-slate-100 rounded-[2rem] outline-none focus:border-blue-600 shadow-xl shadow-slate-200/40 transition-all font-bold text-slate-700"
        />
      </div>

      {/* GRID DE CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtrados.map((v) => {
          const kmAtual = v.abastecimentos[0]?.hodometro || v.ultimoKmTrocaOleo || 0;
          const ultimoKmTroca = v.ultimoKmTrocaOleo || 0;
          const intervalo = v.intervaloTrocaOleo || 10000;
          const rodadoDesdeTroca = Math.max(0, kmAtual - ultimoKmTroca);
          const progresso = Math.min((rodadoDesdeTroca / intervalo) * 100, 100);
          const faltaQuanto = (ultimoKmTroca + intervalo) - kmAtual;

          return (
            <div key={v.id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 flex flex-col justify-between hover:shadow-xl transition-all group">
              <div className="flex justify-between items-start mb-6">
                <div className="bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-mono font-black tracking-wider">
                  {v.placa}
                </div>
                <div className="flex gap-2">
                  <Link href={`/veiculo/editar/${v.id}`} className="p-2 bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors border border-slate-100">
                    <Pencil size={16} />
                  </Link>
                  <BotaoExcluir id={v.id} tabela="veiculo" />
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-2xl font-black text-slate-800 leading-tight italic uppercase tracking-tighter">{v.modelo}</h3>
                <div className="flex items-center gap-4 mt-3 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                  <span className="flex items-center gap-1.5"><Gauge size={14} className="text-blue-600" /> {kmAtual.toLocaleString()} KM</span>
                  <span className="flex items-center gap-1.5"><Wrench size={14} className="text-blue-600" /> {intervalo / 1000}K</span>
                </div>
              </div>

              <div className="bg-slate-50/50 p-5 rounded-[2rem] border border-slate-100 mb-6">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[10px] font-black text-slate-400 uppercase italic tracking-widest">Vida Útil do Óleo</span>
                  <span className={`text-xs font-black ${faltaQuanto <= 500 ? 'text-red-600' : 'text-blue-600'}`}>
                    {Math.round(progresso)}%
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 shadow-[0_0_10px_rgba(37,99,235,0.3)] ${progresso >= 90 ? 'bg-red-600' : 'bg-blue-600'}`} 
                    style={{ width: `${progresso}%` }} 
                  />
                </div>
                <p className={`text-[10px] font-black mt-3 uppercase text-center ${faltaQuanto <= 500 ? 'text-red-600 animate-pulse' : 'text-slate-400'}`}>
                  {faltaQuanto > 0 ? `Faltam ${faltaQuanto} KM para a troca` : `Vencido há ${Math.abs(faltaQuanto)} KM`}
                </p>
              </div>

              <Link href={`/veiculo/${v.id}`} className="flex items-center justify-center gap-2 w-full py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-lg shadow-slate-200 group-hover:shadow-blue-200">
                <Car size={14} /> Histórico Detalhado
              </Link>
            </div>
          );
        })}
      </div>
    </>
  );
}