import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const abastecimentos = await prisma.abastecimento.findMany({
    where: { motoristaId: params.id },
    orderBy: { data: 'asc' },
    select: { data: true, quantidadeLitros: true }
  });

  const dados = abastecimentos.map(a => ({
    data: new Date(a.data).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
    litros: a.quantidadeLitros
  }));

  return NextResponse.json(dados);
}