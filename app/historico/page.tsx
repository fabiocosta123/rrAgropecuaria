import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { BotaoExcluir } from "@/app/components/BotaoExlcuir";

export default async function HistoricoPage() {
  const registros = await prisma.abastecimento.findMany({
    include: { veiculo: true, motorista: true, posto: true },
    orderBy: { data: 'desc' },
  });

  // Cálculos consolidados
  const gastoTotal = registros.reduce((acc, curr) => acc + curr.valorTotal, 0);
  const totalLitros = registros.reduce((acc, curr) => acc + curr.quantidadeLitros, 0);
  const precoMedio = totalLitros > 0 ? gastoTotal / totalLitros : 0;

  return (
    <div className="p-8 max-w-7xl mx-auto bg-gray-50 min-h-screen text-black">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-800 uppercase tracking-tighter">
            Histórico de Abastecimentos
          </h1>
          <p className="text-gray-500 font-medium">Controle detalhado de todas as entradas da frota</p>
        </div>
        <Link 
          href="/abastecimento" 
          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-100"
        >
          + Novo Registro
        </Link>
      </div>

      {/* DASHBOARD CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <p className="text-xs text-gray-400 font-bold uppercase mb-2">Gasto Acumulado</p>
          <p className="text-3xl font-black text-blue-600" suppressHydrationWarning>
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(gastoTotal)}
          </p>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <p className="text-xs text-gray-400 font-bold uppercase mb-2">Volume Consumido</p>
          <p className="text-3xl font-black text-gray-800">
            {totalLitros.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} 
            <span className="text-sm ml-1 text-gray-400 font-bold">L</span>
          </p>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <p className="text-xs text-gray-400 font-bold uppercase mb-2">Média Preço/L</p>
          <p className="text-3xl font-black text-green-600" suppressHydrationWarning>
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(precoMedio)}
          </p>
        </div>
      </div>

      {/* TABELA DE REGISTROS */}
      <div className="bg-white shadow-xl rounded-3xl overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-900 text-white">
                <th className="p-4 text-[10px] uppercase font-black tracking-widest">Data</th>
                <th className="p-4 text-[10px] uppercase font-black tracking-widest">Veículo</th>
                <th className="p-4 text-[10px] uppercase font-black tracking-widest">Motorista / Posto</th>
                <th className="p-4 text-[10px] uppercase font-black tracking-widest text-right">KM Atual</th>
                <th className="p-4 text-[10px] uppercase font-black tracking-widest text-right">Detalhes</th>
                <th className="p-4 text-[10px] uppercase font-black tracking-widest text-right">Total Pago</th>
                <th className="p-4 text-[10px] uppercase font-black text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {registros.map((reg) => (
                <tr key={reg.id} className="hover:bg-blue-50/50 transition-colors group">
                  <td className="p-4 text-sm font-medium text-gray-600" suppressHydrationWarning>
                    {new Date(reg.data).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="p-4">
                    <Link href={`/veiculo/${reg.veiculoId}`} className="text-blue-600 font-black hover:underline block leading-none">
                      {reg.veiculo.placa}
                    </Link>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">{reg.veiculo.modelo}</span>
                  </td>
                  <td className="p-4">
                    <p className="text-sm font-bold text-gray-700 leading-none mb-1">{reg.motorista.nome}</p>
                    <p className="text-[10px] text-gray-400 flex items-center gap-1 font-semibold uppercase">
                      <span className="text-orange-500">⛽</span> {reg.posto.nome}
                    </p>
                  </td>
                  <td className="p-4 text-right text-sm font-mono font-bold text-gray-600">
                    {reg.hodometro.toLocaleString('pt-BR')} <span className="text-[10px] text-gray-300">KM</span>
                  </td>
                  <td className="p-4 text-right">
                    <p className="text-xs font-black text-gray-800">{reg.quantidadeLitros.toFixed(1)}L</p>
                    <p className="text-[10px] text-gray-400 font-medium">R$ {reg.precoPorLitro.toFixed(2)}/L</p>
                  </td>
                  <td className="p-4 text-right font-black text-blue-600" suppressHydrationWarning>
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(reg.valorTotal)}
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center items-center">
                      <BotaoExcluir id={reg.id} tabela="abastecimento" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {registros.length === 0 && (
          <div className="p-20 text-center text-gray-400 font-medium bg-white">
            Nenhum registro de abastecimento encontrado.
          </div>
        )}
      </div>
    </div>
  );
}