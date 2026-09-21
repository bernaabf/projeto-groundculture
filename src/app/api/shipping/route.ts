import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { cep, items } = await request.json();

    if (!cep || !items) {
      return NextResponse.json({ error: "CEP e items são obrigatórios" }, { status: 400 });
    }

    // Em um ambiente real, você enviaria esses dados para a API do Melhor Envio
    // Aqui estamos simulando o retorno da API para fins de demonstração
    
    // Simular o delay da rede
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Validar CEP
    if (cep.replace(/\D/g, '').length !== 8) {
      return NextResponse.json({ error: "CEP inválido" }, { status: 400 });
    }

    const mockShippingOptions = [
      {
        id: "pac",
        name: "PAC (Correios via Melhor Envio)",
        price: 25.90,
        days: 7,
      },
      {
        id: "sedex",
        name: "SEDEX (Correios via Melhor Envio)",
        price: 45.50,
        days: 3,
      },
    ];

    return NextResponse.json({ options: mockShippingOptions });
  } catch (error) {
    console.error("Erro ao calcular frete:", error);
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
}
