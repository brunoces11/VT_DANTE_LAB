import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'jsr:@supabase/supabase-js@2';

interface ChatRenameRequest {
    chat_session_id: string;
    new_title: string;
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
        const requestData: ChatRenameRequest = await req.json();

        // Validar dados obrigatórios
        const { chat_session_id, new_title, user_id } = requestData;

        if (!chat_session_id || !new_title || !user_id) {
            return new Response(
                JSON.stringify({
                    error: 'Dados obrigatórios faltando',
                    required: ['chat_session_id', 'new_title', 'user_id']
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

        // Validar tamanho do título
        if (new_title.length > 100) {
            return new Response(
                JSON.stringify({ error: 'Título muito longo. Máximo 100 caracteres.' }),
                {
                    status: 400,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                }
            );
        }

        console.log(`🏷️ Renomeando: ${chat_session_id.slice(0, 6)} → "${new_title.slice(0, 30)}..."`);

        // Atualizar título da sessão
        const { data: updateResult, error: updateError } = await supabaseClient
            .from('tab_chat_session')
            .update({ chat_session_title: new_title })
            .eq('chat_session_id', chat_session_id)
            .eq('user_id', user_id) // Garantir que só o dono pode renomear
            .select('chat_session_id, chat_session_title')
            .single();

        if (updateError) {
            console.error('❌ Erro ao renomear sessão:', updateError);
            return new Response(
                JSON.stringify({
                    error: 'Erro ao renomear sessão de chat',
                    details: updateError.message
                }),
                {
                    status: 500,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                }
            );
        }

        // Verificar se alguma linha foi afetada
        if (!updateResult) {
            return new Response(
                JSON.stringify({
                    error: 'Sessão não encontrada ou você não tem permissão para renomeá-la'
                }),
                {
                    status: 404,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                }
            );
        }

        console.log('✅ Renomeado');

        // Retornar sucesso
        return new Response(
            JSON.stringify({
                success: true,
                message: 'Sessão renomeada com sucesso',
                data: {
                    chat_session_id: updateResult.chat_session_id,
                    new_title: updateResult.chat_session_title,
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