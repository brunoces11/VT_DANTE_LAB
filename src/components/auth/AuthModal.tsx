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
import { validateEmail, normalizeEmail } from '@/lib/emailValidation';
import { checkEmailExists } from '@/lib/authHelpers';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

type ModalMode = 'login' | 'register' | 'forgot-password';
export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<ModalMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [emailValidation, setEmailValidation] = useState<{ isValid: boolean; error?: string }>({ isValid: false });
  const [emailExists, setEmailExists] = useState(false);

  const { login, register, resetPassword } = useAuth();

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setName('');
    setError('');
    setSuccess('');
    setLoading(false);
    setCheckingEmail(false);
    setEmailValidation({ isValid: false });
    setEmailExists(false);
  };

  const handleClose = () => {
    resetForm();
    setMode('login');
    onClose();
  };

  // Validar email em tempo real
  const handleEmailChange = (value: string) => {
    setEmail(value);
    setError(''); // Limpar erro anterior
    setEmailExists(false); // Reset do status de email existente
    
    if (value) {
      const validation = validateEmail(value);
      setEmailValidation(validation);
      console.log('📧 Validação de email:', validation);
    } else {
      setEmailValidation({ isValid: false });
    }
  };

  // Verificar se email já existe (para cadastro)
  const handleEmailBlur = async () => {
    console.log('🔍 handleEmailBlur chamado:', { mode, email, isValid: emailValidation.isValid });
    
    if (mode === 'register' && email && emailValidation.isValid && !checkingEmail) {
      setCheckingEmail(true);
      setError('');
      setEmailExists(false);
      
      const normalizedEmail = normalizeEmail(email);
      console.log('🔍 Verificando email normalizado:', normalizedEmail);
      
      const { exists, error: checkError } = await checkEmailExists(normalizedEmail);
      
      console.log('📊 Resultado da verificação:', { exists, checkError });
      
      if (checkError) {
        setError(`Erro ao verificar email: ${checkError}`);
      } else if (exists) {
        setEmailExists(true);
        setError('❌ Este email já está cadastrado. Tente fazer login ou use "Esqueci minha senha".');
      } else {
        setEmailExists(false);
        console.log('✅ Email disponível para cadastro');
      }
      
      setCheckingEmail(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    // Validar email antes de prosseguir
    const emailValidationResult = validateEmail(email);
    console.log('📧 Validação final do email:', emailValidationResult);
    
    if (!emailValidationResult.isValid) {
      setError(emailValidationResult.error || 'Email inválido');
      return;
    }
    
    setLoading(true);

    try {
      if (mode === 'login') {
        const normalizedEmail = normalizeEmail(email);
        const { error } = await login(normalizedEmail, password);
        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            setError('Email ou senha incorretos. Verifique suas credenciais.');
          } else {
            setError(error.message);
          }
        } else {
          setSuccess('Login realizado com sucesso!');
          setTimeout(() => {
            handleClose();
            onSuccess?.();
          }, 1000);
        }
      } else if (mode === 'register') {
        // Verificar se email existe antes de prosseguir
        if (emailExists) {
          setError('❌ Este email já está cadastrado. Tente fazer login.');
          setLoading(false);
          return;
        }
        
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

        // Verificar novamente se email já existe antes do cadastro (dupla verificação)
        const normalizedEmail = normalizeEmail(email);
        console.log('🔍 Verificação final antes do cadastro:', normalizedEmail);
        
        const { exists, error: checkError } = await checkEmailExists(normalizedEmail);
        
        if (checkError) {
          setError(`❌ Erro ao verificar email: ${checkError}`);
          setLoading(false);
          return;
        }
        
        if (exists) {
          setError('❌ Este email já está cadastrado. Tente fazer login ou use "Esqueci minha senha".');
          setLoading(false);
          return;
        }

        console.log('✅ Prosseguindo com o cadastro...');
        const { error } = await register(normalizedEmail, password, name);
        if (error) {
          if (error.message.includes('already registered')) {
            setError('❌ Este email já está cadastrado. Tente fazer login.');
          } else {
            setError(`❌ Erro no cadastro: ${error.message}`);
          }
        } else {
          setSuccess('✅ Cadastro realizado! Verifique seu email para confirmar a conta.');
          setTimeout(() => {
            setMode('login');
            resetForm();
          }, 2000);
        }
      } else if (mode === 'forgot-password') {
        const emailValidationResult = validateEmail(email);
        if (!emailValidationResult.isValid) {
          setError(emailValidationResult.error || 'Email inválido');
          setLoading(false);
          return;
        }
        
        const normalizedEmail = normalizeEmail(email);
        const { error } = await resetPassword(normalizedEmail);
        if (error) {
          setError(error.message);
        } else {
          setSuccess('✅ Email de recuperação enviado! Verifique sua caixa de entrada.');
          setTimeout(() => {
            setMode('login');
            resetForm();
          }, 3000);
        }
      }
    } catch (err) {
      setError(`❌ Ocorreu um erro inesperado: ${err}`);
      console.error('❌ Erro inesperado:', err);
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (newMode: ModalMode) => {
    setMode(newMode);
    resetForm();
  };

  const getTitle = () => {
    switch (mode) {
      case 'login':
        return 'Entrar no Dante AI';
      case 'register':
        return 'Criar conta no Dante AI';
      case 'forgot-password':
        return 'Recuperar senha';
      default:
        return 'Dante AI';
    }
  };

  const getSubtitle = () => {
    switch (mode) {
      case 'login':
        return 'Entre com seu email e senha para acessar o chat';
      case 'register':
        return 'Crie sua conta para começar a usar o Dante AI';
      case 'forgot-password':
        return 'Digite seu email para receber o link de recuperação';
      default:
        return '';
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
            {getTitle()}
          </DialogTitle>
          <p className="text-sm text-neutral-600 mt-2">
            {getSubtitle()}
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          {mode === 'register' && (
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
                required={mode === 'register'}
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
              onChange={(e) => handleEmailChange(e.target.value)}
              onBlur={handleEmailBlur}
              required
              className={`w-full ${!emailValidation.isValid && email ? 'border-red-300 focus:border-red-500' : emailExists ? 'border-red-300 focus:border-red-500' : ''}`}
            />
            {!emailValidation.isValid && email && (
              <p className="text-sm text-red-600 mt-1">{emailValidation.error}</p>
            )}
            {emailExists && (
              <p className="text-sm text-red-600 mt-1">❌ Este email já está cadastrado</p>
            )}
            {checkingEmail && (
              <p className="text-sm text-blue-600 mt-1 flex items-center">
                <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                🔍 Verificando se email já existe...
              </p>
            )}
          </div>

          {mode !== 'forgot-password' && (
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

          {mode === 'register' && (
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
                  required={mode === 'register'}
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

          {mode === 'login' && (
            <div className="text-right">
              <button
                type="button"
                onClick={() => switchMode('forgot-password')}
                className="text-sm text-orange-600 hover:text-orange-700 font-medium"
              >
                Esqueci minha senha
              </button>
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
            disabled={loading || checkingEmail || !emailValidation.isValid || (mode === 'register' && emailExists)}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {mode === 'login' ? 'Entrando...' : mode === 'register' ? 'Criando conta...' : 'Enviando...'}
              </>
            ) : (
              mode === 'login' ? 'Entrar' : mode === 'register' ? 'Criar conta' : 'Enviar link de recuperação'
            )}
          </Button>

          {mode !== 'forgot-password' && (
            <div className="text-center">
            <button
              type="button"
              onClick={() => switchMode(mode === 'login' ? 'register' : 'login')}
              className="text-sm text-orange-600 hover:text-orange-700 font-medium"
            >
              {mode === 'login'
                ? 'Não tem uma conta? Cadastre-se' 
                : 'Já tem uma conta? Entrar'
              }
            </button>
          </div>
          )}

          {mode === 'forgot-password' && (
            <div className="text-center">
              <button
                type="button"
                onClick={() => switchMode('login')}
                className="text-sm text-orange-600 hover:text-orange-700 font-medium"
              >
                Voltar para o login
              </button>
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}