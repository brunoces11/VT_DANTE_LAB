# Project Structure

MUITO IMPORTANTE, VC NUNCA VAI CRIAR NENHUM CODIGO, NENHUMA MUDANCA se vc nao entender 100% com clareza total o pedido do usuario, caso contrario vc DEVERA SEMPRE perguntar e esclarecwer com o usuario qualquer ponto, vc so esta autorizado a fazer modificacoes ou criacoes de codigo e arquivos se vc estiver totalmente certo e convicto de que entendeu perfeitamente a solicitacao do usuario, caso contrario vc deve perguntar e pedir esclasrecimento antes. entedeu totalmente isso?
Resumindo nunca faca nada se vc nao entender 100% com clareza meu pedido, caso contrario vc deve perguntar antes.

## Root Directory Organization
```
VT_DANTE_LAB/
├── src/                    # Main application source code
├── services/               # External service integrations
├── supabase/              # Supabase-specific files (Edge Functions)
├── backup/                # Backup files and components
├── .kiro/                 # Kiro AI assistant configuration
├── .env                   # Environment variables
└── [config files]         # Build and tool configurations

+ services/react.ts        # para concentrar as funcoes do frontend criado usando react; entao sempre q o usuario se referir a alguma funcao do frontend ou do react, vc devera criar/consultar/editar nesse arquivo "services/react.ts"; entao sempre q o usuario se referir a alguma funcao relativa ao frontend ou react, entao sempre considere o "services/react.ts".


+ services/supabase.ts     # para concentrar as chamadas de API para executar edge funcions; entao sempre q o usuario se referir a alguma funcao para acionar uma edge funcion, entao vc devera criar/consultar/editar nesse arquivo "services/supabase.ts".

Muito importante, as edge funcions do supabase propriamente dita, todas estao salvas em outro diretorio, seguindo o foato padrao sugerido pelo proprio supabase que é: "supabase/nome_da_edge_funcion/index.ts".

Muito importante, todas as funcoes, edge funcions ou qualquer conexao q envolva acesso ao banco de dados do supabase, devera seguir a risca ao schema publico do banco de dados que foi salvo no arquivo ".kiro/architecture.md"; entao sempre q lidar com essas questoes, acesse o schema exato do bando de dados supabase detalhado no arquivo indicado.

```

## Source Code Structure (`src/`)
```
src/
├── App.tsx                # Root component with routing and error boundaries
├── main.tsx              # Application entry point
├── index.css             # Global styles and Tailwind imports
├── components/           # Reusable UI components
│   ├── auth/            # Authentication-related components
│   ├── ui/              # Base UI components (shadcn/ui)
│   └── [feature components] # Chat, header, sidebar, etc.
├── pages/               # Route-level page components
├── lib/                 # Shared utilities and configurations
└── utils/               # Helper functions and utilities
```

## Component Organization Patterns

### Authentication Components (`src/components/auth/`)
- `AuthProvider.tsx` - Global authentication context
- `AuthModal.tsx` - Login/register modal
- `ResetPasswordModal.tsx` - Password recovery
- `EmailConfirmationModal.tsx` - Email verification

### UI Components (`src/components/ui/`)
- Base components following shadcn/ui patterns
- Each component in its own file
- Consistent naming: `button.tsx`, `dialog.tsx`, `input.tsx`

### Feature Components (`src/components/`)
- `header.tsx` - Main navigation header
- `chat_area.tsx` - Main chat interface
- `chat_input.tsx` - Message input component
- `chat_msg_list.tsx` - Message display list
- `sidebar_collapse.tsx` - Collapsible sidebar
- `user_profile_*.tsx` - User profile components

## Page Components (`src/pages/`)
- `HomePage.tsx` - Landing page
- `ChatPage.tsx` - Main chat application
- `DanteUI.tsx` - Design system showcase
- `[Feature]Page.tsx` - Other feature pages

## Services Directory (`services/`)
- `supa_init.ts` - Supabase client initialization
- `supabase.ts` - Supabase helper functions
- `react.ts` - React-specific utilities

## Naming Conventions

### Files and Directories
- **Components**: PascalCase (e.g., `AuthProvider.tsx`)
- **Pages**: PascalCase with "Page" suffix (e.g., `HomePage.tsx`)
- **Utilities**: camelCase (e.g., `timezone.ts`)
- **Services**: camelCase (e.g., `supa_init.ts`)

### Component Structure
```typescript
// Component file structure
import React from 'react';
import { /* dependencies */ } from 'library';

interface ComponentProps {
  // Props interface
}

export default function ComponentName({ props }: ComponentProps) {
  // Component logic
  return (
    // JSX
  );
}
```

## Import Patterns
- Use `@/` alias for src imports: `import { Button } from '@/components/ui/button'`
- Group imports: React first, then libraries, then local imports
- Use default exports for components, named exports for utilities

## Database Schema Reference
Always reference the schema in `.kiro/architecture.md` for:
- Table structures (`tab_user`, `tab_chat_session`, `tab_chat_msg`, etc.)
- Foreign key relationships
- Column types and constraints
- When creating CRUD operations, Edge Functions, or API calls

## Configuration Files
- `vite.config.ts` - Vite build configuration with path aliases
- `tailwind.config.js` - Tailwind CSS with custom theme
- `eslint.config.js` - ESLint rules for TypeScript/React
- `tsconfig.json` - TypeScript compiler options