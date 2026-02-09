"use client"; 

import { toast } from "sonner";
import { useRef } from "react";

interface FormProps {
  veiculos: any[];
  motoristas: any[];
  postos: any[];
  salvarAction: (formData: FormData) => Promise<{ success: boolean; message: string }>;
}

export function FormAbastecimento({ veiculos, motoristas, postos, salvarAction }: FormProps) {
  const formRef = useRef<HTMLFormElement>(null);

  async function clientAction(formData: FormData) {
    const loadingToast = toast.loading("Gravando registro...");
    
    const result = await salvarAction(formData);

    toast.dismiss(loadingToast);

    if (result.success) {
      toast.success(result.message);
      formRef.current?.reset(); // Limpa o formulário após o sucesso
    } else {
      toast.error(result.message);
    }
  }

  return (
    <form ref={formRef} action={clientAction} className="space-y-4 bg-white p-6 rounded-xl shadow-md border">
      {/* Campo de Data */}
      <div>
        <label className="block text-sm font-bold mb-1 text-gray-600">Data</label>
        <input name="data" type="date" defaultValue={new Date().toISOString().split('T')[0]} className="w-full border p-2 rounded text-black" required />
      </div>

      {/* Veículo */}
      <div>
        <label className="block text-sm font-bold mb-1 text-gray-600">Veículo</label>
        <select name="veiculoId" className="w-full border p-2 rounded text-black" required>
          <option value="">Selecione o veículo...</option>
          {veiculos.map(v => <option key={v.id} value={v.id}>{v.placa} - {v.modelo}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold mb-1 text-gray-600">Motorista</label>
          <select name="motoristaId" className="w-full border p-2 rounded text-black" required>
            {motoristas.map(m => <option key={m.id} value={m.id}>{m.nome}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-bold mb-1 text-gray-600">Posto</label>
          <select name="postoId" className="w-full border p-2 rounded text-black" required>
            {postos.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 pt-4 border-t">
        <input name="hodometro" type="number" placeholder="KM Atual" className="border p-2 rounded text-black font-bold" required />
        <input name="litros" type="number" step="0.01" placeholder="Litros" className="border p-2 rounded text-black" required />
        <input name="preco" type="number" step="0.001" placeholder="Preço/L" className="border p-2 rounded text-black" required />
      </div>

      <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-xl transition-all shadow-lg">
        GRAVAR ABASTECIMENTO
      </button>
    </form>
  );
}