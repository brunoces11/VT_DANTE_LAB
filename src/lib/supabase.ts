import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables not configured. Some features may not work.')
}

// Use placeholder values if environment variables are not properly configured
const finalUrl = supabaseUrl && !supabaseUrl.includes('your-project-id') ? supabaseUrl : 'https://placeholder.supabase.co'
const finalKey = supabaseAnonKey && !supabaseAnonKey.includes('your-anon-key-here') ? supabaseAnonKey : 'placeholder-key'

export const supabase = createClient(finalUrl, finalKey)