import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export default async function EditarMotoristaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const motorista = await prisma.motorista.findUnique({
    where: { id }
  });

  if (!motorista) {
    return <div className="p-10 text-center text-red-500">Motorista não encontrado.</div>;
  }

  async function atualizarMotorista(formData: FormData) {
    "use server";
    const nome = formData.get("nome") as string;

    await prisma.motorista.update({
      where: { id },
      data: { nome },
    });

    revalidatePath("/motorista");
    redirect("/motorista");
  }

  return (
    <div className="p-8 max-w-xl mx-auto text-black">
      <header className="mb-8">
        <h1 className="text-3xl font-black text-gray-900">Editar Motorista</h1>
        <p className="text-gray-500">Atualize os dados cadastrais do colaborador</p>
      </header>
      
      <form action={atualizarMotorista} className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 space-y-6">
        <div>
          <label className="block text-sm font-bold text-gray-400 uppercase mb-2 tracking-wider">
            Nome Completo
          </label>
          <input 
            name="nome" 
            defaultValue={motorista.nome}
            placeholder="Ex: João da Silva"
            className="w-full border-2 border-gray-100 p-4 rounded-2xl focus:border-blue-500 outline-none transition-all text-lg font-medium"
            required
          />
        </div>

        <div className="flex gap-4 pt-4">
          <button 
            type="submit" 
            className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-100 active:scale-95"
          >
            Salvar Alterações
          </button>
          <a 
            href="/motorista" 
            className="flex-1 bg-gray-100 text-gray-600 py-4 rounded-2xl font-bold hover:bg-gray-200 transition text-center"
          >
            Cancelar
          </a>
        </div>
      </form>
    </div>
  );
}