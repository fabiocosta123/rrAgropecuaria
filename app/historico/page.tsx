import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { BotaoExcluir } from "@/app/components/BotaoExcluir";
import { 
  TrendingUp, 
  TrendingDown, 
  Navigation, 
  Plus, 
  Calendar,
  Car,
  Pencil
} from "lucide-react";
import { BotaoExportar } from "./BotaoExportar";
import { FiltroData } from "./FiltroData";

interface HistoricoProps {
  searchParams: {
    inicio?: string;
    fim?: string;
  };
}

export default async function HistoricoPage({ searchParams }: HistoricoProps) {
  const where: any = {};
  if (searchParams.inicio || searchParams.fim) {
    where.data = {};
    if (searchParams.inicio) where.data.gte = new Date(searchParams.inicio + "T00:00:00");
    if (searchParams.fim) where.data.lte = new Date(searchParams.fim + "T23:59:59");
  }

  const registros = await prisma.abastecimento.findMany({
    where,
    include: { veiculo: true, motorista: true, posto: true },
    orderBy: { data: 'desc' },
  });

  const gastoTotal = registros.reduce((acc, curr) => acc + curr.valorTotal, 0);
  const totalLitros = registros.reduce((acc, curr) => acc + curr.quantidadeLitros, 0);
  const precoMedio = totalLitros > 0 ? gastoTotal / totalLitros : 0;

  const obterTendenciaPreco = (registroAtual: any, index: number) => {
    const anteriorMesmoPosto = registros.slice(index + 1).find(
      (r) => r.postoId === registroAtual.postoId
    );
    if (!anteriorMesmoPosto) return null;
    if (registroAtual.precoPorLitro > anteriorMesmoPosto.precoPorLitro) return "subiu";
    if (registroAtual.precoPorLitro < anteriorMesmoPosto.precoPorLitro) return "desceu";
    return "igual";
  };

  return (
    <div className="p-8 max-w-7xl mx-auto bg-gray-50 min-h-screen text-black font-sans">
      
      {/* HEADER */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-6 mb-10">
        <div>
          <h1 className="text-5xl font-black text-gray-900 uppercase tracking-tighter italic leading-none">
            Histórico
          </h1>
          <p className="text-gray-500 font-medium mt-2">Monitoramento de consumo e performance de custos</p>
        </div>
        
        <div className="flex flex-col md:flex-row items-center gap-3 w-full xl:w-auto">
          <FiltroData />
          <div className="flex items-center gap-3 w-full md:w-auto">
            <BotaoExportar registros={registros} />
            
          </div>
        </div>
      </div>

      {/* CARDS DE RESUMO */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
          <p className="text-[10px] text-gray-400 font-black uppercase mb-2 tracking-widest">Investimento no Período</p>
          <p className="text-4xl font-black text-blue-600 tracking-tighter">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(gastoTotal)}
          </p>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
          <p className="text-[10px] text-gray-400 font-black uppercase mb-2 tracking-widest">Volume Total</p>
          <p className="text-4xl font-black text-gray-800 tracking-tighter">
            {totalLitros.toLocaleString('pt-BR', { minimumFractionDigits: 1 })} <span className="text-sm text-gray-300">L</span>
          </p>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
          <p className="text-[10px] text-gray-400 font-black uppercase mb-2 tracking-widest">Média do Período</p>
          <p className="text-4xl font-black text-green-600 tracking-tighter">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(precoMedio)}
          </p>
        </div>
      </div>

      {/* TABELA */}
      <div className="bg-white shadow-2xl rounded-[3rem] overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="p-6 text-[10px] uppercase font-black tracking-widest text-gray-400">📅 Data</th>
                <th className="p-6 text-[10px] uppercase font-black tracking-widest text-gray-400">🚛 Veículo</th>
                <th className="p-6 text-[10px] uppercase font-black tracking-widest text-gray-400">👤 Operação</th>
                <th className="p-6 text-[10px] uppercase font-black tracking-widest text-gray-400 text-right">📍 Odômetro</th>
                <th className="p-6 text-[10px] uppercase font-black tracking-widest text-gray-400 text-right">⛽ Detalhes</th>
                <th className="p-6 text-[10px] uppercase font-black tracking-widest text-gray-400 text-right">💵 Total</th>
                <th className="p-6 text-[10px] uppercase font-black tracking-widest text-gray-400 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {registros.map((reg, index) => {
                const tendencia = obterTendenciaPreco(reg, index);

                
                const proximoAbastecimento = registros
                  .slice(0, index) 
                  .reverse() 
                  .find(r => r.veiculoId === reg.veiculoId);

                let kmRodados = 0;
                let consumoKml = 0;

                if (proximoAbastecimento) {
                  kmRodados = proximoAbastecimento.hodometro - reg.hodometro;
                  consumoKml = kmRodados / reg.quantidadeLitros;
                }

                return (
                  <tr key={reg.id} className="hover:bg-blue-50/40 transition-all group">
                    <td className="p-6">
                      <span className="text-sm font-bold text-gray-600">{new Date(reg.data).toLocaleDateString('pt-BR')}</span>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="bg-gray-100 p-2.5 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors"><Car size={18} /></div>
                        <div>
                          <p className="text-gray-900 font-black leading-none">{reg.veiculo.placa}</p>
                          <span className="text-[10px] text-gray-400 font-black uppercase">{reg.veiculo.modelo}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-gray-700">{reg.motorista.nome}</p>
                        <p className="flex items-center gap-1 text-[10px] text-gray-400 font-black uppercase">
                          <Navigation size={12} className="text-orange-400" /> {reg.posto.nome}
                        </p>
                      </div>
                    </td>
                    <td className="p-6 text-right">
                      <span className="text-sm font-mono font-bold text-gray-600 bg-gray-50 px-3 py-1 rounded-lg">
                        {reg.hodometro.toLocaleString('pt-BR')} KM
                      </span>
                    </td>
                    <td className="p-6 text-right">
                      <p className="text-sm font-black text-gray-800">{reg.quantidadeLitros.toFixed(1)}L</p>
                      <div className="flex flex-col items-end gap-0.5">
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] text-gray-400 font-bold">R$ {reg.precoPorLitro.toFixed(2)}/L</span>
                          {tendencia === "subiu" && <TrendingUp size={12} className="text-red-500" />}
                          {tendencia === "desceu" && <TrendingDown size={12} className="text-green-500" />}
                        </div>
                        {consumoKml > 0 ? (
                          <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded font-black italic">
                            {consumoKml.toFixed(2)} KM/L
                          </span>
                        ) : (
                          <span className="text-[9px] text-gray-300 font-bold uppercase italic tracking-tighter">Aguard. Próximo</span>
                        )}
                      </div>
                    </td>
                    <td className="p-6 text-right">
                      <p className="text-xl font-black text-blue-600 italic">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(reg.valorTotal)}
                      </p>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                        <Link 
                          href={`/abastecimento?edit=${reg.id}`}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                        >
                          <Pencil size={18} />
                        </Link>
                        <BotaoExcluir id={reg.id} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}