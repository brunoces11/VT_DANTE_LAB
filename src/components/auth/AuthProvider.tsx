import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react'
import { supabase, authService, profileService } from '../../services/supabase'

interface User {
  id: string
  email?: string
}

interface UserProfile {
  user_id: string
  avatar_url?: string
  created_at?: string
  updated_at?: string
}

interface AuthContextType { 
  user: User | null
  profile: UserProfile | null
  session: any
  loading: boolean
  login: (email: string, password: string) => Promise<{ error?: any }>
  logout: () => Promise<void>
  register: (email: string, password: string, name: string) => Promise<{ error?: any }>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Sessão inicial
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session?.user) {
          setUser({ id: session.user.id, email: session.user.email })
          setSession(session)
          await loadUserProfile(session.user.id)
        }
      } catch (error) {
        console.error('Error getting initial session:', error)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // Listener de mudanças de auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser({ id: session.user.id, email: session.user.email })
          setSession(session)
          await loadUserProfile(session.user.id)
        } else {
          setUser(null)
          setProfile(null)
          setSession(null)
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const loadUserProfile = async (userId: string) => {
    try {
      const { data, error } = await profileService.getProfile(userId)
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error loading profile:', error)
        return
      }

      if (data) {
        setProfile(data)
      } else {
        // Criar perfil se não existir
        const { data: newProfile } = await profileService.createProfile(userId, {})
        if (newProfile) {
          setProfile(newProfile)
        }
      }
    } catch (error) {
      console.error('Error in loadUserProfile:', error)
    }
  }

  const refreshProfile = async () => {
    if (user?.id) {
      await loadUserProfile(user.id)
    }
  }

  const login = async (email: string, password: string) => {
    setLoading(true)
    try {
      const result = await authService.login(email, password)
      return result
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    setLoading(true)
    try {
      await authService.logout()
    } finally {
      setLoading(false)
    }
  }

  const register = async (email: string, password: string, name: string) => {
    setLoading(true)
    try {
      const result = await authService.register(email, password, name)
      return result
    } finally {
      setLoading(false)
    }
  }

  const authValue: AuthContextType = {
    user,
    profile,
    session,
    loading,
    login,
    logout,
    register,
    refreshProfile,
  }

  return (
    <AuthContext.Provider value={authValue}>
      {children}
    </AuthContext.Provider>
  )
}