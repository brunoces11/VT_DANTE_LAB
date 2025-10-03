import { supabase } from './supa_init';

/**
 * ✅ PADRÃO OFICIAL SUPABASE
 * 
 * Este arquivo contém funções que usam o SDK do Supabase diretamente.
 * NÃO manipula localStorage manualmente.
 * NÃO implementa cache ou timeouts customizados.
 * Deixa o SDK gerenciar tokens, sessões e renovações automaticamente.
 */

// ========================================
// FUNÇÕES DE AUTENTICAÇÃO
// ========================================

export const authService = {
  /**
   * Login com email e senha
   */
  async login(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  /**
   * Registro de novo usuário
   */
  async register(email: string, password: string, name: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name }
      }
    });
    return { data, error };
  },

  /**
   * Logout
   */
  async logout() {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  /**
   * Atualizar senha
   */
  async updatePassword(newPassword: string) {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword
    });
    return { data, error };
  },

  /**
   * Recuperar senha
   */
  async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    return { error };
  }
};

// ========================================
// FUNÇÕES DE PERFIL DO USUÁRIO
// ========================================

export const profileService = {
  /**
   * Obter perfil do usuário
   */
  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from('tab_user')
      .select('*')
      .eq('user_id', userId)
      .single();
    return { data, error };
  },

  /**
   * Criar perfil do usuário
   */
  async createProfile(userId: string, profileData: any = {}) {
    const { data, error } = await supabase
      .from('tab_user')
      .insert({ user_id: userId, ...profileData })
      .select()
      .single();
    return { data, error };
  },

  /**
   * Atualizar perfil do usuário
   */
  async updateProfile(userId: string, updates: any) {
    const { data, error } = await supabase
      .from('tab_user')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single();
    return { data, error };
  }
};

// ========================================
// FUNÇÕES DE CHAT
// ========================================

