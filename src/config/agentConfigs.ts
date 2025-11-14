/**
 * ========================================
 * AGENT CONFIGURATIONS
 * ========================================
 * Configurações centralizadas para todos os agentes do Dante
 * Adicionar novos agentes: apenas adicionar entrada neste arquivo + variável de ambiente
 */

// Tipos de agentes disponíveis
export type AgentType = 'dante-ri' | 'dante-notas';

// Interface de configuração de cada agente
export interface AgentConfig {
  id: AgentType;
  title: string;
  description: string;
  icon: string;
  color: string;
  suggestions: Array<{
    title: string;
    description: string;
    prompt: string;
  }>;
  placeholder: string;
}

// Configurações de todos os agentes
export const agentConfigs: Record<AgentType, AgentConfig> = {
  'dante-ri': {
    id: 'dante-ri',
    title: 'Especialista em Registro de Imóveis',
    description: 'Seu assistente especializado em Registro de Imóveis. Faça sua pergunta sobre procedimentos registrais, legislação vigente ou qualificação de títulos.',
    icon: '📋',
    color: 'orange',
    suggestions: [
      {
        title: '📋 Procedimentos Registrais',
        description: 'Orientações sobre registro de títulos e documentos',
        prompt: 'Como fazer o registro de uma escritura de compra e venda?'
      },
      {
        title: '📄 Documentação',
        description: 'Documentos exigidos e qualificação registral',
        prompt: 'Quais são os documentos necessários para registro de imóvel?'
      },
      {
        title: '💰 Emolumentos',
        description: 'Cálculo de taxas e tributos registrais',
        prompt: 'Como calcular emolumentos para registro de imóvel?'
      },
      {
        title: '⚖️ Legislação',
        description: 'Lei 6.015/73 e normas do CNJ',
        prompt: 'Qual a legislação aplicável ao registro de imóveis?'
      }
    ],
    placeholder: 'Digite sua pergunta sobre Registro de Imóveis...'
  },
  'dante-notas': {
    id: 'dante-notas',
    title: 'Especialista em Tabelionato de Notas',
    description: 'Seu assistente especializado em Tabelionato de Notas. Faça sua pergunta sobre reconhecimento de firmas, autenticações e escrituras públicas.',
    icon: '📝',
    color: 'blue',
    suggestions: [
      {
        title: '✍️ Reconhecimento de Firma',
        description: 'Procedimentos e tipos de reconhecimento',
        prompt: 'Como funciona o reconhecimento de firma por autenticidade?'
      },
      {
        title: '📜 Escrituras Públicas',
        description: 'Lavratura e requisitos legais',
        prompt: 'Quais documentos são necessários para lavrar uma escritura?'
      },
      {
        title: '🔐 Autenticações',
        description: 'Cópias autenticadas e procedimentos',
        prompt: 'Como autenticar documentos no tabelionato?'
      },
      {
        title: '⚖️ Legislação',
        description: 'Lei 8.935/94 e normas do CNJ',
        prompt: 'Qual a legislação aplicável ao tabelionato de notas?'
      }
    ],
    placeholder: 'Digite sua pergunta sobre Tabelionato de Notas...'
  }
};

/**
 * Helper: Valida se um tipo é um AgentType válido
 */
export function isValidAgentType(type: string): type is AgentType {
  return type in agentConfigs;
}

/**
 * Helper: Retorna lista de todos os agentes disponíveis
 */
export function getAvailableAgents(): AgentType[] {
  return Object.keys(agentConfigs) as AgentType[];
}

/**
 * Helper: Retorna configuração de um agente específico
 */
export function getAgentConfig(type: AgentType): AgentConfig {
  return agentConfigs[type];
}
