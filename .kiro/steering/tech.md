# Technology Stack

## Frontend Stack
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite 5.4+ (fast development and optimized builds)
- **Styling**: Tailwind CSS 3.4+ with custom design system
- **UI Components**: Radix UI primitives + shadcn/ui components
- **Icons**: Lucide React
- **Routing**: React Router DOM v7
- **State Management**: React Context API + useState/useEffect

## Backend & Services
- **Backend-as-a-Service**: Supabase
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Supabase Auth with JWT tokens
- **Edge Functions**: Deno runtime on Supabase
- **Real-time**: Supabase Realtime (WebSocket connections)

## Development Tools
- **Linting**: ESLint 9+ with TypeScript support
- **Code Quality**: TypeScript 5.5+ strict mode
- **Package Manager**: npm
- **Environment**: Node.js with ES modules

## Key Libraries
- `@supabase/supabase-js`: Database and auth client
- `react-router-dom`: Client-side routing
- `react-markdown`: Markdown rendering for chat responses
- `class-variance-authority`: Component variant management
- `tailwind-merge`: Tailwind class merging utility
- `react-error-boundary`: Error handling

## Common Commands

### Development
```bash
npm run dev          # Start development server (Vite)
npm run build        # Production build
npm run preview      # Preview production build
npm run lint         # Run ESLint checks
```

### Supabase (if using CLI)
```bash
supabase start       # Start local Supabase
supabase db reset    # Reset local database
supabase functions serve  # Serve edge functions locally
```

## Build Configuration
- **Output Directory**: `dist/`
- **Base Path**: `./` (relative paths for deployment flexibility)
- **Source Maps**: Disabled in production
- **Path Aliases**: `@/` maps to `src/`
- **Asset Optimization**: Automatic via Vite

## Environment Variables
Required in `.env`:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

## Performance Optimizations
- Code splitting with dynamic imports
- Lazy loading for route components
- Optimized bundle size with Vite
- Tree shaking for unused code elimination