
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";
import crypto from "crypto";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function solicitarRecuperacao(email: string) {
  "use server";

  
  const usuario = await prisma.usuario.findUnique({ where: { email } });
  if (!usuario) return { error: "E-mail não encontrado." };

  
  const token = crypto.randomBytes(32).toString("hex");
  const expiracao = new Date(Date.now() + 3600000); 

  // 3. Salvar no Banco
  await prisma.usuario.update({
    where: { email },
    data: {
      resetToken: token,
      resetTokenExpiry: expiracao,
    },
  });

  // 4. Enviar E-mail
  const urlReset = `${process.env.NEXT_PUBLIC_APP_URL}/login/resetar?token=${token}`;
  
  try {
    await resend.emails.send({
      from: "RR AGRO <onboarding@resend.dev>", 
      to: email,
      subject: "Recuperação de Senha - RR AGRO",
      html: `<p>Você solicitou a redefinição de senha. Clique no link abaixo para prosseguir:</p>
             <a href="${urlReset}">Redefinir minha senha</a>
             <p>Este link expira em 1 hora.</p>`,
    });
    return { success: true };
  } catch (err) {
    return { error: "Falha ao enviar e-mail." };
  }
}