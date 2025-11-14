# Requirements Document

## Introduction

Este documento define os requisitos para implementação do sistema multi-agente no VT_DANTE, permitindo que usuários escolham entre diferentes especialistas de IA (Registro de Imóveis, Tabelionato de Notas, etc.) ao iniciar conversas. O sistema deve suportar múltiplos agentes com fluxos de entrada distintos, mantendo persistência e contexto de cada agente por sessão de chat.

## Glossary

- **Agent Type**: Identificador único do especialista de IA (ex: 'dante-ri', 'dante-notas')
- **WelcomeChat**: Componente de seleção inicial de agente exibido quando usuário vem de fora do chat
- **ChatNeoMsg**: Componente de boas-vindas parametrizado que exibe conteúdo específico de cada agente
- **Chat Session**: Sessão persistente de conversa associada a um agent_type específico
- **Langflow Endpoint**: URL da API do agente de IA específico
- **Agent Config**: Objeto de configuração contendo dados visuais e funcionais de cada agente
- **Sistema**: Aplicação VT_DANTE
- **Usuário**: Pessoa autenticada utilizando o chat

## Requirements

### Requirement 1: Seleção de Agente ao Entrar no Chat

**User Story:** Como usuário navegando no site, eu quero escolher qual especialista do Dante consultar ao clicar em "Iniciar Chat", para que eu possa direcionar minhas dúvidas ao agente correto desde o início.

#### Acceptance Criteria

1. WHEN o Usuário clica no botão "Iniciar Chat" no Header vindo de qualquer página do site (exceto /chat), THE Sistema SHALL redirecionar para /chat e exibir o componente WelcomeChat
2. THE WelcomeChat SHALL exibir título "Seja bem-vindo ao Dante", parágrafo introdutório e dois cards lado a lado (Registro de Imóveis e Tabelionato de Notas)
3. WHEN o Usuário clica em um dos cards do WelcomeChat, THE Sistema SHALL definir o agent_type correspondente ('dante-ri' ou 'dante-notas') e renderizar o ChatNeoMsg parametrizado
4. THE Sistema SHALL NOT exibir o WelcomeChat quando o Usuário já está na página /chat e clica nos botões do Sidebar
5. WHEN o Usuário seleciona um agente no WelcomeChat, THE Sistema SHALL armazenar o agent_type no estado currentAgentType do ChatPage

### Requirement 2: Criação de Novo Chat com Agente Específico

**User Story:** Como usuário já no chat, eu quero iniciar uma nova conversa escolhendo diretamente o agente especialista, para que eu possa alternar rapidamente entre diferentes tipos de consulta.

#### Acceptance Criteria

1. THE Sidebar SHALL exibir dois botões separados: "Novo Chat - RI" e "Novo Chat - NOTAS" no lugar do botão único "Novo Chat"
2. WHEN o Usuário clica em "Novo Chat - RI", THE Sistema SHALL criar nova sessão com agent_type='dante-ri' e renderizar ChatNeoMsg parametrizado para RI
3. WHEN o Usuário clica em "Novo Chat - NOTAS", THE Sistema SHALL criar nova sessão com agent_type='dante-notas' e renderizar ChatNeoMsg parametrizado para NOTAS
4. THE Sistema SHALL limpar mensagens anteriores e definir isWelcomeMode como true ao criar novo chat
5. THE Sistema SHALL atualizar o estado currentAgentType com o agent_type selecionado

### Requirement 3: Componente ChatNeoMsg Parametrizado

**User Story:** Como desenvolvedor, eu quero um componente ChatNeoMsg único e parametrizado, para que eu possa adicionar novos agentes facilmente sem duplicar código.

#### Acceptance Criteria

1. THE ChatNeoMsg SHALL receber uma prop agentType do tipo 'dante-ri' ou 'dante-notas'
2. THE ChatNeoMsg SHALL carregar configurações específicas do agente a partir de um arquivo agentConfigs.ts
3. THE agentConfigs.ts SHALL conter para cada agente: title, description, suggestions (array), placeholder, icon e color
4. THE ChatNeoMsg SHALL renderizar dinamicamente título, descrição, sugestões e placeholder baseado no agentConfig recebido
5. THE ChatNeoMsg SHALL exibir indicador visual do agente ativo (ex: "Agente ativo: Registro de Imóveis")

### Requirement 4: Integração com Langflow por Agente

**User Story:** Como usuário enviando mensagem, eu quero que minhas perguntas sejam processadas pelo agente especialista correto, para que eu receba respostas precisas e contextualizadas.

#### Acceptance Criteria

1. THE fun_call_langflow SHALL aceitar parâmetro opcional agent_type do tipo 'dante-ri' ou 'dante-notas'
2. WHEN agent_type é 'dante-ri', THE fun_call_langflow SHALL utilizar VITE_LANGFLOW_FLOW_ID_RI para chamada da API
3. WHEN agent_type é 'dante-notas', THE fun_call_langflow SHALL utilizar VITE_LANGFLOW_FLOW_ID_NOTAS para chamada da API
4. IF agent_type não é fornecido, THE fun_call_langflow SHALL utilizar 'dante-ri' como fallback
5. THE Sistema SHALL adicionar variável VITE_LANGFLOW_FLOW_ID_NOTAS no arquivo .env com valor f0492099-6277-4ca3-a022-32a3fb87481a

