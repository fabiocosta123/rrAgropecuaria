"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export function GraficoConsumo({ dados }: { dados: any[] }) {
  // Invertemos os dados para o gráfico mostrar do mais antigo para o mais novo
  const dataGrafico = [...dados].reverse().map((d, i, arr) => {
    const anterior = arr[i - 1];
    const kmRodado = anterior ? d.hodometro - anterior.hodometro : 0;
    const media = kmRodado > 0 ? parseFloat((kmRodado / d.quantidadeLitros).toFixed(2)) : 0;

    return {
      data: new Date(d.data).toLocaleDateString('pt-BR'),
      media: media,
      preco: d.precoPorLitro
    };
  }).filter(d => d.media > 0); // Só mostra pontos com média calculada

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
      <h3 className="text-lg font-bold mb-6 text-gray-800">Desempenho (KM/L)</h3>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={dataGrafico}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis dataKey="data" fontSize={12} tickMargin={10} />
            <YAxis fontSize={12} />
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            />
            <Legend />
            <Line 
              name="Média KM/L"
              type="monotone" 
              dataKey="media" 
              stroke="#2563eb" 
              strokeWidth={4} 
              dot={{ r: 6, fill: '#2563eb' }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}