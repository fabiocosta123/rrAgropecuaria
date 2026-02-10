import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {

    const { id } = await params;
    const ultimoRegistro = await prisma.abastecimento.findFirst({
      where: { veiculoId: id },
      orderBy: { hodometro: 'desc' },
      select: { hodometro: true }
    });

    return NextResponse.json({ ultimoKm: ultimoRegistro?.hodometro || 0 });
  } catch (error) {
    return NextResponse.json({ ultimoKm: 0 }, { status: 500 });
  }
}