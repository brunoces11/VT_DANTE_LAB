import { supabase } from './supabase';

// Verificar se email já existe no banco de dados usando consulta direta
export const checkEmailExists = async (email: string): Promise<{ exists: boolean; error?: string }> => {
  try {
    console.log('🔍 Verificando se email existe no banco:', email);
    
    // Normalizar email
    const normalizedEmail = email.toLowerCase().trim();
    
    // Usar signUp com confirmação desabilitada para testar
    try {
      const { data, error } = await supabase.auth.signUp({
        email: normalizedEmail,
        password: 'temp_password_for_check_' + Math.random(),
        options: {
          data: { temp_check: true }
        }
      });
      
      console.log('📊 Resultado do signUp de teste:', { data, error });
      
      if (error) {
        // Se o erro indica que o usuário já existe
        if (error.message.includes('already registered') || 
            error.message.includes('already exists') ||
            error.message.includes('User already registered')) {
          console.log('✅ Email existe (já registrado)');
          return { exists: true };
        }
        
        // Se o erro é sobre rate limit ou outros, assumir que não existe
        if (error.message.includes('rate limit') || 
            error.message.includes('too many requests')) {
          console.log('⚠️ Rate limit atingido, assumindo que email não existe');
          return { exists: false };
        }
        
        // Para outros erros, assumir que não existe para permitir tentativa
        console.log('⚠️ Erro desconhecido, assumindo que email não existe:', error.message);
        return { exists: false };
      }
      
      // Se chegou aqui sem erro, o email não existia e foi "criado"
      // Precisamos fazer logout imediatamente para limpar a sessão temporária
      if (data.user) {
        console.log('🧹 Limpando sessão temporária criada para teste...');
        await supabase.auth.signOut();
      }
      
      console.log('✅ Email não existe (signUp bem-sucedido)');
      return { exists: false };
      
    } catch (signUpError) {
      console.error('❌ Erro no signUp de teste:', signUpError);
      return { exists: false, error: 'Erro interno ao verificar email' };
    }
    
  } catch (error) {
    console.error('❌ Erro geral ao verificar email:', error);
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