"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function criarPosto(formData: FormData) {
  const nome = formData.get("nome") as string;

  if (!nome) return { error: "O nome é obrigatório" };

  try {
    await prisma.posto.create({
      data: { nome }
    });
    revalidatePath("/postos");
    return { success: true };
  } catch (error) {
    return { error: "Erro ao cadastrar posto" };
  }
}