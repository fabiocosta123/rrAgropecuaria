import { prisma } from "@/lib/prisma";
import { FormAbastecimento } from "./FormAbastecimento";
import { salvarAbastecimento } from "./actions";

export default async function NovoAbastecimentoPage() {
  // Busca no banco 
  const veiculos = await prisma.veiculo.findMany({ orderBy: { placa: 'asc' } });
  const motoristas = await prisma.motorista.findMany({ orderBy: { nome: 'asc' } });
  const postos = await prisma.posto.findMany({ orderBy: { nome: 'asc' } });

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto min-h-screen bg-slate-50/50">
      <header className="mb-10">
        <h1 className="text-5xl font-black text-slate-900 uppercase italic tracking-tighter">
          Lançamento
        </h1>
        <p className="text-slate-400 font-bold uppercase text-xs tracking-[0.3em] mt-3">
          Registrar novo abastecimento • RR Agro
        </p>
      </header>
      
      <FormAbastecimento 
        veiculos={veiculos} 
        motoristas={motoristas} 
        postos={postos} 
        salvarAction={salvarAbastecimento}
      />
    </div>
  );
}