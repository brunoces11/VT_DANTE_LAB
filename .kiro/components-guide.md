# Guia de Componentes VT_DANTE

## 🔐 Componentes de Autenticação

### AuthProvider
**Localização**: `src/components/auth/AuthProvider.tsx`
**Tipo**: Context Provider
**Responsabilidade**: Gerenciamento global do estado de autenticação

```typescript
interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error?: any }>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<{ error?: any }>;
  changePassword: (newPassword: string) => Promise<{ error?: any }>;
  resetPassword: (email: string) => Promise<{ error?: any }>;
}
```

### AuthModal
**Localização**: `src/components/auth/AuthModal.tsx`
**Props**: `isOpen`, `onClose`, `onSuccess`
**Funcionalidade**: Modal unificado para login e registro

### ResetPasswordModal
**Localização**: `src/components/auth/ResetPasswordModal.tsx`
**Funcionalidade**: Modal para redefinição de senha

### EmailConfirmationModal
**Localização**: `src/components/auth/EmailConfirmationModal.tsx`
**Funcionalidade**: Confirmação de email após registro

## 💬 Componentes de Chat

### ChatArea
**Localização**: `src/components/chat_area.tsx`
**Responsabilidade**: Container principal do chat

**Estado**:
```typescript
interface Message {
  id: number;
  content: string;
  sender: 'user' | 'bot';
  timestamp: string;
  isLoading?: boolean;
  loadingText?: string;
}
```

**Funcionalidades**:
- Gerenciamento de mensagens
- Simulação de consulta à base legal
- Loading sequence elaborada
- Scroll automático
- Respostas contextualizadas

### ChatInput
**Localização**: `src/components/chat_input.tsx`
**Props**: `onSendMessage`, `isLoading`
**Funcionalidade**: Input para envio de mensagens

### ChatMsgList
**Localização**: `src/components/chat_msg_list.tsx`
**Props**: `messages`, `messagesEndRef`
**Funcionalidade**: Lista de mensagens com scroll

### ChatMsgHeader
**Localização**: `src/components/chat_msg_header.tsx`
**Funcionalidade**: Header da área de mensagens

### ChatHeader
**Localização**: `src/components/chat_header.tsx`
**Funcionalidade**: Header específico da página de chat

### SidebarCollapse
**Localização**: `src/components/sidebar_collapse.tsx`
**Funcionalidade**: Sidebar colapsável do chat

## 🧭 Componentes de Navegação

### Header
**Localização**: `src/components/header.tsx`
**Responsabilidade**: Header principal da aplicação

**Funcionalidades**:
- Logo e navegação principal
- Menu responsivo (desktop/mobile)
- Dropdown "Lab" com subpáginas
- Botões de CTA (Iniciar Chat, Entrar)
- Integração com AuthProvider
- UserProfileIcon quando logado

**Estados**:
- `isMenuOpen`: Menu mobile
- `isLabDropdownOpen`: Dropdown Lab
- `isAuthModalOpen`: Modal de autenticação

## 👤 Componentes de Perfil

### UserProfileIcon
**Localização**: `src/components/user_profile_icon.tsx`
**Props**: `size` ('sm' | 'md' | 'lg'), `showTooltip?`
**Funcionalidade**: Ícone de perfil com dropdown

### UserProfilePanel
**Localização**: `src/components/user_profile_panel.tsx`
**Props**: `isOpen`, `onClose`
**Funcionalidade**: Painel lateral de configurações do usuário

## 🎨 Componentes UI Base

### Button
**Localização**: `src/components/ui/button.tsx`
**Baseado em**: Radix UI + shadcn/ui
**Variantes**: default, destructive, outline, secondary, ghost, link
**Tamanhos**: default, sm, lg, icon

### Dialog
**Localização**: `src/components/ui/dialog.tsx`
**Componentes**: Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription

### Input
**Localização**: `src/components/ui/input.tsx`
**Funcionalidade**: Campo de input estilizado

### Tooltip
**Localização**: `src/components/ui/tooltip.tsx`
**Componentes**: Tooltip, TooltipTrigger, TooltipContent, TooltipProvider

### Badge
**Localização**: `src/components/ui/badge.tsx`
**Variantes**: default, secondary, destructive, outline

### Card
**Localização**: `src/components/ui/card.tsx`
**Componentes**: Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter

## 🏠 Componentes de Landing Page

### Hero
**Localização**: `src/components/hero.tsx`
**Funcionalidade**: Seção hero da homepage

### Features
**Localização**: `src/components/features.tsx`
**Funcionalidade**: Seção de funcionalidades

### Testimonials
**Localização**: `src/components/testimonials.tsx`
**Funcionalidade**: Depoimentos de usuários

### Assinatura
**Localização**: `src/components/assinatura.tsx`
**Funcionalidade**: Seção de call-to-action para assinatura

## 🧪 Componentes de Teste

### SupabaseTest
**Localização**: `src/components/SupabaseTest.tsx`
**Funcionalidade**: Componente para testes de integração com Supabase

## 📞 Componentes de Contato

### ChatContato
**Localização**: `src/components/chat_contato.tsx`
**Funcionalidade**: Formulário de contato

### ChatHero
**Localização**: `src/components/chat_hero.tsx`
**Funcionalidade**: Hero específico para páginas de chat

### ChatLoader
**Localização**: `src/components/chat_loader.tsx`
**Funcionalidade**: Componente de loading para chat

## 🎯 Padrões de Uso

### Importação de Componentes
```typescript
// Componentes locais
import Header from '@/components/header';
import { useAuth } from '@/components/auth/AuthProvider';

// Componentes UI
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';

// Ícones
import { Brain, Menu, X } from 'lucide-react';
```

### Padrão de Props
```typescript
interface ComponentProps {
  // Props obrigatórias primeiro
  title: string;
  onAction: () => void;
  
  // Props opcionais depois
  className?: string;
  disabled?: boolean;
  
  // Children por último
  children?: React.ReactNode;
}
```

### Padrão de Estado
```typescript
// useState para estado local
const [isOpen, setIsOpen] = useState(false);

// useContext para estado global
const { user, loading } = useAuth();

// useEffect para side effects
useEffect(() => {
  // cleanup function quando necessário
  return () => cleanup();
}, [dependencies]);
```

### Padrão de Styling
```typescript
// Tailwind classes com conditional
className={`base-classes ${
  condition ? 'conditional-classes' : 'alternative-classes'
}`}

// Ou usando clsx/cn para casos complexos
className={cn(
  'base-classes',
  condition && 'conditional-classes',
  variant === 'primary' && 'primary-classes'
)}
```