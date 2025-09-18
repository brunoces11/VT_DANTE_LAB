import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../../../services/supa_init';
import { login as authLogin, logout as authLogout, register as authRegister } from '../../../services/supa_auth';
import { getProfile, createProfile } from '../../../services/supabase';

interface UserProfile {
  id: string;
  avatar_url?: string;
  [key: string]: any;
}

interface AuthContextType { 
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error?: any }>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<{ error?: any }>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUserProfile = async (userId: string) => {
    console.log('🔍 loadUserProfile called for userId:', userId)
    
    try {
      const { data, error } = await getProfile(userId);
      
      console.log('📊 loadUserProfile - getProfile result:', { data, error })
      
      if (!data && !error) {
        // Perfil não existe, criar um novo
        console.log('📝 Creating new profile for user:', userId)
        const { data: newProfile } = await createProfile(userId, {});
        console.log('📊 New profile created:', newProfile)
        setProfile(newProfile);
      } else if (data) {
        console.log('✅ Profile loaded successfully:', data)
        setProfile(data);
      }
    } catch (err) {
      console.error('Error loading user profile:', err);
    }
  };

  const refreshProfile = async () => {
    if (user?.id) {
      await loadUserProfile(user.id);
    }
  };
  useEffect(() => {
    console.log('🔍 AuthProvider useEffect - Getting initial session')
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('📊 Initial session:', session ? 'Found' : 'Not found')
      
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        console.log('👤 User found, loading profile for:', session.user.id)
        loadUserProfile(session.user.id);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('🔄 Auth state changed:', _event, session ? 'Session exists' : 'No session')
      
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        console.log('👤 Loading profile for user:', session.user.id)
        loadUserProfile(session.user.id);
      } else {
        console.log('🚪 User logged out, clearing profile')
        setProfile(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    return await authLogin(email, password);
  };

  const logout = async () => {
    await authLogout();
    setProfile(null);
  };

  const register = async (email: string, password: string, name: string) => {
    return await authRegister(email, password, name);
  };

  const authValue: AuthContextType = {
    user,
    profile,
    session,
    loading,
    login,
    logout,
    register,
    refreshProfile,
  };

  return (
    <AuthContext.Provider value={authValue}>
      {children}
    </AuthContext.Provider>
  );
};