import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const totalAbastecimentos = await prisma.abastecimento.findMany();

  const gastoTotal = totalAbastecimentos.reduce(
    (acc, curr) => acc + curr.quantidadeLitros * curr.precoPorLitro,
    0
  );
  const totalLitros = totalAbastecimentos.reduce(
    (acc, curr) => acc + curr.quantidadeLitros,
    0
  );
  const mediaPreco =
    totalAbastecimentos.length > 0 ? gastoTotal / totalLitros : 0;

  const ultimosRegistros = await prisma.abastecimento.findMany({
    take: 5,
    orderBy: { data: "desc" },
    include: { veiculo: true, motorista: true },
  });

  return (
    // Removido text-black fixo para evitar conflitos; usamos classes específicas nos textos
    <div className="p-4 md:p-10 max-w-7xl mx-auto min-h-screen">
      
      {/* HEADER */}
      <header className="mb-10">
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter">
          DASHBOARD
        </h1>
        <p className="text-slate-500 font-medium">Visão geral da frota RR Agro</p>
      </header>

      {/* CARDS DE RESUMO */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-7 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-100/50 flex flex-col justify-between">
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Gasto Total</p>
          <h2 className="text-3xl font-black text-blue-600">
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(gastoTotal)}
          </h2>
        </div>

        <div className="bg-white p-7 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-100/50 flex flex-col justify-between">
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Combustível Total</p>
          <h2 className="text-3xl font-black text-slate-800">
            {totalLitros.toLocaleString("pt-BR")} <span className="text-sm font-bold text-slate-400">LITROS</span>
          </h2>
        </div>

        <div className="bg-white p-7 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-100/50 flex flex-col justify-between">
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Média Preço/Litro</p>
          <h2 className="text-3xl font-black text-green-600">
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(mediaPreco)}
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* TABELA DE ÚLTIMAS ATIVIDADES - Agora ocupa 2 colunas no desktop */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-100/50">
          <h3 className="text-xl font-black text-slate-900 mb-6">Últimos Abastecimentos</h3>
          <div className="space-y-4">
            {ultimosRegistros.length > 0 ? (
              ultimosRegistros.map((reg) => (
                <div key={reg.id} className="flex items-center justify-between p-5 bg-slate-50 hover:bg-slate-100 transition-colors rounded-2xl border border-slate-100">
                  <div>
                    <p className="font-extrabold text-slate-800">{reg.veiculo.modelo} <span className="text-blue-600 ml-1">[{reg.veiculo.placa}]</span></p>
                    <p className="text-xs font-semibold text-slate-500 mt-1">{reg.motorista.nome} • {new Date(reg.data).toLocaleDateString("pt-BR")}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-slate-900 text-lg">R$ {(reg.quantidadeLitros * reg.precoPorLitro).toFixed(2)}</p>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{reg.quantidadeLitros}L abastecidos</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-slate-400 font-medium text-center py-10">Nenhum registro encontrado.</p>
            )}
          </div>
        </div>

        {/* CARD DE ATALHOS RÁPIDOS - Ocupa 1 coluna */}
        <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl text-white flex flex-col">
          <div className="bg-blue-500 w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-lg shadow-blue-500/30">⚡</div>
          <h3 className="text-2xl font-black mb-2">Ações Rápidas</h3>
          <p className="mb-8 text-slate-400 text-sm font-medium leading-relaxed">
            Gerencie sua frota agropecuária de forma ágil e centralizada.
          </p>
          <div className="flex flex-col gap-4">
            <a href="/abastecimento" className="bg-blue-600 text-white p-4 rounded-2xl font-black text-center hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20 active:scale-95">
              + Novo Abastecimento
            </a>
            <a href="/veiculo" className="bg-white/10 text-white p-4 rounded-2xl font-black text-center hover:bg-white/20 transition-all border border-white/10 active:scale-95">
              Visualizar Frota
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}