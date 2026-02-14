"use client";

import { Trash2, Loader2, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { excluirAbastecimento } from "@/app/abastecimento/actions"; // Ajuste o caminho aqui

export function BotaoExcluir({ id }: { id: string }) {
  const [confirmar, setConfirmar] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleExcluir() {
    setLoading(true);
    try {
      const result = await excluirAbastecimento(id);
      if (result.success) {
        toast.success("Registro excluído com sucesso!");
      } else {
        toast.error("Erro ao excluir.");
      }
    } catch (error) {
      toast.error("Erro na comunicação com o servidor.");
    } finally {
      setLoading(false);
      setConfirmar(false);
    }
  }

  if (confirmar) {
    return (
      <div className="flex items-center gap-2 bg-red-50 p-1 rounded-xl border border-red-100 animate-in fade-in slide-in-from-right-2">
        <button
          onClick={handleExcluir}
          disabled={loading}
          className="bg-red-600 text-white text-[9px] font-black px-3 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-1"
        >
          {loading ? <Loader2 size={12} className="animate-spin" /> : "CONFIRMAR"}
        </button>
        <button
          onClick={() => setConfirmar(false)}
          className="text-[9px] font-black text-gray-400 hover:text-gray-600 px-2"
        >
          CANCELAR
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirmar(true)}
      className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all group-hover:scale-110"
      title="Excluir Registro"
    >
      <Trash2 size={18} />
    </button>
  );
}