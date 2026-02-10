import { prisma } from "@/lib/prisma";
import { FormAbastecimento } from "./FormAbastecimento"; // Ajuste o caminho se necessário
import { salvarAbastecimento } from "./actions"; // A action que corrigimos com a trava de KM

export default async function NovoAbastecimentoPage() {
  // Busca os dados no servidor
  const [veiculos, motoristas, postos] = await Promise.all([
    prisma.veiculo.findMany({ orderBy: { placa: 'asc' } }),
    prisma.motorista.findMany({ orderBy: { nome: 'asc' } }),
    prisma.posto.findMany({ orderBy: { nome: 'asc' } }),
  ]);

  // Função ponte para adaptar o retorno da sua Action ao que o Form espera
  async function bridgeAction(formData: FormData) {
    "use server";
    const result = await salvarAbastecimento(formData);
    
    if (result.error) {
      return { success: false, message: result.error };
    }
    return { success: true, message: "Abastecimento registrado com sucesso!" };
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 tracking-tighter uppercase">Novo Abastecimento</h1>
        <p className="text-gray-500 font-medium">Preencha os dados abaixo para atualizar a frota.</p>
      </header>

      <FormAbastecimento 
        veiculos={veiculos} 
        motoristas={motoristas} 
        postos={postos} 
        salvarAction={bridgeAction}
      />
    </div>
  );
}