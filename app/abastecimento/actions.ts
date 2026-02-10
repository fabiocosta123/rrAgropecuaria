"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function salvarAbastecimento(formData: FormData) {
  const veiculoId = formData.get("veiculoId") as string;
  const motoristaId = formData.get("motoristaId") as string;
  const postoId = formData.get("postoId") as string;
  const hodometro = Number(formData.get("hodometro"));
  const litros = Number(formData.get("litros"));
  const preco = Number(formData.get("preco"));
  const dataString = formData.get("data") as string; // Ex: "2026-02-10"

  try {
    // 1. VALIDAÇÃO DO HODÔMETRO (Busca o maior valor global do veículo)
    const agregacao = await prisma.abastecimento.aggregate({
      where: { veiculoId },
      _max: { hodometro: true },
    });

    const maiorHodometro = agregacao._max.hodometro || 0;

    if (hodometro <= maiorHodometro) {
      return { error: `KM inválido! O último registro foi de ${maiorHodometro} km.` };
    }

    // 2. CORREÇÃO DA DATA (Força meio-dia para evitar erro de fuso horário UTC)
    const dataAjustada = new Date(`${dataString}T12:00:00`);

    // 3. SALVAR NO BANCO
    await prisma.abastecimento.create({
      data: {
        veiculoId,
        motoristaId,
        postoId,
        data: dataAjustada,
        hodometro,
        quantidadeLitros: litros,
        precoPorLitro: preco,
        valorTotal: litros * preco,
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/historico");
    
    return { success: true };
  } catch (error) {
    return { error: "Erro ao salvar no banco de dados." };
  }
}