/*
  # Função para verificar se email existe na tabela auth.users

  1. Nova Função
    - `check_email_exists(email_to_check text)`
    - Retorna boolean indicando se email existe
    - Acessa diretamente auth.users de forma segura

  2. Segurança
    - Função pública acessível via RPC
    - Não expõe dados sensíveis, apenas boolean
    - Permite verificação sem criar usuários temporários
*/

-- Criar função para verificar se email existe
CREATE OR REPLACE FUNCTION public.check_email_exists(email_to_check text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Verificar se existe um usuário com este email na tabela auth.users
  RETURN EXISTS (
    SELECT 1 
    FROM auth.users 
    WHERE email = lower(trim(email_to_check))
  );
END;
$$;

-- Permitir que usuários autenticados e anônimos chamem esta função
GRANT EXECUTE ON FUNCTION public.check_email_exists(text) TO anon;
GRANT EXECUTE ON FUNCTION public.check_email_exists(text) TO authenticated;