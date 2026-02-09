import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export default async function EditarPostoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const posto = await prisma.posto.findUnique({
    where: { id }
  });

  if (!posto) {
    return <div className="p-10 text-center text-red-500">Posto não encontrado.</div>;
  }

  async function atualizarPosto(formData: FormData) {
    "use server";
    const nome = formData.get("nome") as string;

    await prisma.posto.update({
      where: { id },
      data: { nome },
    });

    revalidatePath("/posto");
    redirect("/posto");
  }

  return (
    <div className="p-8 max-w-xl mx-auto text-black">
      <header className="mb-8">
        <h1 className="text-3xl font-black text-gray-900">Editar Posto</h1>
        <p className="text-gray-500">Atualize o nome da unidade credenciada</p>
      </header>
      
      <form action={atualizarPosto} className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 space-y-6">
        <div>
          <label className="block text-sm font-bold text-gray-400 uppercase mb-2 tracking-wider">
            Nome do Estabelecimento
          </label>
          <input 
            name="nome" 
            defaultValue={posto.nome}
            placeholder="Ex: Posto Rota 66 - Ipiranga"
            className="w-full border-2 border-gray-50 p-4 rounded-2xl focus:border-green-500 outline-none transition-all text-lg font-medium"
            required
          />
        </div>

        <div className="flex gap-4 pt-4">
          <button 
            type="submit" 
            className="flex-1 bg-green-600 text-white py-4 rounded-2xl font-bold hover:bg-green-700 transition shadow-lg shadow-green-100 active:scale-95"
          >
            Salvar Alterações
          </button>
          <a 
            href="/posto" 
            className="flex-1 bg-gray-100 text-gray-600 py-4 rounded-2xl font-bold hover:bg-gray-200 transition text-center"
          >
            Cancelar
          </a>
        </div>
      </form>
    </div>
  );
}