import { supabase } from './supabase';

// Verificar se email já existe no sistema
export const checkEmailExists = async (email: string): Promise<{ exists: boolean; error?: string }> => {
  try {
    // Normalizar email
    const normalizedEmail = email.toLowerCase().trim();
    
    // Consultar a tabela auth.users através do Supabase Admin
    // Como não temos acesso direto à tabela auth.users, vamos usar o método signUp
    // com um password temporário para verificar se o email já existe
    const { data, error } = await supabase.auth.signUp({
      email: normalizedEmail,
      password: 'temp_password_for_check_' + Math.random(),
      options: {
        data: {
          temp_check: true
        }
      }
    });
    
    if (error) {
      // Se o erro for "User already registered", significa que o email existe
      if (error.message.includes('already registered') || 
          error.message.includes('already exists') ||
          error.message.includes('User already registered')) {
        return { exists: true };
      }
      
      // Outros erros (rate limit, etc.)
      return { exists: false, error: error.message };
    }
    
    // Se chegou aqui, o email não existe (mas criamos um usuário temporário)
    // Vamos tentar fazer logout para limpar a sessão temporária
    if (data.user) {
      await supabase.auth.signOut();
    }
    
    return { exists: false };
    
  } catch (error) {
    console.error('Erro ao verificar email:', error);
    return { exists: false, error: 'Erro interno ao verificar email' };
  }
};

// Método alternativo usando RPC (se configurado no Supabase)
export const checkEmailExistsRPC = async (email: string): Promise<{ exists: boolean; error?: string }> => {
  try {
    const normalizedEmail = email.toLowerCase().trim();
    
    // Tentar usar uma função RPC personalizada (se existir)
    const { data, error } = await supabase.rpc('check_email_exists', {
      email_to_check: normalizedEmail
    });
    
    if (error) {
      // Se a função RPC não existir, usar método alternativo
      return await checkEmailExists(email);
    }
    
    return { exists: data || false };
    
  } catch (error) {
    // Fallback para método principal
    return await checkEmailExists(email);
  }
};