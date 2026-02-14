import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { unstable_noStore as noStore } from 'next/cache';

export async function GET(request: Request, { params }: { params: any }) {
  noStore(); 
  try {
    const resolvedParams = await params;
    const id = resolvedParams.id;

    const ultimoRegistro = await prisma.abastecimento.findFirst({
      where: { veiculoId: id },
      orderBy: { hodometro: 'desc' }, 
      select: { hodometro: true, data: true }
    });

    return NextResponse.json({ 
      ultimoKm: ultimoRegistro?.hodometro || 0,
      ultimaData: ultimoRegistro?.data || null 
    });
  } catch (error) {
    return NextResponse.json({ ultimoKm: 0, ultimaData: null }, { status: 500 });
  }
}