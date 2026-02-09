import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { BotaoExcluir } from "@/app/components/BotaoExlcuir";

export default async function PostosPage() {
  const postos = await prisma.posto.findMany({ 
    orderBy: { nome: 'asc' } 
  });

  async function criarPosto(formData: FormData) {
    "use server";
    const nome = formData.get("nome") as string;
    await prisma.posto.create({ data: { nome } });
    revalidatePath("/posto");
  }

  return (
    <div className="p-8 max-w-6xl mx-auto text-black">
      <header className="mb-10">
        <h1 className="text-3xl font-black text-gray-900">Postos Credenciados</h1>
        <p className="text-gray-500 font-medium">Unidades de abastecimento parceiras</p>
      </header>

      {/* Formulário de Cadastro */}
      <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-12">
        <form action={criarPosto} className="flex gap-4">
          <input 
            name="nome" 
            placeholder="Nome do Posto (Ex: Posto Trevo)" 
            className="border-2 border-gray-50 p-3 rounded-xl flex-1 focus:border-green-500 outline-none transition text-black" 
            required 
          />
          <button type="submit" className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-700 shadow-lg shadow-green-100 transition-all">
            Cadastrar Posto
          </button>
        </form>
      </section>

      {/* Grid de Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {postos.map((p) => (
          <div key={p.id} className="relative bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 group hover:border-green-500 transition-all">
            <div className="bg-orange-100 w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-inner">
              ⛽
            </div>
            
            <div className="flex-1">
              <p className="font-bold text-gray-800 text-lg leading-tight">{p.nome}</p>
              <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">Parceiro Agro</p>
            </div>

            {/* Ações */}
            <div className="flex gap-1">
              <Link href={`/posto/editar/${p.id}`} className="p-2 hover:bg-blue-50 rounded-lg text-blue-500 transition-colors" title="Editar">
                ✏️
              </Link>
              <BotaoExcluir id={p.id} tabela="posto" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}