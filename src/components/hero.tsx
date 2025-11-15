import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import ChatHero from "./chat_hero";
import heroBackground from "@/assets/DANTE_IA_Registro_imoveis_BG_v5.jpg";
import AuthModal from "@/components/auth/AuthModal";

export default function Hero() {
  const [question, setQuestion] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleChat = () => {
    if (question.trim()) {
      setIsChatOpen(true);
    }
  };

  // handleKeyPress function removed as it's no longer needed

  return (
    <>
      <section
        className="relative overflow-hidden bg-white flex items-center justify-center"
        style={{
          backgroundImage: `url(${heroBackground})`,
          backgroundPosition: 'center top',
          backgroundRepeat: 'no-repeat',
          backgroundSize: '100% auto',
          minHeight: '550px'
        }}
      >
        {/* Background overlay for better text readability - reduced opacity from 80% to 40% */}
        <div className="absolute inset-0 bg-white/40"></div>

        {/* Background grid - changed from lines to dots with reduced opacity */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle, #80808040 1px, transparent 1px)',
            backgroundSize: '14px 24px',
            opacity: 0.63
          }}
        ></div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="mx-auto max-w-2xl text-center">
            {/* Main headline */}
            <h1 className="font-display text-3xl tracking-tight text-neutral-900 sm:text-4xl leading-[1.9] mt-[25px] mb-[15px]">
              <span className="block font-light">IA Especializada em</span>
              <span className="block relative mt-2">
                <span className="font-bold relative z-10 bg-gradient-to-r from-orange-200 to-orange-600 bg-clip-text text-transparent" style={{ fontSize: '127%' }}>
                  Extra Judicial
                </span>
                <span className="absolute -bottom-2 left-0 right-0 h-3 bg-orange-500/20 -z-10"></span>
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mx-auto mt-6 text-[1.1rem] leading-8 text-neutral-700 max-w-[655px]">
              Dante-IA é um assistente jurídico treinado exclusivamente em Extra Judicial,
              pronto para transformar a forma como você decide, qualifica e fundamenta seus atos.
            </p>

            {/* CTA Buttons */}
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button
                variant="outline"
                size="lg"
                className="px-6 py-3 text-base border-neutral-300 hover:border-neutral-400 bg-white/80 backdrop-blur-sm text-neutral-700 hover:text-neutral-800"
                onClick={() => setIsAuthModalOpen(true)}
              >
                <Play className="mr-2 h-4 w-4 text-neutral-700" />
                Experimente grátis
              </Button>
            </div>

            {/* Interactive Chat Form - COMMENTED OUT */}
            {/* 
            <div className="mt-16">
              <div className="mx-auto max-w-lg">
                <div className="relative rounded-xl border border-neutral-200 bg-white/90 backdrop-blur-sm p-2 shadow-lg ring-1 ring-black/5 focus-within:ring-2 focus-within:ring-orange-500/20">
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="Pergunte sobre Registro de Imóveis..."
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="flex-1 border-0 bg-transparent px-4 py-3 text-neutral-900 placeholder:text-neutral-400 focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                    <Button
                      onClick={handleChat}
                      disabled={!question.trim()}
                      className="bg-orange-500 text-white hover:bg-orange-600 active:bg-orange-700 px-6 py-3 font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Perguntar
                    </Button>
                  </div>
                </div>
              </div>
              
              <p className="mt-5 text-[0.7rem] text-neutral-600">
              🏛️ Especialista em Registro de Imóveis • ⚖️ Baseado na legislação
              </p>
            </div>
            */}
          </div>
        </div>
      </section>

      <ChatHero
        isOpen={isChatOpen}
        onClose={() => {
          setIsChatOpen(false);
          setQuestion(""); // Clear the input when modal closes
        }}
        initialMessage={question}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
}