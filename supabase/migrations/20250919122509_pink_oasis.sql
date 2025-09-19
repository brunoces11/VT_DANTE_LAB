/*
  # Criar tabela de empresas e modificar tab_user

  1. Nova Tabela
    - `companies`
      - `id` (uuid, primary key)
      - `name` (text, nome da empresa)
      - `domain` (text, domínio da empresa para auto-associação)
      - `plan_type` (text, tipo do plano)
      - `max_users` (integer, limite de usuários)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Modificações em tab_user
    - Adicionar `company_id` (uuid, foreign key)
    - Adicionar `is_company_admin` (boolean)

  3. Segurança
    - Enable RLS em companies
    - Políticas para acesso baseado na empresa
    - Políticas para administradores de empresa
*/

-- Criar tabela companies
CREATE TABLE IF NOT EXISTS companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  domain text UNIQUE,
  plan_type text NOT NULL DEFAULT 'free' CHECK (plan_type IN ('free', 'pro', 'premium', 'enterprise')),
  max_users integer NOT NULL DEFAULT 5,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Adicionar colunas à tabela tab_user
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tab_user' AND column_name = 'company_id'
  ) THEN
    ALTER TABLE tab_user ADD COLUMN company_id uuid REFERENCES companies(id) ON DELETE SET NULL;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tab_user' AND column_name = 'is_company_admin'
  ) THEN
    ALTER TABLE tab_user ADD COLUMN is_company_admin boolean DEFAULT false;
  END IF;
END $$;

-- Habilitar RLS
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

-- Políticas para companies
CREATE POLICY "Users can view their own company"
  ON companies
  FOR SELECT
  TO authenticated
  USING (
    id IN (
      SELECT company_id FROM tab_user WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Company admins can update their company"
  ON companies
  FOR UPDATE
  TO authenticated
  USING (
    id IN (
      SELECT company_id FROM tab_user 
      WHERE user_id = auth.uid() AND is_company_admin = true
    )
  );

CREATE POLICY "Company admins can insert companies"
  ON companies
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para atualizar updated_at
CREATE TRIGGER update_companies_updated_at
  BEFORE UPDATE ON companies
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_companies_domain ON companies(domain);
CREATE INDEX IF NOT EXISTS idx_tab_user_company_id ON tab_user(company_id);
CREATE INDEX IF NOT EXISTS idx_tab_user_company_admin ON tab_user(company_id, is_company_admin) WHERE is_company_admin = true;