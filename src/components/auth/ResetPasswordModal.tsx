import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Brain, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from './AuthProvider';
import { supabase } from '@/lib/supabase';

interface ResetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  testMode?: boolean;
}

export default function ResetPasswordModal({ isOpen, onClose, onSuccess, testMode = false }: ResetPasswordModalProps) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { updatePassword } = useAuth();

  const resetForm = () => {
    setPassword('');
    setConfirmPassword('');
    setError('');
    setSuccess('');
    setLoading(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (password !== confirmPassword) {
        setError('As senhas não coincidem');
        setLoading(false);
        return;
      }

      if (password.length < 6) {
        setError('A senha deve ter pelo menos 6 caracteres');
        setLoading(false);
        return;
      }

      if (testMode) {
        // Modo de teste - simular sucesso
        setSuccess('✅ TESTE: Senha seria atualizada com sucesso!');
        setTimeout(() => {
          handleClose();
          onSuccess?.();
        }, 2000);
      } else {
        // Verificar se há uma sessão válida
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (!session && !sessionError) {
          setError('❌ Sessão de autenticação não encontrada. Você precisa acessar através do link de recuperação válido.');
          setLoading(false);
          return;
        }

        const { error } = await updatePassword(password);
        if (error) {
          if (error.message.includes('session')) {
            setError('❌ Sessão expirada. Solicite um novo link de recuperação.');
          } else {
            setError(`❌ Erro: ${error.message}`);
          }
        } else {
          setSuccess('✅ Senha atualizada com sucesso!');
          setTimeout(() => {
            handleClose();
            onSuccess?.();
          }, 2000);
        }
      }
    } catch (err) {
      setError(`❌ Erro inesperado: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-orange-500 rounded-xl">
              <Brain className="h-8 w-8 text-white" />
            </div>
          </div>
          <DialogTitle className="text-2xl font-bold text-neutral-900">
            {testMode ? '🧪 TESTE - Definir nova senha' : 'Definir nova senha'}
          </DialogTitle>
          <p className="text-sm text-neutral-600 mt-2">
            {testMode ? 
              'Modo de teste - simula a redefinição de senha' : 
              'Digite sua nova senha para concluir a recuperação'
            }
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-1">
              Nova senha
            </label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Digite sua nova senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-700 mb-1">
              Repetir nova senha
            </label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Repita sua nova senha"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {success && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-600">{success}</p>
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Atualizando senha...
              </>
            ) : (
              'Confirmar nova senha'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}