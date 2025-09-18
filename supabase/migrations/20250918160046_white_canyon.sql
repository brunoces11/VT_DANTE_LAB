/*
  # Sistema de Perfis de Usuário e Upload de Avatar

  1. Novas Tabelas
    - `tab_user`
      - `user_id` (uuid, primary key, foreign key para auth.users)
      - `avatar_url` (text, nullable)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Storage
    - Bucket `user_avatar` para armazenar avatars dos usuários
    - Políticas de acesso para usuários autenticados

  3. Segurança
    - Enable RLS na tabela `tab_user`
    - Políticas para usuários gerenciarem apenas seus próprios dados
    - Políticas de storage para upload/acesso de avatars
*/

-- Criar tabela de perfis de usuário
CREATE TABLE IF NOT EXISTS tab_user (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Habilitar RLS na tabela
ALTER TABLE tab_user ENABLE ROW LEVEL SECURITY;

-- Política para usuários lerem apenas seu próprio perfil
CREATE POLICY "Users can read own profile"
  ON tab_user
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Política para usuários criarem seu próprio perfil
CREATE POLICY "Users can create own profile"
  ON tab_user
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Política para usuários atualizarem apenas seu próprio perfil
CREATE POLICY "Users can update own profile"
  ON tab_user
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para atualizar updated_at na tabela tab_user
CREATE TRIGGER update_tab_user_updated_at
  BEFORE UPDATE ON tab_user
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Criar bucket para avatars (se não existir)
INSERT INTO storage.buckets (id, name, public)
VALUES ('user_avatar', 'user_avatar', true)
ON CONFLICT (id) DO NOTHING;

-- Política para usuários fazerem upload de seus próprios avatars
CREATE POLICY "Users can upload own avatar"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'user_avatar' 
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Política para usuários atualizarem seus próprios avatars
CREATE POLICY "Users can update own avatar"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'user_avatar' 
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Política para usuários deletarem seus próprios avatars
CREATE POLICY "Users can delete own avatar"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'user_avatar' 
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Política para acesso público de leitura aos avatars (para exibição)
CREATE POLICY "Public can view avatars"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'user_avatar');