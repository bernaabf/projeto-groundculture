"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Turnstile } from "@marsidev/react-turnstile";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  const handleGoogleLogin = async () => {
    if (!token) {
      alert("Por favor, verifique se você é humano antes de prosseguir.");
      return;
    }

    setIsLoading(true);
    try {
      const params = new URLSearchParams(window.location.search);
      const redirectTo = params.get('redirectTo');
      let callbackUrl = `${window.location.origin}/auth/callback`;
      
      if (redirectTo === 'checkout') {
        callbackUrl = `${window.location.origin}/auth/callback?next=/?cart=true`;
      }

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: callbackUrl,
        },
      });

      if (error) throw error;
    } catch (error) {
      console.error("Erro no login:", error);
      alert("Ocorreu um erro ao fazer login.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-24 px-4 bg-bgPrimary">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-neutral-100 text-neutral-900"
      >
        <h1 className="text-3xl font-display font-medium mb-2 text-center text-black">Bem-vindo</h1>
        <p className="text-neutral-500 text-center mb-8 text-sm">
          Faça login para acompanhar seus pedidos e finalizar compras mais rápido.
        </p>

        <div className="flex flex-col gap-6">
          <div className="flex justify-center">
            {/* O site key deve vir das variáveis de ambiente */}
            <Turnstile
              siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "1x00000000000000000000AA"}
              onSuccess={(token) => setToken(token)}
            />
          </div>

          <Button 
            onClick={handleGoogleLogin} 
            disabled={!token || isLoading}
            className="w-full h-12 text-lg flex items-center justify-center gap-2"
          >
            {isLoading ? "Aguarde..." : "Entrar com Google"}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
