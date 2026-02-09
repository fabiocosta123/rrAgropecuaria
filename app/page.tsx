import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function DashboardGeral() {
  // Buscamos os totais para o resumo
  const [totalVeiculos, totalMotoristas, abastecimentos] = await Promise.all([
    prisma.veiculo.count(),
    prisma.motorista.count(),
    prisma.abastecimento.findMany({
      orderBy: { data: 'desc' },
      take: 10, // Pegamos os últimos 10 para o resumo
      include: { veiculo: true }
    })
  ]);

  const gastoTotal = abastecimentos.reduce((acc, curr) => acc + curr.valorTotal, 0);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900 italic">Controle RR Agropecuária</h1>
        <p className="text-gray-500">Visão geral da frota e consumo de combustível</p>
      </header>

      {/* CARDS DE RESUMO RÁPIDO */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="bg-white p-6 rounded-2xl shadow-md border-b-4 border-blue-500">
          <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">Veículos</span>
          <p className="text-3xl font-black">{totalVeiculos}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-md border-b-4 border-green-500">
          <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">Motoristas</span>
          <p className="text-3xl font-black">{totalMotoristas}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-md border-b-4 border-yellow-500">
          <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">Últimos Gastos (10)</span>
          <p className="text-3xl font-black text-red-600">R$ {gastoTotal.toLocaleString('pt-BR')}</p>
        </div>
        <Link href="/abastecimento" className="bg-blue-600 p-6 rounded-2xl shadow-lg hover:bg-blue-700 transition flex items-center justify-center text-white font-bold text-center">
          + REGISTRAR NOVO ABASTECIMENTO
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* ÚLTIMAS ATIVIDADES */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold mb-6">Atividade Recente</h2>
          <div className="space-y-4">
            {abastecimentos.map((abast) => (
              <div key={abast.id} className="flex justify-between items-center border-b pb-3 last:border-0">
                <div>
                  <p className="font-bold text-gray-800">{abast.veiculo.placa}</p>
                  <p className="text-xs text-gray-400">{new Date(abast.data).toLocaleDateString('pt-BR')}</p>
                </div>
                <div className="text-right">
                  <p className="text-green-600 font-bold">R$ {abast.valorTotal.toFixed(2)}</p>
                  <p className="text-xs text-gray-400">{abast.quantidadeLitros}L</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ACESSO RÁPIDO */}
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-bold mb-2">Ações Rápidas</h2>
          <Link href="/veiculo" className="bg-gray-100 p-4 rounded-xl hover:bg-gray-200 transition font-medium">📦 Gerenciar Frota</Link>
          <Link href="/motorista" className="bg-gray-100 p-4 rounded-xl hover:bg-gray-200 transition font-medium">👤 Cadastro de Motoristas</Link>
          <Link href="/historico" className="bg-gray-100 p-4 rounded-xl hover:bg-gray-200 transition font-medium">📊 Relatório Completo</Link>
        </div>
      </div>
    </div>
  );
}