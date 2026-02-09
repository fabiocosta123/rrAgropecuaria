"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function redefinirSenha(token: string, novaSenha: string) {
  const usuario = await prisma.usuario.findFirst({
    where: {
      resetToken: token,
      resetTokenExpiry: { gt: new Date() },
    },
  });

  if (!usuario) {
    return { error: "Link inválido ou expirado." };
  }

  const hashedPassword = await bcrypt.hash(novaSenha, 10);

  await prisma.usuario.update({
    where: { id: usuario.id },
    data: {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiry: null,
    },
  });

  
  return { success: true };
}