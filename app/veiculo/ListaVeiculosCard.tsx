"use client";

import { useState, useRef } from "react";
import { Car, Plus, X, BarChart3, ChevronRight, Gauge } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { criarVeiculo } from "./actions";
import { toast } from "sonner";

export function ListaVeiculosCards({ veiculos }: { veiculos: any[] }) {
  const [veiculoGrafico, setVeiculoGrafico] = useState<{ id: string, placa: string } | null>(null);
  const [isModalCadastroAberto, setIsModalCadastroAberto] = useState(false);
  const [dadosConsumo, setDadosConsumo] = useState([]);
  const formRef = useRef<HTMLFormElement>(null);

  // Busca dados do gráfico ao selecionar veículo
  const abrirGrafico = async (v: any) => {
    setVeiculoGrafico(v);
    const res = await fetch(`/api/veiculo/${v.id}/consumo`);
    const data = await res.json();
    setDadosConsumo(data);
  };

  async function handleCadastro(formData: FormData) {
    const result = await criarVeiculo(formData);
    if (result.success) {
      toast.success("Veículo cadastrado!");
      formRef.current?.reset();
      setIsModalCadastroAberto(false);
    } else {
      toast.error(result.error);
    }
  }

  return (
    <>
      <div className="mb-10 flex justify-between items-center">
        <h1 className="text-4xl font-black text-gray-900 uppercase italic tracking-tighter">Frota</h1>
        <button 
          onClick={() => setIsModalCadastroAberto(true)}
          className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-2 hover:bg-blue-700 transition-all shadow-xl active:scale-95"
        >
          <Plus size={20} strokeWidth={3} /> NOVO VEÍCULO
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {veiculos.map((v) => (
          <div 
            key={v.id}
            onClick={() => abrirGrafico(v)}
            className="group bg-white p-2 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-2xl transition-all cursor-pointer active:scale-95"
          >
            <div className="p-6">
              {/* PLACA ESTILO MERCOSUL */}
              <div className="w-48 h-16 border-[3px] border-gray-900 rounded-lg mx-auto mb-6 flex flex-col overflow-hidden shadow-md group-hover:border-blue-600 transition-colors">
                <div className="bg-blue-700 h-1/3 flex items-center justify-between px-2 text-white">
                  <span className="text-[6px] font-bold">BRASIL</span>
                  <div className="w-4 h-3 bg-white/20 rounded-sm" />
                </div>
                <div className="flex-1 flex items-center justify-center bg-white">
                  <span className="text-2xl font-black tracking-widest text-gray-900">{v.placa}</span>
                </div>
              </div>

              <div className="text-center">
                <h3 className="text-xl font-black text-gray-800 uppercase">{v.modelo}</h3>
                <p className="text-gray-400 font-bold text-xs uppercase flex items-center justify-center gap-1 mt-1">
                  <BarChart3 size={12} /> Ver eficiência de consumo
                </p>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-b-[2rem] p-4 flex justify-between items-center px-8">
               <span className="text-[10px] font-black text-gray-300 uppercase">Eficiência Global</span>
               <ChevronRight size={16} className="text-gray-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
            </div>
          </div>
        ))}
      </div>

      {/* MODAL GRÁFICO KM/L */}
      {veiculoGrafico && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] p-10 shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-3xl font-black text-gray-900 italic uppercase italic leading-none">{veiculoGrafico.placa}</h2>
                <p className="text-blue-600 font-black text-xs uppercase tracking-widest">Desempenho Médio (KM/L)</p>
              </div>
              <button onClick={() => setVeiculoGrafico(null)} className="p-2 bg-gray-100 rounded-full hover:bg-red-50 hover:text-red-500 transition-colors"><X /></button>
            </div>

            <div className="h-64 w-full">
              {dadosConsumo.length > 0 ? (
                <ResponsiveContainer>
                  <LineChart data={dadosConsumo}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="data" axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 'bold'}} />
                    <YAxis hide domain={['auto', 'auto']} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px rgba(0,0,0,0.1)' }}
                      formatter={(val: any) => [`${val} km/l`, 'Eficiência']}
                    />
                    <Line type="monotone" dataKey="consumo" stroke="#2563eb" strokeWidth={4} dot={{ r: 4, fill: '#2563eb' }} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 italic">
                  <Gauge size={48} className="mb-2 opacity-20" />
                  Necessário ao menos 2 abastecimentos
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL CADASTRO */}
      {isModalCadastroAberto && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[3rem] p-10 shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black text-gray-900 uppercase italic">Novo Veículo</h2>
              <button onClick={() => setIsModalCadastroAberto(false)} className="p-2 bg-gray-100 rounded-full"><X /></button>
            </div>
            <form ref={formRef} action={handleCadastro} className="space-y-4">
              <input name="placa" placeholder="PLACA (EX: ABC1D23)" className="w-full border-2 border-gray-50 p-4 rounded-2xl bg-gray-50 focus:bg-white focus:border-blue-500 outline-none font-bold uppercase" required />
              <input name="modelo" placeholder="MODELO (EX: VOLVO FH 540)" className="w-full border-2 border-gray-50 p-4 rounded-2xl bg-gray-50 focus:bg-white focus:border-blue-500 outline-none font-bold uppercase" required />
              <button type="submit" className="w-full bg-gray-900 text-white py-5 rounded-2xl font-black hover:bg-blue-600 transition-all">SALVAR VEÍCULO</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}