"use client";

import { useState, useRef } from "react";
import { MapPin, ChevronRight, BarChart3, Plus, X } from "lucide-react";
import { ModalGraficoPreco } from "@/app/components/ModalGraficoPrecos";
import { criarPosto } from "./actions";
import { toast } from "sonner";

export function ListaPostosCards({ postosInitial }: { postosInitial: any[] }) {
  // Estados para gerenciar os modais
  const [postoSelecionado, setPostoSelecionado] = useState<{ id: string, nome: string } | null>(null);
  const [isModalCadastroAberto, setIsModalCadastroAberto] = useState(false);
  
  // Ref para manipular o formulário sem re-renderizar
  const formRef = useRef<HTMLFormElement>(null);

  async function handleCadastro(formData: FormData) {
    const result = await criarPosto(formData);
    
    if (result.success) {
      toast.success("Posto cadastrado com sucesso!");
      formRef.current?.reset(); // Limpa os campos do formulário
      setIsModalCadastroAberto(false); // Fecha o modal
    } else {
      toast.error(result.error || "Erro ao cadastrar");
    }
  }

  return (
    <>
      {/* HEADER DE AÇÕES */}
      <div className="mb-10 flex justify-between items-center">
        <div className="hidden md:block">
          <span className="text-gray-400 font-bold text-sm uppercase tracking-widest">
            {postosInitial.length} Postos Cadastrados
          </span>
        </div>
        <button 
          onClick={() => setIsModalCadastroAberto(true)}
          className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-3 hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 active:scale-95 hover:translate-y-[-2px]"
        >
          <Plus size={22} strokeWidth={3} />
          NOVO POSTO
        </button>
      </div>

      {/* GRID DE CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {postosInitial.map((posto) => (
          <div 
            key={posto.id}
            onClick={() => setPostoSelecionado({ id: posto.id, nome: posto.nome })}
            className="group bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm 
                       hover:shadow-2xl hover:shadow-blue-900/5 hover:border-blue-200 
                       hover:translate-y-[-4px] active:scale-[0.97] transition-all cursor-pointer 
                       relative overflow-hidden"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="bg-orange-50 p-4 rounded-2xl text-orange-500 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                <MapPin size={28} />
              </div>
              <div className="bg-gray-50 px-4 py-1.5 rounded-full text-[10px] font-black text-gray-400 uppercase tracking-tight">
                {posto._count?.abastecimentos || 0} Abastecimentos
              </div>
            </div>

            <h3 className="text-2xl font-black text-gray-800 uppercase tracking-tighter mb-2 group-hover:text-blue-600 transition-colors">
              {posto.nome}
            </h3>
            
            <p className="text-gray-400 text-sm font-bold flex items-center gap-1 mb-8">
              Ver histórico de preços
              <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </p>

            <div className="flex items-center justify-between pt-6 border-t border-gray-50">
              <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">Data Analytics</span>
              <BarChart3 size={20} className="text-gray-200 group-hover:text-blue-400 transition-all" />
            </div>
          </div>
        ))}
      </div>

      {/* MODAL: GRÁFICO DE PREÇOS */}
      {postoSelecionado && (
        <ModalGraficoPreco 
          postoId={postoSelecionado.id} 
          nomePosto={postoSelecionado.nome} 
          onClose={() => setPostoSelecionado(null)} 
        />
      )}

      {/* MODAL: CADASTRO DE NOVO POSTO */}
      {isModalCadastroAberto && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-[3rem] p-10 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-black text-gray-900 italic uppercase tracking-tighter">Novo Posto</h2>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Adicionar parceiro</p>
              </div>
              <button 
                onClick={() => setIsModalCadastroAberto(false)} 
                className="p-3 bg-gray-100 hover:bg-red-50 hover:text-red-500 rounded-full transition-all active:scale-90"
              >
                <X size={24}/>
              </button>
            </div>
            
            <form ref={formRef} action={handleCadastro} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                  Nome do Posto
                </label>
                <input 
                  name="nome" 
                  type="text" 
                  placeholder="EX: AUTO POSTO BRASIL" 
                  className="w-full border-2 border-gray-50 p-5 rounded-2xl bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50 outline-none font-bold text-gray-800 placeholder:text-gray-300 transition-all"
                  required 
                  autoFocus
                />
              </div>
              
              <button 
                type="submit" 
                className="w-full bg-gray-900 text-white py-5 rounded-2xl font-black text-lg shadow-xl hover:bg-blue-600 transition-all active:scale-[0.98]"
              >
                SALVAR REGISTRO
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}