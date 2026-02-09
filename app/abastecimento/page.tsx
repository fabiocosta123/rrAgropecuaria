import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export default async function NovoAbastecimentoPage() {
  // Buscamos todas as opções para o usuário selecionar
  const [veiculos, motoristas, postos] = await Promise.all([
    prisma.veiculo.findMany({ orderBy: { placa: 'asc' } }),
    prisma.motorista.findMany({ orderBy: { nome: 'asc' } }),
    prisma.posto.findMany({ orderBy: { nome: 'asc' } }),
  ]);

  async function salvarAbastecimento(formData: FormData) {
    "use server";
    
    const veiculoId = formData.get("veiculoId") as string;
    const motoristaId = formData.get("motoristaId") as string;
    const postoId = formData.get("postoId") as string;
    const data = new Date(formData.get("data") as string);
    const hodometro = Number(formData.get("hodometro"));
    const litros = Number(formData.get("litros"));
    const preco = Number(formData.get("preco"));
    const total = litros * preco;

    await prisma.abastecimento.create({
      data: {
        veiculoId,
        motoristaId,
        postoId,
        data,
        hodometro,
        quantidadeLitros: litros,
        precoPorLitro: preco,
        valorTotal: total,
      }
    });

    revalidatePath("/historico");
    redirect("/historico");
  }

  return (
    <div className="p-8 max-w-2xl mx-auto text-black">
      <header className="mb-8">
        <h1 className="text-3xl font-black text-gray-900">Novo Abastecimento</h1>
        <p className="text-gray-500 font-medium">Registre os dados do cupom fiscal</p>
      </header>

      <form action={salvarAbastecimento} className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 space-y-6">
        
        {/* SELEÇÃO DE VEÍCULO */}
        <div>
          <label className="block text-xs font-black text-gray-400 uppercase mb-2 tracking-widest">Veículo (Placa)</label>
          <select name="veiculoId" className="w-full border-2 border-gray-50 p-4 rounded-2xl bg-gray-50 focus:bg-white focus:border-blue-500 outline-none transition-all font-bold" required>
            <option value="">Selecione o veículo...</option>
            {veiculos.map(v => (
              <option key={v.id} value={v.id}>{v.placa} - {v.modelo}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* SELEÇÃO DE MOTORISTA */}
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase mb-2 tracking-widest">Motorista</label>
            <select name="motoristaId" className="w-full border-2 border-gray-50 p-4 rounded-2xl bg-gray-50 focus:bg-white focus:border-blue-500 outline-none transition-all font-bold" required>
              <option value="">Quem dirigia?</option>
              {motoristas.map(m => (
                <option key={m.id} value={m.id}>{m.nome}</option>
              ))}
            </select>
          </div>

          {/* SELEÇÃO DE POSTO */}
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase mb-2 tracking-widest">Posto</label>
            <select name="postoId" className="w-full border-2 border-gray-50 p-4 rounded-2xl bg-gray-50 focus:bg-white focus:border-blue-500 outline-none transition-all font-bold" required>
              <option value="">Onde abasteceu?</option>
              {postos.map(p => (
                <option key={p.id} value={p.id}>{p.nome}</option>
              ))}
            </select>
          </div>
        </div>

        <hr className="border-gray-50" />

        {/* DADOS TÉCNICOS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Data</label>
            <input name="data" type="date" className="w-full border-2 border-gray-50 p-3 rounded-xl outline-none focus:border-blue-500" required defaultValue={new Date().toISOString().split('T')[0]} />
          </div>
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Hodômetro (KM)</label>
            <input name="hodometro" type="number" placeholder="00000" className="w-full border-2 border-gray-50 p-3 rounded-xl outline-none focus:border-blue-500" required />
          </div>
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Litros</label>
            <input name="litros" type="number" step="0.01" placeholder="0.00" className="w-full border-2 border-gray-50 p-3 rounded-xl outline-none focus:border-blue-500" required />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Preço por Litro (R$)</label>
          <input name="preco" type="number" step="0.001" placeholder="R$ 0,000" className="w-full border-2 border-gray-50 p-4 rounded-2xl outline-none focus:border-green-500 text-xl font-black text-green-600" required />
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 active:scale-[0.98]">
          Confirmar Abastecimento
        </button>
      </form>
    </div>
  );
}