import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const abastecimentos = await prisma.abastecimento.findMany({
      where: { veiculoId: id },
      orderBy: { hodometro: 'asc' },
    });

    const dadosGrafico = abastecimentos.map((atual, index) => {
      if (index === 0) return null;
      const anterior = abastecimentos[index - 1];
      const kmRodado = atual.hodometro - anterior.hodometro;
      
      if (atual.quantidadeLitros === 0) return null;
      
      const kml = kmRodado / atual.quantidadeLitros;

      return {
        data: new Date(atual.data).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
        consumo: parseFloat(kml.toFixed(2))
      };
    }).filter(Boolean);

    return NextResponse.json(dadosGrafico);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}