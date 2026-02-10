"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function criarVeiculo(formData: FormData) {
  const placa = formData.get("placa") as string;
  const modelo = formData.get("modelo") as string;

  if (!placa || !modelo) return { error: "Placa e modelo são obrigatórios" };

  try {
    await prisma.veiculo.create({
      data: { 
        placa: placa.toUpperCase(), 
        modelo: modelo.toUpperCase() 
      }
    });
    revalidatePath("/veiculos");
    return { success: true };
  } catch (error) {
    return { error: "Erro ao cadastrar veículo (Placa já existe?)" };
  }
}