import { Metadata } from "next";
import { storeData } from "@/lib/data";
import { Button } from "@/components/ui/Button";
import { LetteringText } from "@/components/ui/LetteringText";

export const metadata: Metadata = {
  title: "Contact | Ground Culture",
};

export default function ContatoPage() {
  return (
    <div className="bg-bgPrimary text-white min-h-screen pt-40 pb-24">
      <div className="container mx-auto px-6 lg:px-12 max-w-6xl">
        <div className="mb-8">
          <span className="font-bold uppercase tracking-widest text-xs text-white/40">Contato</span>
        </div>
        <LetteringText 
          text="Fale Conosco"
          className="text-6xl md:text-8xl font-display font-medium tracking-tight mb-16 leading-[1.1]"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-24">
          <div className="space-y-12">
            <p className="text-2xl font-light text-white/80 leading-relaxed">
              Estamos prontos para ajudar. Entre em contato pelos nossos canais oficiais para dúvidas sobre produtos, tamanhos ou pedidos.
            </p>

            <div className="space-y-10 border-t border-borderPrimary pt-10">
              <div>
                <h3 className="font-bold uppercase tracking-widest text-xs text-white/40 mb-3">WhatsApp</h3>
                <a href={storeData.contact.whatsapp} target="_blank" rel="noreferrer" className="text-2xl font-display font-medium hover:text-accent transition-colors">
                  Enviar Mensagem
                </a>
              </div>
              
              <div>
                <h3 className="font-bold uppercase tracking-widest text-xs text-white/40 mb-3">Instagram</h3>
                <a href={storeData.contact.instagram} target="_blank" rel="noreferrer" className="text-2xl font-display font-medium hover:text-accent transition-colors">
                  @groundculture.store
                </a>
              </div>

              <div>
                <h3 className="font-bold uppercase tracking-widest text-xs text-white/40 mb-3">Email</h3>
                <a href={`mailto:${storeData.contact.email}`} className="text-2xl font-display font-medium hover:text-accent transition-colors">
                  {storeData.contact.email}
                </a>
              </div>
            </div>
          </div>

          {/* Minimalist Form */}
          <div className="bg-bgSecondary p-8 md:p-12 rounded-3xl shadow-sm border border-borderLight">
            <h3 className="text-2xl font-display font-medium mb-8">Envie uma mensagem</h3>
            <form className="space-y-8">
              <div>
                <label htmlFor="name" className="block text-xs font-bold uppercase tracking-widest text-white/40 mb-2">Nome</label>
                <input 
                  type="text" 
                  id="name" 
                  className="w-full border-b border-borderLight py-3 bg-transparent font-light focus:outline-none focus:border-white transition-colors text-lg"
                  placeholder="João Silva"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-xs font-bold uppercase tracking-widest text-white/40 mb-2">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  className="w-full border-b border-borderLight py-3 bg-transparent font-light focus:outline-none focus:border-white transition-colors text-lg"
                  placeholder="joao@exemplo.com"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-xs font-bold uppercase tracking-widest text-white/40 mb-2">Mensagem</label>
                <textarea 
                  id="message" 
                  rows={4}
                  className="w-full border-b border-borderLight py-3 bg-transparent font-light focus:outline-none focus:border-white transition-colors resize-none text-lg"
                  placeholder="Como podemos ajudar?"
                ></textarea>
              </div>
              <Button type="button" className="w-full bg-white text-bgPrimary hover:bg-white/90" size="lg" variant="primary">
                Enviar Solicitação
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
