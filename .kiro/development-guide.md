# Guia de Desenvolvimento VT_DANTE

## 🚀 Setup do Ambiente

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn
- Conta Supabase configurada

### Instalação
```bash
# Clonar repositório
git clone [repository-url]
cd VT_DANTE

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com suas credenciais Supabase
```

### Scripts Disponíveis
```bash
# Desenvolvimento
npm run dev          # Inicia servidor de desenvolvimento (Vite)

# Build
npm run build        # Build de produção
npm run preview      # Preview do build

# Qualidade de código
npm run lint         # ESLint check
```

## 🏗️ Estrutura de Desenvolvimento

### Convenções de Nomenclatura

#### Arquivos e Pastas
- **Componentes**: PascalCase (`AuthModal.tsx`)
- **Páginas**: PascalCase (`HomePage.tsx`)
- **Utilitários**: camelCase (`timezone.ts`)
- **Pastas**: kebab-case ou camelCase consistente

#### Variáveis e Funções
```typescript
// Componentes React
const AuthModal = () => { ... }

// Hooks customizados
const useAuth = () => { ... }

// Funções utilitárias
const getCurrentTimestampUTC = () => { ... }

// Constantes
const SAO_PAULO_TIMEZONE = 'America/Sao_Paulo'

// Interfaces
interface AuthContextType { ... }
```

### Estrutura de Componentes
```typescript
// Template padrão para componentes
import React from 'react';
import { useState, useEffect } from 'react';

interface ComponentProps {
  // Props obrigatórias primeiro
  title: string;
  onAction: () => void;
  
  // Props opcionais
  className?: string;
  disabled?: boolean;
  
  // Children por último
  children?: React.ReactNode;
}

export default function Component({ 
  title, 
  onAction, 
  className,
  disabled = false,
  children 
}: ComponentProps) {
  // Hooks no topo
  const [state, setState] = useState(initialValue);
  
  // useEffect após useState
  useEffect(() => {
    // side effects
  }, [dependencies]);
  
  // Funções auxiliares
  const handleAction = () => {
    // lógica
  };
  
  // Early returns
  if (loading) return <LoadingComponent />;
  
  // JSX principal
  return (
    <div className={className}>
      {/* conteúdo */}
    </div>
  );
}
```

## 🎨 Styling Guidelines

### Tailwind CSS
```typescript
// Classes base primeiro, modificadores depois
className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"

// Conditional classes
className={`base-classes ${
  isActive ? 'active-classes' : 'inactive-classes'
}`}

// Responsive design
className="text-sm md:text-base lg:text-lg"

// Estados interativos
className="hover:bg-gray-100 focus:ring-2 focus:ring-orange-500 active:bg-gray-200"
```

### Paleta de Cores Padrão
```typescript
// Cores principais
'bg-orange-500'     // Primary action
'bg-orange-600'     // Primary hover
'bg-orange-700'     // Primary active

// Neutros
'bg-white'          // Background principal
'bg-neutral-50'     // Background secundário
'bg-neutral-100'    // Background terciário
'text-neutral-900'  // Texto principal
'text-neutral-600'  // Texto secundário

// Estados
'bg-red-50'         // Error background
'text-red-600'      // Error text
'bg-green-50'       // Success background
'text-green-600'    // Success text
```

## 🔧 Padrões de Estado

### useState
```typescript
// Estado simples
const [isOpen, setIsOpen] = useState(false);

// Estado complexo
const [formData, setFormData] = useState({
  email: '',
  password: '',
  name: ''
});

// Atualização de estado complexo
setFormData(prev => ({
  ...prev,
  email: newEmail
}));
```

### useContext
```typescript
// Consumir contexto
const { user, loading, login } = useAuth();

// Verificações condicionais
if (loading) return <Loading />;
if (!user) return <LoginPrompt />;
```

### useEffect
```typescript
// Effect com cleanup
useEffect(() => {
  const subscription = supabase.auth.onAuthStateChange(callback);
  
  return () => {
    subscription.unsubscribe();
  };
}, []);

// Effect com dependências
useEffect(() => {
  if (user) {
    fetchUserData();
  }
}, [user]);
```

