import { Metadata } from "next";
import { LetteringText } from "@/components/ui/LetteringText";

export const metadata: Metadata = {
  title: "O Editorial",
};

export default function SobrePage() {
  return (
    <div className="bg-bgPrimary text-white min-h-screen pt-40 pb-24">
      <div className="container mx-auto px-6 lg:px-12 max-w-5xl">
        <div className="mb-8">
          <span className="font-bold uppercase tracking-widest text-xs text-white/40">O Editorial</span>
        </div>
        <LetteringText 
          text="Nossas Origens"
          className="text-6xl md:text-8xl font-display font-medium tracking-tight mb-16 leading-[1.1]"
        />
        
        <div className="space-y-12 text-xl md:text-3xl font-light text-white/80 leading-relaxed max-w-4xl">
          <p>
            A Ground Culture nasceu de uma paixão profunda pelo Jiu-Jitsu No-Gi e pela cultura das artes marciais. Somos mais do que uma marca de roupas; somos a representação de um estilo de vida forjado nos tatames, construído com resiliência e respeito.
          </p>
          
          <p>
            Nossa missão é desenvolver fightwear de altíssima performance, unindo estética minimalista com tecnologia de ponta. Cada rashguard é projetada para suportar os rolas mais intensos, oferecendo compressão incomparável, conforto e durabilidade.
          </p>

          <p>
            Não aceitamos a mediocridade. Acreditamos que a verdadeira força vem da disciplina diária. Bem-vindo à ground culture.
          </p>
        </div>
      </div>
    </div>
  );
}
