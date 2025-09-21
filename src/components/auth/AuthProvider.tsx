import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../../../services/supa_init';
// import { FUN_DT_LOGIN_NEW_SESSION } from '../../../services/supabase';

interface AuthContextType { 
  user: User | null;
  session: Session | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error?: any }>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<{ error?: any }>;
  changePassword: (newPassword: string) => Promise<{ error?: any }>;
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
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        // Get initial session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (mounted) {
          if (error) {
            console.error('Error getting session:', error);
          }
          setSession(session);
          setUser(session?.user ?? null);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      // Comentado temporariamente para evitar erros de Edge Function
      // if (!error) {
      //   try {
      //     console.log('Login bem-sucedido, criando nova sessão de chat...');
      //     const sessionResult = await FUN_DT_LOGIN_NEW_SESSION();
      //     
      //     if (sessionResult.success) {
      //       console.log('Nova sessão de chat criada:', sessionResult.session);
      //     } else {
      //       console.error('Erro ao criar sessão de chat:', sessionResult.error);
      //     }
      //   } catch (sessionError) {
      //     console.error('Erro inesperado ao criar sessão de chat:', sessionError);
      //   }
      // }
      
      return { error };
    } catch (err) {
      console.error('Login error:', err);
      return { 
        error: { 
          message: 'Erro de conexão. Tente novamente.' 
        } 
      };
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
          },
        },
      });
      
      // Comentado temporariamente para evitar erros de Edge Function
      // if (!error) {
      //   try {
      //     console.log('Registro bem-sucedido, criando nova sessão de chat...');
      //     const sessionResult = await FUN_DT_LOGIN_NEW_SESSION();
      //     
      //     if (sessionResult.success) {
      //       console.log('Nova sessão de chat criada:', sessionResult.session);
      //     } else {
      //       console.error('Erro ao criar sessão de chat:', sessionResult.error);
      //     }
      //   } catch (sessionError) {
      //     console.error('Erro inesperado ao criar sessão de chat:', sessionError);
      //   }
      // }
      
      return { error };
    } catch (err) {
      console.error('Register error:', err);
      return { 
        error: { 
          message: 'Erro de conexão. Tente novamente.' 
        } 
      };
    }
  };

  const changePassword = async (newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (!error) {
        // Supabase automaticamente envia email de confirmação de mudança de senha
        console.log('Senha alterada com sucesso - Email de confirmação enviado automaticamente');
        
        // Opcional: Enviar email customizado adicional se necessário
        // Isso pode ser implementado via Edge Function se quiser personalizar o email
      }
      
      return { error };
    } catch (err) {
      console.error('Erro no changePassword:', err);
      return { 
        error: { 
          message: 'Erro ao alterar senha. Tente novamente.' 
        } 
      };
    }
  };

  const authValue: AuthContextType = {
    user,
    session,
    loading,
    login,
    logout,
    register,
    changePassword,
  };

  return (
    <AuthContext.Provider value={authValue}>
      {children}
    </AuthContext.Provider>
  );
};