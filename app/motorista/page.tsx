import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import MotoristasContent from "./MotoristaContent";
import { User, Plus } from "lucide-react";

export default async function MotoristasPage() {
  const motoristas = await prisma.motorista.findMany({ 
    orderBy: { nome: 'asc' } 
  });

  async function criarMotorista(formData: FormData) {
    "use server";
    const nome = formData.get("nome") as string;
    await prisma.motorista.create({ data: { nome } });
    revalidatePath("/motorista");
  }

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto min-h-screen bg-slate-50/50 text-slate-900">
      {/* HEADER PADRONIZADO */}
      <header className="mb-8">
        <h1 className="text-5xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">Motoristas</h1>
        <p className="text-slate-400 font-bold uppercase text-xs tracking-[0.3em] mt-3">Gestão de Operadores • RR Agro</p>
      </header>

      {/* FORMULÁRIO DE CADASTRO - PADRÃO DARK INDUSTRIAL */}
      <section className="bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl mb-8 border border-slate-800">
        <form action={criarMotorista} className="flex flex-col md:flex-row gap-5">
          <div className="flex-1 space-y-1">
            <label className="text-[10px] font-black text-slate-500 uppercase ml-2 tracking-widest">Nome do Condutor</label>
            <div className="relative">
              <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
              <input 
                name="nome" 
                placeholder="Nome completo" 
                className="w-full bg-slate-800 border-none p-4 pl-14 rounded-2xl text-white font-bold placeholder:text-slate-600 focus:ring-2 focus:ring-blue-600 outline-none transition-all" 
                required 
              />
            </div>
          </div>
          <div className="flex items-end">
            <button type="submit" className="w-full md:w-auto bg-blue-600 text-white px-10 py-4 rounded-2xl font-black hover:bg-blue-500 transition-all uppercase text-xs tracking-widest shadow-lg shadow-blue-600/20 active:scale-95 flex items-center justify-center gap-2">
              <Plus size={18} /> Cadastrar
            </button>
          </div>
        </form>
      </section>

      {/* COMPONENTE DE FILTRO E LISTAGEM */}
      <MotoristasContent motoristasIniciais={motoristas} />
    </div>
  );
}