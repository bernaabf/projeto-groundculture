import Link from "next/link";
import { storeData } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="bg-bgPrimary text-white pt-24 pb-12 border-t border-borderPrimary">
      <div className="container mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-24 border-b border-borderPrimary pb-24">
        
        {/* Brand */}
        <div className="md:col-span-2 space-y-6">
          <Link href="/" className="text-3xl font-display font-medium tracking-tight flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded-full" />
            Ground Culture
          </Link>
          <p className="text-white/60 text-lg font-light max-w-md leading-relaxed">
            Fightwear premium para quem vive a cultura do Jiu-Jitsu No-Gi. Alta performance, durabilidade e estilo projetados para os tatames.
          </p>
        </div>

        {/* Links */}
        <div>
          <h4 className="font-bold uppercase tracking-widest text-xs text-white/40 mb-6">
            Navegação
          </h4>
          <ul className="space-y-4">
            <li>
              <Link href="/produtos" className="text-lg font-medium hover:text-white/70 transition-colors">
                Explorar Produtos
              </Link>
            </li>
            <li>
              <Link href="/sobre" className="text-lg font-medium hover:text-white/70 transition-colors">
                O Editorial
              </Link>
            </li>
            <li>
              <Link href="/contato" className="text-lg font-medium hover:text-white/70 transition-colors">
                Fale Conosco
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact & Social */}
        <div>
          <h4 className="font-bold uppercase tracking-widest text-xs text-white/40 mb-6">
            Conectar
          </h4>
          <ul className="space-y-4">
            <li>
              <a 
                href={storeData.contact.whatsapp} 
                target="_blank" 
                rel="noreferrer"
                className="text-lg font-medium hover:text-white/70 transition-colors"
              >
                WhatsApp
              </a>
            </li>
            <li>
              <a 
                href={storeData.contact.instagram} 
                target="_blank" 
                rel="noreferrer"
                className="text-lg font-medium hover:text-white/70 transition-colors"
              >
                Instagram
              </a>
            </li>
            <li>
              <a 
                href={`mailto:${storeData.contact.email}`}
                className="text-lg font-medium hover:text-white/70 transition-colors"
              >
                Email
              </a>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="container mx-auto px-6 lg:px-12 mt-12 flex flex-col md:flex-row items-center justify-between text-xs text-white/40 font-medium tracking-wide">
        <p>&copy; {new Date().getFullYear()} Ground Culture Store. Todos os direitos reservados.</p>
        <p className="mt-4 md:mt-0">Projeto Demo / Nenhum pagamento processado</p>
      </div>
    </footer>
  );
}
