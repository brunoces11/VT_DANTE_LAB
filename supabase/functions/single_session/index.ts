```typescript
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.44.0'
import { serve } from 'https://deno.land/std@0.223.0/http/server.ts'

serve(async (req) => {
  try {
    // Obter o token de autorização do cabeçalho da requisição
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Authorization header missing' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 401,
      })
    }

    const accessToken = authHeader.replace('Bearer ', '')

    // Inicializar o cliente Supabase com o token de acesso do usuário
    // Isso garante que a função opere no contexto do usuário logado
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '', // Usamos a anon key, mas o token de acesso define o contexto
      {
        global: {
          headers: { Authorization: \`Bearer ${accessToken}` },
        },
      }
    )

    // Chamar a função signOut com scope 'others' para invalidar todas as outras sessões
    const { error } = await supabaseClient.auth.signOut({ scope: 'others' })

    if (error) {
      console.error('Error signing out other sessions:', error.message)
      return new Response(JSON.stringify({ error: error.message }), {
        headers: { 'Content-Type': 'application/json' },
        status: 500,
      })
    }

    return new Response(JSON.stringify({ message: 'Other sessions invalidated successfully' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error('Unexpected error:', error.message)
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
```