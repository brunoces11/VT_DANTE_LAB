// Verificação REAL e DIRETA de email no banco Supabase
import { supabase } from './supabase';

// Função CORRETA para verificar se email já existe
export const checkEmailExists = async (email: string): Promise<{ exists: boolean; error?: string }> => {
  try {
    console.log('🔍 [checkEmailExists] Verificando email:', email);
    
    // Normalizar email
    const normalizedEmail = email.toLowerCase().trim();
    console.log('📧 [checkEmailExists] Email normalizado:', normalizedEmail);
    
    // MÉTODO CORRETO: Usar RPC function que consulta auth.users diretamente
    const { data, error } = await supabase.rpc('check_email_exists', {
      email_to_check: normalizedEmail
    });
    
    if (error) {
      console.error('❌ [checkEmailExists] Erro na consulta RPC:', error);
      return { exists: false, error: `Erro ao verificar email: ${error.message}` };
    }
    
    console.log('📊 [checkEmailExists] Resultado da consulta:', data);
    
    // data será true se email existe, false se não existe
    const emailExists = Boolean(data);
    
    console.log(`${emailExists ? '❌' : '✅'} [checkEmailExists] Email ${emailExists ? 'JÁ EXISTE' : 'DISPONÍVEL'}`);
    
    return { exists: emailExists };
    
  } catch (error) {
    console.error('❌ [checkEmailExists] Erro inesperado:', error);
    return { exists: false, error: 'Erro interno ao verificar email' };
  }
};

// Função para testar um email específico (para debug)
export const testSpecificEmail = async (email: string) => {
  console.log(`🧪 [testSpecificEmail] Testando email: ${email}`);
  const result = await checkEmailExists(email);
  console.log(`🧪 [testSpecificEmail] Resultado:`, result);
  return result;
};

// Função auxiliar para limpar sessões indesejadas (mantida para compatibilidade)
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