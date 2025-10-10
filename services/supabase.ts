import { supabase } from './supa_init';
import type { Session } from '@supabase/supabase-js';

/**
 * ========================================
 * FUNÇÕES DE INTEGRAÇÃO COM LANGFLOW
 * ========================================
 */

/**
 * Função centralizada para chamar o Langflow
 * Elimina duplicação de código entre ChatPage e ChatArea
 */
export async function fun_call_langflow(params: {
  input_value: string;
  session_id: string;
}): Promise<{ success: boolean; response?: string; error?: string }> {
  try {
    const langflowUrl = import.meta.env.VITE_LANGFLOW_URL;
    const langflowFlowId = import.meta.env.VITE_LANGFLOW_FLOW_ID;

    if (!langflowUrl || !langflowFlowId) {
      throw new Error('Variáveis de ambiente do Langflow não configuradas');
    }

    const payload = {
      input_value: params.input_value,
      output_type: 'chat',
      input_type: 'chat',
      session_id: params.session_id,
    };

    const fullUrl = langflowUrl.endsWith('/')
      ? `${langflowUrl}api/v1/run/${langflowFlowId}`
      : `${langflowUrl}/api/v1/run/${langflowFlowId}`;

    console.log('📡 Chamando Langflow:', fullUrl);

    const response = await fetch(fullUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Erro na requisição Langflow: ${response.status} - ${response.statusText}`);
    }

    const responseData = await response.json();
    console.log('📥 Resposta bruta do Langflow recebida');

    // Tratamento unificado da resposta
    let treatedResponse = '';

    if (responseData.outputs?.[0]?.outputs?.[0]) {
      const output = responseData.outputs[0].outputs[0];

      treatedResponse =
        output.outputs?.message?.message ||
        output.artifacts?.message ||
        output.results?.message?.text ||
        output.messages?.[0]?.message ||
        'Resposta do Langflow recebida, mas estrutura não reconhecida.';
    } else {
      treatedResponse =
        responseData.result ||
        responseData.message ||
        'Resposta do Langflow recebida, mas formato não reconhecido.';
    }

    console.log('✅ Resposta tratada do Langflow');

    return {
      success: true,
      response: treatedResponse,
    };
  } catch (error: any) {
    console.error('❌ Erro ao chamar Langflow:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
    };
  }
}

/**
 * ========================================
 * FUNÇÕES DE INTEGRAÇÃO COM SUPABASE
 * ========================================
 */

/**
 * Função para carregar dados completos do usuário após login
 * Chama a edge function load_user_data que retorna sessões de chat e mensagens
 */
export async function fun_load_user_data(accessToken?: string) {
  console.log('🚀 [fun_load_user_data] Iniciando...');

  try {
    let token = accessToken;

    // Se não recebeu token, tentar obter (com timeout para evitar deadlock)
    if (!token) {
      console.log('🔐 [fun_load_user_data] Obtendo sessão com timeout...');

      try {
        const sessionPromise = supabase.auth.getSession();
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Timeout')), 2000)
        );

        const result = await Promise.race([sessionPromise, timeoutPromise]) as any;

        if (result.error) {
          console.error('❌ [fun_load_user_data] Erro ao obter sessão:', result.error);
          throw new Error(`Erro ao obter sessão: ${result.error.message}`);
        }

        token = result.data?.session?.access_token;
      } catch (timeoutError) {
        console.error('❌ [fun_load_user_data] Timeout ao obter sessão - possível deadlock');
        throw new Error('Timeout ao obter sessão - use AuthProvider');
      }
    }

    if (!token) {
      console.error('❌ [fun_load_user_data] Token não disponível');
      throw new Error('Token não disponível');
    }

    console.log('✅ [fun_load_user_data] Token obtido');

    // URL da edge function - verificar se as variáveis de ambiente estão definidas
    const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL

    if (!supabaseUrl) {
      console.error('❌ [fun_load_user_data] VITE_SUPABASE_URL não definida');
      throw new Error('VITE_SUPABASE_URL não está definida no arquivo .env')
    }

    const functionUrl = `${supabaseUrl}/functions/v1/load_user_data`
    console.log('🌐 [fun_load_user_data] URL da edge function:', functionUrl);

    // Fazer a requisição HTTP para a edge function com timeout
    console.log('📡 [fun_load_user_data] Fazendo requisição...');

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.warn('⏰ [fun_load_user_data] Timeout de 10s atingido');
      controller.abort();
    }, 10000); // 10 segundos

    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    console.log('📥 [fun_load_user_data] Resposta recebida, status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ [fun_load_user_data] Erro na resposta:', response.status, errorText);
      throw new Error(`Erro na requisição: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('📦 [fun_load_user_data] Dados recebidos:', data);

    // Verificar se há erro na resposta
    if (data.error) {
      console.error('❌ [fun_load_user_data] Erro retornado pela função:', data.error);
      throw new Error(`Erro retornado pela função: ${data.error}`);
    }

    console.log('✅ [fun_load_user_data] Sucesso! Sessões:', data.chat_sessions?.length || 0);

    return {
      success: true,
      data: data,
      error: null
    };

  } catch (error: any) {
    console.error('❌ [fun_load_user_data] Erro capturado:', error);

    // Tratamento específico para timeout
    if (error.name === 'AbortError') {
      console.error('❌ [fun_load_user_data] Requisição abortada por timeout');
      return {
        success: false,
        data: null,
        error: 'Timeout ao carregar dados - verifique sua conexão'
      };
    }

    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    };
  }
}

