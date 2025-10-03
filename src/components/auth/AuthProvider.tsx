import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../../../services/supa_init';

// Interface para dados do usuário (perfil da tabela tab_user)
interface UserProfile {
  user_id: string;
  user_name?: string;
  user_email?: string;
  user_role?: string;
  created_at?: string;
  updated_at?: string;
}

interface AuthContextType { 
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error?: any }>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<{ error?: any }>;
  changePassword: (newPassword: string) => Promise<{ error?: any }>;
  resetPassword: (email: string) => Promise<{ error?: any }>;
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
  // ✅ PADRÃO SUPABASE: Assume visitante até provar o contrário
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false); // ✅ Começa FALSE (visitante)

  // Debug: Log mudanças de estado
  useEffect(() => {
    console.log('🔍 AuthProvider - Estado:');
    console.log('   - user:', !!user, user?.email);
    console.log('   - profile:', !!profile, profile?.user_name);
    console.log('   - loading:', loading);
  }, [user, profile, loading]);

  useEffect(() => {
    let mounted = true;

    // ✅ PADRÃO OFICIAL SUPABASE: Inicialização
    const initializeAuth = async () => {
      try {
        console.log('🚀 Verificando sessão...');
        
        // ✅ SDK do Supabase (sem timeout - deixa SDK gerenciar)
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.warn('⚠️ Erro ao obter sessão:', error.message);
        }
        
        if (mounted && session?.user) {
          console.log('✅ Sessão encontrada:', session.user.email);
          setSession(session);
          setUser(session.user);
          
          // ✅ Carrega perfil
          await loadUserProfile(session.user.id);
        } else {
          console.log('ℹ️ Visitante (sem sessão)');
        }
      } catch (error) {
        console.warn('⚠️ Erro na verificação:', error);
      }
      
      console.log('✅ Verificação concluída');
    };

    initializeAuth();

    // ✅ PADRÃO OFICIAL SUPABASE: Listener de mudanças
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔔 Auth state changed:', event);
        
        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          
          // ✅ Carregar perfil quando usuário loga
          if (event === 'SIGNED_IN' && session?.user) {
            console.log('✅ Usuário logado:', session.user.email);
            await loadUserProfile(session.user.id);
          }
          
          // ✅ Limpar dados quando usuário desloga
          if (event === 'SIGNED_OUT') {
            console.log('👋 Usuário deslogado');
            setProfile(null);
          }
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // ✅ Função para carregar perfil do usuário
  const loadUserProfile = async (userId: string) => {
    try {
      console.log('📊 Carregando perfil do usuário...');
      
      // ✅ Usa SDK do Supabase diretamente
      const { data, error } = await supabase
        .from('tab_user')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error('❌ Erro ao carregar perfil:', error);
        return;
      }

      if (data) {
        console.log('✅ Perfil carregado:', data.user_email);
        setProfile(data);
      } else {
        // Criar perfil se não existir
        console.log('📝 Criando perfil...');
        const { data: newProfile, error: createError } = await supabase
          .from('tab_user')
          .insert({ user_id: userId })
          .select()
          .single();
        
        if (createError) {
          console.error('❌ Erro ao criar perfil:', createError);
        } else if (newProfile) {
          console.log('✅ Perfil criado');
          setProfile(newProfile);
        }
      }
    } catch (error) {
      console.error('❌ Erro em loadUserProfile:', error);
    }
  };

  // ✅ Função para recarregar perfil
  const refreshProfile = async () => {
    if (user?.id) {
      await loadUserProfile(user.id);
    }
  };

  // ✅ Login
  const login = async (email: string, password: string) => {
    try {
      console.log('🔐 Fazendo login...');
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('❌ Erro no login:', error.message);
      } else {
        console.log('✅ Login bem-sucedido');
      }
      
      return { error };
    } catch (err) {
      console.error('❌ Erro no login:', err);
      return { 
        error: { 
          message: 'Erro de conexão. Tente novamente.' 
        } 
      };
    }
  };

  // ✅ Logout
  const logout = async () => {
    try {
      setLoading(true);
      console.log('🚪 Fazendo logout...');
      
      // ✅ SDK gerencia tudo
      await supabase.auth.signOut();
      
      console.log('✅ Logout concluído');
    } catch (error) {
      console.error('❌ Erro no logout:', error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Registro
  const register = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      console.log('📝 Registrando usuário...');
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
          },
        },
      });
      
      if (error) {
        console.error('❌ Erro no registro:', error.message);
      } else {
        console.log('✅ Registro bem-sucedido');
      }
      
      return { error };
    } catch (err) {
      console.error('❌ Erro no registro:', err);
      return { 
        error: { 
          message: 'Erro de conexão. Tente novamente.' 
        } 
      };
    } finally {
      setLoading(false);
    }
  };

  // ✅ Alterar senha
  const changePassword = async (newPassword: string) => {
    try {
      setLoading(true);
      console.log('🔑 Alterando senha...');
      
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) {
        console.error('❌ Erro ao alterar senha:', error.message);
      } else {
        console.log('✅ Senha alterada com sucesso');
      }
      
      return { error };
    } catch (err) {
      console.error('❌ Erro ao alterar senha:', err);
      return { 
        error: { 
          message: 'Erro ao alterar senha. Tente novamente.' 
        } 
      };
    } finally {
      setLoading(false);
    }
  };

  // ✅ Recuperar senha
  const resetPassword = async (email: string) => {
    try {
      setLoading(true);
      console.log('📧 Enviando e-mail de recuperação...');
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}?reset-password=true`,
      });
      
      if (error) {
        console.error('❌ Erro ao enviar e-mail:', error.message);
      } else {
        console.log('✅ E-mail enviado');
      }
      
      return { error };
    } catch (err) {
      console.error('❌ Erro ao enviar e-mail:', err);
      return { 
        error: { 
          message: 'Erro ao enviar e-mail de recuperação. Tente novamente.' 
        } 
      };
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
    changePassword,
    resetPassword,
    refreshProfile,
  };

  return (
    <AuthContext.Provider value={authValue}>
      {children}
    </AuthContext.Provider>
  );
};
