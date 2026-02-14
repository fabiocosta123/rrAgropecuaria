import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import VeiculosContent from "./VeiculoContent";

export default async function VeiculosPage() {
  const veiculosRaw = await prisma.veiculo.findMany({
    include: {
      abastecimentos: { orderBy: { hodometro: 'desc' }, take: 1 },
      _count: { select: { abastecimentos: true } }
    },
    orderBy: { placa: 'asc' }
  });

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
    <div className="p-6 md:p-10 max-w-7xl mx-auto min-h-screen bg-slate-50/50">
      {/* HEADER */}
      <header className="mb-8">
        <h1 className="text-5xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">Frota Ativa</h1>
        <p className="text-slate-400 font-bold uppercase text-xs tracking-[0.3em] mt-3">Gerenciamento de Veículos • RR Agro</p>
      </header>

      {/* FORMULÁRIO DE CADASTRO  */}
      <section className="bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl mb-8 border border-slate-800">
        <form action={criarVeiculo} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-500 uppercase ml-2 tracking-widest">Placa</label>
            <input name="placa" placeholder="ABC1234" className="w-full bg-slate-800 border-none p-4 rounded-2xl text-white font-bold placeholder:text-slate-600 focus:ring-2 focus:ring-blue-600 outline-none uppercase" required />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-500 uppercase ml-2 tracking-widest">Modelo</label>
            <input name="modelo" placeholder="Ex: Hilux" className="w-full bg-slate-800 border-none p-4 rounded-2xl text-white font-bold placeholder:text-slate-600 focus:ring-2 focus:ring-blue-600 outline-none" required />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-500 uppercase ml-2 tracking-widest">Intervalo Troca</label>
            <select name="intervaloTrocaOleo" className="w-full bg-slate-800 border-none p-4 rounded-2xl text-white font-bold focus:ring-2 focus:ring-blue-600 outline-none appearance-none">
              <option value="5000">5.000 KM</option>
              <option value="7000">7.000 KM</option>
              <option value="10000">10.000 KM</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-500 uppercase ml-2 tracking-widest">KM Última Troca</label>
            <input name="ultimoKmTrocaOleo" type="number" placeholder="Ex: 100000" className="w-full bg-slate-800 border-none p-4 rounded-2xl text-white font-bold placeholder:text-slate-600 focus:ring-2 focus:ring-blue-600 outline-none" required />
          </div>
          <div className="flex items-end">
            <button type="submit" className="w-full bg-blue-600 text-white p-4 rounded-2xl font-black hover:bg-blue-500 transition-all uppercase text-xs tracking-widest shadow-lg shadow-blue-600/20 active:scale-95">
              Cadastrar
            </button>
          </div>
        </form>
      </section>

      {/* COMPONENTE DE FILTRO E LISTAGEM */}
      <VeiculosContent veiculosIniciais={veiculosRaw} />
    </div>
  );
}