/**
 * Função para salvar dados de chat (sessão + mensagem) no banco de dados
 * Chama a edge function ef_save_chat que executa SQL única com CTE + ON CONFLICT
 */
// Cache de sessão para evitar múltiplas chamadas
let cachedSession: Session | null = null;
let sessionCacheTime = 0;
const SESSION_CACHE_DURATION = 30000; // 30 segundos

// Função para limpar cache de sessão
export function clearSessionCache() {
  console.log('🧹 Cache de sessão limpo');
  cachedSession = null;
  sessionCacheTime = 0;
}

export async function fun_save_chat_data(params: {
  chat_session_id: string;
  chat_session_title: string;
  msg_input: string;
  msg_output: string;
  user_id: string;
}) {
  try {
    let session: Session | null = null;
    let sessionError: any = null;

    const now = Date.now();
    if (cachedSession && (now - sessionCacheTime) < SESSION_CACHE_DURATION) {
      session = cachedSession;
    } else {
      // Timeout aumentado para 10s
      const sessionPromise = supabase.auth.getSession();
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Timeout sessão')), 10000)
      );

      try {
        const result = await Promise.race([sessionPromise, timeoutPromise]) as any;
        session = result.data?.session;
        sessionError = result.error;

        if (session) {
          cachedSession = session;
          sessionCacheTime = now;
        }
      } catch (timeoutError) {
        console.warn('Sessão inválida, tentando novamente...');
        try {
          const retryResult = await supabase.auth.getSession();
          if (retryResult.error || !retryResult.data.session?.access_token) {
            console.error('Erro de sessão após retry:', retryResult.error);
            if (cachedSession) {
              session = cachedSession;
            } else {
              throw new Error('Sessão inválida após retry');
            }
          } else {
            session = retryResult.data.session;
            cachedSession = session;
            sessionCacheTime = now;
          }
        } catch (retryError) {
          console.error('Erro no retry:', retryError);
          if (cachedSession) {
            session = cachedSession;
          } else {
            throw timeoutError;
          }
        }
      }
    }

    if (sessionError) {
      throw new Error(`Erro sessão: ${sessionError.message}`);
    }

    if (!session?.access_token) {
      throw new Error('Token indisponível');
    }

    const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL;
    if (!supabaseUrl) {
      throw new Error('VITE_SUPABASE_URL não definida');
    }

    const functionUrl = `${supabaseUrl}/functions/v1/ef_save_chat`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.log('⏰ Timeout 10s');
      controller.abort();
    }, 10000);

    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_session_id: params.chat_session_id,
        chat_session_title: params.chat_session_title,
        msg_input: params.msg_input,
        msg_output: params.msg_output,
        user_id: params.user_id
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`${response.status}: ${errorText}`);
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    return {
      success: true,
      data: data,
      error: null
    };

  } catch (error: any) {
    console.error('❌ Erro em fun_save_chat_data:', error);

    if (error.name === 'AbortError') {
      console.warn('⚠️ Timeout ao salvar chat - continuando normalmente');
      return {
        success: false,
        data: null,
        error: 'Timeout - não crítico'
      };
    }

    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    };
  }
}

/**
 * Função centralizada para salvamento em background com retry robusto
 */
