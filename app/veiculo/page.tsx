import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { BotaoExcluir } from "@/app/components/BotaoExlcuir";

export default async function VeiculosPage() {
  // Busca veículos e conta quantos abastecimentos cada um tem
  const veiculos = await prisma.veiculo.findMany({
    include: {
      _count: {
        select: { abastecimentos: true }
      }
    },
    orderBy: { placa: 'asc' }
  });

  async function criarVeiculo(formData: FormData) {
    "use server";
    const placa = (formData.get("placa") as string).toUpperCase();
    const modelo = formData.get("modelo") as string;

    await prisma.veiculo.create({
      data: { placa, modelo },
    });

    revalidatePath("/veiculo");
  }

  return (
    <div className="p-8 max-w-6xl mx-auto text-black">
      <header className="mb-10">
        <h1 className="text-3xl font-black text-gray-900">Frota de Veículos</h1>
        <p className="text-gray-500 font-medium">Cadastre e gerencie os veículos da agropecuária</p>
      </header>

      {/* FORMULÁRIO DE CADASTRO ESTILIZADO */}
      <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-12">
        <h2 className="text-sm font-bold text-gray-400 uppercase mb-4 tracking-wider">Novo Veículo</h2>
        <form action={criarVeiculo} className="flex flex-wrap gap-4">
          <input 
            name="placa" 
            placeholder="Placa (ex: ABC1234)" 
            className="border-2 border-gray-50 p-3 rounded-xl flex-1 focus:border-blue-500 outline-none transition font-mono uppercase text-black" 
            required 
          />
          <input 
            name="modelo" 
            placeholder="Modelo (ex: Hilux CD 4x4)" 
            className="border-2 border-gray-50 p-3 rounded-xl flex-1 focus:border-blue-500 outline-none transition text-black" 
            required 
          />
          <button type="submit" className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all active:scale-95">
            Salvar Veículo
          </button>
        </form>
      </section>

      {/* GRID DE VEÍCULOS EM CARDS */}
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
        Veículos Ativos 
        <span className="text-xs bg-gray-200 px-2 py-1 rounded-full text-gray-600">{veiculos.length}</span>
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {veiculos.map((v) => (
          <div key={v.id} className="group relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
            
            {/* BOTÕES DE AÇÃO (EDITAR E EXCLUIR) */}
            <div className="absolute top-4 right-4 flex gap-1 z-10">
              <Link 
                href={`/veiculo/editar/${v.id}`} 
                className="p-2 hover:bg-blue-50 rounded-lg text-blue-500 transition-colors"
                title="Editar"
              >
                ✏️
              </Link>
              <BotaoExcluir id={v.id} tabela="veiculo" />
            </div>

            {/* CONTEÚDO DO CARD (LINK PARA DETALHES) */}
            <Link href={`/veiculo/${v.id}`} className="block p-6">
              <div className="bg-gray-800 text-white px-3 py-1 rounded-md text-sm font-mono font-bold w-fit mb-4 group-hover:bg-blue-600 transition-colors">
                {v.placa}
              </div>
              
              <h3 className="text-xl font-bold text-gray-800 mb-1">{v.modelo}</h3>
              
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
                <span className="text-xs font-bold text-gray-400 uppercase">Registros</span>
                <span className="text-sm font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                  {v._count.abastecimentos}
                </span>
              </div>
            </Link>
          </div>
        ))}

        {veiculos.length === 0 && (
          <div className="col-span-full py-20 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
            <p className="text-gray-400 font-medium">Nenhum veículo cadastrado no momento.</p>
          </div>
        )}
      </div>
    </div>
  );
}