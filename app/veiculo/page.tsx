import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { BotaoExcluir } from "@/app/components/BotaoExlcuir";
import { Gauge, Wrench, Car } from "lucide-react";

export default async function VeiculosPage() {
  const veiculosRaw = await prisma.veiculo.findMany({
    include: {
      abastecimentos: { orderBy: { hodometro: 'desc' }, take: 1 },
      _count: { select: { abastecimentos: true } }
    },
    orderBy: { placa: 'asc' }
  });

  const veiculos = veiculosRaw as any[];

  async function criarVeiculo(formData: FormData) {
    "use server";
    const placa = (formData.get("placa") as string).toUpperCase();
    const modelo = formData.get("modelo") as string;
    const intervalo = Number(formData.get("intervaloTrocaOleo"));
    const ultimoKm = Number(formData.get("ultimoKmTrocaOleo"));

    await (prisma.veiculo as any).create({
      data: { placa, modelo, intervaloTrocaOleo: intervalo, ultimoKmTrocaOleo: ultimoKm },
    });

    revalidatePath("/veiculo");
    revalidatePath("/dashboard");
  }

  return (
    <div className="p-8 max-w-7xl mx-auto text-black bg-slate-50/30 min-h-screen">
      <header className="mb-10">
        <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic">Gerenciar Frota</h1>
      </header>

      {/* FORMULÁRIO DE CADASTRO */}
      <section className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100 mb-12">
        <form action={criarVeiculo} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="text-[10px] font-black text-gray-400 uppercase ml-2 mb-1 block">Placa</label>
            <input name="placa" placeholder="ABC1234" className="w-full border-2 p-3 rounded-2xl font-bold bg-gray-50 uppercase" required />
          </div>
          <div>
            <label className="text-[10px] font-black text-gray-400 uppercase ml-2 mb-1 block">Modelo</label>
            <input name="modelo" placeholder="Ex: Hilux" className="w-full border-2 p-3 rounded-2xl font-bold bg-gray-50" required />
          </div>
          <div>
            <label className="text-[10px] font-black text-gray-400 uppercase ml-2 mb-1 block">Troca (KM)</label>
            <select name="intervaloTrocaOleo" className="w-full border-2 p-3 rounded-2xl font-bold bg-gray-50">
              <option value="5000">5.000 KM</option>
              <option value="7000">7.000 KM</option>
              <option value="10000">10.000 KM</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] font-black text-gray-400 uppercase ml-2 mb-1 block">KM última troca</label>
            <input name="ultimoKmTrocaOleo" type="number" placeholder="Ex: 100000" className="w-full border-2 p-3 rounded-2xl font-bold bg-gray-50" required />
          </div>
          <div className="flex items-end">
            <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-2xl font-black hover:bg-blue-700 uppercase text-xs">Salvar</button>
          </div>
        </form>
      </section>

      {/* GRID DE CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {veiculos.map((v) => {
          const kmAtual = v.abastecimentos[0]?.hodometro || v.ultimoKmTrocaOleo || 0;
          const ultimoKmTroca = v.ultimoKmTrocaOleo || 0;
          const intervalo = v.intervaloTrocaOleo || 10000;
          
          const rodadoDesdeTroca = Math.max(0, kmAtual - ultimoKmTroca);
          const progresso = Math.min((rodadoDesdeTroca / intervalo) * 100, 100);
          const faltaQuanto = (ultimoKmTroca + intervalo) - kmAtual;

          return (
            <div key={v.id} className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8 flex flex-col justify-between hover:shadow-xl transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className="bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-mono font-black">{v.placa}</div>
                <div className="flex gap-2">
                  <Link href={`/veiculo/editar/${v.id}`} className="p-2 bg-gray-50 rounded-xl border border-gray-100">✏️</Link>
                  <BotaoExcluir id={v.id} tabela="veiculo" />
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-2xl font-black text-gray-800 leading-tight">{v.modelo}</h3>
                <div className="flex items-center gap-4 mt-2 text-gray-400 font-bold text-[10px] uppercase">
                  <span className="flex items-center gap-1"><Gauge size={12}/> {kmAtual.toLocaleString()} KM</span>
                  <span className="flex items-center gap-1"><Wrench size={12}/> {intervalo / 1000}K</span>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-black text-gray-400 uppercase italic">Vida Útil do Óleo</span>
                  <span className={`text-[10px] font-black ${faltaQuanto <= 500 ? 'text-red-500' : 'text-blue-600'}`}>
                    {Math.round(progresso)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                  <div className={`h-full transition-all duration-1000 ${progresso >= 90 ? 'bg-red-500' : 'bg-blue-600'}`} style={{ width: `${progresso}%` }} />
                </div>
                <p className="text-[9px] font-bold text-gray-400 mt-2 uppercase text-center">
                  {faltaQuanto > 0 ? `Faltam ${faltaQuanto} KM para a troca` : `Vencido há ${Math.abs(faltaQuanto)} KM`}
                </p>
              </div>
              
              <Link href={`/veiculo/${v.id}`} className="flex items-center justify-center gap-2 w-full py-3 bg-gray-50 hover:bg-slate-900 hover:text-white rounded-xl text-xs font-black uppercase transition-all">
                <Car size={14} /> Histórico
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}