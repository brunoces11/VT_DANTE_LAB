import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Fallback values for development
const finalUrl = supabaseUrl || 'https://oifhsdqivbiyyvfheofx.supabase.co'
const finalKey = supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9pZmhzZHFpdmJpeXl2Zmhlb2Z4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcxODc5NDYsImV4cCI6MjA3Mjc2Mzk0Nn0.k5ilqGO-poM8RU5rPOcpTW7XAssY3qmJwmk5vMNLtM0'

export const supabase = createClient(finalUrl, finalKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false
  }
})