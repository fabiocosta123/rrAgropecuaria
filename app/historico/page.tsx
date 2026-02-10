import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { BotaoExcluir } from "@/app/components/BotaoExlcuir";
import { 
  TrendingUp, 
  TrendingDown, 
  Fuel, 
  User, 
  Navigation, 
  Plus, 
  Calendar,
  Car
} from "lucide-react";

export default async function HistoricoPage() {
  const registros = await prisma.abastecimento.findMany({
    include: { veiculo: true, motorista: true, posto: true },
    orderBy: { data: 'desc' },
  });

  const gastoTotal = registros.reduce((acc, curr) => acc + curr.valorTotal, 0);
  const totalLitros = registros.reduce((acc, curr) => acc + curr.quantidadeLitros, 0);
  const precoMedio = totalLitros > 0 ? gastoTotal / totalLitros : 0;

  // Função para descobrir a tendência de preço por posto
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tighter italic">
            Histórico
          </h1>
          <p className="text-gray-500 font-medium">Gestão detalhada de consumo da frota</p>
        </div>
        <Link 
          href="/abastecimento" 
          className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-black hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 flex items-center gap-2 group"
        >
          <Plus size={20} className="group-hover:rotate-90 transition-transform" />
          NOVO REGISTRO
        </Link>
      </div>

      {/* CARDS DE RESUMO */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
          <p className="text-[10px] text-gray-400 font-black uppercase mb-2 tracking-widest">Investimento Total</p>
          <p className="text-3xl font-black text-blue-600" suppressHydrationWarning>
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(gastoTotal)}
          </p>
        </div>
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
          <p className="text-[10px] text-gray-400 font-black uppercase mb-2 tracking-widest">Volume Total</p>
          <p className="text-3xl font-black text-gray-800">
            {totalLitros.toLocaleString('pt-BR', { minimumFractionDigits: 1 })} 
            <span className="text-sm ml-1 text-gray-300 font-bold uppercase">Litros</span>
          </p>
        </div>
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
          <p className="text-[10px] text-gray-400 font-black uppercase mb-2 tracking-widest">Média Global / L</p>
          <p className="text-3xl font-black text-green-600" suppressHydrationWarning>
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(precoMedio)}
          </p>
        </div>
      </div>

      {/* TABELA */}
      <div className="bg-white shadow-2xl shadow-gray-200/50 rounded-[2.5rem] overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="p-5 text-[10px] uppercase font-black tracking-widest text-gray-400">Data</th>
                <th className="p-5 text-[10px] uppercase font-black tracking-widest text-gray-400">Veículo</th>
                <th className="p-5 text-[10px] uppercase font-black tracking-widest text-gray-400">Operação</th>
                <th className="p-5 text-[10px] uppercase font-black tracking-widest text-gray-400 text-right">Odômetro</th>
                <th className="p-5 text-[10px] uppercase font-black tracking-widest text-gray-400 text-right">Consumo</th>
                <th className="p-5 text-[10px] uppercase font-black tracking-widest text-gray-400 text-right">Total</th>
                <th className="p-5 text-[10px] uppercase font-black tracking-widest text-gray-400 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {registros.map((reg, index) => {
                const tendencia = obterTendenciaPreco(reg, index);
                return (
                  <tr key={reg.id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="p-5" suppressHydrationWarning>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar size={14} className="text-gray-300" />
                        <span className="text-sm font-bold">{new Date(reg.data).toLocaleDateString('pt-BR')}</span>
                      </div>
                    </td>
                    <td className="p-5">
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
                          <Car size={18} />
                        </div>
                        <div>
                          <Link href={`/veiculo/${reg.veiculoId}`} className="text-gray-900 font-black hover:text-blue-600 block leading-none">
                            {reg.veiculo.placa}
                          </Link>
                          <span className="text-[10px] text-gray-400 font-bold uppercase">{reg.veiculo.modelo}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-5">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm font-bold text-gray-700">
                          <User size={14} className="text-gray-300" />
                          {reg.motorista.nome}
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-gray-400 font-black uppercase">
                          <Navigation size={12} className="text-orange-400" />
                          {reg.posto.nome}
                        </div>
                      </div>
                    </td>
                    <td className="p-5 text-right font-mono font-bold text-gray-600">
                      {reg.hodometro.toLocaleString('pt-BR')} <span className="text-[10px] text-gray-300">KM</span>
                    </td>
                    <td className="p-5 text-right">
                      <p className="text-sm font-black text-gray-800">{reg.quantidadeLitros.toFixed(1)}L</p>
                      <div className="flex items-center justify-end gap-1">
                        <span className="text-[10px] text-gray-400 font-bold">R$ {reg.precoPorLitro.toFixed(2)}/L</span>
                        {tendencia === "subiu" && <TrendingUp size={12} className="text-red-500" strokeWidth={3} />}
                        {tendencia === "desceu" && <TrendingDown size={12} className="text-green-500" strokeWidth={3} />}
                      </div>
                    </td>
                    <td className="p-5 text-right font-black text-blue-600 text-lg" suppressHydrationWarning>
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(reg.valorTotal)}
                    </td>
                    <td className="p-5">
                      <div className="flex justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <BotaoExcluir id={reg.id} tabela="abastecimento" />
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