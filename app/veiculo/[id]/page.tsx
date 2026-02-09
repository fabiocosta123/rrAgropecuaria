import { prisma } from "@/lib/prisma";
import { GraficoConsumo } from "./GraficoConsumo";
import Link from "next/link";

export default async function DetalhesVeiculo({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const veiculo = await prisma.veiculo.findUnique({
    where: { id },
    include: {
      abastecimentos: {
        orderBy: { data: 'desc' },
        include: { motorista: true, posto: true }
      }
    }
  });

  if (!veiculo) return <div className="p-10 text-center font-bold">Veículo não encontrado.</div>;

  // Cálculos de Resumo do Veículo
  const totalGasto = veiculo.abastecimentos.reduce((acc, cur) => acc + cur.valorTotal, 0);
  const totalLitros = veiculo.abastecimentos.reduce((acc, cur) => acc + cur.quantidadeLitros, 0);
  const quilometragemTotal = veiculo.abastecimentos.length > 0 
    ? veiculo.abastecimentos[0].hodometro - veiculo.abastecimentos[veiculo.abastecimentos.length - 1].hodometro 
    : 0;
  const mediaGeral = totalLitros > 0 ? (quilometragemTotal / totalLitros).toFixed(2) : "0.00";

  return (
    <div className="p-8 max-w-5xl mx-auto text-black bg-gray-50 min-h-screen">
      {/* HEADER COM BOTÃO VOLTAR */}
      <header className="mb-10 flex justify-between items-start">
        <div>
          <Link href="/veiculo" className="text-blue-600 text-sm font-bold hover:underline mb-2 block">
            ← Voltar para Frota
          </Link>
          <h1 className="text-5xl font-black tracking-tighter text-gray-900">{veiculo.placa}</h1>
          <p className="text-gray-400 uppercase font-black tracking-[0.2em] text-sm">{veiculo.modelo}</p>
        </div>
        
        <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 text-right">
          <p className="text-[10px] font-bold text-gray-400 uppercase">Média Geral</p>
          <p className="text-3xl font-black text-blue-600">{mediaGeral} <span className="text-xs">km/L</span></p>
        </div>
      </header>

      {/* GRÁFICO DE CONSUMO */}
      {veiculo.abastecimentos.length > 1 ? (
        <GraficoConsumo dados={veiculo.abastecimentos} />
      ) : (
        <div className="bg-blue-50 p-8 rounded-3xl mb-8 text-center border-2 border-dashed border-blue-100">
          <p className="text-blue-400 font-medium">Abasteça mais de uma vez para gerar o gráfico de desempenho.</p>
        </div>
      )}

      <h2 className="text-2xl font-black mb-6 text-gray-800 flex items-center gap-2">
        <span className="w-2 h-8 bg-blue-600 rounded-full"></span>
        Histórico de Consumo
      </h2>

      <div className="space-y-4">
        {veiculo.abastecimentos.map((abast, index) => {
          const anterior = veiculo.abastecimentos[index + 1];
          const kmRodados = anterior ? abast.hodometro - anterior.hodometro : 0;
          const media = kmRodados > 0 ? (kmRodados / abast.quantidadeLitros).toFixed(2) : "---";
          const diffPreco = anterior ? abast.precoPorLitro - anterior.precoPorLitro : 0;

          return (
            <div key={abast.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              {/* Topo: Data e Posto */}
              <div className="bg-gray-50/50 px-6 py-3 border-b border-gray-100 flex justify-between items-center text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <span suppressHydrationWarning>{new Date(abast.data).toLocaleDateString('pt-BR')}</span>
                <span className="flex items-center gap-1">⛽ {abast.posto.nome}</span>
              </div>

              <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-8 items-center">
                {/* KM Rodados */}
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-black mb-1">Rodagem</p>
                  <p className="text-2xl font-black text-gray-800">+{kmRodados} <span className="text-xs font-bold text-gray-400">KM</span></p>
                  <p className="text-[10px] text-gray-400 font-mono">Total: {abast.hodometro.toLocaleString('pt-BR')} km</p>
                </div>

                {/* Média de Consumo */}
                <div className="bg-blue-600 p-4 rounded-2xl text-white shadow-lg shadow-blue-100">
                  <p className="text-[10px] uppercase font-black opacity-70 text-center">Consumo</p>
                  <p className="text-2xl font-black text-center">{media} <span className="text-xs">km/L</span></p>
                </div>

                {/* Variação de Preço */}
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-black mb-1">Preço Litro</p>
                  <p className="text-xl font-black text-gray-800" suppressHydrationWarning>R$ {abast.precoPorLitro.toFixed(3)}</p>
                  {anterior && (
                    <p className={`text-[10px] font-black flex items-center mt-1 ${diffPreco > 0 ? 'text-red-500' : diffPreco < 0 ? 'text-green-500' : 'text-gray-400'}`}>
                      {diffPreco > 0 ? '▲' : diffPreco < 0 ? '▼' : '●'} 
                      {diffPreco === 0 ? ' ESTÁVEL' : ` R$ ${Math.abs(diffPreco).toFixed(2)}`}
                    </p>
                  )}
                </div>

                {/* Valor Total */}
                <div className="text-right border-l border-gray-100 pl-6">
                  <p className="text-[10px] text-gray-400 uppercase font-black mb-1">Custo Total</p>
                  <p className="text-2xl font-black text-green-600" suppressHydrationWarning>
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(abast.valorTotal)}
                  </p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{abast.motorista.nome}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}