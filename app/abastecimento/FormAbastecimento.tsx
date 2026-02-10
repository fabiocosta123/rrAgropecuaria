"use client"; 

import { toast } from "sonner";
import { useRef, useState } from "react"; 

interface FormProps {
  veiculos: any[];
  motoristas: any[];
  postos: any[];
  salvarAction: (formData: FormData) => Promise<{ success: boolean; message: string }>;
}

export function FormAbastecimento({ veiculos, motoristas, postos, salvarAction }: FormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [ultimoKm, setUltimoKm] = useState<number | null>(null);
  const [kmDigitado, setKmDigitado] = useState<string>(""); 
  const [carregandoKm, setCarregandoKm] = useState(false);

  const isKmInvalido = ultimoKm !== null && kmDigitado !== "" && Number(kmDigitado) <= ultimoKm;

  async function handleVeiculoChange(veiculoId: string) {
    // Reset imediato ao trocar de veículo
    setKmDigitado(""); 
    setUltimoKm(null);

    if (!veiculoId) return;

    setCarregandoKm(true);
    try {
      const response = await fetch(`/api/veiculo/${veiculoId}/ultimo-km`);
      const data = await response.json();
      setUltimoKm(data.ultimoKm);
    } catch (error) {
      console.error("Erro ao buscar KM", error);
      setUltimoKm(0);
    } finally {
      setCarregandoKm(false);
    }
  }

  async function clientAction(formData: FormData) {
    const loadingToast = toast.loading("Gravando registro...");
    const result = await salvarAction(formData);
    toast.dismiss(loadingToast);

    if (result.success) {
      toast.success(result.message);
      formRef.current?.reset();
      setUltimoKm(null);
      setKmDigitado(""); 
    } else {
      toast.error(result.message);
    }
  }

  return (
    <form ref={formRef} action={clientAction} className="space-y-4 bg-white p-6 rounded-[2rem] shadow-2xl border border-gray-100">
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 ml-1">Data do Evento</label>
          <input name="data" type="date" defaultValue={new Date().toISOString().split('T')[0]} className="w-full border-2 border-gray-50 p-4 rounded-2xl text-black font-bold focus:border-blue-500 outline-none bg-gray-50" required />
        </div>

        <div>
          <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 ml-1">Veículo / Placa</label>
          <select 
            name="veiculoId" 
            className="w-full border-2 border-gray-50 p-4 rounded-2xl text-black font-bold focus:border-blue-500 outline-none bg-gray-50" 
            required
            onChange={(e) => handleVeiculoChange(e.target.value)}
          >
            <option value="">Selecione o Veículo...</option>
            {veiculos.map(v => <option key={v.id} value={v.id}>{v.placa} - {v.modelo}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 ml-1">Motorista Responsável</label>
          <select name="motoristaId" className="w-full border-2 border-gray-50 p-4 rounded-2xl text-black font-bold focus:border-blue-500 outline-none bg-gray-50" required>
            <option value="">Quem está dirigindo?</option>
            {motoristas.map(m => <option key={m.id} value={m.id}>{m.nome}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 ml-1">Posto de Combustível</label>
          <select name="postoId" className="w-full border-2 border-gray-50 p-4 rounded-2xl text-black font-bold focus:border-blue-500 outline-none bg-gray-50" required>
            <option value="">Onde abasteceu?</option>
            {postos.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
          </select>
        </div>
      </div>

      <div className="pt-6 border-t border-gray-100 mt-4">
        <div className="flex justify-between items-center mb-3 px-1">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Métricas de Consumo</label>
          {ultimoKm !== null && !carregandoKm && (
            <span className={`text-[10px] px-3 py-1 rounded-full font-black animate-in fade-in slide-in-from-right-2 ${
              isKmInvalido ? "bg-red-500 text-white" : "bg-blue-600 text-white"
            }`}>
              {isKmInvalido ? `⚠ ERRO: KM DEVE SER > ${ultimoKm}` : `ÚLTIMO KM: ${ultimoKm}`}
            </span>
          )}
          {carregandoKm && <span className="text-[10px] text-blue-500 font-black animate-pulse uppercase">Consultando banco...</span>}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input 
            name="hodometro" 
            type="number" 
            placeholder="KM ATUAL" 
            value={kmDigitado}
            onChange={(e) => setKmDigitado(e.target.value)} 
            className={`w-full border-2 p-4 rounded-2xl text-black font-black outline-none transition-all ${
              isKmInvalido 
              ? "border-red-500 bg-red-50 text-red-600" 
              : "border-gray-50 focus:border-blue-500 bg-gray-50 focus:bg-white"
            }`} 
            required 
          />
          
          <input name="litros" type="number" step="0.01" placeholder="LITROS" className="border-2 border-gray-50 p-4 rounded-2xl text-black font-black focus:border-blue-500 outline-none bg-gray-50 focus:bg-white" required />
          <input name="preco" type="number" step="0.001" placeholder="PREÇO/L" className="border-2 border-gray-50 p-4 rounded-2xl text-black font-black focus:border-green-500 outline-none bg-gray-50 focus:bg-white" required />
        </div>
      </div>

      <button 
        type="submit" 
        disabled={isKmInvalido || carregandoKm}
        className={`w-full py-5 rounded-2xl font-black text-lg mt-4 transition-all shadow-xl active:scale-[0.98] ${
          isKmInvalido || carregandoKm
          ? "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none" 
          : "bg-gray-900 hover:bg-blue-600 text-white shadow-gray-200"
        }`}
      >
        {isKmInvalido ? "CORRIJA O KM" : carregandoKm ? "VERIFICANDO..." : "CONFIRMAR REGISTRO"}
      </button>
    </form>
  );
}