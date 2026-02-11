"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";


export type ActionResponse = {
  success: boolean;
  message: string;
};

export async function salvarAbastecimento(formData: FormData): Promise<ActionResponse> {
  const veiculoId = formData.get("veiculoId") as string;
  const motoristaId = formData.get("motoristaId") as string;
  const postoId = formData.get("postoId") as string;
  const hodometro = Number(formData.get("hodometro"));
  const litros = Number(formData.get("litros"));
  const preco = Number(formData.get("preco"));
  const dataString = formData.get("data") as string;

  // 1. Validação de segurança básica
  if (!veiculoId || veiculoId === "undefined") {
    return { success: false, message: "ID do veículo não identificado. Selecione o veículo novamente." };
  }

  try {
    // 2. Busca o maior KM EXCLUSIVO deste veículo
    const ultimo = await prisma.abastecimento.findFirst({
      where: { veiculoId: veiculoId },
      orderBy: { hodometro: 'desc' },
      select: { hodometro: true }
    });

    const maiorKmBanco = ultimo?.hodometro || 0;

    // 3. Validação de Hodômetro
    if (hodometro <= maiorKmBanco) {
      return { 
        success: false, 
        message: `KM Inválido! Para este veículo, o valor deve ser maior que ${maiorKmBanco.toLocaleString('pt-BR')} KM.` 
      };
    }

    // 4. Criação do registro
    await prisma.abastecimento.create({
      data: {
        veiculoId,
        motoristaId,
        postoId,
        data: new Date(`${dataString}T12:00:00`),
        hodometro,
        quantidadeLitros: litros,
        precoPorLitro: preco,
        valorTotal: litros * preco,
      },
    });

    // 5. Revalidação de cache
    revalidatePath("/historico");
    revalidatePath("/dashboard"); 
    
    return { 
      success: true, 
      message: "Abastecimento registrado com sucesso!" 
    };

  } catch (error) {
    console.error("Erro ao salvar abastecimento:", error);
    return { 
      success: false, 
      message: "Erro técnico ao salvar no banco de dados. Verifique os campos." 
    };
  }
}