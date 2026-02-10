import { prisma } from "@/lib/prisma";
import { FormAbastecimento } from "./FormAbastecimento"; 
import { salvarAbastecimento } from "./actions"; 

export default async function NovoAbastecimentoPage() {
  // 1. Busca os dados no servidor de forma paralela
  const [veiculos, motoristas, postos] = await Promise.all([
    prisma.veiculo.findMany({ orderBy: { placa: 'asc' } }),
    prisma.motorista.findMany({ orderBy: { nome: 'asc' } }),
    prisma.posto.findMany({ orderBy: { nome: 'asc' } }),
  ]);

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 tracking-tighter uppercase italic">
          Novo Abastecimento
        </h1>
        <p className="text-gray-500 font-medium">Preencha os dados abaixo para atualizar a frota.</p>
      </header>

      
      <FormAbastecimento 
        veiculos={veiculos} 
        motoristas={motoristas} 
        postos={postos}         
        salvarAction={salvarAbastecimento as any}
      />
    </div>
  );
}