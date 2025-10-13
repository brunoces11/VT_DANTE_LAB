import { createClient } from '@supabase/supabase-js'

// Configuração do Supabase usando variáveis de ambiente
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// Validação das variáveis de ambiente
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY não estão configuradas no arquivo .env')
  console.warn('⚠️ A aplicação funcionará em modo de desenvolvimento sem Supabase')
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseAnonKey || 'placeholder-key', 
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
      storage: window.localStorage,
      storageKey: 'sb-auth-token',
      flowType: 'pkce'
    }
  }
)

// Log para debug
console.log('🔧 [Supabase] Cliente inicializado');
console.log('🔧 [Supabase] URL:', supabaseUrl);
console.log('🔧 [Supabase] persistSession: true');
console.log('🔧 [Supabase] storageKey: sb-auth-token');

// Testar se localStorage está funcionando
try {
  localStorage.setItem('test-storage', 'working');
  const test = localStorage.getItem('test-storage');
  localStorage.removeItem('test-storage');
  console.log('✅ [Supabase] localStorage funcionando:', test === 'working');
} catch (error) {
  console.error('❌ [Supabase] localStorage NÃO está funcionando:', error);
}