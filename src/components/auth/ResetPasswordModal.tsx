import React, { useState, useEffect } from 'react';
import { supabase } from '../../../services/supa_init';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Brain, Eye, EyeOff, Loader2 } from 'lucide-react';

interface ResetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function ResetPasswordModal({ isOpen, onClose, onSuccess }: ResetPasswordModalProps) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Verificar se há uma sessão de recuperação de senha ativa
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Erro ao verificar sessão:', error);
        }
        console.log('Sessão atual:', session);
      } catch (error) {
        console.error('Erro ao verificar sessão:', error);
      }
    };

    if (isOpen) {
      checkSession();
    }
  }, [isOpen]);

  const resetForm = () => {
    setNewPassword('');
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

    console.log('🔄 Iniciando alteração de senha...');

    try {
      if (newPassword !== confirmPassword) {
        setError('As senhas não coincidem');
        setLoading(false);
        return;
      }

      if (newPassword.length < 6) {
        setError('A senha deve ter pelo menos 6 caracteres');
        setLoading(false);
        return;
      }

      // Verificar se há uma sessão ativa antes de tentar alterar a senha
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      console.log('🔍 Sessão atual:', sessionData);
      console.log('🔍 Erro de sessão:', sessionError);
      
      if (sessionError) {
        console.error('❌ Erro ao verificar sessão:', sessionError);
        setError('Erro de sessão. Tente acessar o link do email novamente.');
        setLoading(false);
        return;
      }
      
      if (!sessionData.session) {
        console.error('❌ Nenhuma sessão encontrada');
        setError('Sessão expirada. Solicite um novo link de recuperação de senha.');
        setLoading(false);
        return;
      }
      
      console.log('✅ Sessão válida encontrada, alterando senha...');
      
      // Tentar alterar a senha
      const { data: updateData, error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      console.log('🔍 Resultado da alteração:', { data: updateData, error: updateError });
      
      if (updateError) {
        console.error('❌ Erro ao alterar senha:', updateError);
        setError(`Erro ao alterar senha: ${updateError.message}`);
      } else {
        console.log('✅ Senha alterada com sucesso!');
        setSuccess('✅ Senha alterada com sucesso! Você já pode fazer login com sua nova senha.');
        setNewPassword('');
        setConfirmPassword('');
        onSuccess?.();
      }
    } catch (err: any) {
      console.error('Erro na redefinição de senha:', err);
      setError(err.message || 'Ocorreu um erro inesperado');
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
            Redefinir Senha
          </DialogTitle>
          <p className="text-sm text-neutral-600 mt-2">
            Digite sua nova senha para concluir a recuperação
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-neutral-700 mb-1">
              Nova senha
            </label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showNewPassword ? 'text' : 'password'}
                placeholder="Digite sua nova senha"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full pr-10"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
              >
                {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-700 mb-1">
              Confirmar nova senha
            </label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirme sua nova senha"
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
            disabled={loading || !newPassword || !confirmPassword}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Alterando senha...
              </>
            ) : (
              'Alterar Senha'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}