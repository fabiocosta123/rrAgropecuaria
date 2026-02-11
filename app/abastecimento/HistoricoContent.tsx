"use client";

import { useState } from "react";
import { Search, Calendar, Car, User, Fuel, ArrowDownAZ } from "lucide-react";

export default function HistoricoContent({ abastecimentos }: { abastecimentos: any[] }) {
  const [busca, setBusca] = useState("");
  const [filtroVeiculo, setFiltroVeiculo] = useState("");

  // Lógica de filtragem cruzada
  const filtrados = abastecimentos.filter((reg) => {
    const termo = busca.toLowerCase();
    const matchBusca = 
      reg.veiculo.modelo.toLowerCase().includes(termo) ||
      reg.veiculo.placa.toLowerCase().includes(termo) ||
      reg.motorista.nome.toLowerCase().includes(termo) ||
      reg.posto.nome.toLowerCase().includes(termo);
    
    const matchVeiculo = filtroVeiculo === "" || reg.veiculo.id === filtroVeiculo;

    return matchBusca && matchVeiculo;
  });

  // Extrair veículos únicos para o seletor de filtro
  const veiculosUnicos = Array.from(new Map(abastecimentos.map(a => [a.veiculo.id, a.veiculo])).values());

  return (
    <div className="space-y-6">
      {/* BARRA DE FILTROS INTELIGENTE */}
      <div className="bg-white p-6 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
          <input 
            type="text"
            placeholder="Buscar por motorista, posto ou placa..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full p-4 pl-14 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600/20 focus:bg-white border-transparent focus:border-blue-600 border-2 transition-all font-bold"
          />
        </div>

        <div className="flex gap-4">
            <div className="relative">
                <Car className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <select 
                    value={filtroVeiculo}
                    onChange={(e) => setFiltroVeiculo(e.target.value)}
                    className="pl-12 pr-8 py-4 bg-slate-50 rounded-2xl font-black text-xs uppercase appearance-none cursor-pointer hover:bg-slate-100 transition-colors outline-none border-2 border-transparent focus:border-blue-600"
                >
                    <option value="">Todos Veículos</option>
                    {veiculosUnicos.map((v: any) => (
                        <option key={v.id} value={v.id}>{v.modelo} - {v.placa}</option>
                    ))}
                </select>
            </div>
        </div>
      </div>

      {/* TABELA DE ALTA PERFORMANCE */}
      <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white">
                <th className="p-6 font-black uppercase text-[10px] tracking-widest italic">Data</th>
                <th className="p-6 font-black uppercase text-[10px] tracking-widest italic">Veículo</th>
                <th className="p-6 font-black uppercase text-[10px] tracking-widest italic">Motorista</th>
                <th className="p-6 font-black uppercase text-[10px] tracking-widest italic">KM Atual</th>
                <th className="p-6 font-black uppercase text-[10px] tracking-widest italic text-center">Litros</th>
                <th className="p-6 font-black uppercase text-[10px] tracking-widest italic text-right">Total (R$)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtrados.length > 0 ? (
                filtrados.map((reg) => (
                  <tr key={reg.id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="p-6 font-bold text-slate-500 text-sm">
                        <div className="flex items-center gap-2">
                            <Calendar size={14} className="text-blue-500" />
                            {new Date(reg.data).toLocaleDateString("pt-BR")}
                        </div>
                    </td>
                    <td className="p-6">
                        <span className="block font-black text-slate-800 uppercase italic tracking-tighter">{reg.veiculo.modelo}</span>
                        <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">{reg.veiculo.placa}</span>
                    </td>
                    <td className="p-6">
                        <div className="flex items-center gap-2 font-bold text-slate-700">
                            <div className="w-7 h-7 bg-slate-100 rounded-lg flex items-center justify-center text-[10px] font-black">
                                {reg.motorista.nome.charAt(0)}
                            </div>
                            {reg.motorista.nome}
                        </div>
                    </td>
                    <td className="p-6 font-mono font-bold text-slate-500">
                        {reg.hodometro.toLocaleString()} KM
                    </td>
                    <td className="p-6 text-center font-black text-slate-800">
                        {reg.quantidadeLitros.toFixed(2)}L
                    </td>
                    <td className="p-6 text-right font-black text-lg text-slate-900 tracking-tighter">
                        R$ {reg.valorTotal.toFixed(2)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-20 text-center">
                    <div className="flex flex-col items-center opacity-20">
                        <Search size={48} className="mb-4" />
                        <p className="font-black uppercase tracking-widest">Nenhum registro encontrado</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* RODAPÉ DA TABELA COM RESUMO DO FILTRO */}
        <div className="bg-slate-50 p-6 flex justify-between items-center border-t border-slate-100">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Exibindo {filtrados.length} registros</span>
            <div className="text-right">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Soma dos Filtrados</span>
                <span className="text-xl font-black text-blue-600">
                    R$ {filtrados.reduce((acc, curr) => acc + curr.valorTotal, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
            </div>
        </div>
      </div>
    </div>
  );
}