"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function registrarAbastecimento(data: {
  veiculoId: string;
  motoristaId: string;
  postoId: string;
  hodometro: number;
  quantidadeLitros: number;
  precoPorLitro: number;
}) {
  try {
    // 1. Validação de Hodômetro: Busca o último registro do veículo
    const ultimoAbastecimento = await prisma.abastecimento.findFirst({
      where: { veiculoId: data.veiculoId },
      orderBy: { data: 'desc' },
    });

    if (ultimoAbastecimento && data.hodometro <= ultimoAbastecimento.hodometro) {
      return { 
        error: `Hodômetro inválido. O último registro foi de ${ultimoAbastecimento.hodometro} km.` 
      };
    }

    // 2. Cálculo do Valor Total (Obrigatório no seu Model)
    const valorTotal = data.quantidadeLitros * data.precoPorLitro;

    // 3. Inserção no Banco
    await prisma.abastecimento.create({
      data: {
        hodometro: data.hodometro,
        quantidadeLitros: data.quantidadeLitros,
        precoPorLitro: data.precoPorLitro,
        valorTotal: valorTotal,
        // Usamos as chaves estrangeiras diretamente
        veiculoId: data.veiculoId,
        motoristaId: data.motoristaId,
        postoId: data.postoId,
        
      },
    });

    revalidatePath("/dashboard");
    return { success: true };

  } catch (error) {
    console.error("Erro ao salvar abastecimento:", error);
    return { error: "Erro interno ao salvar os dados." };
  }
}