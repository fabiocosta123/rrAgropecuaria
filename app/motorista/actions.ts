"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function criarMotorista(formData: FormData) {
  const nome = formData.get("nome") as string;

  if (!nome || nome.length < 3) return { error: "Nome muito curto ou inválido" };

  try {
    await prisma.motorista.create({
      data: { nome: nome.toUpperCase() }
    });
    revalidatePath("/motoristas");
    return { success: true };
  } catch (error) {
    return { error: "Erro ao cadastrar motorista" };
  }
}