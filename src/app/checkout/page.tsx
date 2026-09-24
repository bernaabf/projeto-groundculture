"use client";

import { useCartStore } from "@/lib/store/useCartStore";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { ShoppingBag } from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore(state => state.items);
  const getTotal = useCartStore(state => state.getTotal);
  const subtotal = getTotal();

  const [shippingInfo, setShippingInfo] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    cpf: "",
    telefone: "",
    cep: "",
    rua: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
  });

  useEffect(() => {
    // Recuperar o frete selecionado do sessionStorage
    if (typeof window !== 'undefined') {
      const savedShipping = sessionStorage.getItem('gc_checkout_shipping');
      if (savedShipping) {
        try {
          const parsed = JSON.parse(savedShipping);
          setShippingInfo(parsed);
          // Opcional: preencher o CEP com o CEP usado para calcular o frete (se tivéssemos salvo)
        } catch (e) {
          console.error(e);
        }
      }
      
      const savedCep = sessionStorage.getItem('gc_checkout_cep');
      if (savedCep) {
        setFormData(prev => ({ ...prev, cep: savedCep }));
      }
    }
  }, []);

  useEffect(() => {
    // Buscar CEP na API do ViaCEP quando estiver completo (9 dígitos contando o traço)
    const fetchCep = async () => {
      if (formData.cep.length === 9) {
        try {
          const rawCep = formData.cep.replace(/\D/g, "");
          const res = await fetch(`https://viacep.com.br/ws/${rawCep}/json/`);
          const data = await res.json();
          if (!data.erro) {
            setFormData(prev => ({
              ...prev,
              rua: data.logradouro || prev.rua,
              bairro: data.bairro || prev.bairro,
              cidade: data.localidade || prev.cidade,
              estado: data.uf || prev.estado,
            }));
            // Poderíamos focar no input de número aqui, mas para manter simples só preenchemos.
          }
        } catch (error) {
          console.error("Erro ao buscar CEP:", error);
        }
      }
    };
    fetchCep();
  }, [formData.cep]);

  const total = subtotal + (shippingInfo?.price || 0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === "cep") {
      let cepVal = value.replace(/\D/g, "");
      if (cepVal.length > 8) cepVal = cepVal.slice(0, 8);
      if (cepVal.length > 5) {
        cepVal = cepVal.slice(0, 5) + "-" + cepVal.slice(5);
      }
      setFormData(prev => ({ ...prev, [name]: cepVal }));
      return;
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (shippingInfo?.id === "retirada") {
        // Redireciona para o WhatsApp
        const phoneNumber = "5581900000000"; // TODO: Colocar o número real do Miguel
        
        let text = `Olá! Gostaria de finalizar minha compra na Ground Culture (Retirada Pessoalmente).\n\n`;
        text += `*MEUS DADOS*\n`;
        text += `Nome: ${formData.nome}\n`;
        text += `Email: ${formData.email}\n`;
        text += `Telefone: ${formData.telefone}\n\n`;
        text += `*PEDIDO*\n`;
        items.forEach(item => {
          text += `- ${item.quantity}x ${item.product.name} (Tam: ${item.variant}) - R$ ${(item.product.price * item.quantity).toFixed(2).replace('.', ',')}\n`;
        });
        text += `\n*Total a pagar:* R$ ${total.toFixed(2).replace('.', ',')}\n`;
        text += `\nAguardo as instruções para o pagamento e retirada!`;

        // Opcional: Salvar no banco como pedido pendente de whatsapp chamando a API
        await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            items,
            shippingPrice: 0,
            shippingMethod: "Retirada Pessoalmente (WhatsApp)",
            payer: { name: formData.nome, email: formData.email, cpf: formData.cpf, phone: formData.telefone },
            address: { zip_code: formData.cep, street_name: formData.rua, street_number: formData.numero, city: formData.cidade, state: formData.estado }
          }),
        }).catch(() => {}); // Ignora erros ao salvar no db localmente
        
        window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`, '_blank');
        setIsSubmitting(false);
        return;
      }

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          items,
          shippingPrice: shippingInfo?.price,
          shippingMethod: shippingInfo?.name,
          payer: {
            name: formData.nome,
            email: formData.email,
            cpf: formData.cpf,
            phone: formData.telefone,
          },
          address: {
            zip_code: formData.cep,
            street_name: formData.rua,
            street_number: formData.numero,
            complement: formData.complemento,
            neighborhood: formData.bairro,
            city: formData.cidade,
            state: formData.estado,
          }
        }),
      });
      const data = await res.json();
      if (data.init_point) {
        window.location.href = data.init_point;
      } else {
        alert(data.error || "Erro ao processar o pagamento");
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error(error);
      alert("Erro ao conectar com o servidor.");
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center pt-20 px-4">
        <ShoppingBag className="w-16 h-16 text-neutral-300 mb-4" />
        <h1 className="text-2xl font-display font-medium text-neutral-900 mb-2">Seu carrinho está vazio</h1>
        <p className="text-neutral-500 mb-6">Adicione alguns produtos para continuar o checkout.</p>
        <Button onClick={() => router.push("/")}>Voltar para a loja</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-display font-medium text-neutral-900 mb-8">Finalizar Compra</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Coluna Esquerda: Formulário */}
          <div className="lg:col-span-7 xl:col-span-8">
            <form id="checkout-form" onSubmit={handleSubmit} className="space-y-8 bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-neutral-200">
              
              {/* Dados Pessoais */}
              <div>
                <h2 className="text-xl font-semibold text-neutral-900 mb-4 border-b border-neutral-100 pb-2">Dados Pessoais</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Nome Completo *</label>
                    <input required type="text" name="nome" value={formData.nome} onChange={handleInputChange} className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-neutral-900" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">E-mail *</label>
                    <input required type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-neutral-900" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">CPF *</label>
                    <input required type="text" name="cpf" value={formData.cpf} onChange={handleInputChange} className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-neutral-900" placeholder="000.000.000-00" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Telefone / WhatsApp *</label>
                    <input required type="text" name="telefone" value={formData.telefone} onChange={handleInputChange} className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-neutral-900" placeholder="(00) 00000-0000" />
                  </div>
                </div>
              </div>

              {/* Endereço */}
              <div>
                <h2 className="text-xl font-semibold text-neutral-900 mb-4 border-b border-neutral-100 pb-2">Endereço de Entrega</h2>
                <div className="grid grid-cols-1 sm:grid-cols-6 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-neutral-700 mb-1">CEP *</label>
                    <input required type="text" name="cep" value={formData.cep} onChange={handleInputChange} className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-neutral-900" placeholder="00000-000" maxLength={9} />
                  </div>
                  <div className="sm:col-span-4">
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Rua *</label>
                    <input required type="text" name="rua" value={formData.rua} onChange={handleInputChange} className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-neutral-900" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Número *</label>
                    <input required type="text" name="numero" value={formData.numero} onChange={handleInputChange} className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-neutral-900" />
                  </div>
                  <div className="sm:col-span-4">
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Complemento</label>
                    <input type="text" name="complemento" value={formData.complemento} onChange={handleInputChange} className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-neutral-900" placeholder="Apto, Bloco, etc." />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Bairro *</label>
                    <input required type="text" name="bairro" value={formData.bairro} onChange={handleInputChange} className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-neutral-900" />
                  </div>
                  <div className="sm:col-span-3">
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Cidade *</label>
                    <input required type="text" name="cidade" value={formData.cidade} onChange={handleInputChange} className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-neutral-900" />
                  </div>
                  <div className="sm:col-span-1">
                    <label className="block text-sm font-medium text-neutral-700 mb-1">UF *</label>
                    <input required type="text" name="estado" value={formData.estado} onChange={handleInputChange} className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-neutral-900" maxLength={2} placeholder="SP" />
                  </div>
                </div>
              </div>

            </form>
          </div>

          {/* Coluna Direita: Resumo */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-neutral-200 sticky top-24 text-neutral-900">
              <h2 className="text-xl font-semibold mb-6">Resumo do Pedido</h2>
              
              <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2">
                {items.map((item) => (
                  <div key={`${item.product.id}-${item.variant}`} className="flex gap-4">
                    <div className="w-16 h-16 bg-neutral-100 rounded-md relative overflow-hidden shrink-0">
                      <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <h3 className="text-sm font-medium line-clamp-1">{item.product.name}</h3>
                      <p className="text-xs text-neutral-500">Tam: {item.variant} | Qtd: {item.quantity}</p>
                    </div>
                    <div className="text-right flex flex-col justify-center">
                      <p className="text-sm font-semibold">R$ {(item.product.price * item.quantity).toFixed(2).replace('.', ',')}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-neutral-100 pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">Subtotal</span>
                  <span className="font-medium">R$ {subtotal.toFixed(2).replace('.', ',')}</span>
                </div>
                
                {shippingInfo ? (
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-500">Frete ({shippingInfo.name})</span>
                    <span className="font-medium">R$ {shippingInfo.price.toFixed(2).replace('.', ',')}</span>
                  </div>
                ) : (
                  <div className="flex justify-between text-sm text-amber-600 bg-amber-50 p-2 rounded">
                    <span>Atenção:</span>
                    <span className="text-right text-xs">Frete não calculado. Volte ao carrinho se necessário.</span>
                  </div>
                )}
                
                <div className="flex justify-between pt-3 border-t border-neutral-200">
                  <span className="font-bold text-lg">Total</span>
                  <span className="font-bold text-xl">R$ {total.toFixed(2).replace('.', ',')}</span>
                </div>
              </div>

              <Button 
                type="submit" 
                form="checkout-form"
                className={`w-full h-14 mt-8 text-white text-lg shadow-xl shadow-black/10 ${shippingInfo?.id === 'retirada' ? 'bg-green-600 hover:bg-green-700' : 'bg-black hover:bg-neutral-800'}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Processando..." : (shippingInfo?.id === "retirada" ? "Finalizar via WhatsApp" : "Ir para Pagamento")}
              </Button>
              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-neutral-400">
                <span>Ambiente Seguro</span>
                <span>•</span>
                <span>Mercado Pago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
