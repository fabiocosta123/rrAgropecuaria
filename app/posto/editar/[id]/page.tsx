import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Fuel, MapPin, Save, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function EditarPostoPage({ params }: { params: { id: string } }) {
  const posto = await prisma.posto.findUnique({
    where: { id: params.id }
  });

  if (!posto) return redirect("/posto");

  async function atualizarPosto(formData: FormData) {
    "use server";
    const nome = formData.get("nome") as string;
    const cidade = formData.get("cidade") as string;

    await prisma.posto.update({
      where: { id: params.id },
      data: { nome, cidade }
    });

    revalidatePath("/posto");
    redirect("/posto");
  }

  return (
    <div className="p-6 md:p-10 max-w-3xl mx-auto min-h-screen bg-slate-50/50">
      <Link href="/posto" className="flex items-center gap-2 text-slate-400 font-black uppercase text-[10px] tracking-widest mb-6 hover:text-slate-900 transition-colors">
        <ArrowLeft size={14} /> Voltar para Postos
      </Link>

      <header className="mb-10">
        <h1 className="text-4xl font-black text-slate-900 uppercase italic tracking-tighter">Editar Posto</h1>
        <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-2">Atualize as informações do estabelecimento</p>
      </header>

      <section className="bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl border border-slate-800">
        <form action={atualizarPosto} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase ml-2 tracking-widest">Nome do Estabelecimento</label>
            <div className="relative">
              <Fuel className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
              <input 
                name="nome" 
                defaultValue={posto.nome}
                className="w-full bg-slate-800 border-none p-5 pl-14 rounded-2xl text-white font-bold focus:ring-2 focus:ring-green-600 outline-none" 
                required 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase ml-2 tracking-widest">Cidade / Localização</label>
            <div className="relative">
              <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
              <input 
                name="cidade" 
                defaultValue={posto.cidade || ""}
                className="w-full bg-slate-800 border-none p-5 pl-14 rounded-2xl text-white font-bold focus:ring-2 focus:ring-green-600 outline-none" 
              />
            </div>
          </div>

          <button type="submit" className="w-full bg-green-600 text-white p-5 rounded-2xl font-black hover:bg-green-500 transition-all uppercase text-xs tracking-[0.2em] shadow-lg shadow-green-600/20 flex items-center justify-center gap-2">
            <Save size={18} /> Salvar Alterações
          </button>
        </form>
      </section>
    </div>
  );
}