import React from 'react';
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/components/auth/AuthProvider';
import ResetPasswordModal from '@/components/auth/ResetPasswordModal';
import EmailConfirmationModal from '@/components/auth/EmailConfirmationModal';
import AuthModal from '@/components/auth/AuthModal';
import { supabase } from '../services/supa_init';
import HomePage from '@/pages/HomePage';
import ChatPage from '@/pages/ChatPage';
import DanteUI from '@/pages/DanteUI';
import BaseLegal from '@/pages/BaseLegal';
import ComoFunciona from '@/pages/ComoFunciona';
import Planos from '@/pages/Planos';
import Contato from '@/pages/Contato';
import TestePage from '@/pages/TestePage';
import PayloadTest from '@/pages/PayloadTest';
import PoliticaPrivacidadePage from '@/pages/PoliticaPrivacidadePage';
import TermosUsoPage from '@/pages/TermosUsoPage';
import QuemSomosPage from '@/pages/QuemSomosPage';
import MetabasePage from '@/pages/MetabasePage';

// Simple error boundary component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center p-8">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Algo deu errado!</h2>
            <p className="text-gray-600 mb-4">
              {this.state.error?.message || 'Erro desconhecido'}
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
            >
              Recarregar página
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
        <p className="text-neutral-600">Carregando Dante AI...</p>
      </div>
    </div>
  );
}

function App() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);
  const [isEmailConfirmationModalOpen, setIsEmailConfirmationModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Debug: Log mudanças de estado dos modais
  useEffect(() => {
    console.log('🔄 Estado dos modais:', {
      isResetPasswordModalOpen,
      isEmailConfirmationModalOpen,
      isAuthModalOpen
    });
  }, [isResetPasswordModalOpen, isEmailConfirmationModalOpen, isAuthModalOpen]);

  React.useEffect(() => {
    // Simulate loading time and ensure all components are ready
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Detectar se o usuário acessou via link de recuperação de senha
  useEffect(() => {
    const handleAuthRedirects = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const hash = window.location.hash;
      const hashParams = new URLSearchParams(hash.substring(1)); // Remove o #
      
      // Verificar se há erro de link expirado
      const error = hashParams.get('error');
      const errorCode = hashParams.get('error_code');
      
      // Verificar se há erro de link expirado
      
      if (error === 'access_denied' && errorCode === 'otp_expired') {
        console.log('❌ Link de recuperação expirado');
        setIsResetPasswordModalOpen(true);
        // Limpar hash e query params da URL
        const newUrl = window.location.origin + window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
        return;
      }
      
      // Verificar tokens no hash (formato padrão do Supabase)
      let accessToken = hashParams.get('access_token');
      let refreshToken = hashParams.get('refresh_token');
      let type = hashParams.get('type');
      
      // Fallback: verificar nos query params
      if (!accessToken) {
        accessToken = urlParams.get('access_token');
        refreshToken = urlParams.get('refresh_token');
        type = urlParams.get('type');
      }
      
      // Verificar tokens de autenticação
      
      // Verificar se é confirmação de email
      if (type === 'signup' && accessToken && refreshToken) {
        console.log('✅ Detectado link de confirmação de email');
        
        try {
          console.log('🔄 Definindo sessão para confirmação de email...');
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          });
          
          if (error) {
            console.error('❌ Erro ao confirmar email:', error);
          } else {
            console.log('✅ Email confirmado com sucesso');
            
            // Limpar URL ANTES de mostrar o modal
            const newUrl = window.location.origin + window.location.pathname;
            window.history.replaceState({}, document.title, newUrl);
            
            // Aguardar um pouco para garantir que a URL foi limpa
            setTimeout(() => {
              console.log('🎉 Abrindo modal de confirmação de email');
              setIsEmailConfirmationModalOpen(true);
            }, 100);
            setIsEmailConfirmationModalOpen(true);
          }
        } catch (error) {
          console.error('❌ Erro ao processar confirmação de email:', error);
        }
      } else if (type === 'recovery' && accessToken && refreshToken) {
        console.log('✅ Detectado link de recuperação de senha');
        
        try {
          console.log('🔄 Estabelecendo sessão de recuperação...');
          
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          });
          
          if (error) {
            console.error('❌ Erro ao definir sessão:', error);
            setIsResetPasswordModalOpen(true);
          } else {
            console.log('✅ Sessão de recuperação definida:', data);
            
            // Aguardar um pouco para garantir que a sessão foi estabelecida
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Verificar se a sessão está realmente ativa
            const { data: sessionCheck } = await supabase.auth.getSession();
            // Sessão de recuperação estabelecida
            
            setIsResetPasswordModalOpen(true);
          }
        } catch (error) {
          console.error('❌ Erro ao processar tokens de recuperação:', error);
          setIsResetPasswordModalOpen(true);
        }
        
        // Limpar hash e query params da URL
        const newUrl = window.location.origin + window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
      } else if (urlParams.get('reset-password') === 'true') {
        // Parâmetro reset-password detectado
        setIsResetPasswordModalOpen(true);
        const newUrl = window.location.origin + window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
      }
    };
    
    // Aguardar um pouco antes de processar para garantir que o Supabase foi inicializado
    const timer = setTimeout(handleAuthRedirects, 100);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingFallback />;
  }

  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/chat-page" element={<ChatPage />} />
            <Route path="/dante-ui" element={<DanteUI />} />
            <Route path="/base-legal" element={<BaseLegal />} />
            <Route path="/como-funciona" element={<ComoFunciona />} />
            <Route path="/planos" element={<Planos />} />
            <Route path="/contato" element={<Contato />} />
            <Route path="/politica-privacidade" element={<PoliticaPrivacidadePage />} />
            <Route path="/termos-uso" element={<TermosUsoPage />} />
            <Route path="/quem-somos" element={<QuemSomosPage />} />
            <Route path="/metabase" element={<MetabasePage />} />
            <Route path="/teste" element={<TestePage />} />
            <Route path="/payload-test" element={<PayloadTest />} />
          </Routes>
          <ResetPasswordModal 
            isOpen={isResetPasswordModalOpen}
            onClose={() => setIsResetPasswordModalOpen(false)}
            onSuccess={() => {
              console.log('Senha redefinida com sucesso');
            }}
          />
          <EmailConfirmationModal 
            isOpen={isEmailConfirmationModalOpen}
            onClose={() => setIsEmailConfirmationModalOpen(false)}
            onOpenLogin={() => {
              console.log('🔄 EmailConfirmationModal: abrindo modal de login');
              setIsEmailConfirmationModalOpen(false);
              setIsAuthModalOpen(true);
            }}
          />
          <AuthModal 
            isOpen={isAuthModalOpen}
            onClose={() => setIsAuthModalOpen(false)}
            onSuccess={() => {
              console.log('Login realizado após confirmação de email');
            }}
          />
          {/**
           * Comentado: overlay de debug dos modais
           */}
          {/*
          {process.env.NODE_ENV === 'development' && (
            <div style={{ 
              position: 'fixed', 
              top: '10px', 
              right: '10px', 
              background: 'black', 
              color: 'white', 
              padding: '10px', 
              fontSize: '12px',
              zIndex: 10000
            }}>
              Reset: {isResetPasswordModalOpen ? '✅' : '❌'}<br/>
              Email: {isEmailConfirmationModalOpen ? '✅' : '❌'}<br/>
              Auth: {isAuthModalOpen ? '✅' : '❌'}
            </div>
          )}
          */}
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
