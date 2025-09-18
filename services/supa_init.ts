import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// Debug: Log das variáveis de ambiente (remover em produção)
console.log('🔍 Supabase Config Check:')
console.log('URL exists:', !!supabaseUrl)
console.log('Key exists:', !!supabaseAnonKey)
console.log('URL valid:', supabaseUrl && !supabaseUrl.includes('your-project-id'))
console.log('Key valid:', supabaseAnonKey && !supabaseAnonKey.includes('your-anon-key-here'))

if (!supabaseUrl || !supabaseAnonKey || 
    supabaseUrl.includes('your-project-id') || 
    supabaseAnonKey.includes('your-anon-key-here')) {
  console.error('❌ Supabase environment variables not properly configured!')
  console.error('URL:', supabaseUrl ? 'Present but may be placeholder' : 'Missing')
  console.error('Key:', supabaseAnonKey ? 'Present but may be placeholder' : 'Missing')
}

// Criar cliente apenas se as variáveis estiverem válidas
if (!supabaseUrl || !supabaseAnonKey || 
    supabaseUrl.includes('your-project-id') || 
    supabaseAnonKey.includes('your-anon-key-here')) {
  throw new Error('Supabase não está configurado corretamente. Verifique as variáveis VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no arquivo .env')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'X-Client-Info': 'dante-ai-app'
    }
  }
})

// Teste de conectividade
supabase.from('tab_user').select('count', { count: 'exact', head: true })
  .then(({ error, count }) => {
    if (error) {
      console.error('❌ Erro de conectividade com Supabase:', error.message)
    } else {
      console.log('✅ Supabase conectado com sucesso!')
      console.log(`📊 Tabela tab_user tem ${count || 0} registros`)
    }
  })
  .catch(err => {
    console.error('❌ Falha na conexão com Supabase:', err)
  })