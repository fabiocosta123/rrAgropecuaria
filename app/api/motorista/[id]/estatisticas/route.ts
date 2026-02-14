import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request, 
  { params }: { params: Promise<{ id: string }> } 
) {
  try {
    
    const { id } = await params;

    const abastecimentos = await prisma.abastecimento.findMany({
      where: { motoristaId: id },
      orderBy: { data: 'asc' },
      select: { data: true, quantidadeLitros: true }
    });

    
    const dados = abastecimentos.map(a => ({
      data: new Date(a.data).toLocaleDateString('pt-BR', { 
        day: '2-digit', 
        month: '2-digit' 
      }),
      litros: a.quantidadeLitros
    }));

    return NextResponse.json(dados);
    
  } catch (error) {
    console.error("Erro na rota de estatísticas:", error);
    return NextResponse.json(
      { error: "Erro interno ao buscar estatísticas" }, 
      { status: 500 }
    );
  }
}