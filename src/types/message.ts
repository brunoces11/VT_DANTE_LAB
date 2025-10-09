/**
 * Interface centralizada para mensagens do chat
 * Seguindo padrão Supabase de tipos centralizados
 */
export interface Message {
  id: number;
  content: string;
  sender: 'user' | 'bot';
  timestamp: string;
  isLoading?: boolean;
  loadingText?: string;
  status?: 'sending' | 'sent' | 'failed'; // Status de sincronização
}

/**
 * Interface para mensagens básicas (compatibilidade)
 */
export interface BasicMessage {
  id: number;
  content: string;
  sender: 'user' | 'bot';
  timestamp: string;
}

/**
 * Interface para mensagens do chat hero (formato diferente)
 */
export interface HeroMessage {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: string;
}