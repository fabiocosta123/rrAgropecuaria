import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export default async function EditarVeiculoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const veiculo = await prisma.veiculo.findUnique({
    where: { id }
  });

  if (!veiculo) return redirect("/veiculo");

  async function atualizarVeiculo(formData: FormData) {
    "use server";
    const placa = (formData.get("placa") as string).toUpperCase();
    const modelo = formData.get("modelo") as string;
    const intervalo = Number(formData.get("intervalo"));
    const ultimoKm = Number(formData.get("ultimoKm"));

    await (prisma.veiculo as any).update({
      where: { id },
      data: { 
        placa, 
        modelo, 
        intervaloTrocaOleo: intervalo,
        ultimoKmTrocaOleo: ultimoKm 
      }
    });

    revalidatePath("/veiculo");
    revalidatePath("/dashboard");
    redirect("/veiculo");
  }

  return (
    <div className="p-8 max-w-2xl mx-auto min-h-screen">
      <header className="mb-10">
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">Editar Máquina</h1>
        <p className="text-slate-500 font-medium">Ajuste os parâmetros de manutenção</p>
      </header>
      
      <form action={atualizarVeiculo} className="space-y-6 bg-white p-8 rounded-[2.5rem] shadow-2xl border border-slate-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-2">Placa</label>
            <input name="placa" defaultValue={veiculo.placa} className="w-full border-2 p-4 rounded-2xl font-bold bg-slate-50 uppercase text-black" required />
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-2">Modelo</label>
            <input name="modelo" defaultValue={veiculo.modelo} className="w-full border-2 p-4 rounded-2xl font-bold bg-slate-50 text-black" required />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-2">Intervalo de Troca</label>
            
            <select 
              name="intervalo" 
              defaultValue={veiculo.intervaloTrocaOleo.toString()} 
              className="w-full border-2 p-4 rounded-2xl font-bold bg-slate-50 text-black"
            >
              <option value="5000">5.000 KM</option>
              <option value="7000">7.000 KM</option>
              <option value="10000">10.000 KM</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-2">KM da Última Troca</label>
            <input 
              name="ultimoKm" 
              type="number" 
              defaultValue={veiculo.ultimoKmTrocaOleo} 
              className="w-full border-2 p-4 rounded-2xl font-bold bg-slate-50 text-black" 
              required 
            />
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button type="submit" className="flex-1 bg-slate-900 text-white py-5 rounded-2xl font-black uppercase hover:bg-blue-600 transition-all shadow-xl">
            Salvar
          </button>
          <a href="/veiculo" className="flex-1 bg-slate-100 text-slate-400 py-5 rounded-2xl font-black uppercase text-center hover:bg-slate-200 transition-all">
            Cancelar
          </a>
        </div>
      </form>
    </div>
  );
}