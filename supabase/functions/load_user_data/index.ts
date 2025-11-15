import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// TypeScript interfaces
interface ChatMessage {
  chat_msg_id: string;
  msg_input: string;
  msg_output: string;
}

interface ChatSession {
  chat_session_id: string;
  chat_session_title: string;
  agent_type?: string;
  messages: ChatMessage[];
}

interface LoadUserDataResponse {
  user_id: string;
  chat_sessions: ChatSession[];
}

interface ErrorResponse {
  error: string;
  code: string;
  details?: string;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Authentication validation
    const authHeader = req.headers.get('authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header', code: 'UNAUTHORIZED' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401,
        },
      )
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token)
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid authentication token', code: 'UNAUTHORIZED' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401,
        },
      )
    }

    const user_id = user.id

    // Query chat sessions
    const { data: sessions, error: sessionsError } = await supabaseClient
      .from('tab_chat_session')
      .select('chat_session_id, chat_session_title, agent_type')
      .eq('user_id', user_id)
      .order('session_time', { ascending: false })

    if (sessionsError) {
      console.error('Error fetching chat sessions:', sessionsError)
      return new Response(
        JSON.stringify({ error: 'Failed to fetch chat sessions', code: 'DATABASE_ERROR' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        },
      )
    }

    const chatSessions = sessions || []

    // Query messages for each session
    const sessionsWithMessages: ChatSession[] = await Promise.all(
      chatSessions.map(async (session): Promise<ChatSession> => {
        const { data: messages, error: messagesError } = await supabaseClient
          .from('tab_chat_msg')
          .select('chat_msg_id, msg_input, msg_output')
          .eq('chat_session_id', session.chat_session_id)
          .eq('user_id', user_id)
          .order('msg_time', { ascending: true })

        if (messagesError) {
          console.error(`Error fetching messages for session ${session.chat_session_id}:`, messagesError)
          // Return session with empty messages array on error
          return {
            chat_session_id: session.chat_session_id,
            chat_session_title: session.chat_session_title,
            agent_type: session.agent_type || 'dante-ri',
            messages: []
          }
        }

        return {
          chat_session_id: session.chat_session_id,
          chat_session_title: session.chat_session_title,
          agent_type: session.agent_type || 'dante-ri',
          messages: (messages as ChatMessage[]) || []
        }
      })
    )

    // Structure JSON response according to specification
    const response: LoadUserDataResponse = {
      user_id: user_id,
      chat_sessions: sessionsWithMessages
    }

    return new Response(
      JSON.stringify(response),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Unexpected error in load_user_data:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        code: 'INTERNAL_ERROR',
        details: error.message 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})