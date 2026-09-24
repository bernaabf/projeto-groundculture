import { createClient } from "@/lib/supabase/server";
import { DollarSign, Package, TrendingUp, Users } from "lucide-react";

// Tipo temporário para demonstrar UI
type Order = {
  id: string;
  sale_code: string;
  created_at: string;
  total_price: number;
  status: string;
  shipping_method: string;
};

export default async function AdminDashboard() {
  const supabase = await createClient();
  
  // Buscar pedidos do banco de dados
  const { data: orders, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  // Valores mockados em caso de erro/falta de tabela
  const safeOrders: Order[] = orders || [
    {
      id: "1",
      sale_code: "GC-XYZ1234",
      created_at: new Date().toISOString(),
      total_price: 250.0,
      status: "approved",
      shipping_method: "SEDEX (Correios)",
    },
    {
      id: "2",
      sale_code: "GC-ABC5678",
      created_at: new Date(Date.now() - 86400000).toISOString(),
      total_price: 180.0,
      status: "pending",
      shipping_method: "PAC (Correios)",
    }
  ];

  const totalSales = safeOrders.filter(o => o.status === 'approved').reduce((acc, o) => acc + o.total_price, 0);
  const pendingOrders = safeOrders.filter(o => o.status === 'pending').length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-medium">Dashboard de Vendas</h1>
        <p className="text-neutral-500 mt-1">Bem-vindo ao seu painel de controle. Aqui você acompanha seus resultados.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider">Receita Total</h3>
            <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-bold">R$ {totalSales.toFixed(2).replace('.', ',')}</div>
          <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
            <TrendingUp className="w-4 h-4" /> +12% esse mês
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider">Pedidos</h3>
            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-bold">{safeOrders.length}</div>
          <p className="text-sm text-neutral-500 mt-2">Total de pedidos realizados</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider">Pendentes</h3>
            <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-bold">{pendingOrders}</div>
          <p className="text-sm text-neutral-500 mt-2">Aguardando pagamento</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider">Clientes</h3>
            <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-bold">--</div>
          <p className="text-sm text-neutral-500 mt-2">Registrados via Google</p>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-neutral-200 flex justify-between items-center">
          <h2 className="text-lg font-bold">Pedidos Recentes</h2>
          <button className="text-sm font-medium text-black hover:underline">Ver todos</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-50 text-neutral-500 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-semibold">Código</th>
                <th className="px-6 py-4 font-semibold">Data</th>
                <th className="px-6 py-4 font-semibold">Frete</th>
                <th className="px-6 py-4 font-semibold">Total</th>
                <th className="px-6 py-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {safeOrders.map((order) => (
                <tr key={order.id} className="hover:bg-neutral-50 transition-colors">
                  <td className="px-6 py-4 font-medium">{order.sale_code}</td>
                  <td className="px-6 py-4 text-neutral-500">
                    {new Date(order.created_at).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 text-neutral-500">{order.shipping_method}</td>
                  <td className="px-6 py-4 font-medium">R$ {order.total_price.toFixed(2).replace('.', ',')}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      order.status === 'approved' 
                        ? 'bg-green-100 text-green-700' 
                        : order.status === 'pending'
                        ? 'bg-orange-100 text-orange-700'
                        : 'bg-neutral-100 text-neutral-700'
                    }`}>
                      {order.status === 'approved' ? 'Aprovado' : order.status === 'pending' ? 'Pendente' : order.status}
                    </span>
                  </td>
                </tr>
              ))}
              {safeOrders.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-neutral-500">
                    Nenhum pedido encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
