import { prisma } from "@/lib/prisma";
import { GraficoConsumo } from "./GraficoConsumo";

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

  if (!veiculo) return <div className="p-10">Veículo não encontrado.</div>;

  return (
    <div className="p-8 max-w-5xl mx-auto text-black">
      <header className="mb-8 border-b pb-6">
        <h1 className="text-4xl font-black">{veiculo.placa}</h1>
        <p className="text-gray-500 uppercase tracking-widest">{veiculo.modelo}</p>
      </header>

      {/* GRÁFICO DE CONSUMO */}
{veiculo.abastecimentos.length > 1 && (
  <GraficoConsumo dados={veiculo.abastecimentos} />
)}

<h2 className="text-xl font-bold mb-4 border-b pb-2">Histórico de Consumo</h2>

      <div className="space-y-6">
        {veiculo.abastecimentos.map((abast, index) => {
          // O "anterior" cronologicamente é o próximo item do array (pois demos orderBy desc)
          const anterior = veiculo.abastecimentos[index + 1];
          
          const kmRodados = anterior ? abast.hodometro - anterior.hodometro : 0;
          const media = kmRodados > 0 ? (kmRodados / abast.quantidadeLitros).toFixed(2) : "---";
          
          // Lógica de Comparação de Preço
          const diffPreco = anterior ? abast.precoPorLitro - anterior.precoPorLitro : 0;

          return (
            <div key={abast.id} className="bg-white border rounded-2xl shadow-sm overflow-hidden">
              {/* Topo do Card: Data e Posto */}
              <div className="bg-gray-50 px-6 py-2 border-b flex justify-between text-xs font-bold text-gray-400 uppercase">
                <span>{new Date(abast.data).toLocaleDateString('pt-BR')}</span>
                <span>{abast.posto.nome}</span>
              </div>

              <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
                {/* KM Rodados */}
                <div>
                  <p className="text-xs text-gray-400 uppercase font-bold">Rodagem</p>
                  <p className="text-xl font-bold">+{kmRodados} <span className="text-sm font-normal">KM</span></p>
                  <p className="text-xs text-gray-400">Total: {abast.hodometro} km</p>
                </div>

                {/* Média de Consumo */}
                <div className="bg-blue-50 p-3 rounded-xl border border-blue-100">
                  <p className="text-xs text-blue-400 uppercase font-bold text-center">Consumo</p>
                  <p className="text-2xl font-black text-blue-700 text-center">{media} <span className="text-xs">km/L</span></p>
                </div>

                {/* Variação de Preço */}
                <div>
                  <p className="text-xs text-gray-400 uppercase font-bold">Preço Litro</p>
                  <p className="text-lg font-bold">R$ {abast.precoPorLitro.toFixed(3)}</p>
                  {anterior && (
                    <p className={`text-xs font-bold flex items-center ${diffPreco > 0 ? 'text-red-500' : diffPreco < 0 ? 'text-green-500' : 'text-gray-400'}`}>
                      {diffPreco > 0 ? '▲' : diffPreco < 0 ? '▼' : '●'} 
                      {diffPreco === 0 ? ' Sem alteração' : ` R$ ${Math.abs(diffPreco).toFixed(3)}`}
                    </p>
                  )}
                </div>

                {/* Valor Total */}
                <div className="text-right border-l pl-6">
                  <p className="text-xs text-gray-400 uppercase font-bold">Custo Total</p>
                  <p className="text-xl font-black text-green-600">R$ {abast.valorTotal.toFixed(2)}</p>
                  <p className="text-xs text-gray-400">{abast.motorista.nome}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}