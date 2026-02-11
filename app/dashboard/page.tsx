import { prisma } from "@/lib/prisma";
import { AlertTriangle, CheckCircle2, TrendingUp, Droplets, Fuel } from "lucide-react";
import { GraficoLinha } from "../components/GraficoLinha";

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

  const alertasManutencao = veiculos.map(v => {
    const kmAtual = v.abastecimentos[0]?.hodometro || 0;
    const ultimoKmTroca = v.ultimoKmTrocaOleo || 0;
    const intervalo = v.intervaloTrocaOleo || 10000;
    const proximaTrocaNoKm = ultimoKmTroca + intervalo;
    const faltaQuanto = proximaTrocaNoKm - kmAtual;

    let status = "OK";
    if (faltaQuanto <= 500) status = "CRÍTICO";
    else if (faltaQuanto <= 1500) status = "ATENÇÃO";

    return { ...v, kmAtual, faltaQuanto, status };
  }).filter(v => v.status !== "OK");

  const dadosGrafico = totalAbastecimentos.reduce((acc: any[], curr) => {
    const mes = new Intl.DateTimeFormat('pt-BR', { month: 'short' }).format(new Date(curr.data));
    const existente = acc.find(i => i.name === mes);
    if (existente) {
      existente.total += curr.valorTotal;
    } else {
      acc.push({ name: mes, total: curr.valorTotal });
    }
    return acc;
  }, []).slice(-6); // Últimos 6 meses

  const ultimosRegistros = [...totalAbastecimentos]
    .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
    .slice(0, 5);

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto min-h-screen bg-slate-50/50 text-slate-900">
      {/* HEADER */}
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black tracking-tighter italic leading-none">DASHBOARD</h1>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em] mt-2">RR Agropecuária • Gestão de Frota</p>
        </div>
        <div className="hidden md:block text-right">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status do Sistema</span>
          <div className="flex items-center gap-2 text-green-500 font-bold text-xs">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> ONLINE
          </div>
        </div>
      </header>

      {/* CARDS DE RESUMO */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/30 group hover:border-blue-500 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Gasto Total</p>
            <TrendingUp size={16} className="text-blue-500" />
          </div>
          <h2 className="text-3xl font-black text-blue-600 italic">
            {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(gastoTotal)}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/30 group hover:border-slate-800 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Combustível</p>
            <Droplets size={16} className="text-slate-800" />
          </div>
          <h2 className="text-3xl font-black text-slate-800 italic">{totalLitros.toLocaleString("pt-BR")} L</h2>
        </div>

        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/30 group hover:border-green-500 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Média por Litro</p>
            <Fuel size={16} className="text-green-600" />
          </div>
          <h2 className="text-3xl font-black text-green-600 italic">R$ {mediaPreco.toFixed(2)}</h2>
        </div>
      </div>

      {/* ALERTAS E CONTEÚDO PRINCIPAL */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start"> {/* items-start evita o crescimento das colunas */}

        {/* COLUNA DA ESQUERDA (ALERTAS E TABELA) */}
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl mb-8">
            <h3 className="text-xl font-black mb-6 italic tracking-tighter">Fluxo de Gastos (R$)</h3>
            <div className="h-64 w-full">
              {/* Componente de Gráfico (Exemplo simplificado) */}
              {/* Para usar Recharts, este trecho precisa estar em um componente 'use client' */}
              <GraficoLinha dados={dadosGrafico} />
            </div>
          </section>

          {/* SEÇÃO DE ALERTAS */}
          <section>
            <h3 className="text-xs font-black mb-4 uppercase tracking-[0.2em] text-slate-400 italic">Alertas de Manutenção</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {alertasManutencao.length > 0 ? (
                alertasManutencao.map(v => (
                  <div key={v.id} className={`p-5 rounded-3xl border-2 shadow-sm flex items-center gap-4 ${v.status === "CRÍTICO" ? "bg-red-50 border-red-100" : "bg-orange-50 border-orange-100"}`}>
                    <div className={`p-3 rounded-2xl ${v.status === "CRÍTICO" ? "bg-red-500" : "bg-orange-500"} text-white`}>
                      <AlertTriangle size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase text-slate-400">{v.placa}</p>
                      <p className="font-black text-slate-900 leading-none mb-1">{v.modelo}</p>
                      <p className={`text-sm font-black ${v.status === "CRÍTICO" ? "text-red-600" : "text-orange-600"}`}>
                        {v.faltaQuanto <= 0 ? "TROCA VENCIDA" : `Faltam ${v.faltaQuanto} KM`}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-6 flex items-center justify-center gap-3 bg-white rounded-3xl border border-dashed border-slate-200">
                  <CheckCircle2 size={18} className="text-green-500" />
                  <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest">Frota 100% Operacional</p>
                </div>
              )}
            </div>
          </section>

          {/* ÚLTIMOS REGISTROS */}
          <section className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl">
            <h3 className="text-xl font-black mb-6 italic tracking-tighter">Últimos Abastecimentos</h3>
            <div className="space-y-3">
              {ultimosRegistros.map((reg) => (
                <div key={reg.id} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm font-black text-xs text-blue-600 border border-slate-100">
                      {reg.veiculo.placa.substring(0, 3)}
                    </div>
                    <div>
                      <p className="font-black text-slate-800 text-sm leading-tight">{reg.veiculo.modelo}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">{new Date(reg.data).toLocaleDateString("pt-BR")}</p>
                    </div>
                  </div>
                  <p className="font-black text-slate-900">R$ {reg.valorTotal.toFixed(2)}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* COLUNA DA DIREITA (AÇÕES) - h-fit impede o espaço vazio */}
        <aside className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl h-fit sticky top-10">
          <div className="bg-blue-600 w-12 h-12 rounded-2xl flex items-center justify-center text-xl mb-6 shadow-lg shadow-blue-600/20 italic font-black">
            RR
          </div>
          <h3 className="text-2xl font-black mb-2 italic text-blue-500 tracking-tighter uppercase">Ações Rápidas</h3>
          <p className="text-slate-400 text-xs font-medium mb-8 leading-relaxed">
            Gerencie novos abastecimentos ou consulte os detalhes da sua frota ativa.
          </p>

          <div className="flex flex-col gap-3">
            <a href="/abastecimento" className="bg-blue-600 p-4 rounded-2xl font-black text-center hover:bg-blue-500 transition-all uppercase text-xs tracking-wider shadow-lg shadow-blue-900/20">
              Novo Registro
            </a>
            <a href="/veiculo" className="bg-white/5 p-4 rounded-2xl font-black text-center hover:bg-white/10 transition-all border border-white/10 uppercase text-xs tracking-wider">
              Ver Veículos
            </a>
          </div>

          <div className="mt-10 pt-8 border-t border-white/5">
            <div className="flex items-center justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest">
              <span>Versão v1.0.4</span>
              <span className="text-blue-500">RR Agro</span>
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
}