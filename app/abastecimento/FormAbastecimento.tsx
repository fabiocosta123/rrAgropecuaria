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

  // Verifica se o KM atual é menor ou igual ao último
  const isKmInvalido = ultimoKm !== null && kmDigitado !== "" && Number(kmDigitado) <= ultimoKm;

  async function handleVeiculoChange(veiculoId: string) {
    if (!veiculoId) {
      setUltimoKm(null);
      return;
    }
    try {
      const response = await fetch(`/api/veiculo/${veiculoId}/ultimo-km`);
      const data = await response.json();
      setUltimoKm(data.ultimoKm);
    } catch (error) {
      console.error("Erro ao buscar KM", error);
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
      setKmDigitado(""); // Limpa o estado
    } else {
      toast.error(result.message);
    }
  }
  return (
    <form ref={formRef} action={clientAction} className="space-y-4 bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Campo de Data */}
        <div>
          <label className="block text-xs font-black text-gray-400 uppercase mb-1">Data</label>
          <input name="data" type="date" defaultValue={new Date().toISOString().split('T')[0]} className="w-full border-2 border-gray-50 p-3 rounded-xl text-black font-bold focus:border-blue-500 outline-none" required />
        </div>

        {/* Veículo */}
        <div>
          <label className="block text-xs font-black text-gray-400 uppercase mb-1">Veículo</label>
          <select 
            name="veiculoId" 
            className="w-full border-2 border-gray-50 p-3 rounded-xl text-black font-bold focus:border-blue-500 outline-none" 
            required
            onChange={(e) => handleVeiculoChange(e.target.value)} // Chama a API ao mudar
          >
            <option value="">Selecione...</option>
            {veiculos.map(v => <option key={v.id} value={v.id}>{v.placa} - {v.modelo}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-black text-gray-400 uppercase mb-1">Motorista</label>
          <select name="motoristaId" className="w-full border-2 border-gray-50 p-3 rounded-xl text-black font-bold focus:border-blue-500 outline-none" required>
            <option value="">Selecione...</option>
            {motoristas.map(m => <option key={m.id} value={m.id}>{m.nome}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-black text-gray-400 uppercase mb-1">Posto</label>
          <select name="postoId" className="w-full border-2 border-gray-50 p-3 rounded-xl text-black font-bold focus:border-blue-500 outline-none" required>
            <option value="">Selecione...</option>
            {postos.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
          </select>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-50">
        <div className="flex justify-between items-center mb-2">
          <label className="text-xs font-black text-gray-400 uppercase tracking-tighter">Dados de Consumo</label>
          {ultimoKm !== null && (
            <span className={`text-[10px] px-2 py-1 rounded-lg font-black transition-colors ${
              isKmInvalido ? "bg-red-100 text-red-600" : "bg-blue-50 text-blue-600"
            }`}>
              {isKmInvalido ? `⚠ DEVE SER MAIOR QUE ${ultimoKm}` : `ÚLTIMO REGISTRO: ${ultimoKm} KM`}
            </span>
          )}
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="relative">
            <input 
              name="hodometro" 
              type="number" 
              placeholder="KM Atual" 
              value={kmDigitado || " "}
              onChange={(e) => setKmDigitado(e.target.value)} 
              className={`w-full border-2 p-3 rounded-xl text-black font-bold outline-none transition-all ${
                isKmInvalido 
                ? "border-red-500 bg-red-50 focus:border-red-600" 
                : "border-gray-50 focus:border-blue-500 bg-gray-50 focus:bg-white"
              }`} 
              required 
            />
          </div>
          
          <input name="litros" type="number" step="0.01" placeholder="Litros" className="border-2 border-gray-50 p-3 rounded-xl text-black font-bold focus:border-blue-500 outline-none bg-gray-50 focus:bg-white" required />
          <input name="preco" type="number" step="0.001" placeholder="Preço/L" className="border-2 border-gray-50 p-3 rounded-xl text-black font-bold focus:border-green-500 outline-none bg-gray-50 focus:bg-white" required />
        </div>
      </div>

      <button 
        type="submit" 
        disabled={isKmInvalido} // Desabilita o botão se o KM estiver errado
        className={`w-full py-5 rounded-2xl font-black text-xl transition-all shadow-xl active:scale-95 ${
          isKmInvalido 
          ? "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none" 
          : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-100"
        }`}
      >
        {isKmInvalido ? "KM INVÁLIDO" : "GRAVAR ABASTECIMENTO"}
      </button>
    </form>
  );
}