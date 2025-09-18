import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { supabase } from '../../services/supa_init';
import { login as supabaseLogin, logout as supabaseLogout, register as supabaseRegister } from '../../services/supa_auth';
import { getProfile, createProfile } from '../../services/supabase';

interface User {
  id: string;
  email?: string;
}

interface UserProfile {
  user_id: string;
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
  [key: string]: any;
}

interface AuthContextType { 
  user: User | null;
  profile: UserProfile | null;
  session: any;
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
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          setUser({ id: session.user.id, email: session.user.email });
          setSession(session);
          await loadUserProfile(session.user.id);
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser({ id: session.user.id, email: session.user.email });
          setSession(session);
          await loadUserProfile(session.user.id);
        } else {
          setUser(null);
          setProfile(null);
          setSession(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (userId: string) => {
    try {
      const { data, error } = await getProfile(userId);
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error loading profile:', error);
        return;
      }

      if (data) {
        setProfile(data);
      } else {
        // Create profile if it doesn't exist
        const { data: newProfile } = await createProfile(userId, {});
        if (newProfile) {
          setProfile(newProfile);
        }
      }
    } catch (error) {
      console.error('Error in loadUserProfile:', error);
    }
  };

  const refreshProfile = async () => {
    if (user?.id) {
      await loadUserProfile(user.id);
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const result = await supabaseLogin(email, password);
      return result;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await supabaseLogout();
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    setLoading(true);
    try {
      const result = await supabaseRegister(email, password, name);
      return result;
    } finally {
      setLoading(false);
    }
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