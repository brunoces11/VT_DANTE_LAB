import type { AgentType } from '@/config/agentConfigs';
import { Home, ScrollText } from 'lucide-react';

interface WelcomeChatProps {
  onAgentSelect: (agentType: AgentType) => void;
}

export default function WelcomeChat({ onAgentSelect }: WelcomeChatProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-background px-8 py-12">
      <div className="w-full max-w-[900px]">
        {/* Título Principal */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-foreground mb-6">
            Seja bem-vindo ao Dante IA
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-[700px] mx-auto">
            Escolha qual especialista do Dante você deseja consultar para suas dúvidas jurídicas
          </p>
        </div>

        {/* Grid de Cards de Agentes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[800px] mx-auto">
          {/* Card Registro de Imóveis */}
          <button
            onClick={() => onAgentSelect('dante-ri')}
            className="group relative bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 
                     border-2 border-orange-200 dark:border-orange-700 rounded-2xl p-8 
                     hover:border-orange-400 dark:hover:border-orange-500 
                     hover:shadow-xl hover:scale-[1.02] 
                     transition-all duration-300 text-left"
          >
            {/* Ícone */}
            <div className="mb-4">
              <Home className="h-16 w-16 text-orange-600 dark:text-orange-400" />
            </div>
            
            {/* Título */}
            <h2 className="text-2xl font-bold text-foreground mb-3">
              Registro de Imóveis
            </h2>
            
            {/* Descrição */}
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Especialista em registro de propriedades, procedimentos registrais, 
              qualificação de títulos e legislação imobiliária.
            </p>
            
            {/* CTA */}
            <div className="flex items-center text-orange-600 dark:text-orange-400 font-semibold group-hover:translate-x-2 transition-transform">
              <span>Iniciar Chat - Registro de Imóveis</span>
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>

          {/* Card Tabelionato de Notas */}
          <button
            onClick={() => onAgentSelect('dante-notas')}
            className="group relative bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 
                     border-2 border-blue-200 dark:border-blue-700 rounded-2xl p-8 
                     hover:border-blue-400 dark:hover:border-blue-500 
                     hover:shadow-xl hover:scale-[1.02] 
                     transition-all duration-300 text-left"
          >
            {/* Ícone */}
            <div className="mb-4">
              <ScrollText className="h-16 w-16 text-blue-600 dark:text-blue-400" />
            </div>
            
            {/* Título */}
            <h2 className="text-2xl font-bold text-foreground mb-3">
              Tabelionato de Notas
            </h2>
            
            {/* Descrição */}
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Especialista em reconhecimento de firmas, autenticações, 
              escrituras públicas e atos notariais.
            </p>
            
            {/* CTA */}
            <div className="flex items-center text-blue-600 dark:text-blue-400 font-semibold group-hover:translate-x-2 transition-transform">
              <span>Iniciar Chat - Tabelionato de Notas</span>
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        </div>

        {/* Nota Informativa */}
        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground">
            Você poderá alternar entre especialistas a qualquer momento durante sua consulta
          </p>
        </div>
      </div>
    </div>
  );
}
