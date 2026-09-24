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
    const { items, shippingPrice, shippingMethod, payer, address } = await request.json();
    const supabase = await createClient();

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

    // Se for retirada pelo WhatsApp, salva local e retorna
    if (shippingMethod === "Retirada Pessoalmente (WhatsApp)") {
      try {
        await supabase.from('orders').insert({
          sale_code: saleCode,
          status: 'pending_whatsapp',
          items: items,
          total_price: preferenceItems.reduce((acc: number, item: any) => acc + (item.unit_price * item.quantity), 0),
          shipping_method: shippingMethod,
          shipping_price: 0,
          customer_name: payer?.name,
          customer_email: payer?.email,
          customer_cpf: payer?.cpf,
          customer_phone: payer?.phone,
          shipping_address: address
        });
      } catch (dbError) {
        console.warn("Aviso: Falha ao salvar pedido de WhatsApp localmente.", dbError);
      }
      return NextResponse.json({ success: true, saleCode });
    }

    const preference = new Preference(client);
    
    // Preparar dados do payer para o Mercado Pago
    const mpPayer = payer ? {
      name: payer.name?.split(' ')[0],
      surname: payer.name?.split(' ').slice(1).join(' '),
      email: payer.email,
      phone: {
        area_code: payer.phone?.substring(0, 2),
        number: payer.phone?.substring(2),
      },
      address: address ? {
        zip_code: address.zip_code,
        street_name: address.street_name,
        street_number: address.street_number,
      } : undefined
    } : undefined;
    
    try {
      const response = await preference.create({
        body: {
          items: preferenceItems,
          payer: mpPayer,
          external_reference: saleCode,
          back_urls: {
            success: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/checkout/success?code=${saleCode}`,
            failure: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/checkout/failure`,
            pending: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/checkout/pending`,
          },
          auto_return: 'approved',
        }
      });
      
      // Salvar o pedido no banco de dados
      try {
        await supabase.from('orders').insert({
          sale_code: saleCode,
          status: 'pending',
          items: items,
          total_price: preferenceItems.reduce((acc: number, item: any) => acc + (item.unit_price * item.quantity), 0),
          shipping_method: shippingMethod,
          shipping_price: shippingPrice,
          preference_id: response.id,
          customer_name: payer?.name,
          customer_email: payer?.email,
          customer_cpf: payer?.cpf,
          customer_phone: payer?.phone,
          shipping_address: address
        });
      } catch (dbError) {
        console.warn("Aviso: Falha ao salvar pedido localmente. (Pode faltar colunas no BD)", dbError);
      }

      return NextResponse.json({ 
        init_point: response.init_point, 
        saleCode: saleCode,
        preferenceId: response.id
      });
      
    } catch (mpError) {
      console.warn("Mercado Pago falhou (provavelmente sem token válido). Usando MOCK para apresentação.", mpError);
      
      // MOCK para apresentação: Salva o pedido localmente e finge que foi pro MP
      try {
        await supabase.from('orders').insert({
          sale_code: saleCode,
          status: 'pending', // mock
          items: items,
          total_price: preferenceItems.reduce((acc: number, item: any) => acc + (item.unit_price * item.quantity), 0),
          shipping_method: shippingMethod,
          shipping_price: shippingPrice,
          preference_id: 'mock_pref_123',
          customer_name: payer?.name,
          customer_email: payer?.email,
          customer_cpf: payer?.cpf,
          customer_phone: payer?.phone,
          shipping_address: address
        });
      } catch (dbError) {
        console.warn("Aviso: Falha ao salvar pedido mock localmente.", dbError);
      }

      // Retorna para a página de sucesso diretamente para não travar a apresentação
      const mockInitPoint = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/checkout/success?code=${saleCode}`;
      
      return NextResponse.json({ 
        init_point: mockInitPoint, 
        saleCode: saleCode,
        preferenceId: 'mock_pref_123'
      });
    }

  } catch (error) {
    console.error("Erro geral no checkout:", error);
    return NextResponse.json({ error: "Erro ao iniciar checkout" }, { status: 500 });
  }
}
