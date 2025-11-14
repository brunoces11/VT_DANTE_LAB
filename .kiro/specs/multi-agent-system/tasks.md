# Implementation Plan - Sistema Multi-Agente

## Overview

Este plano de implementação detalha as tarefas de código necessárias para implementar o sistema multi-agente no VT_DANTE. As tarefas estão organizadas em ordem lógica de execução, construindo incrementalmente sobre o código existente.

## Task List

- [x] 1. Criar arquivo de configuração de agentes


  - Criar arquivo `src/config/agentConfigs.ts` com tipos e configurações
  - Definir tipo `AgentType` com valores 'dante-ri' e 'dante-notas'
  - Criar interface `AgentConfig` com estrutura completa
  - Implementar objeto `agentConfigs` com configurações de RI e NOTAS
  - Criar helpers `isValidAgentType()` e `getAvailableAgents()`
  - _Requirements: 3.1, 3.2, 3.3, 9.1, 9.2_



- [ ] 2. Adicionar variável de ambiente para agente NOTAS
  - Adicionar `VITE_LANGFLOW_FLOW_ID_NOTAS=f0492099-6277-4ca3-a022-32a3fb87481a` no arquivo `.env`
  - Verificar que `VITE_LANGFLOW_FLOW_ID_RI` já existe


  - Documentar variáveis no README se necessário
  - _Requirements: 4.5_

- [ ] 3. Modificar serviço Langflow para roteamento por agente
  - Modificar interface de parâmetros de `fun_call_langflow` para aceitar `agent_type` opcional
  - Implementar lógica de seleção de Flow ID baseado em `agent_type`



  - Adicionar fallback para 'dante-ri' se `agent_type` não fornecido
  - Adicionar logs indicando qual agente está sendo usado
  - Implementar tratamento de erro se Flow ID do agente não estiver configurado


  - _Requirements: 4.1, 4.2, 4.3, 4.4, 7.1_

- [ ] 4. Atualizar interface de salvamento para incluir agent_type
  - Modificar interface `SaveChatData` em `services/supabase.ts` para incluir `agent_type` opcional
  - Verificar que edge function `ef_save_chat` já aceita `agent_type` (já implementado)
  - Atualizar chamadas de `saveInBackground` para incluir `agent_type` quando disponível
  - _Requirements: 5.1, 5.2_




- [ ] 5. Criar componente WelcomeChat (seletor de agente)
  - Criar arquivo `src/components/welcome_chat.tsx`
  - Implementar interface `WelcomeChatProps` com callback `onAgentSelect`
  - Criar estrutura visual com título, parágrafo introdutório e grid de cards
  - Renderizar cards dinamicamente baseado em `agentConfigs`
  - Implementar cards clicáveis com hover states
  - Adicionar ícones e cores específicas por agente
  - Tornar responsivo (1 coluna mobile, 2 colunas desktop)


  - _Requirements: 1.1, 1.2, 1.3, 8.2, 8.5_

- [ ] 6. Modificar ChatNeoMsg para ser parametrizado
  - Adicionar prop `agentType` na interface `ChatNeoMsgProps`


  - Importar `agentConfigs` e carregar config do agente ativo
  - Substituir conteúdo hardcoded por valores dinâmicos de `agentConfig`
  - Atualizar título para usar `agentConfig.title`
  - Atualizar descrição para usar `agentConfig.description`
  - Renderizar sugestões dinamicamente de `agentConfig.suggestions`


  - Atualizar placeholder para usar `agentConfig.placeholder`
  - Adicionar indicador visual do agente ativo
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 8.1, 8.3_

- [x] 7. Adicionar estado de agent_type no ChatPage


  - Adicionar estado `currentAgentType` com tipo `AgentType` e valor inicial 'dante-ri'
  - Adicionar estado `showWelcomeChat` com tipo `boolean` e valor inicial `false`
  - Importar tipos e helpers de `agentConfigs.ts`
  - _Requirements: 1.5, 6.1_



