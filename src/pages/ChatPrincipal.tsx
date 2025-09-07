import React from 'react';
import { Button } from '@/components/ui/button';
import { Brain, MessageCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { useNavigate } from 'react-router-dom';

export default function ChatPrincipal() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className="text-neutral-600 hover:text-neutral-900"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-orange-500 rounded-lg">
                  <Brain className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-neutral-900">Dante AI</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-neutral-600">
                Olá, {user?.user_metadata?.name || user?.email}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="text-neutral-700 border-neutral-300"
              >
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-orange-100 rounded-2xl">
              <MessageCircle className="h-12 w-12 text-orange-600" />
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-neutral-900 mb-4">
            Chat Principal - Dante AI
          </h1>
          
          <p className="text-lg text-neutral-600 mb-8 max-w-2xl mx-auto">
            Bem-vindo ao chat principal do Dante AI! Esta é a área onde você poderá 
            conversar diretamente com nossa IA especializada em Registro de Imóveis.
          </p>

          <div className="bg-white rounded-2xl p-8 shadow-sm border border-neutral-200 max-w-2xl mx-auto">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center">
                <Brain className="h-8 w-8 text-white" />
              </div>
            </div>
            
            <h3 className="text-xl font-semibold text-neutral-900 mb-3">
              🚧 Em Desenvolvimento
            </h3>
            
            <p className="text-neutral-600 mb-6">
              O sistema de chat está sendo desenvolvido e estará disponível em breve. 
              Aqui você poderá fazer perguntas específicas sobre Registro de Imóveis 
              e receber respostas precisas baseadas na legislação vigente.
            </p>

            <div className="bg-neutral-50 rounded-lg p-4 mb-6">
              <h4 className="font-medium text-neutral-900 mb-2">
                Recursos que estarão disponíveis:
              </h4>
              <ul className="text-sm text-neutral-600 space-y-1">
                <li>• Consultas sobre procedimentos registrais</li>
                <li>• Análise de documentos e qualificação</li>
                <li>• Orientações baseadas na legislação</li>
                <li>• Histórico de conversas</li>
                <li>• Respostas com fundamentação jurídica</li>
              </ul>
            </div>

            <Button
              disabled
              className="bg-neutral-300 text-neutral-500 cursor-not-allowed"
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              Iniciar Conversa (Em breve)
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}