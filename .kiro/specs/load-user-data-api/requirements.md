# Requirements Document

## Introduction

Criar uma Edge Function Supabase chamada `load_user_data` que carrega dados completos do usuário após login, incluindo sessões de chat e mensagens.

## Requirements

### Requirement 1

**User Story:** Como usuário autenticado, quero carregar meu histórico de chat após login, para continuar conversas anteriores.

#### Acceptance Criteria

1. WHEN função é chamada THEN deve obter `user_id` via `auth.user().id`
2. WHEN autenticado THEN buscar dados do usuário

### Requirement 2

**User Story:** Como usuário, quero recuperar todas minhas sessões de chat, para ver conversas anteriores.

#### Acceptance Criteria

1. WHEN usuário autenticado THEN consultar `public.tab_chat_session` 
2. WHEN consultar THEN filtrar por `user_id`
3. WHEN retornar THEN incluir `chat_session_id` e `chat_session_title`

### Requirement 3

**User Story:** Como usuário, quero recuperar todas mensagens de cada sessão, para ver histórico completo.

#### Acceptance Criteria

1. WHEN sessões obtidas THEN consultar `public.tab_chat_msg` para cada `chat_session_id`
2. WHEN consultar mensagens THEN filtrar por `chat_session_id` e `user_id`
3. WHEN retornar THEN incluir `chat_msg_id`, `msg_input` e `msg_output`

### Requirement 4

**User Story:** Como desenvolvedor frontend, quero dados em JSON estruturado, para facilitar parsing.

#### Acceptance Criteria

1. WHEN sucesso THEN retornar status 200
2. WHEN retornar THEN seguir estrutura JSON especificada:
```json
{
  "user_id": "uuid",
  "chat_sessions": [
    {
      "chat_session_id": "uuid", 
      "chat_session_title": "string",
      "messages": [
        {
          "chat_msg_id": "uuid",
          "msg_input": "string", 
          "msg_output": "string"
        }
      ]
    }
  ]
}
```