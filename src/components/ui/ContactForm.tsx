"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

export default function ContactForm({ whatsappLink }: { whatsappLink: string }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const message = formData.get("message") as string;

    const text = `Olá, meu nome é ${name} (${email}).\n\n${message}`;
    const url = `${whatsappLink}?text=${encodeURIComponent(text)}`;

    setTimeout(() => {
      window.open(url, "_blank");
      setLoading(false);
      setSuccess(true);
      (e.target as HTMLFormElement).reset();
    }, 800);
  };

  return (
    <form className="space-y-8" onSubmit={handleSubmit}>
      <div aria-live="polite" className="sr-only">
        {success ? "Sua mensagem foi redirecionada para o WhatsApp com sucesso." : ""}
      </div>
      
      <div className="group relative">
        <label htmlFor="name" className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1 transition-colors group-focus-within:text-white/80">Nome</label>
        <div className="relative">
          <input 
            type="text" 
            id="name"
            name="name"
            required
            className="w-full border-b border-white/20 py-3 bg-transparent font-light focus:outline-none focus:border-white transition-all duration-300 text-lg placeholder-white/20"
            placeholder="João Silva"
          />
          <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-white transition-all duration-300 group-focus-within:w-full"></span>
        </div>
      </div>
      <div className="group relative">
        <label htmlFor="email" className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1 transition-colors group-focus-within:text-white/80">Email</label>
        <div className="relative">
          <input 
            type="email" 
            id="email" 
            name="email"
            required
            className="w-full border-b border-white/20 py-3 bg-transparent font-light focus:outline-none focus:border-white transition-all duration-300 text-lg placeholder-white/20"
            placeholder="joao@exemplo.com"
          />
          <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-white transition-all duration-300 group-focus-within:w-full"></span>
        </div>
      </div>
      <div className="group relative">
        <label htmlFor="message" className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1 transition-colors group-focus-within:text-white/80">Mensagem</label>
        <div className="relative">
          <textarea 
            id="message" 
            name="message"
            rows={4}
            required
            className="w-full border-b border-white/20 py-3 bg-transparent font-light focus:outline-none focus:border-white transition-all duration-300 resize-none text-lg placeholder-white/20"
            placeholder="Como podemos ajudar?"
          ></textarea>
          <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-white transition-all duration-300 group-focus-within:w-full"></span>
        </div>
      </div>
      <Button 
        type="submit" 
        disabled={loading}
        className="w-full bg-white text-bgPrimary hover:bg-white/90 disabled:opacity-50" 
        size="lg" 
        variant="primary"
      >
        {loading ? "Redirecionando..." : "Enviar Solicitação"}
      </Button>
      
      {success && (
        <p className="text-sm text-green-400 mt-4 text-center">
          Redirecionando para o WhatsApp...
        </p>
      )}
    </form>
  );
}
