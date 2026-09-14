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
      
      <div>
        <label htmlFor="name" className="block text-xs font-bold uppercase tracking-widest text-white/40 mb-2">Nome</label>
        <input 
          type="text" 
          id="name"
          name="name"
          required
          className="w-full border-b border-borderLight py-3 bg-transparent font-light focus:outline-none focus:border-white transition-colors text-lg"
          placeholder="João Silva"
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-xs font-bold uppercase tracking-widest text-white/40 mb-2">Email</label>
        <input 
          type="email" 
          id="email" 
          name="email"
          required
          className="w-full border-b border-borderLight py-3 bg-transparent font-light focus:outline-none focus:border-white transition-colors text-lg"
          placeholder="joao@exemplo.com"
        />
      </div>
      <div>
        <label htmlFor="message" className="block text-xs font-bold uppercase tracking-widest text-white/40 mb-2">Mensagem</label>
        <textarea 
          id="message" 
          name="message"
          rows={4}
          required
          className="w-full border-b border-borderLight py-3 bg-transparent font-light focus:outline-none focus:border-white transition-colors resize-none text-lg"
          placeholder="Como podemos ajudar?"
        ></textarea>
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