- [ ] 8. Modificar fun_create_chat_session para receber agentType
  - Modificar assinatura da função para aceitar parâmetro `agentType: AgentType`
  - Adicionar chamada `setCurrentAgentType(agentType)` dentro da função
  - Atualizar log para incluir qual agente está sendo usado


  - Atualizar chamada de `persistUIState` se necessário
  - _Requirements: 2.5, 6.2_

- [ ] 9. Modificar fun_load_chat_session para carregar agent_type
  - Adicionar extração de `agent_type` dos dados da sessão



  - Implementar fallback para 'dante-ri' se `agent_type` não existir
  - Adicionar chamada `setCurrentAgentType(chatAgentType)`
  - Adicionar log indicando qual agente foi carregado
  - _Requirements: 5.3, 5.4, 5.5, 10.1, 10.4_

- [ ] 10. Modificar handleFirstMessage para incluir agent_type
  - Atualizar chamada `fun_call_langflow` para incluir `agent_type: currentAgentType`
  - Atualizar objeto `saveData` para incluir `agent_type: currentAgentType`
  - Verificar que logs indicam qual agente está sendo usado
  - _Requirements: 6.4, 6.5_

- [ ] 11. Detectar entrada via Header e exibir WelcomeChat
  - Criar `useEffect` para detectar `location.state.startWelcome`
  - Implementar lógica para `setShowWelcomeChat(true)` quando detectado
  - Implementar lógica para `setIsWelcomeForced(true)`
  - Limpar state com `navigate(location.pathname, { replace: true, state: {} })`
  - _Requirements: 1.1, 1.4_

- [ ] 12. Implementar callback onAgentSelect no WelcomeChat
  - Criar função handler que recebe `agentType` selecionado
  - Implementar `setCurrentAgentType(agentType)`
  - Implementar `setShowWelcomeChat(false)`
  - Implementar `setIsWelcomeMode(true)`
  - _Requirements: 1.3, 1.5_

- [ ] 13. Atualizar renderização condicional no ChatPage
  - Modificar JSX para renderizar `WelcomeChat` quando `showWelcomeChat === true`
  - Passar callback `onAgentSelect` para `WelcomeChat`
  - Manter renderização de `ChatArea` quando `showWelcomeChat === false`
  - _Requirements: 1.1, 1.4_


- [ ] 14. Modificar SidebarCollapse para 2 botões de novo chat
  - Atualizar interface `SidebarCollapseProps` para `onNewChat: (agentType: AgentType) => void`
  - Substituir botão único "Novo Chat" por container com 2 botões
  - Criar botão "Novo Chat - RI" que chama `onNewChat('dante-ri')`
  - Criar botão "Novo Chat - NOTAS" que chama `onNewChat('dante-notas')`
  - Aplicar cores distintas (orange para RI, blue para NOTAS)
  - Atualizar versão colapsada com tooltips e ícones
  - _Requirements: 2.1, 2.2, 2.3, 8.2_

- [ ] 15. Atualizar passagem de props no ChatPage para Sidebar
  - Modificar prop `onNewChat` passada para `SidebarCollapse`
  - Garantir que `fun_create_chat_session` está sendo passada corretamente
  - Verificar que assinatura da função está compatível
  - _Requirements: 2.5_

- [ ] 16. Adicionar prop currentAgentType no ChatArea
  - Atualizar interface `ChatAreaProps` para incluir `currentAgentType: AgentType`
  - Atualizar destructuring de props no componente
  - _Requirements: 6.2, 6.3_

- [ ] 17. Passar currentAgentType para ChatNeoMsg no ChatArea
  - Atualizar JSX de renderização de `ChatNeoMsg` para incluir prop `agentType={currentAgentType}`
  - Verificar que prop está sendo passada corretamente
  - _Requirements: 3.1, 6.3_

- [ ] 18. Modificar handleSendMessage no ChatArea para incluir agent_type
  - Atualizar chamada `fun_call_langflow` para incluir `agent_type: currentAgentType`
  - Atualizar objeto `saveData` para incluir `agent_type: currentAgentType`
  - Verificar que logs indicam qual agente está sendo usado
  - _Requirements: 6.4, 6.5_

