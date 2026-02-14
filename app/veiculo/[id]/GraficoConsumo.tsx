"use client";

import { useEffect, useState } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Legend, AreaChart, Area 
} from 'recharts';

export function GraficoConsumo({ dados }: { dados: any[] }) {
  const [isClient, setIsClient] = useState(false);

  // renderiza no navegador
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return <div className="h-[300px] w-full bg-gray-50 animate-pulse rounded-2xl" />;

  
  const dataGrafico = [...dados]
    .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime())
    .map((d, i, arr) => {
      if (i === 0) return null;

      const anterior = arr[i - 1];
      const kmRodado = d.hodometro - anterior.hodometro;
      
      // Média = (KM Atual - KM Anterior) / Litros do abastecimento atual
      const media = kmRodado > 0 ? parseFloat((kmRodado / d.quantidadeLitros).toFixed(2)) : 0;

      return {
        data: new Date(d.data).toLocaleDateString('pt-BR'),
        media: media,
        preco: d.precoPorLitro,
        litros: d.quantidadeLitros
      };
    })
    .filter(d => d !== null && d.media > 0);

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-8">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-black text-gray-800 uppercase tracking-tight">Desempenho de Consumo</h3>
        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">KM/L</span>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={dataGrafico} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis 
              dataKey="data" 
              fontSize={10} 
              tickMargin={10} 
              axisLine={false} 
              tickLine={false}
              tick={{ fill: '#9ca3af', fontWeight: 'bold' }}
            />
            <YAxis 
              fontSize={10} 
              axisLine={false} 
              tickLine={false}
              tick={{ fill: '#9ca3af', fontWeight: 'bold' }}
            />
            <Tooltip 
              contentStyle={{ 
                borderRadius: '16px', 
                border: 'none', 
                boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                padding: '12px' 
              }}
              itemStyle={{ fontWeight: 'bold', fontSize: '12px' }}
            />
            <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 'bold', paddingTop: '10px' }} />
            <Line 
              name="Eficiência (KM/L)"
              type="monotone" 
              dataKey="media" 
              stroke="#2563eb" 
              strokeWidth={4} 
              dot={{ r: 4, fill: '#2563eb', strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 7, strokeWidth: 0 }}
              animationDuration={1500}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}