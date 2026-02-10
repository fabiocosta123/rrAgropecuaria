import { prisma } from "@/lib/prisma";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

export default async function DashboardPage() {
  const [totalAbastecimentos, veiculosRaw] = await Promise.all([
    prisma.abastecimento.findMany({
      include: { veiculo: true, motorista: true },
    }),
    prisma.veiculo.findMany({
      include: { 
        abastecimentos: { orderBy: { hodometro: 'desc' }, take: 1 } 
      }
    })
  ]);

  const veiculos = veiculosRaw as any[];
  const gastoTotal = totalAbastecimentos.reduce((acc, curr) => acc + (curr.valorTotal || 0), 0);
  const totalLitros = totalAbastecimentos.reduce((acc, curr) => acc + curr.quantidadeLitros, 0);
  const mediaPreco = totalAbastecimentos.length > 0 ? gastoTotal / totalLitros : 0;

  // Lógica de Alertas Refatorada
  const alertasManutencao = veiculos.map(v => {
    const kmAtual = v.abastecimentos[0]?.hodometro || 0;
    const ultimoKmTroca = v.ultimoKmTrocaOleo || 0;
    const intervalo = v.intervaloTrocaOleo || 10000;

    const proximaTrocaNoKm = ultimoKmTroca + intervalo;
    const faltaQuanto = proximaTrocaNoKm - kmAtual;
    
    let status = "OK";
    // Se falta menos de 500km ou se o KM atual já passou da próxima troca
    if (faltaQuanto <= 500) status = "CRÍTICO";
    else if (faltaQuanto <= 1500) status = "ATENÇÃO";

    return { ...v, kmAtual, faltaQuanto, status };
  }).filter(v => v.status !== "OK");

  const ultimosRegistros = [...totalAbastecimentos]
    .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
    .slice(0, 5);

  return (
    <div className="p-4 md:p-10 max-w-7xl mx-auto min-h-screen bg-slate-50/50 text-slate-900">
      <header className="mb-10">
        <h1 className="text-4xl font-black tracking-tighter italic">DASHBOARD</h1>
        <p className="text-slate-500 font-medium uppercase text-xs tracking-widest">RR Agropecuária</p>
      </header>

      {/* CARDS DE RESUMO */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-7 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40">
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Gasto Total</p>
          <h2 className="text-3xl font-black text-blue-600 italic">
            {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(gastoTotal)}
          </h2>
        </div>
        <div className="bg-white p-7 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40">
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Combustível Total</p>
          <h2 className="text-3xl font-black text-slate-800 italic">{totalLitros.toLocaleString("pt-BR")} L</h2>
        </div>
        <div className="bg-white p-7 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40">
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Média Preço/L</p>
          <h2 className="text-3xl font-black text-green-600 italic">R$ {mediaPreco.toFixed(2)}</h2>
        </div>
      </div>

      {/* ALERTAS DE MANUTENÇÃO */}
      <section className="mb-12">
        <h3 className="text-xl font-black mb-6 uppercase tracking-tighter italic">Alertas de Óleo</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {alertasManutencao.length > 0 ? (
            alertasManutencao.map(v => (
              <div key={v.id} className={`p-5 rounded-[2rem] border-2 shadow-sm ${v.status === "CRÍTICO" ? "bg-red-50 border-red-100" : "bg-orange-50 border-orange-100"}`}>
                <div className="flex justify-between mb-2">
                  <span className="text-[10px] font-black uppercase text-slate-500">{v.placa}</span>
                  <AlertTriangle size={16} className={v.status === "CRÍTICO" ? "text-red-600" : "text-orange-500"} />
                </div>
                <p className="font-black text-slate-900">{v.modelo}</p>
                <p className={`text-xl font-black mt-2 ${v.status === "CRÍTICO" ? "text-red-600" : "text-orange-600"}`}>
                  {v.faltaQuanto <= 0 ? "TROCA VENCIDA" : `Trocar em ${v.faltaQuanto} KM`}
                </p>
              </div>
            ))
          ) : (
            <div className="col-span-full py-8 text-center bg-white rounded-[2rem] border border-dashed border-slate-200 flex flex-col items-center">
              <CheckCircle2 className="text-green-500 mb-2" />
              <p className="text-slate-400 font-black uppercase text-xs tracking-widest">Toda a frota em dia</p>
            </div>
          )}
        </div>
      </section>

      {/* LISTA DE ÚLTIMOS ABASTECIMENTOS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl">
          <h3 className="text-xl font-black mb-6 italic">Últimos Registros</h3>
          <div className="space-y-4">
            {ultimosRegistros.map((reg) => (
              <div key={reg.id} className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100">
                <div>
                  <p className="font-extrabold text-slate-800">{reg.veiculo.modelo} <span className="text-blue-600">[{reg.veiculo.placa}]</span></p>
                  <p className="text-xs font-semibold text-slate-500">{new Date(reg.data).toLocaleDateString("pt-BR")}</p>
                </div>
                <p className="font-black text-slate-900 text-lg">R$ {reg.valorTotal.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white flex flex-col justify-between">
          <div>
            <h3 className="text-2xl font-black mb-4 italic italic text-blue-500">Ações</h3>
            <div className="flex flex-col gap-4">
              <a href="/abastecimento" className="bg-blue-600 p-4 rounded-2xl font-black text-center hover:bg-blue-500 transition-all uppercase text-sm">Novo Registro</a>
              <a href="/veiculo" className="bg-white/10 p-4 rounded-2xl font-black text-center hover:bg-white/20 transition-all border border-white/10 uppercase text-sm">Ver Veículos</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}