export const saveInBackground = async (data: any, updateMessageStatus?: (messageId: number, status: 'sending' | 'sent' | 'failed') => void, messageId?: number) => {
  const sessionId = data.chat_session_id.slice(0, 6);
  let attempts = 0;
  const maxAttempts = 3;

  if (updateMessageStatus && messageId) {
    updateMessageStatus(messageId, 'sending');
  }

  while (attempts < maxAttempts) {
    try {
      attempts++;
      console.log(`💾 ${sessionId}: Tentativa ${attempts}/${maxAttempts} - ${data.msg_input.slice(0, 20)}...`);

      const result = await fun_save_chat_data(data);

      if (result.success) {
        console.log(`✅ ${sessionId} salvo com sucesso na tentativa ${attempts}`);

        if (updateMessageStatus && messageId) {
          updateMessageStatus(messageId, 'sent');
        }

        return result;
      } else {
        console.warn(`⚠️ ${sessionId} falha na tentativa ${attempts}:`, result.error);

        if (attempts < maxAttempts) {
          const delay = 1000 * attempts;
          console.log(`⏳ ${sessionId} aguardando ${delay}ms antes da próxima tentativa...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          clearSessionCache();
        }
      }
    } catch (error) {
      console.error(`❌ ${sessionId} erro na tentativa ${attempts}:`, error instanceof Error ? error.message : error);

      if (attempts < maxAttempts) {
        const delay = 1000 * attempts;
        console.log(`⏳ ${sessionId} aguardando ${delay}ms após erro...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  console.error(`❌ ${sessionId} falhou após ${maxAttempts} tentativas`);

  if (updateMessageStatus && messageId) {
    updateMessageStatus(messageId, 'failed');
  }

  return { success: false, error: 'Max attempts reached' };
};

/**
 * Função para renomear chat
 */
export async function fun_renomear_chat(params: {
  chat_session_id: string;
  new_title: string;
  user_id: string;
}) {
  const sessionId = params.chat_session_id.slice(0, 6);
  console.log(`🏷️ Renomeando ${sessionId}: "${params.new_title.slice(0, 30)}..."`);

  try {
    let session: Session | null = null;
    let sessionError: any = null;

    const now = Date.now();
    if (cachedSession && (now - sessionCacheTime) < SESSION_CACHE_DURATION) {
      session = cachedSession;
    } else {
      const sessionPromise = supabase.auth.getSession();
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Timeout sessão')), 10000)
      );

      try {
        const result = await Promise.race([sessionPromise, timeoutPromise]) as any;
        session = result.data?.session;
        sessionError = result.error;

        if (session) {
          cachedSession = session;
          sessionCacheTime = now;
        }
      } catch (timeoutError) {
        console.warn('Sessão inválida para renomeação, tentando novamente...');
        try {
          const retryResult = await supabase.auth.getSession();
          if (retryResult.error || !retryResult.data.session?.access_token) {
            console.error('Erro de sessão após retry (renomear):', retryResult.error);
            if (cachedSession) {
              session = cachedSession;
            } else {
              throw new Error('Sessão inválida após retry');
            }
          } else {
            session = retryResult.data.session;
            cachedSession = session;
            sessionCacheTime = now;
          }
        } catch (retryError) {
          console.error('Erro no retry (renomear):', retryError);
          if (cachedSession) {
            session = cachedSession;
          } else {
            throw timeoutError;
          }
        }
      }
    }

    if (sessionError) {
      throw new Error(`Erro sessão: ${sessionError.message}`);
    }

    if (!session?.access_token) {
      throw new Error('Token indisponível');
    }

    const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL;
    if (!supabaseUrl) {
      throw new Error('VITE_SUPABASE_URL não definida');
    }

    const functionUrl = `${supabaseUrl}/functions/v1/ef_renomear_chat`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.log('⏰ Timeout 10s');
      controller.abort();
    }, 10000);

    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_session_id: params.chat_session_id,
        new_title: params.new_title,
        user_id: params.user_id
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`${response.status}: ${errorText}`);
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    console.log(`✅ ${sessionId} renomeado`);

    return {
      success: true,
      data: data,
      error: null
    };

  } catch (error: any) {
    console.error(`❌ ${sessionId} erro:`, error);

    if (error.name === 'AbortError') {
      console.warn('⚠️ Timeout ao renomear chat - continuando normalmente');
      return {
        success: false,
        data: null,
        error: 'Timeout - não crítico'
      };
    }

    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    };
  }
}
