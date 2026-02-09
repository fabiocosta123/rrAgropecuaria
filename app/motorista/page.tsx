import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { BotaoExcluir } from "@/app/components/BotaoExlcuir";

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
    <div className="p-8 max-w-6xl mx-auto text-black">
      <header className="mb-10">
        <h1 className="text-3xl font-black text-gray-900">Motoristas</h1>
        <p className="text-gray-500 font-medium">Gerencie a equipe de condutores da RR Agro</p>
      </header>

      {/* Formulário de Cadastro */}
      <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-12">
        <form action={criarMotorista} className="flex gap-4">
          <input 
            name="nome" 
            placeholder="Nome Completo do Motorista" 
            className="border-2 border-gray-50 p-3 rounded-xl flex-1 focus:border-blue-500 outline-none transition text-black" 
            required 
          />
          <button type="submit" className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all">
            Adicionar Motorista
          </button>
        </form>
      </section>

      {/* Grid de Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {motoristas.map((m) => (
          <div key={m.id} className="relative bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 group hover:border-blue-500 transition-all">
            {/* Avatar Círculo */}
            <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center text-xl text-blue-600 font-bold">
              {m.nome.charAt(0).toUpperCase()}
            </div>
            
            <div className="flex-1">
              <p className="font-bold text-gray-800 text-lg leading-tight">{m.nome}</p>
              <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">Colaborador Ativo</p>
            </div>

            {/* Ações */}
            <div className="flex gap-1">
              <Link href={`/motorista/editar/${m.id}`} className="p-2 hover:bg-blue-50 rounded-lg text-blue-500 transition-colors" title="Editar">
                ✏️
              </Link>
              <BotaoExcluir id={m.id} tabela="motorista" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}