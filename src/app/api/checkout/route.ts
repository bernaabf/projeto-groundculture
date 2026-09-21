import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { createClient } from '@/lib/supabase/server';

// Inicializar Mercado Pago
const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN || 'TEST-0000000000000000-000000-00000000000000000000000000000000-000000000' });

function generateSaleCode() {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  let result = 'GC-';
  for (let i = 0; i < 3; i++) {
    result += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  for (let i = 0; i < 4; i++) {
    result += numbers.charAt(Math.floor(Math.random() * numbers.length));
  }
  return result; // Exemplo: GC-ABC1234
}

export async function POST(request: Request) {
  try {
    const { items, shippingPrice, shippingMethod } = await request.json();
    const supabase = await createClient();

    // Obter sessão do usuário (opcional, se não logado será null)
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Carrinho vazio" }, { status: 400 });
    }

    const saleCode = generateSaleCode();

    // Mapear itens para o formato do Mercado Pago
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const preferenceItems = items.map((item: any) => ({
      id: item.product.id,
      title: `${item.product.name} - Tamanho: ${item.variant}`,
      quantity: item.quantity,
      unit_price: Number(item.product.price),
      currency_id: 'BRL',
    }));

    // Se tiver frete, adiciona como item
    if (shippingPrice) {
      preferenceItems.push({
        id: 'shipping',
        title: `Frete - ${shippingMethod}`,
        quantity: 1,
        unit_price: Number(shippingPrice),
        currency_id: 'BRL',
      });
    }

    const preference = new Preference(client);
    
    const response = await preference.create({
      body: {
        items: preferenceItems,
        external_reference: saleCode,
        back_urls: {
          success: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/checkout/success?code=${saleCode}`,
          failure: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/checkout/failure`,
          pending: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/checkout/pending`,
        },
        auto_return: 'approved',
      }
    });

    // Aqui poderíamos salvar o pedido no banco de dados (Supabase)
    if (userId) {
      await supabase.from('orders').insert({
        user_id: userId,
        sale_code: saleCode,
        status: 'pending',
        items: items,
        total_price: preferenceItems.reduce((acc, item) => acc + (item.unit_price * item.quantity), 0),
        shipping_method: shippingMethod,
        shipping_price: shippingPrice,
        preference_id: response.id
      });
    }

    return NextResponse.json({ 
      init_point: response.init_point, 
      saleCode: saleCode,
      preferenceId: response.id
    });
  } catch (error) {
    console.error("Erro ao criar preferência:", error);
    return NextResponse.json({ error: "Erro ao iniciar checkout" }, { status: 500 });
  }
}
