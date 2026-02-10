import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  const agregacao = await prisma.abastecimento.aggregate({
    where: { veiculoId: id },
    _max: { hodometro: true },
  });

  return NextResponse.json({ 
    ultimoKm: agregacao._max.hodometro || 0 
  });
}