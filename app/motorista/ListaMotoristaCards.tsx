"use client";

import { useState, useRef } from "react";
import { User, Plus, X, Award, BarChart3, UserCheck, Calendar } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { criarMotorista } from "./actions";
import { toast } from "sonner";

export function ListaMotoristasCards({ motoristas }: { motoristas: any[] }) {
  const [motoristaSel, setMotoristaSel] = useState<{ id: string, nome: string } | null>(null);
  const [isModalCadastroAberto, setIsModalCadastroAberto] = useState(false);
  const [dadosGrafico, setDadosGrafico] = useState([]);
  const formRef = useRef<HTMLFormElement>(null);

  const abrirPerfil = async (m: any) => {
    setMotoristaSel(m);
    const res = await fetch(`/api/motorista/${m.id}/estatisticas`);
    const data = await res.json();
    setDadosGrafico(data);
  };

  async function handleCadastro(formData: FormData) {
    const result = await criarMotorista(formData);
    if (result.success) {
      toast.success("Motorista cadastrado com sucesso!");
      formRef.current?.reset();
      setIsModalCadastroAberto(false);
    } else {
      toast.error(result.error);
    }
  }

  return (
    <>
      <div className="mb-10 flex justify-between items-center">
        <h1 className="text-4xl font-black text-gray-900 uppercase italic tracking-tighter">Equipe</h1>
        <button 
          onClick={() => setIsModalCadastroAberto(true)}
          className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-2 hover:bg-blue-700 transition-all shadow-xl active:scale-95"
        >
          <Plus size={22} strokeWidth={3} /> NOVO MOTORISTA
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {motoristas.map((m) => (
          <div 
            key={m.id}
            onClick={() => abrirPerfil(m)}
            className="group relative bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-2xl transition-all cursor-pointer active:scale-95 overflow-hidden flex flex-col items-center pt-8 pb-6"
          >
            {/* Decoração superior do crachá */}
            <div className="absolute top-0 w-full h-3 bg-blue-600" />
            <div className="absolute top-3 w-12 h-1.5 bg-gray-100 rounded-full" />
            
            {/* Foto/Avatar Placeholder */}
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center border-4 border-white shadow-inner mb-4 group-hover:scale-110 transition-transform">
              <User size={48} className="text-gray-300" />
            </div>

            <div className="text-center px-4">
              <h3 className="text-lg font-black text-gray-800 uppercase leading-tight line-clamp-1">{m.nome}</h3>
              <div className="flex items-center justify-center gap-1 mt-2">
                 <span className="bg-green-100 text-green-700 text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-tighter">Ativo</span>
                 <span className="text-[10px] text-gray-400 font-bold uppercase">• ID: {m.id.slice(-4)}</span>
              </div>
            </div>

            <div className="mt-8 w-full px-6">
              <div className="flex justify-between items-center text-[10px] font-black text-gray-300 uppercase border-t pt-4">
                <span className="flex items-center gap-1"><BarChart3 size={12}/> Histórico</span>
                <span className="text-blue-500 group-hover:translate-x-1 transition-transform">VER →</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL PERFIL/GRÁFICO */}
      {motoristaSel && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] p-10 shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-start mb-8">
              <div className="flex items-center gap-4">
                <div className="bg-blue-600 p-3 rounded-2xl text-white"><UserCheck size={32}/></div>
                <div>
                  <h2 className="text-3xl font-black text-gray-900 italic uppercase">{motoristaSel.nome}</h2>
                  <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">Performance de Abastecimento</p>
                </div>
              </div>
              <button onClick={() => setMotoristaSel(null)} className="p-2 bg-gray-100 rounded-full hover:bg-red-50 hover:text-red-500 transition-colors"><X /></button>
            </div>

            <div className="h-64 w-full">
              {dadosGrafico.length > 0 ? (
                <ResponsiveContainer>
                  <BarChart data={dadosGrafico}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="data" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold'}} />
                    <YAxis hide />
                    <Tooltip 
                      cursor={{fill: '#f8fafc'}}
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px rgba(0,0,0,0.1)' }}
                      formatter={(val: any) => [`${val} Litros`, 'Volume']}
                    />
                    <Bar dataKey="litros" fill="#2563eb" radius={[6, 6, 0, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 italic">
                  <Calendar size={48} className="mb-2 opacity-20" />
                  Nenhum registro vinculado a este motorista.
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
              <h2 className="text-2xl font-black text-gray-900 uppercase italic">Novo Motorista</h2>
              <button onClick={() => setIsModalCadastroAberto(false)} className="p-2 bg-gray-100 rounded-full"><X /></button>
            </div>
            <form ref={formRef} action={handleCadastro} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Nome Completo</label>
                <input name="nome" placeholder="EX: JOÃO DA SILVA" className="w-full border-2 border-gray-50 p-5 rounded-2xl bg-gray-50 focus:bg-white focus:border-blue-500 outline-none font-bold uppercase" required autoFocus />
              </div>
              <button type="submit" className="w-full bg-gray-900 text-white py-5 rounded-2xl font-black hover:bg-blue-600 transition-all shadow-lg">SALVAR MOTORISTA</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}