"use client";

import { PDFDownloadLink } from "@react-pdf/renderer";
import { FileDown } from "lucide-react";
import { PdfAbastecimento } from "@/app/relatorios/PdfAbastecimento";
import { useEffect, useState } from "react";

export function BotaoExportar({ registros }: { registros: any[] }) {
  
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);

  if (!isClient) return (
    <div className="bg-gray-100 text-gray-400 px-6 py-3 rounded-2xl font-black flex items-center gap-2">
      <FileDown size={20} /> AGUARDE...
    </div>
  );

  return (
    <PDFDownloadLink
      document={<PdfAbastecimento registros={registros} />}
      fileName={`relatorio-frota-${new Date().toLocaleDateString('pt-BR')}.pdf`}
      className="bg-gray-900 text-white px-6 py-3 rounded-2xl font-black hover:bg-black transition-all shadow-xl shadow-gray-200 flex items-center gap-2 active:scale-95"
    >
      {({ loading }) => (
        <>
          <FileDown size={20} className={loading ? "animate-bounce" : ""} />
          {loading ? "PREPARANDO..." : "EXPORTAR PDF"}
        </>
      )}
    </PDFDownloadLink>
  );
}