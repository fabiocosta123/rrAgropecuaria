import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  // 1. Buscando dados básicos para os cards
  const totalAbastecimentos = await prisma.abastecimento.findMany();
  
  const gastoTotal = totalAbastecimentos.reduce((acc, curr) => acc + (curr.quantidadeLitros * curr.precoPorLitro), 0);
  const totalLitros = totalAbastecimentos.reduce((acc, curr) => acc + curr.quantidadeLitros, 0);
  const mediaPreco = totalAbastecimentos.length > 0 ? (gastoTotal / totalLitros) : 0;

  // 2. Últimos 5 registros para a tabela rápida
  const ultimosRegistros = await prisma.abastecimento.findMany({
    take: 5,
    orderBy: { data: 'desc' },
    include: { veiculo: true, motorista: true }
  });

  return (
    <div className="p-8 max-w-7xl mx-auto text-black">
      <header className="mb-10">
        <h1 className="text-4xl font-black text-gray-900 tracking-tighter">DASHBOARD</h1>
        <p className="text-gray-500 font-medium">Visão geral da frota RR Agro</p>
      </header>

      {/* CARDS DE RESUMO */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <p className="text-sm font-bold text-gray-400 uppercase mb-1">Gasto Total</p>
          <h2 className="text-3xl font-black text-blue-600">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(gastoTotal)}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <p className="text-sm font-bold text-gray-400 uppercase mb-1">Combustível Total</p>
          <h2 className="text-3xl font-black text-gray-800">{totalLitros.toFixed(2)} <span className="text-lg">L</span></h2>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <p className="text-sm font-bold text-gray-400 uppercase mb-1">Média Preço/Litro</p>
          <h2 className="text-3xl font-black text-green-600">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(mediaPreco)}
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* TABELA DE ÚLTIMAS ATIVIDADES */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <h3 className="text-xl font-black mb-6">Últimos Abastecimentos</h3>
          <div className="space-y-4">
            {ultimosRegistros.map((reg) => (
              <div key={reg.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                <div>
                  <p className="font-bold text-gray-800">{reg.veiculo.modelo} ({reg.veiculo.placa})</p>
                  <p className="text-xs text-gray-500">{reg.motorista.nome} • {new Date(reg.data).toLocaleDateString('pt-BR')}</p>
                </div>
                <div className="text-right">
                  <p className="font-black text-blue-600">R$ {(reg.quantidadeLitros * reg.precoPorLitro).toFixed(2)}</p>
                  <p className="text-xs text-gray-400">{reg.quantidadeLitros}L</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CARD DE ATALHOS RÁPIDOS */}
        <div className="bg-blue-600 p-8 rounded-3xl shadow-xl shadow-blue-100 text-white flex flex-col justify-center">
          <h3 className="text-2xl font-black mb-4">Ações Rápidas</h3>
          <p className="mb-8 opacity-80 font-medium">Selecione uma operação para gerenciar a agropecuária.</p>
          <div className="grid grid-cols-2 gap-4">
            <a href="/abastecimento" className="bg-white text-blue-600 p-4 rounded-2xl font-bold text-center hover:bg-blue-50 transition">Novo Abastecimento</a>
            <a href="/veiculo" className="bg-blue-500 text-white p-4 rounded-2xl font-bold text-center hover:bg-blue-400 transition border border-blue-400">Ver Frota</a>
          </div>
        </div>
      </div>
    </div>
  );
}