export const chatService = {
  /**
   * Carregar sessões de chat do usuário
   */
  async loadUserChatSessions(userId: string) {
    try {
      console.log('📊 Carregando sessões de chat...');
      
      const { data, error } = await supabase
        .from('tab_chat_session')
        .select(`
          chat_session_id,
          chat_session_title,
          created_at,
          updated_at
        `)
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });
      
      if (error) {
        console.error('❌ Erro ao carregar sessões:', error);
        return { data: null, error };
      }
      
      console.log(`✅ ${data?.length || 0} sessões carregadas`);
      return { data, error: null };
    } catch (error) {
      console.error('❌ Erro em loadUserChatSessions:', error);
      return { data: null, error };
    }
  },

  /**
   * Carregar mensagens de uma sessão
   */
  async loadChatMessages(sessionId: string) {
    try {
      console.log('💬 Carregando mensagens da sessão:', sessionId.slice(0, 6));
      
      const { data, error } = await supabase
        .from('tab_chat_msg')
        .select('*')
        .eq('chat_session_id', sessionId)
        .order('created_at', { ascending: true });
      
      if (error) {
        console.error('❌ Erro ao carregar mensagens:', error);
        return { data: null, error };
      }
      
      console.log(`✅ ${data?.length || 0} mensagens carregadas`);
      return { data, error: null };
    } catch (error) {
      console.error('❌ Erro em loadChatMessages:', error);
      return { data: null, error };
    }
  },

  /**
   * Salvar nova mensagem de chat
   */
  async saveChatMessage(params: {
    chat_session_id: string;
    chat_session_title: string;
    msg_input: string;
    msg_output: string;
    user_id: string;
  }) {
    try {
      const sessionId = params.chat_session_id.slice(0, 6);
      console.log(`💾 Salvando mensagem: ${sessionId}`);
      
      // 1. Criar/atualizar sessão
      const { error: sessionError } = await supabase
        .from('tab_chat_session')
        .upsert({
          chat_session_id: params.chat_session_id,
          user_id: params.user_id,
          chat_session_title: params.chat_session_title,
          updated_at: new Date().toISOString()
        });
      
      if (sessionError) {
        console.error('❌ Erro ao salvar sessão:', sessionError);
        return { success: false, error: sessionError };
      }
      
      // 2. Salvar mensagem
      const { error: messageError } = await supabase
        .from('tab_chat_msg')
        .insert({
          chat_session_id: params.chat_session_id,
          msg_input: params.msg_input,
          msg_output: params.msg_output
        });
      
      if (messageError) {
        console.error('❌ Erro ao salvar mensagem:', messageError);
        return { success: false, error: messageError };
      }
      
      console.log(`✅ ${sessionId} salva`);
      return { success: true, error: null };
    } catch (error) {
      console.error('❌ Erro em saveChatMessage:', error);
      return { success: false, error };
    }
  },

  /**
   * Renomear sessão de chat
   */
  async renameChat(sessionId: string, newTitle: string, userId: string) {
    try {
      const shortId = sessionId.slice(0, 6);
      console.log(`🏷️ Renomeando ${shortId}: "${newTitle.slice(0, 30)}..."`);
      
      const { error } = await supabase
        .from('tab_chat_session')
        .update({ 
          chat_session_title: newTitle,
          updated_at: new Date().toISOString()
        })
        .eq('chat_session_id', sessionId)
        .eq('user_id', userId);
      
      if (error) {
        console.error('❌ Erro ao renomear:', error);
        return { success: false, error };
      }
      
      console.log(`✅ ${shortId} renomeado`);
      return { success: true, error: null };
    } catch (error) {
      console.error('❌ Erro em renameChat:', error);
      return { success: false, error };
    }
  },

  /**
   * Deletar sessão de chat
   */
  async deleteChat(sessionId: string, userId: string) {
    try {
      const shortId = sessionId.slice(0, 6);
      console.log(`🗑️ Deletando ${shortId}`);
      
      // Deletar mensagens primeiro (cascade pode não estar configurado)
      await supabase
        .from('tab_chat_msg')
        .delete()
        .eq('chat_session_id', sessionId);
      
      // Deletar sessão
      const { error } = await supabase
        .from('tab_chat_session')
        .delete()
        .eq('chat_session_id', sessionId)
        .eq('user_id', userId);
      
      if (error) {
        console.error('❌ Erro ao deletar:', error);
        return { success: false, error };
      }
      
      console.log(`✅ ${shortId} deletado`);
      return { success: true, error: null };
    } catch (error) {
      console.error('❌ Erro em deleteChat:', error);
      return { success: false, error };
    }
  }
};

// ========================================
// FUNÇÕES DE STORAGE (AVATAR)
// ========================================

export const storageService = {
  /**
   * Upload de avatar do usuário
   */
  async uploadAvatar(file: File, userId: string) {
    // Validações
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return { data: null, error: { message: 'Tipo de arquivo não permitido' } };
    }

    const maxSize = 4 * 1024 * 1024; // 4MB
    if (file.size > maxSize) {
      return { data: null, error: { message: 'Arquivo muito grande (máx 4MB)' } };
    }

    // Upload
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('user_avatar')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) return { data: null, error };

    // URL pública
    const { data: publicUrlData } = supabase.storage
      .from('user_avatar')
      .getPublicUrl(fileName);

    return { 
      data: { 
        path: data.path, 
        publicUrl: publicUrlData.publicUrl 
      }, 
      error: null 
    };
  }
};

// ========================================
// FUNÇÕES LEGADAS (COMPATIBILIDADE)
// ========================================

/**
 * @deprecated Use chatService.saveChatMessage() instead
 * Mantido para compatibilidade com código existente
 */
export async function fun_save_chat_data(params: {
  chat_session_id: string;
  chat_session_title: string;
  msg_input: string;
  msg_output: string;
  user_id: string;
}) {
  return await chatService.saveChatMessage(params);
}

/**
 * @deprecated Use chatService.renameChat() instead
 * Mantido para compatibilidade com código existente
 */
export async function fun_renomear_chat(params: {
  chat_session_id: string;
  new_title: string;
  user_id: string;
}) {
  return await chatService.renameChat(
    params.chat_session_id,
    params.new_title,
    params.user_id
  );
}
