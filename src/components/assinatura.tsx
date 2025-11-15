import { Link } from 'react-router-dom';
import { Instagram, Linkedin, Youtube } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface AssinaturaProps {
  className?: string;
}

export default function Assinatura({ className }: AssinaturaProps) {
  return (
    <footer className={`text-white py-12 ${className || ''}`} style={{ backgroundColor: '#1a0f0a' }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Three Column Grid Layout with Visual Separators */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative">
          {/* Column 1: About Dante IA */}
          <div className="space-y-4 relative">
            <h3 className="text-lg font-semibold text-stone-50">Sobre o Dante IA</h3>
            <p className="text-sm text-gray-300 max-w-80">
              Dante é uma inteligência artificial jurídica construída sobre bases sólidas: legalidade, segurança e atualização normativa contínua.
              Especializado em registros imobiliários e Tabelionato de Notas, oferecendo embasamento confiável e fundamentação jurídica precisa para cada decisão.
            </p>
            {/* Vertical separator after column 1 - desktop only */}
            <div className="hidden md:block absolute top-0 -right-6 w-px h-full bg-white/20"></div>
          </div>

          {/* Column 2: Navigation Links - moved 80px right on desktop */}
          <div className="space-y-4 relative md:ml-20">
            <h3 className="text-lg font-semibold text-stone-50">Navegação</h3>
            <nav className="space-y-2">
              <Link 
                to="/quem-somos" 
                onClick={() => window.scrollTo(0, 0)}
                className="block text-sm hover:text-orange-300 transition-colors"
              >
                Quem somos
              </Link>
              <Link 
                to="/base-legal" 
                onClick={() => window.scrollTo(0, 0)}
                className="block text-sm hover:text-orange-300 transition-colors"
              >
                Base Legal
              </Link>
              <Link 
                to="/politica-privacidade" 
                onClick={() => window.scrollTo(0, 0)}
                className="block text-sm hover:text-orange-300 transition-colors"
              >
                Política de Privacidade
              </Link>
              <Link 
                to="/termos-uso" 
                onClick={() => window.scrollTo(0, 0)}
                className="block text-sm hover:text-orange-300 transition-colors"
              >
                Termos de Uso
              </Link>
            </nav>
            {/* Vertical separator after column 2 - desktop only */}
            <div className="hidden md:block absolute top-0 -right-6 w-px h-full bg-white/20"></div>
          </div>

          {/* Column 3: Contact Information - moved 50px right on desktop */}
          <div className="space-y-4 md:ml-12">
            <h3 className="text-lg font-semibold text-stone-50">Contato</h3>
            <div className="space-y-4 text-sm text-gray-300">
              <div className="space-y-2">
                <p>contato@dante-ia.com</p>
                <p>Santa Catarina, SC / Brasil</p>
              </div>
              
              {/* Social Media Icons */}
              <TooltipProvider>
                <div className="flex space-x-8 pt-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span
                        className="text-gray-400 cursor-not-allowed opacity-60"
                        aria-label="Instagram"
                      >
                        <Instagram className="w-6 h-6" />
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Em breve</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span
                        className="text-gray-400 cursor-not-allowed opacity-60"
                        aria-label="LinkedIn"
                      >
                        <Linkedin className="w-6 h-6" />
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Em breve</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span
                        className="text-gray-400 cursor-not-allowed opacity-60"
                        aria-label="YouTube"
                      >
                        <Youtube className="w-6 h-6" />
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Em breve</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </TooltipProvider>
            </div>
          </div>
        </div>

        {/* Copyright Section with Divider */}
        <div className="mt-8 pt-8 border-t border-white/20">
          <p className="text-xs text-center">
            © 2025 Copyright. Todos os direitos reservados a Dante-IA ©
          </p>
        </div>
      </div>
    </footer>
  );
}