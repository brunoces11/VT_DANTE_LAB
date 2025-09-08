import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Brain } from 'lucide-react';
import ResetPasswordModal from '@/components/auth/ResetPasswordModal';
import { supabase } from '@/lib/supabase';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handlePasswordReset = async () => {
      const accessToken = searchParams.get('access_token');
      const refreshToken = searchParams.get('refresh_token');
      const type = searchParams.get('type');

      if (type === 'recovery' && accessToken && refreshToken) {
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (error) {
          setError('Link de recuperação inválido ou expirado');
        } else {
          setIsModalOpen(true);
        }
      } else {
        setError('Link de recuperação inválido');
      }
    };

    handlePasswordReset();
  }, [searchParams]);

  const handleSuccess = () => {
    navigate('/', { replace: true });
  };

  const handleClose = () => {
    navigate('/', { replace: true });
  };

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
          <p className="text-neutral-600 mb-6">
            {error}
          </p>
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
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-2xl p-8 shadow-sm border border-neutral-200 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-orange-100 rounded-xl">
              <Brain className="h-8 w-8 text-orange-600" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-4">
            Recuperação de senha
          </h1>
          <p className="text-neutral-600">
            Processando seu link de recuperação...
          </p>
        </div>
      </div>

      <ResetPasswordModal
        isOpen={isModalOpen}
        onClose={handleClose}
        onSuccess={handleSuccess}
      />
    </>
  );
}