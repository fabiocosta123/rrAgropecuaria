"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// salvar e editar
export async function salvarAbastecimento(formData: FormData) {
  const id = formData.get("id") as string;
  const veiculoId = formData.get("veiculoId") as string;
  const motoristaId = formData.get("motoristaId") as string;
  const postoId = formData.get("postoId") as string;
  const hodometroDigitado = Number(formData.get("hodometro"));
  const quantidadeLitros = Number(formData.get("litros"));
  const valorInput = Number(formData.get("preco"));
  const dataString = formData.get("data") as string;
  const dataDigitada = new Date(`${dataString}T12:00:00`);

  try {
    let valorFinalTotal = 0;
    let precoPorLitroReal = 0;

    if (valorInput < 20 && quantidadeLitros > 0) {
      precoPorLitroReal = valorInput;
      valorFinalTotal = quantidadeLitros * valorInput;
    } else {
      valorFinalTotal = valorInput;
      precoPorLitroReal = quantidadeLitros > 0 ? valorInput / quantidadeLitros : 0;
    }

    const dadosBase = {
      veiculoId,
      motoristaId,
      postoId,
      hodometro: hodometroDigitado,
      quantidadeLitros,
      precoPorLitro: precoPorLitroReal,
      valorTotal: valorFinalTotal,
      data: dataDigitada,
    };

    if (id && id !== "" && id !== "undefined") {
      await prisma.abastecimento.update({
        where: { id },
        data: dadosBase,
      });
    } else {
      const ultimo = await prisma.abastecimento.findFirst({
        where: { veiculoId },
        orderBy: { hodometro: 'desc' }
      });
      
      if (ultimo && hodometroDigitado <= ultimo.hodometro && dataDigitada >= new Date(ultimo.data)) {
        return { success: false, message: "KM deve ser superior ao último registro." };
      }
      await prisma.abastecimento.create({ data: dadosBase });
    }

    revalidatePath("/dashboard");
    revalidatePath("/historico");
    return { success: true, message: id ? "Alteração salva!" : "Registrado!" };
  } catch (e) {
    return { success: false, message: "Erro no banco de dados." };
  }
}

// Excluir
export async function excluirAbastecimento(id: string) {
  try {
    await prisma.abastecimento.delete({
      where: { id },
    });
    
    revalidatePath("/dashboard");
    revalidatePath("/historico");
    
    return { success: true };
  } catch (error) {
    console.error("Erro ao excluir:", error);
    return { success: false, message: "Erro ao excluir registro." };
  }
}