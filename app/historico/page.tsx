import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function HistoricoPage() {
  const registros = await prisma.abastecimento.findMany({
    include: { veiculo: true, motorista: true, posto: true },
    orderBy: { data: 'desc' },
  });

  // Cálculos para o Dashboard
  const gastoTotal = registros.reduce((acc, curr) => acc + curr.valorTotal, 0);
  const totalLitros = registros.reduce((acc, curr) => acc + curr.quantidadeLitros, 0);
  const precoMedio = gastoTotal / totalLitros || 0;

  return (
    <div className="p-8 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-black text-gray-800 mb-8">Gestão de Combustível</h1>

      {/* DASHBOARD CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl shadow-sm border-l-8 border-blue-600">
          <p className="text-sm text-gray-500 font-bold uppercase">Gasto Total</p>
          <p className="text-2xl font-black text-gray-900">R$ {gastoTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border-l-8 border-green-600">
          <p className="text-sm text-gray-500 font-bold uppercase">Volume Total</p>
          <p className="text-2xl font-black text-gray-900">{totalLitros.toFixed(2)} L</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border-l-8 border-yellow-500">
          <p className="text-sm text-gray-500 font-bold uppercase">Preço Médio p/ Litro</p>
          <p className="text-2xl font-black text-gray-900">R$ {precoMedio.toFixed(3)}</p>
        </div>
      </div>

      {/* TABELA DE REGISTROS */}
      <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-200">
        <table className="w-full text-left">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="p-4 text-xs uppercase">Data</th>
              <th className="p-4 text-xs uppercase">Veículo</th>
              <th className="p-4 text-xs uppercase">Motorista</th>
              <th className="p-4 text-xs uppercase text-right">Média Período</th>
              <th className="p-4 text-xs uppercase text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {registros.map((reg) => (
              <tr key={reg.id} className="hover:bg-gray-50 transition">
                <td className="p-4 text-sm">{new Date(reg.data).toLocaleDateString('pt-BR')}</td>
                <td className="p-4">
                  <Link href={`/veiculo/${reg.veiculoId}`} className="text-blue-600 font-bold hover:underline">
                    {reg.veiculo.placa}
                  </Link>
                  <p className="text-xs text-gray-400">{reg.veiculo.modelo}</p>
                </td>
                <td className="p-4 text-gray-600 text-sm">{reg.motorista.nome}</td>
                <td className="p-4 text-right text-sm font-medium text-orange-600">
                  {/* O cálculo de KM/L individual faremos na página do veículo */}
                  ---
                </td>
                <td className="p-4 text-right font-bold text-gray-900">
                  R$ {reg.valorTotal.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}