import React from 'react';
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/components/auth/AuthProvider';
import ResetPasswordModal from '@/components/auth/ResetPasswordModal';
import HomePage from '@/pages/HomePage';
import ChatPage from '@/pages/ChatPage';
import DanteUI from '@/pages/DanteUI';
import BaseLegal from '@/pages/BaseLegal';
import ComoFunciona from '@/pages/ComoFunciona';
import Planos from '@/pages/Planos';
import Contato from '@/pages/Contato';
import TestePage from '@/pages/TestePage';

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

  React.useEffect(() => {
    // Simulate loading time and ensure all components are ready
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Detectar se o usuário acessou via link de recuperação de senha
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const isResetPassword = urlParams.get('reset-password');
    
    if (isResetPassword === 'true') {
      setIsResetPasswordModalOpen(true);
      // Limpar o parâmetro da URL sem recarregar a página
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    }
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
            <Route path="/teste" element={<TestePage />} />
          </Routes>
          
          <ResetPasswordModal 
            isOpen={isResetPasswordModalOpen}
            onClose={() => setIsResetPasswordModalOpen(false)}
            onSuccess={() => {
              // Opcional: redirecionar para login ou mostrar mensagem adicional
              console.log('Senha redefinida com sucesso');
            }}
          />
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;