import { createClient } from '@supabase/supabase-js'

// Configuração do Supabase - PASSO 1: Setup básico
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// Cliente Supabase - configuração minimalista
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// PASSO 2: Funções de autenticação
export const authService = {
  async login(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  },

  async register(email: string, password: string, name: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name }
      }
    })
    return { data, error }
  },

  async logout() {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Erro no logout:', error)
      }
      return { error }
    } catch (err) {
      console.error('Erro inesperado no logout:', err)
      return { error: err }
    }
  },

  async updatePassword(newPassword: string) {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword
    })
    return { data, error }
  }
}

// PASSO 3: Funções de perfil
export const profileService = {
  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from('tab_user')
      .select('*')
      .eq('user_id', userId)
      .single()
    return { data, error }
  },

  async createProfile(userId: string, profileData: any = {}) {
    const { data, error } = await supabase
      .from('tab_user')
      .insert({ user_id: userId, ...profileData })
      .select()
      .single()
    return { data, error }
  },

  async updateProfile(userId: string, updates: any) {
    const { data, error } = await supabase
      .from('tab_user')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single()
    return { data, error }
  }
}

// PASSO 4: Funções de storage
export const storageService = {
  async uploadAvatar(file: File, userId: string) {
    // Validações
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      return { data: null, error: { message: 'Tipo de arquivo não permitido' } }
    }

    const maxSize = 4 * 1024 * 1024 // 4MB
    if (file.size > maxSize) {
      return { data: null, error: { message: 'Arquivo muito grande (máx 4MB)' } }
    }

    // Upload
    const fileExt = file.name.split('.').pop()
    const fileName = `${userId}/${Date.now()}.${fileExt}`

    const { data, error } = await supabase.storage
      .from('user_avatar')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) return { data: null, error }

    // URL pública
    const { data: publicUrlData } = supabase.storage
      .from('user_avatar')
      .getPublicUrl(fileName)

    return { 
      data: { 
        path: data.path, 
        publicUrl: publicUrlData.publicUrl 
      }, 
      error: null 
    }
  }
}