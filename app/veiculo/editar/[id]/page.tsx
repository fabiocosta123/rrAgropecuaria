import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export default async function EditarVeiculoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const veiculo = await prisma.veiculo.findUnique({ where: { id } });

  if (!veiculo) return <div className="p-10">Veículo não encontrado.</div>;

  async function atualizarVeiculo(formData: FormData) {
    "use server";
    const placa = (formData.get("placa") as string).toUpperCase();
    const modelo = formData.get("modelo") as string;

    await prisma.veiculo.update({
      where: { id },
      data: { placa, modelo },
    });

    revalidatePath("/veiculo");
    redirect("/veiculo");
  }

  return (
    <div className="p-8 max-w-xl mx-auto text-black">
      <h1 className="text-3xl font-black mb-6">Editar Veículo</h1>
      
      <form action={atualizarVeiculo} className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 space-y-6">
        <div>
          <label className="block text-sm font-bold text-gray-400 uppercase mb-2">Placa</label>
          <input 
            name="placa" 
            defaultValue={veiculo.placa}
            className="w-full border-2 border-gray-100 p-3 rounded-xl focus:border-blue-500 outline-none font-mono text-lg"
          />
        </div>
        
        <div>
          <label className="block text-sm font-bold text-gray-400 uppercase mb-2">Modelo</label>
          <input 
            name="modelo" 
            defaultValue={veiculo.modelo}
            className="w-full border-2 border-gray-100 p-3 rounded-xl focus:border-blue-500 outline-none"
          />
        </div>

        <div className="flex gap-4 pt-4">
          <button type="submit" className="flex-1 bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-100">
            Salvar Alterações
          </button>
          <a href="/veiculo" className="flex-1 bg-gray-100 text-gray-600 py-4 rounded-xl font-bold hover:bg-gray-200 transition text-center">
            Cancelar
          </a>
        </div>
      </form>
    </div>
  );
}