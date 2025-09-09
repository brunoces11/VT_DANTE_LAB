import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Brain, Key, TestTube, AlertCircle, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import ResetPasswordModal from '@/components/auth/ResetPasswordModal';

export default function TestResetPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [testResults, setTestResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const addTestResult = (test: string, status: 'success' | 'error' | 'info', message: string, data?: any) => {
    setTestResults(prev => [...prev, {
      test,
      status,
      message,
      data,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  const runTests = async () => {
    setTestResults([]);
    setLoading(true);

    // Teste 1: Verificar configuração do Supabase
    addTestResult('Configuração Supabase', 'info', 'Verificando configuração...');
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      if (supabaseUrl && supabaseKey) {
        addTestResult('Configuração Supabase', 'success', 'Variáveis de ambiente configuradas', {
          url: supabaseUrl,
          keyLength: supabaseKey.length
        });
      } else {
        addTestResult('Configuração Supabase', 'error', 'Variáveis de ambiente não encontradas');
      }
    } catch (error) {
      addTestResult('Configuração Supabase', 'error', `Erro: ${error}`);
    }

    // Teste 2: Verificar sessão atual
    addTestResult('Sessão Atual', 'info', 'Verificando sessão...');
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (session) {
        addTestResult('Sessão Atual', 'success', 'Usuário logado', {
          userId: session.user.id,
          email: session.user.email
        });
      } else {
        addTestResult('Sessão Atual', 'info', 'Nenhuma sessão ativa', { error });
      }
    } catch (error) {
      addTestResult('Sessão Atual', 'error', `Erro: ${error}`);
    }

    // Teste 3: Simular tokens válidos
    addTestResult('Simulação de Tokens', 'info', 'Criando sessão de teste...');
    
    // Vamos simular uma situação onde temos tokens válidos
    const mockTokens = {
      access_token: 'mock_access_token_for_testing',
      refresh_token: 'mock_refresh_token_for_testing',
      type: 'recovery'
    };

    addTestResult('Simulação de Tokens', 'success', 'Tokens simulados criados', mockTokens);

    setLoading(false);
  };

  const testModalDirectly = () => {
    // Simular que temos uma sessão válida para teste
    setIsModalOpen(true);
  };

  const createTestSession = async () => {
    addTestResult('Teste de Sessão', 'info', 'Tentando criar sessão de teste...');
    
    // Vamos tentar fazer login com um usuário de teste
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'test@example.com',
        password: 'testpassword'
      });

      if (error) {
        addTestResult('Teste de Sessão', 'error', `Erro no login de teste: ${error.message}`);
      } else {
        addTestResult('Teste de Sessão', 'success', 'Sessão de teste criada', {
          userId: data.user?.id,
          email: data.user?.email
        });
        setIsModalOpen(true);
      }
    } catch (error) {
      addTestResult('Teste de Sessão', 'error', `Erro: ${error}`);
    }
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
                ← Voltar
              </Button>
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-orange-500 rounded-lg">
                  <TestTube className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-neutral-900">Teste - Reset de Senha</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-neutral-200">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-orange-100 rounded-2xl">
                <Key className="h-12 w-12 text-orange-600" />
              </div>
            </div>
            
            <h1 className="text-3xl font-bold text-neutral-900 mb-4">
              Teste - Redefinição de Senha
            </h1>
            
            <p className="text-lg text-neutral-600 mb-8">
              Esta página permite testar o sistema de redefinição de senha de forma isolada.
            </p>
          </div>

          {/* Botões de Teste */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <Button
              onClick={runTests}
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600 text-white p-4 h-auto flex flex-col items-center"
            >
              <TestTube className="h-6 w-6 mb-2" />
              <span className="font-medium">Executar Testes</span>
              <span className="text-xs opacity-80">Verificar configurações</span>
            </Button>

            <Button
              onClick={testModalDirectly}
              className="bg-green-500 hover:bg-green-600 text-white p-4 h-auto flex flex-col items-center"
            >
              <Key className="h-6 w-6 mb-2" />
              <span className="font-medium">Testar Modal</span>
              <span className="text-xs opacity-80">Abrir modal diretamente</span>
            </Button>
          </div>

          {/* Resultados dos Testes */}
          {testResults.length > 0 && (
            <div className="bg-neutral-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center">
                <TestTube className="h-5 w-5 mr-2" />
                Resultados dos Testes
              </h3>
              
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {testResults.map((result, index) => (
                  <div key={index} className="bg-white rounded-lg p-4 border border-neutral-200">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {result.status === 'success' && <CheckCircle className="h-5 w-5 text-green-500" />}
                        {result.status === 'error' && <AlertCircle className="h-5 w-5 text-red-500" />}
                        {result.status === 'info' && <AlertCircle className="h-5 w-5 text-blue-500" />}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-neutral-900">{result.test}</h4>
                          <span className="text-xs text-neutral-500">{result.timestamp}</span>
                        </div>
                        <p className="text-sm text-neutral-600 mt-1">{result.message}</p>
                        
                        {result.data && (
                          <details className="mt-2">
                            <summary className="text-xs text-neutral-500 cursor-pointer hover:text-neutral-700">
                              Ver detalhes
                            </summary>
                            <pre className="text-xs bg-neutral-100 p-2 rounded mt-1 overflow-x-auto">
                              {JSON.stringify(result.data, null, 2)}
                            </pre>
                          </details>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Informações sobre o Problema */}
          <div className="mt-8 bg-orange-50 rounded-lg p-6 border border-orange-200">
            <h3 className="text-lg font-semibold text-orange-900 mb-4">
              🔍 Diagnóstico do Problema
            </h3>
            
            <div className="space-y-3 text-sm text-orange-800">
              <p><strong>Problema atual:</strong> Links de recuperação sempre retornam "otp_expired"</p>
              
              <p><strong>Possíveis causas:</strong></p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Configuração incorreta no Supabase</li>
                <li>URL de redirecionamento não autorizada</li>
                <li>Problema com o parsing dos tokens</li>
                <li>Tokens sendo invalidados muito rapidamente</li>
              </ul>
              
              <p><strong>Este teste vai verificar:</strong></p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Se as variáveis de ambiente estão corretas</li>
                <li>Se a conexão com o Supabase funciona</li>
                <li>Se o modal de redefinição funciona isoladamente</li>
                <li>Se conseguimos criar sessões de teste</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <ResetPasswordModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          setIsModalOpen(false);
          addTestResult('Modal de Reset', 'success', 'Senha redefinida com sucesso!');
        }}
      />
    </div>
  );
}