/*
  # Corrigir políticas de storage para upload de avatar

  1. Remover políticas existentes que podem estar causando conflito
  2. Recriar políticas mais simples e funcionais
  3. Garantir que o bucket seja público para visualização
*/

-- Remover políticas existentes do storage que podem estar causando conflito
DROP POLICY IF EXISTS "Users can upload own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Public can view avatars" ON storage.objects;

-- Recriar políticas mais simples
CREATE POLICY "Authenticated users can upload avatars"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'user_avatar');

CREATE POLICY "Authenticated users can update own avatars"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'user_avatar');

CREATE POLICY "Authenticated users can delete own avatars"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'user_avatar');

CREATE POLICY "Anyone can view avatars"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'user_avatar');

-- Garantir que o bucket seja público
UPDATE storage.buckets 
SET public = true 
WHERE id = 'user_avatar';