import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../../../services/supa_init';
import { fun_load_user_data, fun_single_session } from '../../../services/supabase';

// Interfaces para dados do chat
interface ChatMessage {
  chat_msg_id: string;
  msg_input: string;
  msg_output: string;
}

interface ChatSession {
  chat_session_id: string;
  chat_session_title: string;
  messages: ChatMessage[];
}

interface UserChatData {
  user_id: string;
  chat_sessions: ChatSession[];
}

interface AuthContextType { 
  user: User | null;
  session: Session | null;
  loading: boolean;
  chatData: UserChatData | null;
  loadingChatData: boolean;
  login: (email: string, password: string) => Promise<{ error?: any }>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<{ error?: any }>;
  changePassword: (newPassword: string) => Promise<{ error?: any }>;
  resetPassword: (email: string) => Promise<{ error?: any }>;
  invalidateUserDataCache: () => void;
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

// Constantes para cache
const CACHE_KEY = 'user_chat_data';
const CACHE_TIMESTAMP_KEY = 'user_data_timestamp';
const CACHE_TTL = 5 * 60 * 1000; // 5 minutos
const MAX_SESSIONS = 10; // Máximo de sessões em cache
const MAX_MESSAGES_PER_SESSION = 50; // Máximo de mensagens por sessão

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [chatData, setChatData] = useState<UserChatData | null>(null);
  const [loadingChatData, setLoadingChatData] = useState(false);

