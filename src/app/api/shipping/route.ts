import { NextResponse } from 'next/server';
import { calcularPrecoPrazo } from 'correios-brasil';

export async function POST(request: Request) {
  try {
    const { cep, items } = await request.json();

    if (!cep || !items) {
      return NextResponse.json({ error: "CEP e items são obrigatórios" }, { status: 400 });
    }

    // Validar CEP de destino
    const cepDestino = cep.replace(/\D/g, '');
    if (cepDestino.length !== 8) {
      return NextResponse.json({ error: "CEP inválido" }, { status: 400 });
    }

    // CEP de Origem: Recife (Centro) - Você pode ajustar para o seu exato depois
    const cepOrigem = '50010000';

    // Calcular peso e dimensões estimadas com base na quantidade de itens
    // Assumindo cada camiseta como ~300g
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const totalQuantity = items.reduce((acc: number, item: any) => acc + item.quantity, 0);
    // Correios costuma preferir pesos inteiros (em kg) na API legada. Mínimo 1kg
    const weight = Math.max(1, Math.ceil(totalQuantity * 0.3)).toString();
    
    // Dimensões mínimas dos correios (15x20x10)
    const comprimento = '20';
    const largura = '15';
    const altura = Math.max(10, 10 * Math.ceil(totalQuantity / 2)).toString(); 

    const args = {
      sCepOrigem: cepOrigem,
      sCepDestino: cepDestino,
      nVlPeso: weight,
      nCdFormato: '1', // 1 - Formato caixa/pacote
      nVlComprimento: comprimento,
      nVlAltura: altura,
      nVlLargura: largura,
      nCdServico: ['04510', '04014'], // 04510 = PAC, 04014 = SEDEX (Os códigos podem variar com contrato, esses são à vista)
      nVlDiametro: '0',
    };

    const result = await calcularPrecoPrazo(args).catch(() => null);

    if (!result || result.length === 0 || result[0].Erro !== '0') {
      console.warn("Falha ao calcular frete com os Correios, usando mock de fallback.");
      // Fallback em caso de erro da API dos Correios
      return NextResponse.json({
        options: [
          { id: "pac", name: "PAC (Estimativa)", price: 25.90, days: 7 },
          { id: "sedex", name: "SEDEX (Estimativa)", price: 45.50, days: 3 },
          { id: "retirada", name: "Retirada Pessoalmente (Recife e RM)", price: 0, days: 0 },
        ]
      });
    }

    // Mapear resultado para o formato esperado pelo frontend
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const options = result.map((servico: any) => {
      let name = "Frete";
      let id = servico.Codigo;
      if (servico.Codigo === '04510') { name = "PAC (Correios)"; id = "pac"; }
      if (servico.Codigo === '04014') { name = "SEDEX (Correios)"; id = "sedex"; }
      
      return {
        id,
        name,
        price: parseFloat(servico.Valor.replace(',', '.')),
        days: parseInt(servico.PrazoEntrega, 10),
      };
    });

    options.push({
      id: "retirada",
      name: "Retirada Pessoalmente (Recife e RM)",
      price: 0,
      days: 0,
    });

    return NextResponse.json({ options });
  } catch (error) {
    console.error("Erro ao calcular frete:", error);
    return NextResponse.json({ error: "Erro interno no servidor ao calcular o frete" }, { status: 500 });
  }
}
