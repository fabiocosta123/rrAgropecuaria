import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const precos = await prisma.abastecimento.findMany({
      where: { postoId: id },
      select: {
        data: true,
        precoPorLitro: true,
      },
      orderBy: { data: 'asc' },
    });

    const dadosFormatados = precos.map(p => ({
      data: new Date(p.data).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
      preco: p.precoPorLitro
    }));

    return NextResponse.json(dadosFormatados);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}