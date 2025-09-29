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
      message: data.message,
      error: null
    };

  } catch (error) {
    console.error('Erro em fun_single_session:', error);
    
    return {
      success: false,
      message: null,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    };
  }
}