## 🔄 Gerenciamento de Dados

### Supabase Integration
```typescript
// Sempre usar try/catch
const fetchData = async () => {
  try {
    setLoading(true);
    const { data, error } = await supabase
      .from('table')
      .select('*');
      
    if (error) throw error;
    
    setData(data);
  } catch (error) {
    console.error('Error:', error);
    setError(error.message);
  } finally {
    setLoading(false);
  }
};
```

### Error Handling
```typescript
// Error boundary para componentes
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }
    return this.props.children;
  }
}
```

## 🧪 Testing Guidelines

### Componente de Teste
```typescript
// TestePage.tsx - para testes de desenvolvimento
export default function TestePage() {
  const [testResult, setTestResult] = useState(null);
  
  const runTest = async () => {
    try {
      // Lógica de teste
      const result = await testFunction();
      setTestResult(result);
    } catch (error) {
      console.error('Test failed:', error);
    }
  };
  
  return (
    <div className="p-8">
      <h1>Página de Testes</h1>
      <button onClick={runTest}>Executar Teste</button>
      {testResult && <pre>{JSON.stringify(testResult, null, 2)}</pre>}
    </div>
  );
}
```

## 📱 Responsividade

### Mobile-First Approach
```typescript
// Sempre começar com mobile
className="text-sm p-2 md:text-base md:p-4 lg:text-lg lg:p-6"

// Menu responsivo
const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

return (
  <>
    {/* Desktop menu */}
    <nav className="hidden md:flex">
      {/* menu items */}
    </nav>
    
    {/* Mobile menu button */}
    <button 
      className="md:hidden"
      onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
    >
      <Menu />
    </button>
    
    {/* Mobile menu */}
    {isMobileMenuOpen && (
      <nav className="md:hidden">
        {/* mobile menu items */}
      </nav>
    )}
  </>
);
```

## 🔒 Segurança

### Validação de Input
```typescript
// Sempre validar inputs
const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const handleSubmit = (formData: FormData) => {
  if (!validateEmail(formData.email)) {
    setError('Email inválido');
    return;
  }
  
  // Prosseguir com submit
};
```

### Proteção de Rotas
```typescript
// Componente de rota protegida
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!loading && !user) {
      navigate('/');
    }
  }, [user, loading, navigate]);
  
  if (loading) return <Loading />;
  if (!user) return null;
  
  return <>{children}</>;
};
```

## 🚀 Deploy

### Build de Produção
```bash
# Gerar build
npm run build

# Verificar build localmente
npm run preview
```

### Variáveis de Ambiente
```env
# Desenvolvimento (.env.local)
VITE_SUPABASE_URL=http://localhost:54321
VITE_SUPABASE_ANON_KEY=local-key

# Produção (.env.production)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=production-key
```

## 🐛 Debug

### Console Logging
```typescript
// Debug condicional
const DEBUG = import.meta.env.DEV;

if (DEBUG) {
  console.log('🔍 Debug info:', data);
}

// Logging estruturado
console.log('🔄 Estado dos modais:', {
  isResetPasswordModalOpen,
  isEmailConfirmationModalOpen,
  isAuthModalOpen
});
```

### Error Tracking
```typescript
// Capturar erros para análise
const logError = (error: Error, context: string) => {
  console.error(`❌ ${context}:`, error);
  
  // Em produção, enviar para serviço de monitoramento
  if (import.meta.env.PROD) {
    // sendToErrorService(error, context);
  }
};
```

## 📚 Recursos Úteis

### Documentação
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Radix UI](https://www.radix-ui.com/)
- [Lucide Icons](https://lucide.dev/)

### Ferramentas de Desenvolvimento
- **Vite**: Build tool e dev server
- **ESLint**: Linting de código
- **TypeScript**: Type checking
- **Tailwind**: Styling
- **React DevTools**: Debug de componentes