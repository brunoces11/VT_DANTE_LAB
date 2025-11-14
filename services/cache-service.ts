/**
 * Sistema de Cache Seguro Unificado para VT_DANTE v2.0
 *
 * Este serviço implementa um cache seguro que armazena apenas dados não sensíveis
 * no localStorage, seguindo as best practices de segurança do Supabase.
 *
 * IMPORTANTE: Este cache NÃO armazena:
 * - Tokens de acesso
 * - Conteúdo completo das mensagens (apenas últimas 3 trocas para preview)
 * - Dados pessoais sensíveis
 * - Informações de autenticação
 *
 * VERSÃO 2.0:
 * - Cache unificado (elimina user_chat_data e window.__serverData)
 * - Suporte a multi-agente (agent_type)
 * - Cache de mensagens recentes (recent_messages)
 * - Sistema de migração automática
 * - Versionamento robusto
 */

// Interface para mensagens recentes (cache de preview)
interface RecentMessage {
  user: string;  // Últimas palavras do usuário (até 100 chars)
  bot: string;   // Primeiras palavras do bot (até 200 chars)
}

// Interface para dados seguros do cache v2.0
interface SafeCacheData {
  version: '2.0';
  user_id: string;
  sessions: {
    id: string;
    title: string;
    agent_type?: string;  // Tipo do agente (dante-ri, dante-notas, etc)
    message_count: number;
    last_updated: string;
    recent_messages?: RecentMessage[];  // Últimas 3 trocas para preview rápido
  }[];
  ui_state: {
    currentSessionId: string | null;
    isWelcomeMode: boolean;
    selectedAgent?: string | null;  // Agente selecionado atualmente
  };
  _meta: {
    last_sync: string;  // ISO timestamp da última sincronização com servidor
    dirty: boolean;     // Se tem mudanças locais não sincronizadas
  };
}

// Interface v1.0 (legado, para migração)
interface SafeCacheDataV1 {
  version?: '1.0';
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
const BACKUP_KEY = 'user_chat_data_backup';

/**
 * Sistema de migração automática entre versões
 */
const CACHE_MIGRATIONS = {
  '1.0': (data: SafeCacheDataV1): SafeCacheData => {
    console.log('🔄 Migrando cache v1.0 → v2.0');
    return {
      version: '2.0',
      user_id: data.user_id,
      sessions: data.sessions.map(s => ({
        ...s,
        agent_type: 'dante-ri',  // Default para sessões antigas
        recent_messages: []       // Vazio para sessões migradas
      })),
      ui_state: {
        ...data.ui_state,
        selectedAgent: null  // Novo campo
      },
      _meta: {
        last_sync: new Date().toISOString(),
        dirty: false
      }
    };
  }
};

/**
 * Aplica migração automática de versões antigas
 */
const migrateCache = (cachedData: any): SafeCacheData => {
  const currentVersion = cachedData.version || '1.0';

  if (currentVersion === '2.0') {
    return cachedData as SafeCacheData;  // Já está atualizado
  }

  if (CACHE_MIGRATIONS[currentVersion]) {
    const migrated = CACHE_MIGRATIONS[currentVersion](cachedData);
    console.log('✅ Cache migrado com sucesso para v2.0');
    return migrated;
  }

  console.warn('⚠️ Versão de cache desconhecida, será criado novo cache');
  throw new Error('Versão incompatível');
};

/**
 * Migra dados do sistema legado user_chat_data → SafeCache v2.0
 */
const migrateLegacyCache = (): SafeCacheData | null => {
  try {
    const legacyData = localStorage.getItem('user_chat_data');
    if (!legacyData) return null;

    console.log('🔄 Detectado cache legado (user_chat_data), migrando para SafeCache v2.0...');

    const parsed = JSON.parse(legacyData);

    const converted: SafeCacheData = {
      version: '2.0',
      user_id: parsed.user_id || '',
      sessions: parsed.chat_sessions?.map((session: any) => {
        // Extrair últimas 3 trocas de mensagens para preview
        const recentMessages: RecentMessage[] = session.messages?.slice(-3).map((msg: any) => ({
          user: msg.msg_input?.substring(0, 100) || '',
          bot: msg.msg_output?.substring(0, 200) || ''
        })) || [];

        return {
          id: session.chat_session_id,
          title: session.chat_session_title,
          agent_type: 'dante-ri',  // Padrão para sessões legadas
          message_count: session.messages?.length || 0,
          last_updated: new Date().toISOString(),
          recent_messages: recentMessages
        };
      }) || [],
      ui_state: {
        currentSessionId: null,
        isWelcomeMode: parsed.chat_sessions?.length === 0,
        selectedAgent: null
      },
      _meta: {
        last_sync: new Date().toISOString(),
        dirty: false
      }
    };

    // Salvar no novo formato
    saveSafeCache(converted);

    // Criar backup de segurança (expira em 7 dias)
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 7);
    localStorage.setItem(BACKUP_KEY, JSON.stringify({
      data: parsed,
      expires: expiryDate.toISOString(),
      migrated_at: new Date().toISOString()
    }));

    // Remover cache legado
    localStorage.removeItem('user_chat_data');

    console.log('✅ Migração concluída! Backup criado (expira em 7 dias)');
    console.log(`📊 Migrados: ${converted.sessions.length} sessões com ${converted.sessions.reduce((sum, s) => sum + s.message_count, 0)} mensagens`);

    return converted;

  } catch (error) {
    console.error('❌ Erro na migração do cache legado:', error);
    return null;
  }
};

