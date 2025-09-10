import { supabase } from './supabase';

// Verificar se email já existe no banco de dados usando consulta direta
export const checkEmailExists = async (email: string): Promise<{ exists: boolean; error?: string }> => {
  try {
    console.log('🔍 [checkEmailExists] Iniciando verificação para:', email);
    
    // Normalizar email
    const normalizedEmail = email.toLowerCase().trim();
    console.log('📧 [checkEmailExists] Email normalizado:', normalizedEmail);
    
    // Usar signUp com confirmação desabilitada para testar
    try {
      console.log('🧪 [checkEmailExists] Tentando signUp de teste...');
      const { data, error } = await supabase.auth.signUp({
        email: normalizedEmail,
        password: 'temp_password_for_check_' + Math.random(),
        options: {
          data: { temp_check: true }
        }
      });
      
      console.log('📊 [checkEmailExists] Resultado do signUp:', { 
        hasData: !!data, hasUser: !!data?.user, hasError: !!error, errorMessage: error?.message 
      });
      
      if (error) {
        // Se o erro indica que o usuário já existe
        if (error.message.includes('already registered') || 
            error.message.includes('already exists') ||
            error.message.includes('User already registered')) {
          console.log('❌ [checkEmailExists] Email JÁ EXISTE no banco');
          return { exists: true };
        }
        
        // Se o erro é sobre rate limit ou outros, assumir que não existe
        if (error.message.includes('rate limit') || 
            error.message.includes('too many requests')) {
          console.log('⚠️ [checkEmailExists] Rate limit - assumindo que não existe');
          return { exists: false };
        }
        
        // Para outros erros, assumir que não existe para permitir tentativa
        console.log('⚠️ [checkEmailExists] Erro desconhecido - assumindo que não existe:', error.message);
        return { exists: false };
      }
      
      // Se chegou aqui sem erro, o email não existia e foi "criado"
      // Precisamos fazer logout imediatamente para limpar a sessão temporária
      if (data.user) {
        console.log('🧹 [checkEmailExists] Limpando sessão temporária...');
        await supabase.auth.signOut();
      }
      
      console.log('✅ [checkEmailExists] Email DISPONÍVEL (não existe no banco)');
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

// Função auxiliar para limpar sessões temporárias
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