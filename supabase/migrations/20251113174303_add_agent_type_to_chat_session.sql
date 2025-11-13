/*
  # Add agent_type column to chat sessions

  ## Changes
  1. Adds `agent_type` column to `tab_chat_session` table
     - Type: TEXT
     - Default: 'dante-ri' (ensures backward compatibility with existing chats)
     - Purpose: Stores which AI agent (RI or NOTAS) was used for each chat session
  
  ## Why this is needed
  - Each chat needs to remember which Langflow endpoint to use
  - Ensures continuity when user returns to old chats
  - Enables proper routing to correct AI agent (RI vs NOTAS)
  
  ## Impact on existing data
  - All existing chat sessions will default to 'dante-ri'
  - New chats will explicitly set this value on creation
  
  ## Security
  - No RLS changes needed (inherits from existing table policies)
  - Non-breaking change (uses IF NOT EXISTS)
*/

-- Add agent_type column with safe check
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tab_chat_session' 
    AND column_name = 'agent_type'
  ) THEN
    ALTER TABLE tab_chat_session 
    ADD COLUMN agent_type TEXT DEFAULT 'dante-ri';
  END IF;
END $$;