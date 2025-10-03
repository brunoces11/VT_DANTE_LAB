# Lista de Componentes do Projeto

## Instruções
Este arquivo registra componentes do projeto mediante solicitação específica. Cada registro contém:
1. Nome do componente / arquivo
2. Funções que executa
3. Localização (isolado ou embutido)
4. Onde está sendo usado
5. Interação com variáveis de ambiente
6. Componentes: Sempre q houver algum elemento interno q seja tb um componente, vc devera indicar claramente isso ou seja identifique todos os compoentes dentro do componente analisado.

---

## Componentes Registrados

### ChatNeoMsg
**Arquivo:** `src/components/chat_neo_msg.tsx`  
**Funções:** Interface de boas-vindas com input de texto, 4 cards de sugestões clicáveis, botão "Iniciar Conversa" com ícone Send, validação de input e eventos (Enter/click)  
**Localização:** Arquivo isolado  
**Usado em:** `ChatArea` (renderização condicional quando `isWelcomeMode=true`)  
**Variáveis de ambiente:** Nenhuma  
**Componentes internos:** `Button` (ui/button), `Input` (ui/input), ícones `Send` e `Loader2` (lucide-react)

### ChatInputMsg
**Arquivo:** `src/components/chat_input_msg.tsx`  
**Funções:** Input de mensagens para conversas existentes, botão "Enviar" com ícone Send, validação de input, eventos (Enter/click), loading state com spinner, disclaimer sobre IA  
**Localização:** Arquivo isolado  
**Usado em:** `ChatArea` (renderização condicional quando `isWelcomeMode=false`)  
**Variáveis de ambiente:** Nenhuma  
**Componentes internos:** `Button` (ui/button), `Input` (ui/input), ícones `Send` e `Loader2` (lucide-react)

### Chat Session Card
**Arquivo:** Embutido em `src/components/sidebar_collapse.tsx` (linhas 120-200 aproximadamente)  
**Funções:** Exibe card de sessão de chat com título, timestamp, indicador de ativo, menu dropdown (renomear/excluir), click handler para navegação entre sessões  
**Localização:** Componente embutido (não isolado)  
**Usado em:** `SidebarCollapse` (mapeado via `chats.map()`)  
**Variáveis de ambiente:** Nenhuma  
**Componentes internos:** `Button` (ui/button), `DropdownMenu` (ui/dropdown-menu), ícones `MoreVertical`, `Edit2`, `Trash2` (lucide-react)

---

*Última atualização: $(date)*

### UserP
rofileIcon
**Arquivo:** `src/components/user_profile_icon.tsx`  
**Funções:** 
- Exibe avatar do usuário (imagem ou ícone genérico)
- Dropdown menu com opções "Painel do Usuário" e "Sair"
- Gerencia estado de autenticação via AuthProvider
- Suporta 3 tamanhos (sm/md/lg)
- Tooltip com nome/email do usuário
- Callback customizado para logout

**Localização:** Arquivo isolado  

**Usado em:** 
- `Header` (header.tsx) - Desktop e Mobile
- `ChatHeader` (chat_header.tsx) - Área de chat

**Variáveis de ambiente:** Nenhuma (usa dados do AuthProvider)

**Componentes internos:** 
- `UserProfilePanel` (user_profile_panel) - Modal de perfil
- Ícones: `User`, `Settings`, `LogOut` (lucide-react)

**Integração com AuthProvider (Padrão Supabase):**
```typescript
const { user, profile, logout } = useAuth();

// ✅ Só renderiza se tiver user E profile
if (!user || !profile) return null;

// Avatar
{profile?.avatar_url ? (
  <img src={profile.avatar_url} /> // Avatar real
) : (
  <User /> // Ícone genérico
)}

// Tooltip
title={profile?.user_name || user?.email || 'Usuário logado'}
```

**Comportamento:**
1. **Deslogado:** Não renderiza (retorna null)
2. **Logado sem profile:** Não renderiza (aguarda profile carregar)
3. **Logado com profile:** Renderiza avatar ou ícone genérico
4. **Click:** Abre dropdown com opções
5. **Logout:** Executa callback customizado ou logout padrão + redirect

**Props:**
- `size?: 'sm' | 'md' | 'lg'` - Tamanho do avatar (padrão: 'md')
- `className?: string` - Classes CSS adicionais
- `showTooltip?: boolean` - Mostrar tooltip (padrão: true)
- `onLogout?: () => void` - Callback customizado para logout

**Padrão Supabase:**
- ✅ Usa `user` e `profile` do AuthProvider (fonte única)
- ✅ Aguarda profile carregar antes de renderizar
- ✅ Não manipula localStorage diretamente
- ✅ Logout via SDK do Supabase
- ✅ Sincronizado com estado global de autenticação

**Notas:**
- Avatar real requer upload via `storageService.uploadAvatar()`
- URL do avatar salva em `profile.avatar_url` (tabela `tab_user`)
- Ícone genérico `<User />` aparece se não tiver avatar
- Componente é responsivo e acessível

---

*Última atualização: 2025-01-03*