### Requirement 5: Persistência de Agent Type

**User Story:** Como usuário, eu quero que o sistema lembre qual agente eu estava usando em cada conversa, para que eu possa retomar conversas antigas com o contexto correto.

#### Acceptance Criteria

1. WHEN o Usuário envia primeira mensagem em novo chat, THE Sistema SHALL salvar agent_type junto com chat_session_id na tabela tab_chat_session
2. WHEN o Usuário envia mensagens subsequentes, THE Sistema SHALL incluir agent_type nos dados salvos via ef_save_chat
3. WHEN o Usuário clica em chat antigo no Sidebar, THE Sistema SHALL carregar agent_type da sessão e definir currentAgentType
4. THE Sistema SHALL utilizar o agent_type carregado para todas as novas mensagens naquela sessão
5. IF agent_type não existe em chat antigo, THE Sistema SHALL utilizar 'dante-ri' como fallback

### Requirement 6: Propagação de Agent Type no Fluxo de Mensagens

**User Story:** Como desenvolvedor, eu quero que o agent_type seja propagado corretamente por todos os componentes, para garantir consistência entre UI, chamadas API e salvamento no banco.

#### Acceptance Criteria

1. THE ChatPage SHALL manter estado currentAgentType acessível para todos os componentes filhos
2. THE ChatPage SHALL passar currentAgentType como prop para ChatArea
3. THE ChatArea SHALL receber e utilizar currentAgentType nas chamadas fun_call_langflow e saveInBackground
4. THE handleFirstMessage SHALL incluir currentAgentType ao chamar fun_call_langflow e ao salvar dados
5. THE handleSendMessage SHALL incluir currentAgentType ao chamar fun_call_langflow e ao salvar dados

### Requirement 7: Validação e Tratamento de Erros

**User Story:** Como usuário, eu quero receber feedback claro caso algo dê errado com a seleção de agente, para que eu possa corrigir e continuar usando o sistema.

#### Acceptance Criteria

1. IF variáveis de ambiente do Langflow não estão configuradas para o agent_type selecionado, THE Sistema SHALL exibir mensagem de erro clara indicando qual agente está com problema
2. THE Sistema SHALL validar que agent_type é um dos valores permitidos ('dante-ri' ou 'dante-notas') antes de processar
3. IF agent_type inválido é detectado, THE Sistema SHALL utilizar 'dante-ri' como fallback e registrar warning no console
4. THE Sistema SHALL manter funcionamento normal mesmo se um dos agentes estiver indisponível, permitindo uso do outro
5. WHEN ocorre erro na chamada Langflow, THE Sistema SHALL exibir mensagem de erro sem expor detalhes técnicos ao Usuário

### Requirement 8: Experiência de Usuário e Feedback Visual

**User Story:** Como usuário, eu quero saber claramente qual agente estou usando a qualquer momento, para ter confiança de que minhas perguntas estão sendo direcionadas corretamente.

#### Acceptance Criteria

1. THE ChatNeoMsg SHALL exibir de forma proeminente o nome do agente ativo (ex: "Especialista em Registro de Imóveis")
2. THE WelcomeChat SHALL utilizar ícones distintos para cada agente (📋 para RI, 📝 para NOTAS)
3. THE Sistema SHALL manter indicação visual do agente ativo durante toda a sessão de chat
4. WHEN o Usuário alterna entre chats antigos, THE Sistema SHALL atualizar indicador visual para refletir o agente correto
5. THE cards no WelcomeChat SHALL ter hover states e feedback visual ao clicar

### Requirement 9: Escalabilidade para Novos Agentes

**User Story:** Como desenvolvedor, eu quero adicionar novos agentes facilmente no futuro, para expandir as capacidades do sistema sem refatoração massiva.

#### Acceptance Criteria

1. THE agentConfigs.ts SHALL utilizar estrutura de objeto com chaves sendo agent_type para fácil adição de novos agentes
2. THE Sistema SHALL suportar adição de novos agent_types apenas adicionando entrada no agentConfigs.ts e variável de ambiente correspondente
3. THE validação de agent_type SHALL ser baseada nas chaves do objeto agentConfigs ao invés de lista hardcoded
4. THE WelcomeChat SHALL renderizar cards dinamicamente baseado nas entradas do agentConfigs
5. THE Sistema SHALL NOT requerer mudanças em múltiplos arquivos para adicionar novo agente

### Requirement 10: Compatibilidade com Sistema Existente

**User Story:** Como usuário existente, eu quero que minhas conversas antigas continuem funcionando normalmente, para não perder histórico ou contexto.

#### Acceptance Criteria

1. THE Sistema SHALL aplicar fallback 'dante-ri' para todas as sessões antigas que não possuem agent_type definido
2. THE Sistema SHALL manter compatibilidade com edge function ef_save_chat existente (agent_type opcional)
3. THE Sistema SHALL NOT quebrar funcionalidades existentes de chat, autenticação ou navegação
4. WHEN o Usuário acessa chat antigo sem agent_type, THE Sistema SHALL funcionar normalmente usando fallback
5. THE Sistema SHALL manter estrutura de dados existente na tabela tab_chat_session (agent_type como coluna adicional)
