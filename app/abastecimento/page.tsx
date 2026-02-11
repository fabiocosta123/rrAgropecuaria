import { prisma } from "@/lib/prisma";
import HistoricoContent from "./HistoricoContent";

export default async function HistoricoPage() {
  const abastecimentos = await prisma.abastecimento.findMany({
    include: {
      veiculo: true,
      motorista: true,
      posto: true
    },
    orderBy: {
      data: 'desc'
    }
  });

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto min-h-screen bg-slate-50/50">
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-5xl font-black text-slate-900 italic tracking-tighter uppercase leading-none">Histórico</h1>
          <p className="text-slate-400 font-bold uppercase text-xs tracking-[0.3em] mt-3">Relatório Geral de Abastecimentos</p>
        </div>
        <a 
          href="/abastecimento/novo" 
          className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black hover:bg-blue-600 transition-all uppercase text-xs tracking-widest shadow-xl active:scale-95"
        >
          + Novo Registro
        </a>
      </header>

      {/* Componente Client com Filtros e Tabela */}
      <HistoricoContent abastecimentos={abastecimentos} />
    </div>
  );
}