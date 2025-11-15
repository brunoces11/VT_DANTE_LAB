/*
  # Adicionar coluna agent_type à tabela tab_chat_msg

  1. Alterações
    - Adicionar coluna `agent_type` à tabela `tab_chat_msg`
      - Tipo: text
      - Nullable: true
      - Default: 'dante-ri'
      - Descrição: Tipo do agente que gerou a resposta (dante-ri, dante-notas, etc)

  2. Motivo
    - Permitir rastreamento de qual agente IA foi usado em cada mensagem
    - Suporta sistema multi-agente onde diferentes especialistas podem ser usados
    - Mantém histórico completo de interações por tipo de agente

  3. Notas Importantes
    - A coluna é nullable para compatibilidade com mensagens antigas
    - Default 'dante-ri' para mensagens que não especificarem o agente
    - Nenhuma alteração em RLS (não aplicável a esta tabela)
*/

-- Adicionar coluna agent_type à tabela tab_chat_msg
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tab_chat_msg' AND column_name = 'agent_type'
  ) THEN
    ALTER TABLE tab_chat_msg 
    ADD COLUMN agent_type text DEFAULT 'dante-ri';
  END IF;
END $$;