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

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [isResetPassword, setIsResetPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { login, register, resetPassword } = useAuth();

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setName('');
    setError('');
    setSuccess('');
    setLoading(false);
  };

  const handleClose = () => {
    resetForm();
    setIsLogin(true); // Reset to login mode when closing
    setIsResetPassword(false);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (isResetPassword) {
        const { error } = await resetPassword(email);
        if (error) {
          setError(error.message);
        } else {
          setSuccess('E-mail de recuperação enviado! Verifique sua caixa de entrada e clique no link para redefinir sua senha.');
          // NÃO limpar o formulário nem fechar o modal - mensagem deve persistir
        }
      } else if (isLogin) {
        const { error } = await login(email, password);
        if (error) {
          setError(error.message);
        } else {
          setSuccess('Login realizado com sucesso!');
          setTimeout(() => {
            handleClose();
            onSuccess?.();
          }, 1000);
        }
      } else {
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

        const { error } = await register(email, password, name);
        if (error) {
          setError(error.message);
        } else {
          setSuccess('✅ Cadastro realizado com sucesso! Verifique sua caixa de entrada e clique no link de confirmação para ativar sua conta.');
          // NÃO usar setTimeout - mensagem deve persistir até o usuário fechar o modal
        }
      }
    } catch (err) {
      setError('Ocorreu um erro inesperado');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    if (isResetPassword) {
      setIsResetPassword(false);
      setIsLogin(true);
    } else {
      setIsLogin(!isLogin);
    }
    resetForm();
  };

  const handleResetPasswordClick = () => {
    setIsResetPassword(true);
    setIsLogin(false);
    resetForm();
  };

  const getTitle = () => {
    if (isResetPassword) return 'Recuperar Senha';
    return isLogin ? 'Entrar no Dante AI' : 'Criar conta no Dante AI';
  };

  const getDescription = () => {
    if (isResetPassword) return 'Digite seu e-mail para receber o link de recuperação';
    return isLogin 
      ? 'Entre com seu email e senha para acessar o chat'
      : 'Crie sua conta para começar a usar o Dante AI';
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
            {getTitle()}
          </DialogTitle>
          <p className="text-sm text-neutral-600 mt-2">
            {getDescription()}
          </p>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          {!isLogin && !isResetPassword && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-1">
                Nome completo
              </label>
              <Input
                id="name"
                type="text"
                placeholder="Seu nome completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={!isLogin && !isResetPassword}
                className="w-full"
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full"
            />
          </div>

          {!isResetPassword && (
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-1">
                Senha
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Sua senha"
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
          )}

          {!isLogin && !isResetPassword && (
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-700 mb-1">
                Confirmar senha
              </label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirme sua senha"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required={!isLogin && !isResetPassword}
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
          )}

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
                {isResetPassword ? 'Enviando...' : isLogin ? 'Entrando...' : 'Criando conta...'}
              </>
            ) : (
              isResetPassword ? 'Enviar e-mail' : isLogin ? 'Entrar' : 'Criar conta'
            )}
          </Button>

          <div className="text-center">
            {isResetPassword ? (
              <button
                type="button"
                onClick={toggleMode}
                className="text-sm text-orange-600 hover:text-orange-700 font-medium"
              >
                Voltar para o login
              </button>
            ) : (
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={toggleMode}
                  className="text-sm text-orange-600 hover:text-orange-700 font-medium block w-full"
                >
                  {isLogin 
                    ? 'Não tem uma conta? Cadastre-se' 
                    : 'Já tem uma conta? Entrar'
                  }
                </button>
                {isLogin && (
                  <button
                    type="button"
                    onClick={handleResetPasswordClick}
                    className="text-sm text-neutral-600 hover:text-neutral-700 font-medium"
                  >
                    Esqueci minha senha
                  </button>
                )}
              </div>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}