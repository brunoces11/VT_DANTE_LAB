import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../../../services/supa_init';
// Importar cache seguro para limpeza no logout
import { clearSafeCache } from '../../../services/cache-service';

// Interface simplificada seguindo padrão oficial Supabase
interface AuthContextType { 
  user: User | null;
  session: Session | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error?: any }>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<{ error?: any }>;
  changePassword: (newPassword: string) => Promise<{ error?: any }>;
  resetPassword: (email: string) => Promise<{ error?: any }>;
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

// AuthProvider otimizado seguindo padrão oficial Supabase
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Inicialização simplificada seguindo padrão oficial
    const initializeAuth = async () => {
      try {
        console.log('🔐 [AuthProvider] Inicializando autenticação...');
        
        // Obter sessão inicial (do localStorage se existir)
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (mounted) {
          if (error) {
            console.error('❌ [AuthProvider] Erro ao obter sessão:', error);
            setSession(null);
            setUser(null);
          } else if (session) {
            console.log('✅ [AuthProvider] Sessão restaurada do localStorage');
            console.log('👤 [AuthProvider] User ID:', session.user.id);
            setSession(session);
            setUser(session.user);
          } else {
            console.log('📭 [AuthProvider] Nenhuma sessão encontrada');
            setSession(null);
            setUser(null);
          }
          
          setLoading(false);
          console.log('✅ [AuthProvider] Inicialização concluída');
        }
      } catch (error) {
        console.error('❌ [AuthProvider] Erro na inicialização:', error);
        if (mounted) {
          setSession(null);
          setUser(null);
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // Listener simplificado para mudanças de auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (mounted) {
        console.log('🔄 [AuthProvider] Auth state change:', event);
        
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        
        // Limpar cache ao fazer logout
        if (event === 'SIGNED_OUT') {
          console.log('🧹 [AuthProvider] Limpando cache no logout...');
          clearSafeCache();
          localStorage.removeItem('user_chat_data');
          console.log('✅ [AuthProvider] Cache limpo');
        }
        
        // Log de login bem-sucedido
        if (event === 'SIGNED_IN') {
          console.log('✅ [AuthProvider] Login bem-sucedido');
          console.log('👤 [AuthProvider] User ID:', session?.user?.id);
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Interface simplificada seguindo padrão oficial
  const login = async (email: string, password: string) => {
    try {
      // Tentando login
      const { error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      
      if (error) {
        console.error('❌ Erro no login:', error);
      } else {
        // Login iniciado com sucesso
      }
      
      return { error };
    } catch (err) {
      console.error('❌ Erro de conexão no login:', err);
      return { 
        error: { 
          message: 'Erro de conexão. Tente novamente.' 
        } 
      };
    }
  };

  const logout = async () => {
    try {
      console.log('🚪 Iniciando logout...');
      
      // Limpar cache antes de fazer signOut
      console.log('🧹 Limpando cache...');
      clearSafeCache();
      localStorage.removeItem('user_chat_data');
      
      // Fazer signOut
      await supabase.auth.signOut();
      
      // Limpar estados locais
      setUser(null);
      setSession(null);
      
      console.log('✅ Logout concluído');
    } catch (error) {
      console.error('❌ Erro no logout:', error);
      // Mesmo com erro, limpar estados
      setUser(null);
      setSession(null);
      clearSafeCache();
      localStorage.removeItem('user_chat_data');
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      // Tentando registro
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
        console.error('❌ Erro no registro:', error);
      } else {
        // Registro iniciado com sucesso
      }
      
      return { error };
    } catch (err) {
      console.error('❌ Erro de conexão no registro:', err);
      return { 
        error: { 
          message: 'Erro de conexão. Tente novamente.' 
        } 
      };
    }
  };

  const changePassword = async (newPassword: string) => {
    try {
      // Alterando senha
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) {
        console.error('❌ Erro ao alterar senha:', error);
      } else {
        console.log('✅ Senha alterada');
      }
      
      return { error };
    } catch (err) {
      console.error('❌ Erro de conexão ao alterar senha:', err);
      return { 
        error: { 
          message: 'Erro ao alterar senha. Tente novamente.' 
        } 
      };
    }
  };

  const resetPassword = async (email: string) => {
    try {
      // Enviando reset de senha
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}?reset-password=true`,
      });
      
      if (error) {
        console.error('❌ Erro ao enviar reset:', error);
      } else {
        console.log('✅ Reset enviado');
      }
      
      return { error };
    } catch (err) {
      console.error('❌ Erro de conexão no reset:', err);
      return { 
        error: { 
          message: 'Erro ao enviar e-mail de recuperação. Tente novamente.' 
        } 
      };
    }
  };

  // Interface simplificada
  const authValue: AuthContextType = {
    user,
    session,
    loading,
    login,
    logout,
    register,
    changePassword,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={authValue}>
      {children}
    </AuthContext.Provider>
  );
};