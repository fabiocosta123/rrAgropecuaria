import { prisma } from "@/lib/prisma";
import { AlertTriangle, CheckCircle2, TrendingUp, Droplets, Fuel, ArrowRight, Zap } from "lucide-react";
import { GraficoLinha } from "../components/GraficoLinha";
import Link from "next/link";

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
    const kmAtual = v.abastecimentos[0]?.hodometro || v.ultimoKmTrocaOleo || 0;
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
  }, []).slice(-6);

  const ultimosRegistros = [...totalAbastecimentos]
    .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
    .slice(0, 5);

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto min-h-screen bg-slate-50/50 text-slate-900">
      
      {/* HEADER IMPACTANTE */}
      <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-6xl font-black tracking-tighter italic leading-none text-slate-900">
            DASH<span className="text-blue-600">BOARD</span>
          </h1>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.4em] mt-3 ml-1">
            RR Agropecuária • Central de Inteligência
          </p>
        </div>
        
        <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="text-right">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Status da Frota</p>
            <p className="text-xs font-bold text-slate-900 uppercase italic">Operação em Dia</p>
          </div>
          <div className="relative">
             <div className="w-3 h-3 bg-green-500 rounded-full animate-ping absolute" />
             <div className="w-3 h-3 bg-green-500 rounded-full relative" />
          </div>
        </div>
      </header>

      {/* CARDS DE RESUMO COM ESTILO INDUSTRIAL */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group border border-slate-800">
          <TrendingUp className="absolute -right-4 -bottom-4 text-white/5 w-32 h-32 rotate-12 group-hover:text-blue-500/10 transition-colors" />
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Investimento Total</p>
          <h2 className="text-4xl font-black text-white italic tracking-tighter">
            {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(gastoTotal)}
          </h2>
          <div className="mt-4 flex items-center gap-2">
            <span className="w-8 h-1 bg-blue-600 rounded-full" />
            <span className="text-[9px] font-bold text-slate-400 uppercase">Fluxo Acumulado</span>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden group">
          <Droplets className="absolute -right-4 -bottom-4 text-slate-50 w-32 h-32 rotate-12" />
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Volume Consumido</p>
          <h2 className="text-4xl font-black text-slate-900 italic tracking-tighter">
            {totalLitros.toLocaleString("pt-BR")} <span className="text-blue-600 text-2xl uppercase">L</span>
          </h2>
          <div className="mt-4 flex items-center gap-2">
            <span className="w-8 h-1 bg-slate-200 rounded-full" />
            <span className="text-[9px] font-bold text-slate-400 uppercase">Litros Totais</span>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden group">
          <Fuel className="absolute -right-4 -bottom-4 text-slate-50 w-32 h-32 rotate-12" />
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Custo Médio/L</p>
          <h2 className="text-4xl font-black text-green-600 italic tracking-tighter">
            R$ {mediaPreco.toFixed(2)}
          </h2>
          <div className="mt-4 flex items-center gap-2">
            <span className="w-8 h-1 bg-green-500 rounded-full" />
            <span className="text-[9px] font-bold text-slate-400 uppercase">Eficiência de Compra</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* COLUNA ESQUERDA: GRÁFICO E HISTÓRICO */}
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-black italic uppercase tracking-tighter text-slate-900">Análise de Desembolso</h3>
              <span className="text-[10px] font-black bg-slate-100 px-3 py-1 rounded-full text-slate-400 uppercase tracking-widest">Últimos 6 meses</span>
            </div>
            <div className="h-72 w-full">
              <GraficoLinha dados={dadosGrafico} />
            </div>
          </section>

          {/* ÚLTIMOS REGISTROS COM DESIGN DE LISTA */}
          <section className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl">
            <h3 className="text-xl font-black italic uppercase tracking-tighter mb-6">Atividade Recente</h3>
            <div className="divide-y divide-slate-50">
              {ultimosRegistros.map((reg) => (
                <div key={reg.id} className="py-4 flex items-center justify-between hover:bg-slate-50/50 transition-all px-2 rounded-2xl group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center font-black text-[10px] text-blue-500 shadow-lg italic">
                      {reg.veiculo.placa.substring(0, 3)}
                    </div>
                    <div>
                      <p className="font-black text-slate-800 text-sm italic uppercase tracking-tighter group-hover:text-blue-600 transition-colors">{reg.veiculo.modelo}</p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{new Date(reg.data).toLocaleDateString("pt-BR")} • {reg.motorista.nome}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-slate-900 text-lg tracking-tighter italic">R$ {reg.valorTotal.toFixed(2)}</p>
                    <p className="text-[9px] font-black text-green-600 uppercase tracking-widest">{reg.quantidadeLitros}L Registrados</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* COLUNA DIREITA: ALERTAS E AÇÕES */}
        <div className="space-y-8 h-fit">
          
          {/* ALERTAS CRÍTICOS */}
          <section className="bg-white p-8 rounded-[3rem] border-2 border-slate-100 shadow-xl">
            <div className="flex items-center gap-2 mb-6">
              <Zap size={18} className="text-orange-500" />
              <h3 className="text-sm font-black uppercase tracking-widest italic text-slate-400">Manutenções</h3>
            </div>
            <div className="space-y-4">
              {alertasManutencao.length > 0 ? (
                alertasManutencao.map(v => (
                  <div key={v.id} className={`p-5 rounded-[2rem] border shadow-sm relative overflow-hidden ${v.status === "CRÍTICO" ? "bg-red-50 border-red-100" : "bg-orange-50 border-orange-100"}`}>
                    <div className="relative z-10 flex items-center gap-4">
                       <AlertTriangle size={24} className={v.status === "CRÍTICO" ? "text-red-600" : "text-orange-600"} />
                       <div>
                         <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest leading-none mb-1">{v.placa}</p>
                         <p className="font-black text-slate-900 text-sm uppercase italic">{v.modelo}</p>
                         <p className={`text-[10px] font-black mt-1 ${v.status === "CRÍTICO" ? "text-red-600" : "text-orange-600"}`}>
                           {v.faltaQuanto <= 0 ? "⚠️ VENCIDA AGORA" : `⚠️ TROCAR EM ${v.faltaQuanto} KM`}
                         </p>
                       </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-10 text-center bg-slate-50 rounded-[2rem] border border-dashed border-slate-200">
                  <CheckCircle2 size={24} className="text-green-500 mx-auto mb-3" />
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Frota Operacional</p>
                </div>
              )}
            </div>
          </section>

          {/* AÇÕES RÁPIDAS DARK */}
          <aside className="bg-slate-900 p-8 rounded-[3rem] text-white shadow-2xl">
            <div className="bg-blue-600 w-12 h-12 rounded-2xl flex items-center justify-center text-xl mb-6 shadow-lg shadow-blue-600/30 italic font-black">
              RR
            </div>
            <h3 className="text-2xl font-black mb-4 italic text-white tracking-tighter uppercase leading-none">Ações do<br/><span className="text-blue-500">Gestor</span></h3>
            
            <div className="flex flex-col gap-3">
              <Link href="/abastecimento" className="bg-blue-600 p-5 rounded-2xl font-black text-center hover:bg-blue-500 transition-all uppercase text-[10px] tracking-[0.2em] shadow-lg shadow-blue-900/40 flex items-center justify-center gap-2 group">
                Novo Abastecimento <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/veiculo" className="bg-slate-800 p-5 rounded-2xl font-black text-center hover:bg-slate-700 transition-all border border-slate-700 uppercase text-[10px] tracking-[0.2em]">
                Gerenciar Frota
              </Link>
              <Link href="/historico" className="bg-slate-800 p-5 rounded-2xl font-black text-center hover:bg-slate-700 transition-all border border-slate-700 uppercase text-[10px] tracking-[0.2em]">
                Relatórios Completos
              </Link>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}