- [ ] 19. Passar currentAgentType do ChatPage para ChatArea
  - Atualizar JSX de renderização de `ChatArea` no `ChatPage`
  - Adicionar prop `currentAgentType={currentAgentType}`
  - Verificar que prop está sendo passada corretamente
  - _Requirements: 6.2_

- [ ] 20. Atualizar cache service para incluir agent_type
  - Modificar interface de sessão no `SafeCache` para incluir `agent_type` opcional
  - Atualizar função `convertToSafeCache` para extrair `agent_type` das sessões
  - Atualizar função `addSessionToCache` para aceitar `agent_type`
  - Atualizar função `updateSessionInCache` para permitir atualizar `agent_type`
  - _Requirements: 5.1, 5.2_

- [ ] 21. Implementar validação de agent_type no frontend
  - Criar função de validação usando `isValidAgentType` helper
  - Adicionar validação antes de chamar `fun_call_langflow`
  - Adicionar validação antes de salvar no banco
  - Implementar fallback para 'dante-ri' em caso de valor inválido
  - Adicionar logs de warning quando fallback é usado
  - _Requirements: 7.2, 7.3, 10.3_

- [ ] 22. Adicionar tratamento de erro para agente indisponível
  - Implementar verificação de variáveis de ambiente no `fun_call_langflow`
  - Criar mensagem de erro amigável quando Flow ID não está configurado
  - Sugerir ao usuário tentar outro agente
  - Adicionar logs de erro detalhados no console
  - _Requirements: 7.1, 7.4_

- [ ] 23. Implementar persistência de agent_type no estado da UI
  - Atualizar função `persistUIState` para incluir `currentAgentType` se necessário
  - Verificar que `currentAgentType` é restaurado ao recarregar página
  - Testar que alternância entre chats mantém contexto correto
  - _Requirements: 5.3, 5.4, 10.2_

- [ ]* 24. Adicionar testes unitários para agentConfigs
  - Criar arquivo de teste `src/config/agentConfigs.test.ts`
  - Testar helper `isValidAgentType` com valores válidos e inválidos
  - Testar helper `getAvailableAgents` retorna array correto
  - Testar estrutura de `agentConfigs` está completa
  - Verificar que todos os agentes têm todas as propriedades obrigatórias
  - _Requirements: 9.3_

- [ ]* 25. Adicionar testes unitários para fun_call_langflow
  - Criar testes para roteamento correto de Flow IDs
  - Testar fallback para 'dante-ri' quando agent_type não fornecido
  - Testar tratamento de erro quando Flow ID não configurado
  - Mockar chamadas fetch e verificar URLs corretas
  - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [ ]* 26. Adicionar testes de integração para fluxo completo
  - Testar Fluxo 1: Site → WelcomeChat → Seleção → Primeira mensagem
  - Testar Fluxo 2: Sidebar → Novo Chat RI/NOTAS → Primeira mensagem
  - Testar Fluxo 3: Carregar chat antigo com agent_type
  - Testar Fluxo 3b: Carregar chat antigo sem agent_type (fallback)
  - Testar alternância entre chats de agentes diferentes
  - _Requirements: 1.1, 1.2, 1.3, 2.1, 2.2, 5.3, 5.4_

- [ ]* 27. Adicionar testes E2E para cenários críticos
  - Testar fluxo completo de usuário novo (site → seleção → conversa)
  - Testar criação de múltiplos chats com agentes diferentes
  - Testar refresh da página mantém contexto
  - Testar logout e login mantém histórico
  - Testar tratamento de erros (agente indisponível)
  - _Requirements: 7.1, 7.4, 10.2, 10.3_

- [ ] 28. Validação final e testes manuais
  - Verificar todos os cenários do manual testing checklist
  - Testar em diferentes navegadores (Chrome, Firefox, Safari)
  - Testar em diferentes dispositivos (desktop, tablet, mobile)
  - Verificar logs no console estão corretos e informativos
  - Verificar que não há erros ou warnings inesperados
  - Testar performance (tempo de carregamento, responsividade)
  - _Requirements: Todos_

## Implementation Notes

### Ordem de Execução Recomendada

**Fase 1: Fundação (Tasks 1-4)**
- Criar configurações e tipos base
- Modificar serviços para suportar agent_type
- Sem mudanças visíveis na UI ainda

