/*
  # Dados de exemplo para empresas

  1. Empresas de exemplo
    - Empresa Free
    - Empresa Pro
    - Empresa Premium

  2. Usuários de exemplo associados às empresas
*/

-- Inserir empresas de exemplo
INSERT INTO companies (id, name, domain, plan_type, max_users) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'Cartório Central', 'cartoriocentral.com.br', 'pro', 25),
  ('550e8400-e29b-41d4-a716-446655440002', 'Registro Imóveis SP', 'registroimoveissp.com.br', 'premium', 100),
  ('550e8400-e29b-41d4-a716-446655440003', 'Tabelionato Santos', 'tabelionatosantos.com.br', 'free', 5)
ON CONFLICT (id) DO NOTHING;

-- Atualizar alguns usuários existentes para serem associados às empresas
-- (Isso é apenas um exemplo - você deve ajustar conforme necessário)
UPDATE tab_user 
SET 
  company_id = '550e8400-e29b-41d4-a716-446655440001',
  is_company_admin = true
WHERE user_role = 'admin' 
  AND company_id IS NULL
  LIMIT 1;

-- Comentário: Execute este script apenas se quiser dados de exemplo
-- Em produção, as empresas serão criadas através da interface da aplicação