/**
 * Limpa backups expirados automaticamente
 */
export const cleanExpiredBackups = (): void => {
  try {
    const backup = localStorage.getItem(BACKUP_KEY);
    if (!backup) return;

    const parsed = JSON.parse(backup);
    const expiryDate = new Date(parsed.expires);

    if (new Date() > expiryDate) {
      console.log('🧹 Removendo backup expirado de user_chat_data');
      localStorage.removeItem(BACKUP_KEY);
    } else {
      const daysLeft = Math.ceil((expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
      console.log(`📦 Backup disponível (expira em ${daysLeft} dias)`);
    }
  } catch (error) {
    console.warn('⚠️ Erro ao limpar backups:', error);
  }
};

/**
 * Salva dados seguros no cache local (v2.0)
 * @param data Dados seguros para armazenar
 */
export const saveSafeCache = (data: SafeCacheData): void => {
  try {
    const cacheData = {
      ...data,
      version: '2.0',
      timestamp: new Date().toISOString()
    };

    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
    console.log('💾 Cache v2.0 salvo:', {
      user_id: data.user_id.slice(0, 8) + '...',
      sessions_count: data.sessions.length,
      current_session: data.ui_state.currentSessionId?.slice(0, 6) + '...' || 'none',
      agent: data.ui_state.selectedAgent || 'none'
    });
  } catch (error) {
    console.warn('⚠️ Cache não pôde ser salvo:', error);
  }
};

/**
 * Carrega dados seguros do cache local com migração automática
 * @returns Dados do cache v2.0 ou null se não existir
 */
export const loadSafeCache = (): SafeCacheData | null => {
  try {
    // Limpar backups expirados automaticamente
    cleanExpiredBackups();

    // 1. Tentar carregar SafeCache atual
    const cached = localStorage.getItem(CACHE_KEY);

    if (cached) {
      const parsedData = JSON.parse(cached);

      // Verificar versão e migrar se necessário
      const version = parsedData.version || '1.0';

      if (version !== '2.0') {
        console.log(`🔄 Cache v${version} detectado, migrando para v2.0...`);
        const migrated = migrateCache(parsedData);
        saveSafeCache(migrated);  // Salvar versão migrada
        return migrated;
      }

      // Validar estrutura v2.0
      if (!parsedData.user_id || !Array.isArray(parsedData.sessions) || !parsedData.ui_state) {
        console.warn('⚠️ Cache v2.0 com estrutura inválida, limpando');
        clearSafeCache();
        return null;
      }

      console.log('📂 Cache v2.0 carregado:', {
        user_id: parsedData.user_id.slice(0, 8) + '...',
        sessions_count: parsedData.sessions.length,
        timestamp: parsedData.timestamp,
        version: parsedData.version
      });

      return parsedData as SafeCacheData;
    }

    // 2. Se não há SafeCache, tentar migrar user_chat_data (legado)
    console.log('📭 SafeCache vazio, verificando cache legado...');
    const migrated = migrateLegacyCache();

    if (migrated) {
      console.log('✅ Cache legado migrado com sucesso para v2.0');
      return migrated;
    }

    console.log('📭 Nenhum cache encontrado (primeira execução ou logout)');
    return null;

  } catch (error) {
    console.warn('⚠️ Erro ao carregar cache, limpando:', error);
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
    console.log('🧹 Cache v2.0 limpo');
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
 * Converte dados do servidor para formato de cache seguro v2.0
 * @param serverData Dados vindos do servidor
 * @returns Dados formatados para cache v2.0
 */
export const convertToSafeCache = (serverData: any): SafeCacheData => {
  const sessions = serverData.chat_sessions?.map((session: any) => {
    // Extrair últimas 3 trocas para preview
    const recentMessages: RecentMessage[] = session.messages?.slice(-3).map((msg: any) => ({
      user: msg.msg_input?.substring(0, 100) || '',
      bot: msg.msg_output?.substring(0, 200) || ''
    })) || [];

    return {
      id: session.chat_session_id,
      title: session.chat_session_title,
      agent_type: session.agent_type || 'dante-ri',  // Padrão se não especificado
      message_count: session.messages?.length || 0,
      last_updated: session.updated_at || session.created_at || new Date().toISOString(),
      recent_messages: recentMessages
    };
  }) || [];

  return {
    version: '2.0',
    user_id: serverData.user_id,
    sessions: sessions,
    ui_state: {
      currentSessionId: null,
      isWelcomeMode: sessions.length === 0,
      selectedAgent: null
    },
    _meta: {
      last_sync: new Date().toISOString(),
      dirty: false
    }
  };
};

/**
 * Converte dados do cache para formato esperado pela UI
 * @param sessions Sessões do cache v2.0
 * @returns Dados formatados para a UI
 */
export const convertToChatsFormat = (sessions: SafeCacheData['sessions']) => {
  return sessions.map(session => ({
    chat_session_id: session.id,
    chat_session_title: session.title,
    agent_type: session.agent_type,
    message_count: session.message_count,
    last_updated: session.last_updated,
    messages: []  // Mensagens completas serão carregadas sob demanda do servidor
  }));
};

/**
 * Atualiza uma sessão específica no cache
 * @param sessionId ID da sessão a atualizar
 * @param updates Atualizações a aplicar
 */
export const updateSessionInCache = (sessionId: string, updates: Partial<{
  title: string;
  agent_type: string;
  message_count: number;
  last_updated: string;
  recent_messages: RecentMessage[];
}>): void => {
  const currentCache = loadSafeCache();
  if (!currentCache) return;

  const sessionIndex = currentCache.sessions.findIndex(s => s.id === sessionId);
  if (sessionIndex === -1) return;

  currentCache.sessions[sessionIndex] = {
    ...currentCache.sessions[sessionIndex],
    ...updates
  };

  // Marcar como dirty se houver atualizações
  currentCache._meta.dirty = true;

  saveSafeCache(currentCache);
};

/**
 * Adiciona uma nova sessão ao cache
 * @param session Nova sessão a adicionar
 */
export const addSessionToCache = (session: {
  id: string;
  title: string;
  agent_type?: string;
  message_count?: number;
  last_updated?: string;
  recent_messages?: RecentMessage[];
}): void => {
  const currentCache = loadSafeCache();
  if (!currentCache) return;

  const newSession = {
    id: session.id,
    title: session.title,
    agent_type: session.agent_type || 'dante-ri',
    message_count: session.message_count || 0,
    last_updated: session.last_updated || new Date().toISOString(),
    recent_messages: session.recent_messages || []
  };

  currentCache.sessions.unshift(newSession);  // Adicionar no início
  currentCache._meta.dirty = true;

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
  currentCache._meta.dirty = true;

  saveSafeCache(currentCache);
};
