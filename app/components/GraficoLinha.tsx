"use client"; // Obrigatório para Recharts

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface GraficoProps {
  dados: { name: string; total: number }[];
}

export function GraficoLinha({ dados }: GraficoProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={dados} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
        <XAxis 
          dataKey="name" 
          axisLine={false} 
          tickLine={false} 
          tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 'bold' }}
        />
        <YAxis 
          axisLine={false} 
          tickLine={false} 
          tick={{ fill: '#94a3b8', fontSize: 10 }}
        />
        <Tooltip 
          cursor={{ fill: '#f8fafc' }}
          contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
        />
        <Bar dataKey="total" radius={[6, 6, 0, 0]} barSize={40}>
          {dados.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={index === dados.length - 1 ? '#2563eb' : '#cbd5e1'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}