**Fase 2: Componentes Visuais (Tasks 5-6)**
- Criar WelcomeChat
- Parametrizar ChatNeoMsg
- Componentes prontos mas ainda não integrados

**Fase 3: Estado e Lógica (Tasks 7-13)**
- Adicionar estado no ChatPage
- Modificar funções para usar agent_type
- Integrar WelcomeChat no fluxo

**Fase 4: Sidebar e Propagação (Tasks 14-19)**
- Modificar Sidebar para 2 botões
- Propagar agent_type por todos os componentes
- Sistema completo e funcional

**Fase 5: Refinamento (Tasks 20-23)**
- Cache e persistência
- Validação e tratamento de erros
- Polimento final

**Fase 6: Testes (Tasks 24-28)**
- Testes unitários, integração e E2E
- Validação manual completa
- Pronto para deploy

### Dependências entre Tasks

- Task 6 depende de Task 1 (agentConfigs)
- Tasks 7-13 dependem de Tasks 1-6 (fundação)
- Tasks 14-19 dependem de Tasks 7-13 (estado)
- Tasks 20-23 dependem de Tasks 1-19 (sistema completo)
- Tasks 24-27 dependem de Tasks 1-23 (código completo)
- Task 28 depende de todas as anteriores

### Estimativas de Tempo

- **Fase 1**: 1-2 horas
- **Fase 2**: 2-3 horas
- **Fase 3**: 3-4 horas
- **Fase 4**: 2-3 horas
- **Fase 5**: 1-2 horas
- **Fase 6**: 4-6 horas (se implementar todos os testes)

**Total**: 13-20 horas (sem testes opcionais: 9-14 horas)

### Pontos de Verificação

Após cada fase, verificar:
1. ✅ Código compila sem erros
2. ✅ Não há warnings críticos no console
3. ✅ Funcionalidades existentes continuam funcionando
4. ✅ Novos recursos funcionam conforme esperado
5. ✅ Logs indicam comportamento correto

### Rollback Points

Se algo der errado:
- **Após Fase 1**: Reverter mudanças em services, sistema volta ao normal
- **Após Fase 2**: Componentes novos não afetam sistema existente
- **Após Fase 3**: Remover estado novo, usar valores hardcoded
- **Após Fase 4**: Sistema deve estar funcional, apenas ajustes finos

### Considerações Especiais

1. **Compatibilidade**: Todas as mudanças mantêm compatibilidade com chats antigos
2. **Fallback**: Sistema sempre funciona com 'dante-ri' como padrão
3. **Incremental**: Cada task adiciona funcionalidade sem quebrar existente
4. **Testável**: Cada fase pode ser testada independentemente
5. **Reversível**: Mudanças podem ser revertidas sem perda de dados

## Success Criteria

O sistema multi-agente estará completo quando:

1. ✅ Usuário vindo do site vê WelcomeChat e pode escolher agente
2. ✅ Usuário no chat pode criar novo chat escolhendo agente (2 botões)
3. ✅ ChatNeoMsg exibe conteúdo específico do agente selecionado
4. ✅ Primeira mensagem é enviada para endpoint correto do agente
5. ✅ Mensagens são salvas no banco com agent_type correto
6. ✅ Chats antigos carregam com agent_type correto (ou fallback)
7. ✅ Novas mensagens em chat antigo usam agent_type da sessão
8. ✅ Alternância entre chats mantém contexto de cada agente
9. ✅ Refresh da página mantém estado correto
10. ✅ Erros são tratados graciosamente com mensagens amigáveis
11. ✅ Sistema funciona mesmo se um agente estiver indisponível
12. ✅ Adicionar novo agente requer apenas config + env var

## Post-Implementation

Após implementação completa:

1. **Documentação**: Atualizar README com informações sobre agentes
2. **Monitoramento**: Adicionar logs/analytics para uso por agente
3. **Feedback**: Coletar feedback de usuários sobre experiência
4. **Otimização**: Ajustar baseado em métricas de uso
5. **Expansão**: Planejar adição de novos agentes baseado em demanda
