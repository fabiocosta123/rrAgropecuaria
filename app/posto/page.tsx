import { prisma } from "@/lib/prisma";
import { ListaPostosCards } from "./ListaPostosCards";

export default async function PostosPage() {
  // Busca os postos e conta quantos abastecimentos cada um tem
  const postos = await prisma.posto.findMany({
    include: {
      _count: {
        select: { abastecimentos: true }
      }
    },
    orderBy: { nome: 'asc' }
  });

  return (
    <div className="p-8 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      <header className="mb-10">
        <h1 className="text-4xl font-black text-gray-900 uppercase italic tracking-tighter">
          Postos Parceiros
        </h1>
        <p className="text-gray-500 font-medium">Gerencie os locais de abastecimento e analise o histórico de preços</p>
      </header>

      {/* Passamos os dados para o componente de cliente que gerencia o Modal */}
      <ListaPostosCards postosInitial={postos} />
    </div>
  );
}