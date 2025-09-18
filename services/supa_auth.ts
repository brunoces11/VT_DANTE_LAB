import { supabase } from './supa_init';

export const login = async (email: string, password: string) => {
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  } catch (err) {
    return { 
      error: { 
        message: 'Erro de conexão: Verifique se o Supabase está configurado corretamente. Consulte o console para mais detalhes.' 
      } 
    };
  }
};

export const logout = async () => {
  await supabase.auth.signOut();
};

export const register = async (email: string, password: string, name: string) => {
  try {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name,
        },
      },
    });
    return { error };
  } catch (err) {
    return { 
      error: { 
        message: 'Erro de conexão: Verifique se o Supabase está configurado corretamente. Consulte o console para mais detalhes.' 
      } 
    };
  }
};

export const updateUserPassword = async (newPassword: string) => {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });
    
    return { error };
  } catch (err) {
    return { 
      error: { 
        message: 'Erro ao atualizar senha' 
      } 
    };
  }
};