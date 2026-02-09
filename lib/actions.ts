"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function excluirItem(id: string, tabela: 'veiculo' | 'motorista' | 'posto' | 'abastecimento') {
  try {
    // @ts-ignore - prisma[tabela] funciona dinamicamente
    await prisma[tabela].delete({ where: { id } });
    
    // Revalida todas as rotas possíveis para atualizar o visual
    revalidatePath("/veiculo");
    revalidatePath("/motorista");
    revalidatePath("/posto");
    revalidatePath("/historico");
    return { success: true };
  } catch (error) {
    return { success: false, message: "Não é possível excluir: existem registros vinculados." };
  }
}