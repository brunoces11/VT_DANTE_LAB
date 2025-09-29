# Project Overview

## Stack
- Vite + React 18 + TypeScript (alias `@` ? `src` via `vite.config.ts`)
- Tailwind CSS with `tailwindcss-animate`
- Supabase JS client (`services/supa_init.ts`) e Edge Functions (`supabase/functions`)
- Radix UI + shadcn-style utilit�rios (`class-variance-authority`, `tailwind-merge`)

## Estrutura Principal
- `src/App.tsx`: roteamento principal, modais de autentica��o e integra��o Supabase.
- `src/pages`: p�ginas institucionais (Home, Planos, BaseLegal, ComoFunciona etc.) e telas de chat/teste.
- `src/components`: componentes de UI e fluxo de chat, pasta `auth` centraliza modais Auth/Reset/Email.
- `src/utils`: utilidades como `timezone` (fuso hor�rio) e `supabase-admin` (chamadas administrativas).
- `services`: wrapper Supabase + fun��es helpers (`FUN_DT_LOGIN_NEW_SESSION`).
- `supabase/functions`: Edge Functions `execute o projeto
` e `single_session` (Node/TypeScript).

## Pontos de Aten��o
- Vari�veis `.env` cr�ticas: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`.
- `App.tsx` possui muitos logs/debug e l�gica de modais ? revisar para limpeza futura.
- Manter coer�ncia com componentes existentes (arquivos grandes >5k linhas, considerar modulariza��o).

## Pr�ximos Passos Sugeridos
1. Mapear fluxo completo de autentica��o (modais, `AuthProvider`, edge functions).
2. Revisar componentes de chat (`chat_area`, `chat_msg_list`, etc.) para entender estado e integra��es.
3. Validar schema Supabase (consultar `supabase` diret�rio e tabelas referenciadas em c�digo).
