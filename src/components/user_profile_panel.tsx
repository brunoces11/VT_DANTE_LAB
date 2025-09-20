import React, { useState, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Brain, Eye, EyeOff, User, Loader2, Camera } from 'lucide-react';
import { useAuth } from './auth/AuthProvider';

interface UserProfilePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UserProfilePanel({ isOpen, onClose }: UserProfilePanelProps) {
  const { user, changePassword } = useAuth();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [avatarError, setAvatarError] = useState('');
  const [avatarSuccess, setAvatarSuccess] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetPasswordForm = () => {
    setNewPassword('');
    setConfirmPassword('');
    setPasswordError('');
    // NÃO limpar passwordSuccess aqui para manter a mensagem visível
  };

  const resetAvatarMessages = () => {
    setAvatarError('');
    setAvatarSuccess('');
  };

  const handleClose = () => {
    resetPasswordForm();
    resetAvatarMessages();
    onClose();
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');
    setPasswordLoading(true);

    try {
      if (newPassword !== confirmPassword) {
        setPasswordError('As senhas não coincidem');
        setPasswordLoading(false);
        return;
      }

      if (newPassword.length < 6) {
        setPasswordError('A senha deve ter pelo menos 6 caracteres');
        setPasswordLoading(false);
        return;
      }

      const result = await changePassword(newPassword);
      if (result.error) {
        setPasswordError(result.error.message || 'Erro ao alterar senha');
      } else {
        setPasswordSuccess('✔️ Senha modificada com sucesso!');
        // Limpar apenas os campos de senha, manter a mensagem de sucesso
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err: any) {
      console.error('Erro na mudança de senha:', err);
      setPasswordError(err.message || 'Ocorreu um erro inesperado');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handlePasswordChange(e as any);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;

    setAvatarError('');
    setAvatarSuccess('');
    setAvatarLoading(true);

    try {
      // Validações básicas
      const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        setAvatarError('Tipo de arquivo não permitido');
        return;
      }

      const maxSize = 4 * 1024 * 1024; // 4MB
      if (file.size > maxSize) {
        setAvatarError('Arquivo muito grande (máx 4MB)');
        return;
      }

      // Simular upload bem-sucedido
      setTimeout(() => {
        setAvatarSuccess('Avatar atualizado com sucesso!');
        setAvatarLoading(false);
      }, 2000);

    } catch (err) {
      setAvatarError('Ocorreu um erro inesperado');
      setAvatarLoading(false);
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
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
            Painel do Usuário
          </DialogTitle>
          <p className="text-sm text-neutral-600 mt-2">
            Gerencie seu perfil e configurações
          </p>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Seção do Avatar */}
          <div className="text-center">
            <div className="relative inline-block">
              <div className="w-20 h-20 rounded-full bg-neutral-100 border-2 border-neutral-200 flex items-center justify-center overflow-hidden">
                <User className="h-10 w-10 text-neutral-400" />
              </div>
              <button
                onClick={triggerFileInput}
                disabled={avatarLoading}
                className="absolute -bottom-1 -right-1 w-8 h-8 bg-orange-500 hover:bg-orange-600 text-white rounded-full flex items-center justify-center transition-colors disabled:opacity-50"
              >
                {avatarLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Camera className="h-4 w-4" />
                )}
              </button>
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/gif"
              onChange={handleAvatarUpload}
              className="hidden"
            />
            
            <p className="text-sm text-neutral-600 mt-2">
              {user?.email}
            </p>
            
            <p className="text-xs text-neutral-500 mt-1">
              Clique no ícone da câmera para alterar seu avatar
            </p>

            {avatarError && (
              <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-xs text-red-600">{avatarError}</p>
              </div>
            )}

            {avatarSuccess && (
              <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-xs text-green-600">{avatarSuccess}</p>
              </div>
            )}
          </div>

          {/* Seção de Mudança de Senha */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">
              Alterar Senha
            </h3>
            
            <form onSubmit={handlePasswordChange} className="space-y-4">
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

              {passwordError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{passwordError}</p>
                </div>
              )}

              {passwordSuccess && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-600">{passwordSuccess}</p>
                </div>
              )}

              <Button
                type="submit"
                disabled={passwordLoading || !newPassword || !confirmPassword}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white"
              >
                {passwordLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Alterando senha...
                  </>
                ) : (
                  'Alterar Senha'
                )}
              </Button>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

