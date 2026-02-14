"use client";

import { toast } from "sonner";
import { useRef, useState, useEffect } from "react";
import { Gauge, Fuel, User, Calendar, MapPin, CheckCircle2, DollarSign, ArrowUpRight, PencilLine, XCircle } from "lucide-react";

interface FormProps {
  veiculos: any[];
  motoristas: any[];
  postos: any[];
  salvarAction: (formData: FormData) => Promise<{ success: boolean; message: string }>;
}

export function FormAbastecimento({ veiculos, motoristas, postos, salvarAction }: FormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  
  // Estados de Controle
  const [idEdicao, setIdEdicao] = useState<string | null>(null);
  const [ultimoKm, setUltimoKm] = useState<number | null>(null);
  const [ultimaDataStr, setUltimaDataStr] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);
  
  // Estados dos Campos
  const [veiculoSelecionado, setVeiculoSelecionado] = useState("");
  const [motoristaSelecionado, setMotoristaSelecionado] = useState("");
  const [postoSelecionado, setPostoSelecionado] = useState("");
  const [kmDigitado, setKmDigitado] = useState("");
  const [dataDigitada, setDataDigitada] = useState(new Date().toISOString().split('T')[0]);
  const [litros, setLitros] = useState("");
  const [preco, setPreco] = useState("");

  // carregar modo em edição
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const editId = params.get("edit");
    
    if (editId) {
      setIdEdicao(editId);
      setCarregando(true);
      
      fetch(`/api/abastecimento/${editId}`)
        .then(res => {
          if (!res.ok) throw new Error("Registro não encontrado");
          return res.json();
        })
        .then(data => {
          if (data && data.id) {
            setVeiculoSelecionado(data.veiculoId || "");
            setMotoristaSelecionado(data.motoristaId || "");
            setPostoSelecionado(data.postoId || "");
            setKmDigitado(data.hodometro?.toString() || "");
            setDataDigitada(data.data ? data.data.split('T')[0] : "");
            setLitros(data.quantidadeLitros?.toString() || "");
            
            setPreco(data.precoPorLitro?.toString() || "");

            // Atualiza histórico do veículo selecionado (sem limpar o KM atual da edição)
            handleVeiculoChange(data.veiculoId, false);
          }
        })
        .catch(() => toast.error("Erro ao carregar dados."))
        .finally(() => setCarregando(false));
    }
  }, []);

  
  const valorKmNumerico = Number(kmDigitado);
  const isDataRetroativa = ultimaDataStr ? dataDigitada < ultimaDataStr : false;
  const isConflitoFuturo = isDataRetroativa && ultimoKm !== null && valorKmNumerico > ultimoKm;
  const isKmInsuficiente = !isDataRetroativa && ultimoKm !== null && kmDigitado !== "" && valorKmNumerico <= ultimoKm;
  
  // Trava de segurança apenas para novos registros (Edições permitem ajuste livre)
  const isInvalido = !idEdicao && (isConflitoFuturo || isKmInsuficiente);
  
  
  const investimentoTotal = (Number(litros) * Number(preco)) || 0;

  async function handleVeiculoChange(veiculoId: string, limparKm = true) {
    if (limparKm) setKmDigitado("");
    setVeiculoSelecionado(veiculoId);
    if (!veiculoId) return;

    try {
      const response = await fetch(`/api/veiculo/${veiculoId}/ultimo-km?t=${Date.now()}`);
      const data = await response.json();
      setUltimoKm(data.ultimoKm);
      setUltimaDataStr(data.ultimaData ? data.ultimaData.split('T')[0] : null);
    } catch (error) {
      console.error("Erro ao buscar histórico");
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isInvalido) return toast.error("Verifique os dados do hodômetro.");

    const formData = new FormData(e.currentTarget);
    const loadingToast = toast.loading(idEdicao ? "Atualizando registro..." : "Salvando lançamento...");
    
    const result = await salvarAction(formData);
    toast.dismiss(loadingToast);

    if (result.success) {
      toast.success(result.message);
      if (idEdicao) {
        window.location.href = "/historico"; 
      } else {
        formRef.current?.reset();
        setKmDigitado(""); setLitros(""); setPreco(""); setUltimoKm(null);
      }
    } else {
      toast.error(result.message);
    }
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="relative space-y-6 bg-white p-8 rounded-[2.5rem] shadow-2xl border border-gray-100">
      
      {/* BADGE MODO EDIÇÃO */}
      {idEdicao && (
        <div className="absolute -top-4 left-10 bg-blue-600 text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg flex items-center gap-2 animate-bounce">
          <PencilLine size={14} /> Modo Edição Ativado
        </div>
      )}

      <input type="hidden" name="id" value={idEdicao || ""} />

      {/* CARD DE HODÔMETRO (HISTÓRICO) */}
      {ultimoKm !== null && (
        <div className={`transition-all duration-500 rounded-3xl p-6 flex items-center justify-between border-2 ${
          isInvalido ? "bg-red-50 border-red-500" : "bg-orange-50 border-orange-200"
        }`}>
          <div className="flex items-center gap-4">
            <div className={`p-4 rounded-2xl ${isInvalido ? "bg-red-500" : "bg-orange-500"} text-white shadow-lg`}>
              <Gauge size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Último Hodômetro</p>
              <h2 className={`text-3xl font-black italic ${isInvalido ? "text-red-600" : "text-orange-600"}`}>
                {ultimoKm.toLocaleString()} KM
              </h2>
            </div>
          </div>
        </div>
      )}

      {/* GRID CAMPOS PRINCIPAIS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 italic"><Calendar size={12} /> Data</label>
          <input name="data" type="date" value={dataDigitada} onChange={(e) => setDataDigitada(e.target.value)} className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-600 p-4 rounded-2xl text-black font-bold outline-none transition-all" required />
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 italic"><ArrowUpRight size={12} /> Veículo</label>
          <select name="veiculoId" value={veiculoSelecionado} onChange={(e) => handleVeiculoChange(e.target.value)} className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-600 p-4 rounded-2xl text-black font-bold outline-none" required>
            <option value="">Selecione...</option>
            {veiculos.map(v => <option key={v.id} value={v.id}>{v.placa} - {v.modelo}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 italic"><User size={12} className="inline mr-1"/> Motorista</label>
          <select name="motoristaId" value={motoristaSelecionado} onChange={(e) => setMotoristaSelecionado(e.target.value)} className="w-full bg-gray-50 p-4 rounded-2xl text-black font-bold outline-none" required>
            <option value="">Selecione o motorista</option>
            {motoristas.map(m => <option key={m.id} value={m.id}>{m.nome}</option>)}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 italic"><MapPin size={12} className="inline mr-1"/> Posto de Combustível</label>
          <select name="postoId" value={postoSelecionado} onChange={(e) => setPostoSelecionado(e.target.value)} className="w-full bg-gray-50 p-4 rounded-2xl text-black font-bold outline-none" required>
            <option value="">Onde foi abastecido?</option>
            {postos.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
          </select>
        </div>
      </div>

      {/* INPUTS DE VALORES */}
      <div className="pt-8 border-t border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-gray-400 uppercase ml-4 italic">Hodômetro Atual</label>
          <input name="hodometro" type="number" value={kmDigitado} onChange={(e) => setKmDigitado(e.target.value)} className={`w-full border-2 p-5 rounded-[2rem] text-black font-black outline-none text-center text-2xl transition-all ${isInvalido ? "border-red-500 bg-red-50 text-red-600" : "border-transparent bg-gray-50 focus:border-blue-600"}`} required />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-gray-400 uppercase ml-4 italic">Qtd Litros</label>
          <input name="litros" type="number" step="0.01" value={litros} onChange={(e) => setLitros(e.target.value)} className="w-full bg-gray-50 p-5 rounded-[2rem] text-black font-black text-2xl text-center outline-none focus:bg-white focus:ring-2 ring-blue-100 transition-all" required />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-gray-400 uppercase ml-4 italic">Preço Litro ou Total</label>
          <input name="preco" type="number" step="0.001" value={preco} onChange={(e) => setPreco(e.target.value)} className="w-full bg-gray-50 p-5 rounded-[2rem] text-black font-black text-2xl text-center outline-none focus:bg-white focus:ring-2 ring-blue-100 transition-all" required />
        </div>
      </div>

      {/* FOOTER DO FORMULÁRIO*/}
      <div className="bg-slate-900 rounded-[2.5rem] p-8 flex justify-between items-center text-white shadow-xl">
        <div className="flex items-center gap-6">
          <div className="p-4 bg-slate-800 rounded-3xl text-green-400 shadow-inner">
            <DollarSign size={32} />
          </div>
          <div>
            <span className="text-xs font-black text-slate-500 uppercase block tracking-widest">Total Estimado</span>
            <span className="text-4xl font-black italic tracking-tighter">
              R$ {investimentoTotal.toLocaleString('pt-BR', { 
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2 
              })}
            </span>
          </div>
        </div>
      </div>

      {/* BOTÕES DE AÇÃO */}
      <div className="flex gap-4">
        {idEdicao && (
          <button type="button" onClick={() => window.location.href = "/historico"} className="flex-1 py-8 rounded-[2.5rem] font-black text-xs uppercase tracking-widest bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all flex items-center justify-center gap-2 border border-transparent hover:border-red-100">
            <XCircle size={18}/> Cancelar
          </button>
        )}
        <button type="submit" disabled={isInvalido || carregando} className="flex-[2] py-8 rounded-[2.5rem] font-black text-sm uppercase tracking-[0.4em] bg-blue-600 text-white hover:bg-blue-700 shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-4">
          {idEdicao ? <><PencilLine size={20}/> Atualizar Registro</> : <><CheckCircle2 size={20}/> Salvar Lançamento</>}
        </button>
      </div>
    </form>
  );
}