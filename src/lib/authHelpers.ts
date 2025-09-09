import { supabase } from './supabase';

// Verificar se email já existe no sistema usando método mais direto
export const checkEmailExists = async (email: string): Promise<{ exists: boolean; error?: string }> => {
  try {
    console.log('🔍 Verificando se email existe:', email);
    
    // Normalizar email
    const normalizedEmail = email.toLowerCase().trim();
    
    // Tentar fazer login com senha inválida para verificar se o email existe
    const { data, error } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password: 'senha_temporaria_para_verificacao_' + Math.random()
    });
    
    console.log('📊 Resultado da verificação:', { data, error });
    
    if (error) {
      // Se o erro for "Invalid login credentials", o email existe mas a senha está errada
      if (error.message.includes('Invalid login credentials') || 
          error.message.includes('invalid_credentials')) {
        console.log('✅ Email existe (credenciais inválidas)');
        return { exists: true };
      }
      
      // Se o erro for sobre email não confirmado, o email existe
      if (error.message.includes('Email not confirmed') ||
          error.message.includes('not confirmed')) {
        console.log('✅ Email existe (não confirmado)');
        return { exists: true };
      }
      
      // Se o erro for sobre usuário não encontrado, o email não existe
      if (error.message.includes('User not found') ||
          error.message.includes('not found')) {
        console.log('❌ Email não existe');
        return { exists: false };
      }
      
      // Para outros erros, assumir que não existe para permitir cadastro
      console.log('⚠️ Erro desconhecido, assumindo que email não existe:', error.message);
      return { exists: false };
    }
    
    // Se chegou aqui sem erro, significa que o login foi bem-sucedido (improvável com senha aleatória)
    // Fazer logout imediatamente
    if (data.user) {
      await supabase.auth.signOut();
      console.log('✅ Email existe (login bem-sucedido)');
      return { exists: true };
    }
    
    return { exists: false };
    
  } catch (error) {
    console.error('❌ Erro ao verificar email:', error);
    return { exists: false, error: 'Erro interno ao verificar email' };
  }
};