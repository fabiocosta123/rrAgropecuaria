import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { ListaPostosCards } from "./ListaPostosCards";
import { Fuel, MapPin, Plus } from "lucide-react";

export default async function PostosPage() {
  const postos = await prisma.posto.findMany({
    include: { _count: { select: { abastecimentos: true } } },
    orderBy: { nome: 'asc' }
  });

  async function criarPosto(formData: FormData) {
    "use server";
    const nome = formData.get("nome") as string;
    const cidade = formData.get("cidade") as string;
    await prisma.posto.create({ data: { nome, cidade } });
    revalidatePath("/posto");
  }

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto min-h-screen bg-slate-50/50">
      {/* HEADER PADRONIZADO */}
      <header className="mb-8">
        <h1 className="text-5xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">Postos Parceiros</h1>
        <p className="text-slate-400 font-bold uppercase text-xs tracking-[0.3em] mt-3">Rede de Abastecimento • RR Agro</p>
      </header>

      {/* FORMULÁRIO DE CADASTRO - PADRÃO DARK INDUSTRIAL (VERDE) */}
      <section className="bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl mb-8 border border-slate-800">
        <form action={criarPosto} className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-500 uppercase ml-2 tracking-widest">Estabelecimento</label>
            <div className="relative">
              <Fuel className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
              <input 
                name="nome" 
                placeholder="Nome do Posto" 
                className="w-full bg-slate-800 border-none p-4 pl-14 rounded-2xl text-white font-bold placeholder:text-slate-600 focus:ring-2 focus:ring-green-600 outline-none transition-all" 
                required 
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-500 uppercase ml-2 tracking-widest">Localização</label>
            <div className="relative">
              <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
              <input 
                name="cidade" 
                placeholder="Cidade / UF" 
                className="w-full bg-slate-800 border-none p-4 pl-14 rounded-2xl text-white font-bold placeholder:text-slate-600 focus:ring-2 focus:ring-green-600 outline-none transition-all" 
              />
            </div>
          </div>

          <div className="flex items-end">
            <button type="submit" className="w-full bg-green-600 text-white p-4 rounded-2xl font-black hover:bg-green-500 transition-all uppercase text-xs tracking-widest shadow-lg shadow-green-600/20 active:scale-95 flex items-center justify-center gap-2">
              <Plus size={18} /> Cadastrar Posto
            </button>
          </div>
        </form>
      </section>

      {/* COMPONENTE DE FILTRO E LISTAGEM */}
      <ListaPostosCards postosInitial={postos} />
    </div>
  );
}