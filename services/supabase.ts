import { supabase } from './supa_init';

/**
 * Função para criar uma nova sessão de chat via Edge Function
 * Chama a edge function DT_LOGIN_NEW_SESSION que cria automaticamente
 * uma nova entrada na tabela tab_chat_session
 */
export async function FUN_DT_LOGIN_NEW_SESSION() {
  try {
    // Obter a sessão atual do usuário
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      throw new Error(`Erro ao obter sessão: ${sessionError.message}`);
    }
    
    if (!session?.access_token) {
      throw new Error('Usuário não está logado ou token não disponível');
    }

    // URL da edge function
    const functionUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/DT_LOGIN_NEW_SESSION`;
    
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
    
    if (!data.success) {
      throw new Error(`Erro retornado pela função: ${JSON.stringify(data)}`);
    }

    return {
      success: true,
      session: data.session,
      error: null
    };

  } catch (error) {
    console.error('Erro em FUN_DT_LOGIN_NEW_SESSION:', error);
    
    return {
      success: false,
      session: null,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    };
  }
}