  // Funções utilitárias para cache
  const getCachedData = (): UserChatData | null => {
    try {
      const cachedData = localStorage.getItem(CACHE_KEY);
      const timestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);
      
      if (!cachedData || !timestamp) return null;
      
      // Verificar se cache não expirou
      if (Date.now() - parseInt(timestamp) > CACHE_TTL) {
        console.log('🕐 Cache expirado, removendo...');
        localStorage.removeItem(CACHE_KEY);
        localStorage.removeItem(CACHE_TIMESTAMP_KEY);
        return null;
      }
      
      const parsedData = JSON.parse(cachedData);
      
      // Validar estrutura básica
      if (!parsedData.user_id || !Array.isArray(parsedData.chat_sessions)) {
        throw new Error('Estrutura de dados inválida');
      }
      
      return parsedData;
    } catch (error) {
      console.warn('🗑️ Cache corrompido, limpando...', error);
      localStorage.removeItem(CACHE_KEY);
      localStorage.removeItem(CACHE_TIMESTAMP_KEY);
      return null;
    }
  };

  const saveCacheData = (data: UserChatData): void => {
    try {
      // Limitar dados para evitar localStorage muito grande
      const limitedData: UserChatData = {
        user_id: data.user_id,
        chat_sessions: data.chat_sessions
          .slice(0, MAX_SESSIONS)
          .map(session => ({
            ...session,
            messages: session.messages.slice(-MAX_MESSAGES_PER_SESSION)
          }))
      };
      
      localStorage.setItem(CACHE_KEY, JSON.stringify(limitedData));
      localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
      console.log('💾 Dados salvos no cache');
    } catch (error) {
      console.warn('⚠️ Falha ao salvar cache, continuando sem cache...', error);
    }
  };

  const invalidateUserDataCache = (): void => {
    try {
      localStorage.removeItem(CACHE_KEY);
      localStorage.removeItem(CACHE_TIMESTAMP_KEY);
      console.log('🗑️ Cache invalidado');
    } catch (error) {
      console.warn('⚠️ Erro ao invalidar cache', error);
    }
  };

  const loadUserDataWithFallback = async (): Promise<UserChatData | null> => {
    setLoadingChatData(true);
    
    try {
      // 1. Mostrar dados em cache imediatamente se existir
      const cachedData = getCachedData();
      if (cachedData) {
        console.log('📦 Usando dados em cache...');
        setChatData(cachedData);
      }
      
      // 2. Sempre fazer requisição para dados atuais
      console.log('🔄 Carregando dados atuais do servidor...');
      const result = await fun_load_user_data();
      
      if (result.success && result.data) {
        console.log('✅ Dados atuais carregados do servidor');
        setChatData(result.data);
        saveCacheData(result.data);
        return result.data;
      } else {
        console.warn('❌ Falha na API, usando cache como fallback');
        if (cachedData) {
          return cachedData;
        }
        throw new Error(result.error || 'Falha ao carregar dados');
      }
    } catch (error) {
      console.error('💥 Erro ao carregar dados do usuário:', error);
      
      // Fallback para cache se API falhar completamente
      const cachedData = getCachedData();
      if (cachedData) {
        console.log('📦 Usando cache como último recurso');
        setChatData(cachedData);
        return cachedData;
      }
      
      // Se tudo falhar, definir estado vazio
      setChatData(null);
      return null;
    } finally {
      setLoadingChatData(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        console.log('🚀 Inicializando autenticação...');
        
        let session = null;
        let error = null;
        
        // PRIORIZAR localStorage para inicialização rápida
        const authData = localStorage.getItem('sb-oifhsdqivbiyyvfheofx-auth-token');
        if (authData) {
          try {
            const parsed = JSON.parse(authData);
            // Criar objeto session manualmente do localStorage
            session = {
              access_token: parsed.access_token,
              refresh_token: parsed.refresh_token,
              expires_at: parsed.expires_at,
              expires_in: parsed.expires_in,
              token_type: parsed.token_type,
              user: parsed.user
            };
            console.log('⚡ Sessão recuperada RAPIDAMENTE do localStorage');
            
            // Atualizar estado imediatamente para evitar flash
            if (mounted) {
              setSession(session);
              setUser(session?.user ?? null);
              setLoading(false);
            }
          } catch (parseError) {
            console.warn('⚠️ Erro ao parsear localStorage');
          }
        }
        
        // Depois tentar getSession() em background para validar
        try {
          const sessionPromise = supabase.auth.getSession();
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Timeout ao obter sessão inicial')), 3000)
          );
          
          const result = await Promise.race([sessionPromise, timeoutPromise]) as any;
          const apiSession = result.data?.session;
          error = result.error;
          
          if (apiSession) {
            console.log('✅ Sessão validada via getSession()');
            session = apiSession;
          }
        } catch (timeoutError) {
          console.warn('⚠️ Timeout em getSession(), usando localStorage');
          // Já temos session do localStorage, então está ok
        }
        
        if (mounted) {
          if (error) {
            console.error('Error getting session:', error);
          }
          setSession(session);
          setUser(session?.user ?? null);
          setLoading(false);
          
          // Se já há sessão válida, carregar dados do usuário e invalidar outras sessões
          if (session?.user) {
            // Sessão existente - executando ações automáticas
            
            // Executar ambas funções simultaneamente
            const [userDataResult, singleSessionResult] = await Promise.allSettled([
              loadUserDataWithFallback(),
              fun_single_session()
            ]);
            
            // Log dos resultados
            if (userDataResult.status === 'fulfilled') {
              console.log('✅ Dados do usuário processados');
            } else {
              console.error('❌ Erro ao carregar dados:', userDataResult.reason);
            }
            
            if (singleSessionResult.status === 'fulfilled') {
              const result = singleSessionResult.value;
              if (result.success) {
                console.log('✅ Outras sessões invalidadas:', result.message);
              } else {
                console.warn('⚠️ Erro ao invalidar sessões (não crítico):', result.error);
              }
            } else {
              console.warn('⚠️ Erro ao invalidar sessões (não crítico):', singleSessionResult.reason);
            }
          }
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
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔔 Auth state changed:', event, 'User:', session?.user?.email);
      
      if (mounted) {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        console.log('✅ Estado atualizado: loading=false, user=', session?.user?.email || 'null');
        
        // Carregar dados do usuário e invalidar outras sessões automaticamente após login
        if (event === 'SIGNED_IN' && session?.user) {
          console.log('🔄 SIGNED_IN detectado, carregando dados em background...');
          
          // Executar ambas funções simultaneamente em background (não bloquear UI)
          Promise.allSettled([
            loadUserDataWithFallback(),
            fun_single_session()
          ]).then(([userDataResult, singleSessionResult]) => {
            // Log dos resultados
            if (userDataResult.status === 'fulfilled') {
              console.log('✅ Dados do usuário processados');
            } else {
              console.error('❌ Erro ao carregar dados:', userDataResult.reason);
            }
            
            if (singleSessionResult.status === 'fulfilled') {
              const result = singleSessionResult.value;
              if (result.success) {
                console.log('✅ Outras sessões invalidadas:', result.message);
              } else {
                console.warn('⚠️ Erro ao invalidar sessões (não crítico):', result.error);
              }
            } else {
              console.warn('⚠️ Erro ao invalidar sessões (não crítico):', singleSessionResult.reason);
            }
          });
        }
        
        // Limpar dados quando usuário faz logout
        if (event === 'SIGNED_OUT') {
          console.log('👋 Listener: Usuário deslogado, limpando dados...');
          setChatData(null);
          invalidateUserDataCache();
          setLoading(false); // Garantir que loading seja false após logout
          console.log('✅ Listener: Limpeza concluída');
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      return { error };
    } catch (err) {
      console.error('Login error:', err);
      return { 
        error: { 
          message: 'Erro de conexão. Tente novamente.' 
        } 
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    console.log('🚪 AuthProvider: Logout INSTANTÂNEO iniciado...');
    
    // 1. LIMPAR TUDO LOCALMENTE PRIMEIRO (instantâneo)
    setChatData(null);
    invalidateUserDataCache();
    localStorage.removeItem('sb-oifhsdqivbiyyvfheofx-auth-token');
    
    // 2. ATUALIZAR ESTADO IMEDIATAMENTE (UI responde instantaneamente)
    setUser(null);
    setSession(null);
    setLoading(false);
    
    console.log('✅ AuthProvider: Logout local completo (instantâneo)');
    
    // 3. CHAMAR API EM BACKGROUND (não bloqueia UI)
    supabase.auth.signOut()
      .then(() => {
        console.log('✅ SignOut API concluído em background');
      })
      .catch((error) => {
        console.warn('⚠️ Erro no signOut API (não crítico, já deslogado localmente):', error);
      });
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
          },
        },
      });
      
      return { error };
    } catch (err) {
      console.error('Register error:', err);
      return { 
        error: { 
          message: 'Erro de conexão. Tente novamente.' 
        } 
      };
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (newPassword: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (!error) {
        console.log('Senha alterada com sucesso');
      }
      
      return { error };
    } catch (err) {
      console.error('Erro no changePassword:', err);
      return { 
        error: { 
          message: 'Erro ao alterar senha. Tente novamente.' 
        } 
      };
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}?reset-password=true`,
      });
      
      return { error };
    } catch (err) {
      console.error('Erro no resetPassword:', err);
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
    session,
    loading,
    chatData,
    loadingChatData,
    login,
    logout,
    register,
    changePassword,
    resetPassword,
    invalidateUserDataCache,
  };

  return (
    <AuthContext.Provider value={authValue}>
      {children}
    </AuthContext.Provider>
  );
};