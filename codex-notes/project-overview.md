# Project Overview

## Stack
- Vite + React 18 + TypeScript (alias `@` ? `src` via `vite.config.ts`)
- Tailwind CSS with `tailwindcss-animate`
- Supabase JS client (`services/supa_init.ts`) e Edge Functions (`supabase/functions`)
- Radix UI + shadcn-style utilitários (`class-variance-authority`, `tailwind-merge`)

## Estrutura Principal
- `src/App.tsx`: roteamento principal, modais de autenticação e integração Supabase.
- `src/pages`: páginas institucionais (Home, Planos, BaseLegal, ComoFunciona etc.) e telas de chat/teste.
- `src/components`: componentes de UI e fluxo de chat, pasta `auth` centraliza modais Auth/Reset/Email.
- `src/utils`: utilidades como `timezone` (fuso horário) e `supabase-admin` (chamadas administrativas).
- `services`: wrapper Supabase + funções helpers (`FUN_DT_LOGIN_NEW_SESSION`).
- `supabase/functions`: Edge Functions `DT_LOGIN_NEW_SESSION` e `single_session` (Node/TypeScript).

## Pontos de Atenção
- Variáveis `.env` críticas: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`.
- `App.tsx` possui muitos logs/debug e lógica de modais ? revisar para limpeza futura.
- Manter coerência com componentes existentes (arquivos grandes >5k linhas, considerar modularização).

## Próximos Passos Sugeridos
1. Mapear fluxo completo de autenticação (modais, `AuthProvider`, edge functions).
2. Revisar componentes de chat (`chat_area`, `chat_msg_list`, etc.) para entender estado e integrações.
3. Validar schema Supabase (consultar `supabase` diretório e tabelas referenciadas em código).
