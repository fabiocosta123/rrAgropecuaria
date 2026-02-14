import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> } 
) {
  try {
    
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "ID não fornecido" }, { status: 400 });
    }

    const abastecimento = await prisma.abastecimento.findUnique({
      where: { id },
    });

    if (!abastecimento) {
      console.log(`Registro ${id} não encontrado no banco.`);
      return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
    }

    return NextResponse.json(abastecimento);
  } catch (error) {
    console.error("Erro na API de busca:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}