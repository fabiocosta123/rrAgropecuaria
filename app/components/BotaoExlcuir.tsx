"use client";

import { useState } from "react";
import { toast } from "sonner";
import { excluirItem } from "@/lib/actions";
import { ModalConfirmacao } from "./ModalConfirmacao";

// Definindo tipos mais estritos para melhor autocompletar
type Tabela = 'veiculo' | 'motorista' | 'posto' | 'abastecimento';

interface BotaoExcluirProps {
  id: string;
  tabela: Tabela;
}

export function BotaoExcluir({ id, tabela }: BotaoExcluirProps) {
  const [modalAberto, setModalAberto] = useState(false);
  const [isExcluindo, setIsExcluindo] = useState(false);

  async function confirmarExclusao() {
    setIsExcluindo(true);
    try {
      const res = await excluirItem(id, tabela);
      if (res.success) {
        toast.success("Registro removido com sucesso!");
        setModalAberto(false);
      } else {
        toast.error(res.message || "Erro ao excluir registro.");
      }
    } catch (error) {
      toast.error("Erro de conexão ao tentar excluir.");
    } finally {
      setIsExcluindo(false);
    }
  }

  return (
    <>
      <button 
        onClick={(e) => {
          e.preventDefault(); // Evita navegar se o botão estiver dentro de um Link
          setModalAberto(true);
        }}
        disabled={isExcluindo}
        className="p-2 hover:bg-red-50 rounded-lg text-red-500 transition-colors disabled:opacity-50"
        title="Excluir"
      >
        {isExcluindo ? "..." : "🗑️"}
      </button>

     
      <ModalConfirmacao 
        isOpen={modalAberto}
        onClose={() => setModalAberto(false)}
        onConfirm={confirmarExclusao}
        titulo="Confirmar Exclusão"
        mensagem="Esta ação não pode ser desfeita. Todos os dados vinculados a este registro serão perdidos."
      />
    </>
  );
}