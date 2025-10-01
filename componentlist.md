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