// Verificação REAL e DIRETA de email no banco Supabase
import { supabase } from './supabase';

// Função para verificar se email já existe - ABORDAGEM CORRETA
export const checkEmailExists = async (email: string): Promise<{ exists: boolean; error?: string }> => {
  try {
    console.log('🔍 [checkEmailExists] Iniciando verificação para:', email);
    
    // Normalizar email
    const normalizedEmail = email.toLowerCase().trim();
    console.log('📧 [checkEmailExists] Email normalizado:', normalizedEmail);
    
    // MÉTODO CORRETO: Usar signUp para detectar se email já existe
    // Se email já existe, Supabase retornará erro específico
    // Se email não existe, tentará criar usuário (que cancelaremos)
    try {
      console.log('🎯 [checkEmailExists] Tentando signUp para verificação...');
      
      const { data, error } = await supabase.auth.signUp({
        email: normalizedEmail,
        password: 'temp_verification_password_' + Date.now(),
        options: {
          data: {
            verification_check: true,
            temp_user: true
          }
        }
      });
      
      if (error) {
        console.log('📋 [checkEmailExists] Erro do signUp:', error.message);
        
        // Verificar se é erro de email já existente
        if (error.message.includes('already') || 
            error.message.includes('registered') ||
            error.message.includes('exists') ||
            error.message.includes('duplicate') ||
            error.message.includes('User already registered')) {
          console.log('❌ [checkEmailExists] Email JÁ EXISTE no banco');
          return { exists: true };
        }
        
        // Para outros erros, assumir que email não existe
        console.log('⚠️ [checkEmailExists] Erro diferente - assumindo email disponível');
        return { exists: false };
      }
      
      // Se chegou aqui, signUp foi bem-sucedido (email não existia)
      console.log('✅ [checkEmailExists] SignUp bem-sucedido - email DISPONÍVEL');
      
      // IMPORTANTE: Fazer logout imediatamente para não manter sessão temporária
      if (data.user) {
        console.log('🧹 [checkEmailExists] Fazendo logout da sessão temporária...');
        await supabase.auth.signOut();
      }
      
      return { exists: false };
      
    } catch (signUpError) {
      console.error('❌ [checkEmailExists] Erro no signUp:', signUpError);
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
    if (session?.user?.user_metadata?.verification_check || 
        session?.user?.user_metadata?.temp_user) {
      console.log('🧹 Removendo sessão temporária de verificação...');
      await supabase.auth.signOut();
    }
  } catch (error) {
    console.log('⚠️ Erro ao limpar sessão temporária:', error);
  }
};