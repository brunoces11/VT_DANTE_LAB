/**
 * Sistema de Cache Seguro para VT_DANTE
 * 
 * Este serviço implementa um cache seguro que armazena apenas dados não sensíveis
 * no localStorage, seguindo as best practices de segurança do Supabase.
 * 
 * IMPORTANTE: Este cache NÃO armazena:
 * - Tokens de acesso
 * - Conteúdo completo das mensagens
 * - Dados pessoais sensíveis
 * - Informações de autenticação
 */

// Interface para dados seguros do cache
interface SafeCacheData {
  user_id: string;
  sessions: {
    id: string;
    title: string;
    message_count: number;
    last_updated: string;
  }[];
  ui_state: {
    currentSessionId: string | null;
    isWelcomeMode: boolean;
  };
}

// Chave do cache no localStorage
const CACHE_KEY = 'dante_safe_cache';

/**
 * Salva dados seguros no cache local
 * @param data Dados seguros para armazenar
 */
export const saveSafeCache = (data: SafeCacheData): void => {
  try {
    const cacheData = {
      ...data,
      timestamp: new Date().toISOString(),
      version: '1.0'
    };
    
    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
    console.log('💾 Cache seguro salvo:', {
      user_id: data.user_id.slice(0, 8) + '...',
      sessions_count: data.sessions.length,
      current_session: data.ui_state.currentSessionId?.slice(0, 6) + '...' || 'none'
    });
  } catch (error) {
    console.warn('⚠️ Cache não pôde ser salvo:', error);
    // Falha silenciosa - não é crítico para o funcionamento
  }
};

/**
 * Carrega dados seguros do cache local
 * @returns Dados do cache ou null se não existir/corrompido
 */
export const loadSafeCache = (): SafeCacheData | null => {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) {
      console.log('📭 Cache vazio');
      return null;
    }

    const parsedData = JSON.parse(cached);
    
    // Validar estrutura básica do cache
    if (!parsedData.user_id || !Array.isArray(parsedData.sessions) || !parsedData.ui_state) {
      console.warn('⚠️ Cache com estrutura inválida, limpando');
      clearSafeCache();
      return null;
    }

    console.log('📂 Cache seguro carregado:', {
      user_id: parsedData.user_id.slice(0, 8) + '...',
      sessions_count: parsedData.sessions.length,
      timestamp: parsedData.timestamp
    });

    return {
      user_id: parsedData.user_id,
      sessions: parsedData.sessions,
      ui_state: parsedData.ui_state
    };
  } catch (error) {
    console.warn('⚠️ Cache corrompido, limpando:', error);
    clearSafeCache();
    return null;
  }
};

/**
 * Limpa o cache seguro
 */
export const clearSafeCache = (): void => {
  try {
    localStorage.removeItem(CACHE_KEY);
    console.log('🧹 Cache seguro limpo');
  } catch (error) {
    console.warn('⚠️ Erro ao limpar cache:', error);
  }
};

/**
 * Verifica se o cache existe e é válido
 * @returns true se o cache existe e é válido
 */
export const hasSafeCache = (): boolean => {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return false;

    const parsedData = JSON.parse(cached);
    return !!(parsedData.user_id && Array.isArray(parsedData.sessions) && parsedData.ui_state);
  } catch {
    return false;
  }
};

/**
 * Converte dados do servidor para formato de cache seguro
 * @param serverData Dados vindos do servidor
 * @returns Dados formatados para cache seguro
 */
export const convertToSafeCache = (serverData: any): SafeCacheData => {
  const sessions = serverData.chat_sessions?.map((session: any) => ({
    id: session.chat_session_id,
    title: session.chat_session_title,
    message_count: session.messages?.length || 0,
    last_updated: session.updated_at || session.created_at
  })) || [];

  return {
    user_id: serverData.user_id,
    sessions: sessions,
    ui_state: {
      currentSessionId: null, // Será definido pela UI
      isWelcomeMode: sessions.length === 0
    }
  };
};

/**
 * Converte dados do cache para formato esperado pela UI
 * @param cacheData Dados do cache seguro
 * @returns Dados formatados para a UI
 */
export const convertToChatsFormat = (sessions: SafeCacheData['sessions']) => {
  return sessions.map(session => ({
    chat_session_id: session.id,
    chat_session_title: session.title,
    message_count: session.message_count,
    last_updated: session.last_updated,
    messages: [] // Mensagens serão carregadas sob demanda
  }));
};

/**
 * Atualiza uma sessão específica no cache
 * @param sessionId ID da sessão a atualizar
 * @param updates Atualizações a aplicar
 */
export const updateSessionInCache = (sessionId: string, updates: Partial<{
  title: string;
  message_count: number;
  last_updated: string;
}>): void => {
  const currentCache = loadSafeCache();
  if (!currentCache) return;

  const sessionIndex = currentCache.sessions.findIndex(s => s.id === sessionId);
  if (sessionIndex === -1) return;

  currentCache.sessions[sessionIndex] = {
    ...currentCache.sessions[sessionIndex],
    ...updates
  };

  saveSafeCache(currentCache);
};

/**
 * Adiciona uma nova sessão ao cache
 * @param session Nova sessão a adicionar
 */
export const addSessionToCache = (session: {
  id: string;
  title: string;
  message_count?: number;
  last_updated?: string;
}): void => {
  const currentCache = loadSafeCache();
  if (!currentCache) return;

  const newSession = {
    id: session.id,
    title: session.title,
    message_count: session.message_count || 0,
    last_updated: session.last_updated || new Date().toISOString()
  };

  currentCache.sessions.unshift(newSession); // Adicionar no início
  saveSafeCache(currentCache);
};

/**
 * Remove uma sessão do cache
 * @param sessionId ID da sessão a remover
 */
export const removeSessionFromCache = (sessionId: string): void => {
  const currentCache = loadSafeCache();
  if (!currentCache) return;

  currentCache.sessions = currentCache.sessions.filter(s => s.id !== sessionId);
  saveSafeCache(currentCache);
};