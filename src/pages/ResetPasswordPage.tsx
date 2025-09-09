import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Brain } from 'lucide-react';
import ResetPasswordModal from '@/components/auth/ResetPasswordModal';
import { supabase } from '@/lib/supabase';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handlePasswordReset = async () => {
      setLoading(true);
      
      const fullUrl = window.location.href;
      const allParams = Object.fromEntries(searchParams.entries());
      
      // Também verificar se os tokens estão no hash (fragment)
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const hashParamsObj = Object.fromEntries(hashParams.entries());
      
      // Capturar informações de debug
      const debugData = {
        fullUrl,
        allParams,
        hashParams: hashParamsObj,
        hash: window.location.hash,
        pathname: window.location.pathname,
        search: window.location.search
      };
      
      setDebugInfo(debugData);
      console.log('=== DEBUG INFO ===');
      console.log('URL completa:', fullUrl);
      console.log('Todos os parâmetros:', allParams);
      console.log('Parâmetros no hash:', hashParamsObj);
      console.log('Hash:', window.location.hash);
      console.log('Pathname:', window.location.pathname);
      console.log('Search:', window.location.search);
      console.log('==================');
      
      // PRIMEIRO: Verificar se há erros no hash
      const error_code = hashParams.get('error_code');
      const error_description = hashParams.get('error_description');
      const error = hashParams.get('error');
      
      if (error || error_code || error_description) {
        console.log('❌ ERRO DETECTADO NO HASH:', { error, error_code, error_description });
        
        let errorMessage = '';
        if (error_code === 'otp_expired') {
          errorMessage = `🔄 TOKEN EXPIRADO - O link de recuperação expirou ou já foi usado.
          
⚠️ SOLUÇÃO:
1. Vá para: https://vt-dante-xgdz.bolt.host
2. Clique em "Entrar" → "Esqueci minha senha"
3. Digite seu email NOVAMENTE
4. Use o NOVO link IMEDIATAMENTE após receber o email

💡 DICA: Cada link só funciona UMA vez e expira em 1 hora.`;
        } else if (error === 'access_denied') {
          errorMessage = `🚫 ACESSO NEGADO - O link pode estar malformado ou já foi usado.
          
⚠️ SOLUÇÃO:
1. Solicite um NOVO link de recuperação
2. Verifique se clicou no link correto do email
3. Use o link dentro de 1 hora após receber`;
        } else {
          errorMessage = `❌ ERRO: ${error_description || error || 'Link inválido'}
          
⚠️ SOLUÇÃO: Solicite um novo link de recuperação`;
        }
        
        setError(errorMessage);
        setLoading(false);
        return;
      }
      
      // Verificar tokens tanto nos parâmetros de query quanto no hash
      const accessToken = searchParams.get('access_token') || hashParams.get('access_token');
      const refreshToken = searchParams.get('refresh_token') || hashParams.get('refresh_token');
      const type = searchParams.get('type') || hashParams.get('type');
      
      console.log('Parâmetros extraídos:');
      console.log('- accessToken:', accessToken ? 'PRESENTE' : 'AUSENTE');
      console.log('- refreshToken:', refreshToken ? 'PRESENTE' : 'AUSENTE');
      console.log('- type:', type);

      // Se não encontrou tokens nos parâmetros, tentar usar o método getSession do Supabase
      if (!accessToken || !refreshToken) {
        console.log('Tokens não encontrados na URL, tentando getSession...');
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (session && !sessionError) {
          console.log('Sessão encontrada via getSession:', session);
          setIsModalOpen(true);
          setLoading(false);
          return;
        } else {
          console.log('Nenhuma sessão encontrada via getSession:', sessionError);
        }
      }

      // Verificar se todos os parâmetros necessários estão presentes
      if (!accessToken || !refreshToken || type !== 'recovery') {
        console.log('Parâmetros ausentes:', { accessToken: !!accessToken, refreshToken: !!refreshToken, type });
        setError(`🔍 LINK INCOMPLETO - Tokens de recuperação não encontrados.
        
⚠️ POSSÍVEIS CAUSAS:
• Link foi copiado incorretamente
• Email foi encaminhado (tokens podem ser removidos)
• Problema na configuração do Supabase

✅ SOLUÇÃO:
1. Vá diretamente para: https://vt-dante-xgdz.bolt.host
2. Solicite um NOVO link de recuperação
3. Clique no link diretamente do email (não copie/cole)`);
        setLoading(false);
        return;
      }

      if (type === 'recovery' && accessToken && refreshToken) {
        console.log('Tentando definir sessão...');
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (error) {
          console.log('Erro ao definir sessão:', error);
          setError(`🚫 ERRO NA SESSÃO: ${error.message}
          
⚠️ SOLUÇÃO:
1. Solicite um NOVO link de recuperação
2. Use o link IMEDIATAMENTE após receber o email`);
        } else {
          console.log('Sessão definida com sucesso');
          setIsModalOpen(true);
        }
      } else {
        setError('🔍 Parâmetros de recuperação não encontrados na URL');
      }
      
      setLoading(false);
    };

    handlePasswordReset();
  }, [searchParams]);

  const handleSuccess = () => {
    navigate('/', { replace: true });
  };

  const handleClose = () => {
    navigate('/', { replace: true });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-2xl p-8 shadow-sm border border-neutral-200 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-orange-100 rounded-xl">
              <Brain className="h-8 w-8 text-orange-600" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-4">
            Processando recuperação
          </h1>
          <p className="text-neutral-600">
            Validando seu link de recuperação...
          </p>
          <div className="mt-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-2xl p-8 shadow-sm border border-neutral-200 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-red-100 rounded-xl">
              <Brain className="h-8 w-8 text-red-600" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-4">
            Erro na recuperação
          </h1>
          <p className="text-neutral-600 mb-6 text-sm">
            {error}
          </p>
          
          {/* Informações de Debug */}
          {debugInfo && (
            <div className="bg-neutral-50 rounded-lg p-4 mb-6 text-left">
              <h4 className="font-medium text-neutral-900 mb-2 text-sm">
                Informações de Debug:
              </h4>
              <div className="text-xs text-neutral-600 space-y-1 font-mono">
                <div><strong>URL:</strong> {debugInfo.fullUrl}</div>
                <div><strong>Parâmetros:</strong> {JSON.stringify(debugInfo.allParams, null, 2)}</div>
                <div><strong>Hash Params:</strong> {JSON.stringify(debugInfo.hashParams, null, 2)}</div>
                <div><strong>Hash:</strong> {debugInfo.hash || 'Nenhum'}</div>
              </div>
            </div>
          )}
          
          <div className="bg-orange-50 rounded-lg p-4 mb-6 text-left border border-orange-200">
            <h4 className="font-medium text-neutral-900 mb-2 text-sm">
              🔄 COMO RESOLVER O PROBLEMA:
            </h4>
            <div className="text-sm text-neutral-700 space-y-3">
              <div className="bg-white p-3 rounded border-l-4 border-red-400">
                <p className="font-bold text-red-700 mb-1">❌ PROBLEMA ATUAL:</p>
                <p className="text-red-600 text-xs">
                  {debugInfo?.hashParams?.error_code === 'otp_expired' ? 
                    'Token expirado ou já usado' : 
                    'Link inválido ou malformado'
                  }
                </p>
              </div>
              
              <div className="bg-white p-3 rounded border-l-4 border-green-400">
                <p className="font-bold text-green-700 mb-2">✅ SOLUÇÃO PASSO A PASSO:</p>
                <ol className="text-xs text-green-600 space-y-1 list-decimal list-inside">
                  <li><strong>Vá para:</strong> https://vt-dante-xgdz.bolt.host</li>
                  <li><strong>Clique em:</strong> "Entrar" → "Esqueci minha senha"</li>
                  <li><strong>Digite:</strong> Seu email novamente</li>
                  <li><strong>Aguarde:</strong> O novo email chegar</li>
                  <li><strong>Clique:</strong> No link IMEDIATAMENTE (não espere)</li>
                </ol>
              </div>
              
              <div className="bg-white p-3 rounded border-l-4 border-blue-400">
                <p className="font-bold text-blue-700 mb-1">💡 DICAS IMPORTANTES:</p>
                <ul className="text-xs text-blue-600 space-y-1 list-disc list-inside">
                  <li>Cada link só funciona UMA vez</li>
                  <li>Links expiram em 1 hora</li>
                  <li>Use sempre o email mais recente</li>
                  <li>Clique diretamente do email (não copie/cole)</li>
                </ul>
              </div>
            </div>
          </div>
          <button
            onClick={() => navigate('/')}
            className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium mb-3 text-sm"
          >
            ✅ Ir para o site e solicitar NOVO link
          </button>
          
          <button
            onClick={() => navigate('/')}
            className="w-full bg-neutral-200 hover:bg-neutral-300 text-neutral-700 px-4 py-2 rounded-lg font-medium text-sm"
          >
            ← Voltar ao início
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <ResetPasswordModal
        isOpen={isModalOpen}
        onClose={handleClose}
        onSuccess={handleSuccess}
      />
    </>
  );
}