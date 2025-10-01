import { supabase } from './supa_init';
import { getCurrentTimestampUTC } from '@/utils/timezone';

/**
 * Função para carregar dados completos do usuário após login
 * Chama a edge function load_user_data que retorna sessões de chat e mensagens
 */
export async function fun_load_user_data() {
  try {
    // Obter a sessão atual do usuário
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      throw new Error(`Erro ao obter sessão: ${sessionError.message}`);
    }
    
    if (!session?.access_token) {
      throw new Error('Usuário não está logado ou token não disponível');
    }

    // URL da edge function - verificar se as variáveis de ambiente estão definidas
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
    
    if (!supabaseUrl) {
      throw new Error('VITE_SUPABASE_URL não está definida no arquivo .env')
    }
    
    const functionUrl = `${supabaseUrl}/functions/v1/load_user_data`
    
    console.log('📊 Carregando dados do usuário...');
    
    // Fazer a requisição HTTP para a edge function
    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro na requisição: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    // Verificar se há erro na resposta
    if (data.error) {
      throw new Error(`Erro retornado pela função: ${data.error}`);
    }

    return {
      success: true,
      data: data,
      error: null
    };

  } catch (error) {
    console.error('Erro em fun_load_user_data:', error);
    
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    };
  }
}

/**
 * Função para invalidar outras sessões do usuário
 * Chama a edge function single_session que desloga todas as outras sessões ativas
 */
export async function fun_single_session() {
  try {
    // Obter a sessão atual do usuário
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      throw new Error(`Erro ao obter sessão: ${sessionError.message}`);
    }
    
    if (!session?.access_token) {
      throw new Error('Usuário não está logado ou token não disponível');
    }

    // URL da edge function - verificar se as variáveis de ambiente estão definidas
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
    
    if (!supabaseUrl) {
      throw new Error('VITE_SUPABASE_URL não está definida no arquivo .env')
    }
    
    const functionUrl = `${supabaseUrl}/functions/v1/single_session`
    
    console.log('🔒 Invalidando outras sessões do usuário...');
    
    // Fazer a requisição HTTP para a edge function com timeout e error handling
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout
    
    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro na requisição: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    // Verificar se há erro na resposta
    if (data.error) {
      throw new Error(`Erro retornado pela função: ${data.error}`);
    }

    return {
      success: true,
      message: data.message,
      error: null
    };

  } catch (error) {
    console.error('Erro em fun_single_session:', error);
    
    // Se for erro de rede/timeout, não é crítico - apenas log
    if (error.name === 'AbortError' || error.message === 'Failed to fetch') {
      console.warn('⚠️ Timeout ou erro de rede na invalidação de sessões - continuando normalmente');
      return {
        success: false,
        message: 'Timeout na invalidação de outras sessões',
        error: 'Network timeout - não crítico'
      };
    }
    
    return {
      success: false,
      message: null,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    };
  }
}

/**
 * Função para salvar dados de chat (sessão + mensagem) no banco de dados
 * Chama a edge function ef_save_chat que executa SQL única com CTE + ON CONFLICT
 */
export async function fun_save_chat_data(params: {
  chat_session_id: string;
  chat_session_title: string;
  msg_input: string;
  msg_output: string;
  user_id: string;
}) {
  try {
    // Obter a sessão atual do usuário
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      throw new Error(`Erro ao obter sessão: ${sessionError.message}`);
    }
    
    if (!session?.access_token) {
      throw new Error('Usuário não está logado ou token não disponível');
    }

    // URL da edge function - verificar se as variáveis de ambiente estão definidas
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    
    if (!supabaseUrl) {
      throw new Error('VITE_SUPABASE_URL não está definida no arquivo .env');
    }
    
    const functionUrl = `${supabaseUrl}/functions/v1/ef_save_chat`;
    
    console.log('💾 Salvando dados do chat...', {
      session_id: params.chat_session_id,
      title: params.chat_session_title,
      user_id: params.user_id
    });
    
    // Fazer a requisição HTTP para a edge function
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
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro na requisição: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    // Verificar se há erro na resposta
    if (data.error) {
      throw new Error(`Erro retornado pela função: ${data.error}`);
    }

    console.log('✅ Dados do chat salvos com sucesso:', data);

    return {
      success: true,
      data: data,
      error: null
    };

  } catch (error) {
    console.error('❌ Erro em fun_save_chat_data:', error);
    
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    };
  }
}
