import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { FormAbastecimento } from "./FormAbastecimento"; 

export default async function NovoAbastecimentoPage() {
  // 1. Busca dados para os selects
  const [veiculos, motoristas, postos] = await Promise.all([
    prisma.veiculo.findMany({ orderBy: { placa: 'asc' } }),
    prisma.motorista.findMany({ orderBy: { nome: 'asc' } }),
    prisma.posto.findMany({ orderBy: { nome: 'asc' } }),
  ]);

  // 2. função que grava no banco
  async function salvarAction(formData: FormData) {
    "use server";
    try {
      const vId = formData.get("veiculoId") as string;
      const odom = parseFloat(formData.get("hodometro") as string);
      const litros = parseFloat(formData.get("litros") as string);
      const preco = parseFloat(formData.get("preco") as string);
      const dataInput = formData.get("data") as string;
      const dataFinal = dataInput ? new Date(dataInput + "T12:00:00") : new Date();

      // Validação de Hodômetro
      const ultimo = await prisma.abastecimento.findFirst({
        where: { veiculoId: vId },
        orderBy: { hodometro: 'desc' }
      });

      if (ultimo && odom <= ultimo.hodometro) {
        return { success: false, message: `O KM deve ser maior que ${ultimo.hodometro}!` };
      }

      await prisma.abastecimento.create({
        data: {
          data: dataFinal,
          hodometro: odom,
          quantidadeLitros: litros,
          precoPorLitro: preco,
          valorTotal: litros * preco,
          veiculoId: vId,
          motoristaId: formData.get("motoristaId") as string,
          postoId: formData.get("postoId") as string,
        }
      });

      revalidatePath("/historico");
      revalidatePath(`/veiculo/${vId}`);
      return { success: true, message: "Registro gravado com sucesso!" };
      
    } catch (error) {
      console.error(error);
      return { success: false, message: "Erro ao salvar. Verifique os dados." };
    }
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-black mb-6 text-gray-800">Novo Abastecimento</h1>
      
      
      <FormAbastecimento 
        veiculos={veiculos} 
        motoristas={motoristas} 
        postos={postos} 
        salvarAction={salvarAction} 
      />
    </div>
  );
}