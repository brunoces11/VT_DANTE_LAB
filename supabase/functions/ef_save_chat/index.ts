import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'jsr:@supabase/supabase-js@2';

interface ChatSaveRequest {
  chat_session_id: string;
  chat_session_title: string;
  msg_input: string;
  msg_output: string;
  user_id: string;
}

Deno.serve(async (req: Request) => {
  // Configurar CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Verificar se é POST
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Método não permitido. Use POST.' }),
        {
          status: 405,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Obter token de autorização
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Token de autorização não fornecido' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Inicializar cliente Supabase
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    );

    // Verificar autenticação do usuário
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();

    if (authError || !user) {
      console.error('Erro de autenticação:', authError);
      return new Response(
        JSON.stringify({ error: 'Usuário não autenticado' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Parse do body da requisição
    const requestData: ChatSaveRequest = await req.json();

    // Validar dados obrigatórios
    const { chat_session_id, chat_session_title, msg_input, msg_output, user_id } = requestData;

    if (!chat_session_id || !chat_session_title || !msg_input || !msg_output || !user_id) {
      return new Response(
        JSON.stringify({
          error: 'Dados obrigatórios faltando',
          required: ['chat_session_id', 'chat_session_title', 'msg_input', 'msg_output', 'user_id']
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Verificar se user_id corresponde ao usuário autenticado
    if (user_id !== user.id) {
      return new Response(
        JSON.stringify({ error: 'user_id não corresponde ao usuário autenticado' }),
        {
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log(`💾 Salvando: ${chat_session_id.slice(-8)} | ${msg_input.slice(0, 20)}...`);

    // Primeiro: Verificar se sessão existe, se não, criar
    const { data: existingSession } = await supabaseClient
      .from('tab_chat_session')
      .select('chat_session_id')
      .eq('chat_session_id', chat_session_id)
      .single();

    if (!existingSession) {
      const { error: sessionError } = await supabaseClient
        .from('tab_chat_session')
        .insert({
          chat_session_id: chat_session_id,
          chat_session_title: chat_session_title,
          user_id: user_id
        });

      if (sessionError) {
        console.error('❌ Erro ao inserir sessão:', sessionError);
        return new Response(
          JSON.stringify({
            error: 'Erro ao criar sessão de chat',
            details: sessionError.message
          }),
          {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }
    }

    // Segundo: Inserir mensagem (sempre) - com UUID gerado
    const { data: messageResult, error: messageError } = await supabaseClient
      .from('tab_chat_msg')
      .insert({
        chat_msg_id: crypto.randomUUID(), // Gerar UUID para chat_msg_id
        chat_session_id: chat_session_id,
        user_id: user_id,
        msg_input: msg_input,
        msg_output: msg_output
      })
      .select('chat_msg_id')
      .single();

    if (messageError) {
      console.error('❌ Erro ao inserir mensagem:', messageError);
      return new Response(
        JSON.stringify({
          error: 'Erro ao salvar mensagem no banco',
          details: messageError.message
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('✅ Salvo');

    // Retornar sucesso
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Dados do chat salvos com sucesso',
        data: {
          chat_session_id: chat_session_id,
          chat_message_id: messageResult?.chat_msg_id || null,
          timestamp: new Date().toISOString()
        }
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('❌ Erro geral na edge function:', error);

    return new Response(
      JSON.stringify({
        error: 'Erro interno do servidor',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});