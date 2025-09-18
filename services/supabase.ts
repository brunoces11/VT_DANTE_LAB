import { supabase } from './supa_init';

// User Profile Functions
export const getProfile = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('tab_user')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (err) {
    console.error('Error in getProfile:', err);
    return { 
      data: null, 
      error: { message: 'Erro ao buscar perfil do usuário' } 
    };
  }
};

export const updateProfile = async (userId: string, updates: { avatar_url?: string; [key: string]: any }) => {
  try {
    const { data, error } = await supabase
      .from('tab_user')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating profile:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (err) {
    console.error('Error in updateProfile:', err);
    return { 
      data: null, 
      error: { message: 'Erro ao atualizar perfil do usuário' } 
    };
  }
};

export const createProfile = async (userId: string, profileData: { avatar_url?: string; [key: string]: any }) => {
  try {
    const { data, error } = await supabase
      .from('tab_user')
      .insert({ user_id: userId, ...profileData })
      .select()
      .single();

    if (error) {
      console.error('Error creating profile:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (err) {
    console.error('Error in createProfile:', err);
    return { 
      data: null, 
      error: { message: 'Erro ao criar perfil do usuário' } 
    };
  }
};

// Storage Functions
export const uploadAvatar = async (file: File, userId: string) => {
  try {
    // Validar tipo de arquivo
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return { 
        data: null, 
        error: { message: 'Tipo de arquivo não permitido. Use PNG, JPEG, JPG ou GIF.' } 
      };
    }

    // Validar tamanho do arquivo (4MB)
    const maxSize = 4 * 1024 * 1024; // 4MB em bytes
    if (file.size > maxSize) {
      return { 
        data: null, 
        error: { message: 'Arquivo muito grande. O tamanho máximo é 4MB.' } 
      };
    }

    // Gerar nome único para o arquivo
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${Date.now()}.${fileExt}`;

    // Upload do arquivo
    const { data, error } = await supabase.storage
      .from('user_avatar')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Error uploading avatar:', error);
      return { data: null, error };
    }

    // Obter URL pública
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
  } catch (err) {
    console.error('Error in uploadAvatar:', err);
    return { 
      data: null, 
      error: { message: 'Erro ao fazer upload do avatar' } 
    };
  }
};

export const deleteAvatar = async (filePath: string) => {
  try {
    const { error } = await supabase.storage
      .from('user_avatar')
      .remove([filePath]);

    if (error) {
      console.error('Error deleting avatar:', error);
      return { error };
    }

    return { error: null };
  } catch (err) {
    console.error('Error in deleteAvatar:', err);
    return { error: { message: 'Erro ao deletar avatar' } };
  }
};