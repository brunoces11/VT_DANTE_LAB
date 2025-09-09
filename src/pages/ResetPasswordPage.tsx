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
      
      // Verificar tokens tanto nos parâmetros de query quanto no hash
      const accessToken = searchParams.get('access_token') || hashParams.get('access_token');
      const refreshToken = searchParams.get('refresh_token') || hashParams.get('refresh_token');
      const type = searchParams.get('type') || hashParams.get('type');
      const error_code = searchParams.get('error_code');
      const error_description = searchParams.get('error_description');
      
      console.log('Parâmetros extraídos:');
      console.log('- accessToken:', accessToken ? 'PRESENTE' : 'AUSENTE');
      console.log('- refreshToken:', refreshToken ? 'PRESENTE' : 'AUSENTE');
      console.log('- type:', type);
      console.log('- error_code:', error_code);
      console.log('- error_description:', error_description);

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
      // Se há erro nos parâmetros da URL
      if (error_code || error_description) {
        console.log('Erro nos parâmetros:', { error_code, error_description });
        
        // Tratar diferentes tipos de erro
        let errorMessage = '';
        if (error_code === 'otp_expired') {
          errorMessage = 'O link de recuperação expirou. Links de recuperação são válidos por apenas 1 hora após o envio do email.';
        } else if (error_code === 'access_denied') {
          errorMessage = 'Acesso negado. O link pode ter sido usado anteriormente ou é inválido.';
        } else if (error_description) {
          errorMessage = decodeURIComponent(error_description.replace(/\+/g, ' '));
        } else {
          errorMessage = 'Link de recuperação inválido';
        }
        
        setError(errorMessage);
        setLoading(false);
        return;
      }

      // Verificar se todos os parâmetros necessários estão presentes
      if (!accessToken || !refreshToken || type !== 'recovery') {
        console.log('Parâmetros ausentes:', { accessToken: !!accessToken, refreshToken: !!refreshToken, type });
        setError('Link de recuperação incompleto ou inválido');
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
          setError(`Link de recuperação inválido ou expirado: ${error.message}`);
        } else {
          console.log('Sessão definida com sucesso');
          setIsModalOpen(true);
        }
      } else {
        setError('Parâmetros de recuperação não encontrados na URL');
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
              ⚠️ Token Expirado - Como resolver:
            </h4>
            <div className="text-xs text-neutral-700 space-y-2">
              <p className="font-medium text-orange-700">
                🔄 <strong>PASSO 1:</strong> Solicite um NOVO link de recuperação
              </p>
              <p>
                ⚡ <strong>PASSO 2:</strong> Use o link IMEDIATAMENTE após receber o email
              </p>
              <p>
                ⏰ <strong>IMPORTANTE:</strong> Links expiram em 1 hora e só funcionam uma vez
              </p>
              <div className="mt-3 p-2 bg-white rounded border-l-4 border-orange-400">
                <p className="text-orange-800 font-medium">
                  ❌ Este token já foi usado ou expirou
                </p>
                <p className="text-orange-700 text-xs mt-1">
                  Token: ...{debugInfo?.hashParams?.error_code === 'otp_expired' ? 'EXPIRADO' : 'INVÁLIDO'}
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={() => navigate('/')}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium mb-3 text-sm"
          >
            🔄 Solicitar NOVO link de recuperação
          </button>
          
          <button
            onClick={() => navigate('/')}
            className="w-full bg-neutral-200 hover:bg-neutral-300 text-neutral-700 px-4 py-2 rounded-lg font-medium text-sm"
          >
            Voltar ao início
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