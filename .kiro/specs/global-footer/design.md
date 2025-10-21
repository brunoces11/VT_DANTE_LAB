# Design Document

## Overview

O rodapé global será implementado como um componente React reutilizável que utiliza shadcn/ui para consistência com o design system existente. O componente será aplicado automaticamente em todas as páginas através do layout principal, exceto na página de chat.

## Architecture

### Component Structure
```
Footer/
├── Footer.tsx (componente principal)
├── FooterColumn.tsx (componente de coluna reutilizável)
└── FooterDivider.tsx (linha divisória)
```

### Integration Points
- **App.tsx**: Integração condicional baseada na rota atual
- **Layout Components**: Aplicação automática em páginas que necessitam do rodapé
- **Router**: Detecção de rota para exclusão da página de chat

## Components and Interfaces

### Footer Component
```typescript
interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className }) => {
  // Implementação do rodapé com 3 colunas + copyright
}
```

### FooterColumn Component
```typescript
interface FooterColumnProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const FooterColumn: React.FC<FooterColumnProps> = ({ title, children, className }) => {
  // Implementação de coluna reutilizável
}
```

## Data Models

### Footer Content Structure
```typescript
interface FooterContent {
  about: {
    title: string;
    description: string;
  };
  navigation: {
    title: string;
    links: Array<{
      label: string;
      href: string;
      external?: boolean;
    }>;
  };
  contact: {
    title: string;
    email: string;
    location: string;
  };
  copyright: {
    text: string;
    year: number;
  };
}
```

### Navigation Links (excluding contact)
```typescript
const navigationLinks = [
  { label: 'Como funciona', href: '/como-funciona' },
  { label: 'Base Legal', href: '/base-legal' },
  { label: 'Planos', href: '/planos' },
  { label: 'Lab', href: '/chat-page' }
];
```

## Design Specifications

### Color Scheme
- **Background Color**: `#3D1413` (mesma cor do ícone da logo)
- **Text Color**: `#FFFFFF` (branco para contraste)
- **Link Hover**: `#F97316` (orange-500 do design system)
- **Divider**: `#FFFFFF20` (branco com 20% de opacidade)

### Typography
- **Column Titles**: `text-lg font-semibold` (shadcn/ui)
- **Body Text**: `text-sm` (shadcn/ui)
- **Links**: `text-sm hover:text-orange-300 transition-colors`
- **Copyright**: `text-xs text-center`

### Layout Structure
```
┌─────────────────────────────────────────────────────────────┐
│                     Footer Container                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │   Coluna 1  │  │   Coluna 2  │  │   Coluna 3  │        │
│  │   Sobre o   │  │   Links de  │  │   Contato   │        │
│  │   Dante IA  │  │  Navegação  │  │             │        │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
│  ─────────────────────────────────────────────────────────  │
│                      Copyright                              │
└─────────────────────────────────────────────────────────────┘
```

### Responsive Behavior
- **Desktop (md+)**: 3 colunas lado a lado
- **Tablet (sm-md)**: 3 colunas com espaçamento reduzido
- **Mobile (<sm)**: Colunas empilhadas verticalmente

### Spacing
- **Container Padding**: `px-4 sm:px-6 lg:px-8`
- **Vertical Padding**: `py-12`
- **Column Gap**: `gap-8 md:gap-12`
- **Copyright Margin**: `mt-8 pt-8`

## Content Specifications

### Column 1: About Dante IA
```
Título: "Sobre o Dante IA"
Conteúdo: "Dante é uma IA avançada especializada em fornecer embasamento jurídico para cartórios e registros imobiliários. Oferecemos respostas objetivas, concisas e rigorosamente baseadas na legislação vigente."
```

### Column 2: Navigation Links
```
Título: "Navegação"
Links:
- Como funciona
- Base Legal  
- Planos
- Lab
```

### Column 3: Contact Information
```
Título: "Contato"
Conteúdo:
- contato@dante-ia.com
- Santa Catarina, SC / Brasil
```

### Copyright Section
```
"© 2025 Copyright. Todos os direitos reservados a Dante-IA ©"
```

## Technical Implementation

### shadcn/ui Components Used
- **Container**: Custom container with max-width
- **Typography**: shadcn/ui text utilities
- **Responsive Grid**: CSS Grid com breakpoints do Tailwind
- **Separator**: shadcn/ui Separator component para a linha divisória

### Conditional Rendering Logic
```typescript
const shouldShowFooter = () => {
  const location = useLocation();
  return !location.pathname.includes('/chat-page');
};
```

### Integration with App Router
```typescript
// Em App.tsx ou layout principal
{shouldShowFooter() && <Footer />}
```

## Error Handling

### Navigation Error Handling
- Links quebrados devem ter fallback para página inicial
- Links externos devem abrir em nova aba
- Tratamento de erros de navegação com React Router

### Responsive Error Handling
- Graceful degradation em telas muito pequenas
- Fallback para layout vertical em caso de problemas de CSS Grid

## Testing Strategy

### Unit Tests
- Renderização correta do componente
- Conteúdo das colunas está presente
- Links de navegação funcionam corretamente
- Conditional rendering baseado na rota

### Integration Tests
- Integração com React Router
- Comportamento responsivo
- Aplicação correta das cores do design system

### Visual Tests
- Screenshot testing para diferentes breakpoints
- Verificação de cores e tipografia
- Teste de hover states

### Accessibility Tests
- Navegação por teclado
- Screen reader compatibility
- Contraste de cores adequado
- Semantic HTML structure