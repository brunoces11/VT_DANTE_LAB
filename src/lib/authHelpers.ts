// Verificação REAL e DIRETA de email no banco Supabase
import { supabase } from './supabase';

// Função para verificar se email já existe - ABORDAGEM CORRETA
export const checkEmailExists = async (email: string): Promise<{ exists: boolean; error?: string }> => {
  try {
    console.log('🔍 [checkEmailExists] Iniciando verificação DIRETA para:', email);
    
    // Normalizar email
    const normalizedEmail = email.toLowerCase().trim();
    console.log('📧 [checkEmailExists] Email normalizado:', normalizedEmail);
    
    // MÉTODO 1: Tentar consulta direta na tabela auth.users (se RLS permitir)
    try {
      console.log('🎯 [checkEmailExists] Tentando consulta DIRETA na tabela auth.users...');
      
      const { data, error, count } = await supabase
        .from('auth.users')
        .select('email', { count: 'exact', head: true })
        .eq('email', normalizedEmail)
        .limit(1);
      
      if (!error) {
        const exists = (count || 0) > 0;
        console.log(`✅ [checkEmailExists] Consulta direta SUCESSO - Email ${exists ? 'EXISTE' : 'DISPONÍVEL'}`);
        return { exists };
      } else {
        console.log('⚠️ [checkEmailExists] Consulta direta falhou (RLS?), tentando método alternativo:', error.message);
      }
    } catch (directQueryError) {
      console.log('⚠️ [checkEmailExists] Erro na consulta direta:', directQueryError);
    }
    
    // MÉTODO 2: Usar RPC function (se existir)
    try {
      console.log('🎯 [checkEmailExists] Tentando RPC function...');
      
      const { data, error } = await supabase.rpc('check_user_email_exists', {
        email_to_check: normalizedEmail
      });
      
      if (!error) {
        console.log(`✅ [checkEmailExists] RPC SUCESSO - Email ${data ? 'EXISTE' : 'DISPONÍVEL'}`);
        return { exists: !!data };
      } else {
        console.log('⚠️ [checkEmailExists] RPC falhou, tentando método de fallback:', error.message);
      }
    } catch (rpcError) {
      console.log('⚠️ [checkEmailExists] Erro no RPC:', rpcError);
    }
    
    // MÉTODO 3: Fallback usando signInWithPassword (SEM criar usuário)
    try {
      console.log('🎯 [checkEmailExists] Usando fallback com signInWithPassword...');
      
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
          console.log('✅ [checkEmailExists] Fallback - Email EXISTE (credenciais inválidas)');
          return { exists: true };
        }
        
        // Se erro é sobre email não encontrado, email NÃO EXISTE
        if (error.message.includes('User not found') ||
            error.message.includes('Email not confirmed') ||
            error.message.includes('No user found')) {
          console.log('✅ [checkEmailExists] Fallback - Email DISPONÍVEL (usuário não encontrado)');
          return { exists: false };
        }
        
        // Para outros erros, assumir que não existe (evitar falsos positivos)
        console.log('⚠️ [checkEmailExists] Erro desconhecido no fallback - assumindo disponível:', error.message);
        return { exists: false };
      }
      
      // Se chegou aqui sem erro, algo está errado (não deveria fazer login com senha inválida)
      console.log('⚠️ [checkEmailExists] Login inesperado com senha inválida - fazendo logout...');
      await supabase.auth.signOut();
      return { exists: true };
      
    } catch (fallbackError) {
      console.error('❌ [checkEmailExists] Erro no fallback:', fallbackError);
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