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
  const navigate = useNavigate();

  useEffect(() => {
    const handlePasswordReset = async () => {
      setLoading(true);
      console.log('URL completa:', window.location.href);
      console.log('Search params:', Object.fromEntries(searchParams.entries()));
      
      const accessToken = searchParams.get('access_token');
      const refreshToken = searchParams.get('refresh_token');
      const type = searchParams.get('type');
      const error_code = searchParams.get('error_code');
      const error_description = searchParams.get('error_description');

      // Se há erro nos parâmetros da URL
      if (error_code || error_description) {
        console.log('Erro nos parâmetros:', { error_code, error_description });
        setError(`Erro: ${error_description || 'Link de recuperação inválido'}`);
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
          <div className="bg-neutral-50 rounded-lg p-4 mb-6 text-left">
            <h4 className="font-medium text-neutral-900 mb-2 text-sm">
              Possíveis causas:
            </h4>
            <ul className="text-xs text-neutral-600 space-y-1">
              <li>• Link expirado (válido por 1 hora)</li>
              <li>• Link já foi usado anteriormente</li>
              <li>• Link foi copiado incorretamente</li>
              <li>• Problema de configuração no email</li>
            </ul>
          </div>
          <button
            onClick={() => navigate('/')}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium"
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