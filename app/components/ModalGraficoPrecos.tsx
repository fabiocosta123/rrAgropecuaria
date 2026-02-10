"use client";

import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { X, TrendingUp } from "lucide-react";

export function ModalGraficoPreco({ postoId, nomePosto, onClose }: { postoId: string, nomePosto: string, onClose: () => void }) {
    const [dados, setDados] = useState([]);

    useEffect(() => {
        fetch(`/api/posto/${postoId}/precos`)
            .then(res => res.json())
            .then(setDados);
    }, [postoId]);

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-8">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2 italic uppercase">
                                <TrendingUp className="text-blue-600" />
                                Variação de Preço
                            </h2>
                            <p className="text-gray-400 font-bold text-sm uppercase">{nomePosto}</p>
                        </div>
                        <button onClick={onClose} className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors text-gray-500">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="h-[300px] w-full">
                        {dados.length > 1 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={dados}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                    <XAxis
                                        dataKey="data"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 12, fontWeight: 'bold', fill: '#9ca3af' }}
                                        dy={10}
                                    />
                                    <YAxis hide domain={['auto', 'auto']} />

                                    <Tooltip
                                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                        formatter={(value: any) => [
                                            `R$ ${Number(value).toFixed(3)}`,
                                            'Preço por Litro'
                                        ]}
                                    />

                                    <Line
                                        type="monotone"
                                        dataKey="preco"
                                        stroke="#2563eb"
                                        strokeWidth={4}
                                        dot={{ r: 6, fill: '#2563eb', strokeWidth: 2, stroke: '#fff' }}
                                        activeDot={{ r: 8 }}
                                        animationDuration={1000}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-400 font-medium italic">
                                Aguardando mais registros para gerar o gráfico...
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}