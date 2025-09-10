// Verificação REAL e DIRETA de email no banco Supabase
import { supabase } from './supabase';

// Função para verificar se email já existe - ABORDAGEM CORRETA
export const checkEmailExists = async (email: string): Promise<{ exists: boolean; error?: string }> => {
  try {
    console.log('🔍 [checkEmailExists] Iniciando verificação DIRETA para:', email);
    
    // Normalizar email
    const normalizedEmail = email.toLowerCase().trim();
    console.log('📧 [checkEmailExists] Email normalizado:', normalizedEmail);
    
    // MÉTODO: Usar signInWithPassword para verificar existência (SEM criar usuário)
    try {
      console.log('🎯 [checkEmailExists] Usando signInWithPassword para verificação...');
      
      // Tentar login com senha inválida - se email existe, erro será "Invalid login credentials"
      // Se email não existe, erro será diferente
      const { error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password: 'invalid_password_for_check_' + Math.random()
      });
      
      if (error) {
        // Se erro é "Invalid login credentials", email EXISTE mas senha está errada
        if (error.message.includes('Invalid login credentials') || 
            error.message.includes('Invalid email or password')) {
          console.log('✅ [checkEmailExists] Email EXISTE (credenciais inválidas - comportamento esperado)');
          return { exists: true };
        }
        
        // Se erro é sobre email não encontrado, email NÃO EXISTE
        if (error.message.includes('User not found') ||
            error.message.includes('Email not confirmed') ||
            error.message.includes('No user found')) {
          console.log('✅ [checkEmailExists] Email DISPONÍVEL (usuário não encontrado)');
          return { exists: false };
        }
        
        // Para outros erros, assumir que não existe (evitar falsos positivos)
        console.log('⚠️ [checkEmailExists] Erro desconhecido - assumindo disponível:', error.message);
        return { exists: false };
      }
      
      // Se chegou aqui sem erro, algo está errado (não deveria fazer login com senha inválida)
      console.log('⚠️ [checkEmailExists] Login inesperado - fazendo logout...');
      await supabase.auth.signOut();
      return { exists: true };
      
    } catch (signInError) {
      console.error('❌ [checkEmailExists] Erro no signIn:', signInError);
      return { exists: false, error: 'Erro interno ao verificar email' };
    }
    
  } catch (error) {
    console.error('❌ [checkEmailExists] Erro geral:', error);
    return { exists: false, error: 'Erro interno ao verificar email' };
  }
};

// Função auxiliar para limpar sessões indesejadas
export const cleanupTempSession = async () => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user?.user_metadata?.temp_check) {
      console.log('🧹 Removendo sessão temporária de verificação...');
      await supabase.auth.signOut();
    }
  } catch (error) {
    console.log('⚠️ Erro ao limpar sessão temporária:', error);
  }
};