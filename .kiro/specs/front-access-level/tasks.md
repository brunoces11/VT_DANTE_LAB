# Implementation Plan - Front Access Level

- [x] 1. Criar função auxiliar para buscar user_role


  - Adicionar função `getUserRole(userId: string)` no arquivo `services/supabase.ts`
  - Implementar query Supabase para buscar `user_role` da tabela `tab_user`
  - Adicionar error handling robusto (retornar `null` em caso de erro)
  - Garantir que a função segue o padrão das funções existentes no arquivo
  - _Requirements: 1.1, 1.5, 5.1, 5.2, 5.3, 5.6_





- [ ] 2. Estender AuthProvider para incluir user_role
  - [ ] 2.1 Adicionar estado userRole ao AuthProvider
    - Adicionar `useState<string | null>(null)` para armazenar o role
    - Estender interface `AuthContextType` para incluir `userRole: string | null`


    - Expor `userRole` no value do Context Provider
    - _Requirements: 1.2, 1.3, 6.1_

  - [ ] 2.2 Integrar busca de role no listener onAuthStateChange
    - Adicionar busca de role dentro do listener `onAuthStateChange` existente (linha ~80)
    - Buscar role quando `session?.user?.id` existe (cobre login, sessão restaurada, refresh token)

    - Resetar role para `null` quando `session` é `null` (cobre logout)
    - Usar `await getUserRole(session.user.id)` e armazenar em `setUserRole()`
    - Garantir que erros não bloqueiem o fluxo de autenticação (fail-safe)
    - _Requirements: 1.1, 1.5, 6.2_



  - [ ] 2.3 Garantir limpeza de role no logout
    - Verificar que role é resetado para `null` quando `session` é `null` no listener
    - Não precisa adicionar código extra (já coberto pela lógica do item 2.2)
    - Testar que componentes re-renderizam corretamente após logout
    - _Requirements: 1.4_



- [ ] 3. Criar hook customizado useUserRole
  - Criar arquivo `src/hooks/useUserRole.ts`
  - Implementar hook que acessa `AuthContext` e retorna `userRole`
  - Adicionar validação para garantir uso dentro do AuthProvider
  - Lançar erro informativo se usado fora do Provider
  - Garantir que retorna `null` quando não autenticado ou carregando
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 4.1, 4.2_

- [ ] 4. Aplicar controle de visibilidade no dropdown Lab completo
  - Importar hook `useUserRole` no componente `src/components/header.tsx`
  - Envolver TODO o bloco `<div className="relative">` (dropdown completo) na condicional
  - O dropdown inclui: botão "Lab" + ChevronDown + menu com 3 sub-itens (Chat page, Dante UI, Payload Test)
  - Aplicar condicional `{role === 'sadmin' && (<div className="relative">...</div>)}` em 2 lugares:
    - Versão DESKTOP do menu (linha ~130-160)
    - Versão MOBILE do menu (linha ~240-270)
  - Garantir que TODO o dropdown (botão + sub-itens) só aparece quando `role === 'sadmin'`
  - Verificar que dropdown permanece oculto em todos os outros casos (null, outros roles)
  - Testar comportamento durante carregamento (dropdown oculto até confirmação do role)
  - Testar em todas as resoluções (desktop, tablet, mobile)
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 6.3, 6.4_

- [ ] 5. Validação e testes manuais
  - [ ] 5.1 Testar fluxo completo de autenticação
    - Testar login com usuário sem role (null) → Menu Lab oculto
    - Testar login com role 'free' → Menu Lab oculto
    - Testar login com role 'sadmin' → Menu Lab visível
    - Testar logout após ser sadmin → Menu Lab desaparece
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.6_

  - [ ] 5.2 Testar navegação e persistência
    - Navegar entre páginas como sadmin → Menu Lab permanece visível
    - Recarregar página como sadmin → Menu Lab aparece após carregamento
    - Verificar que não há flickers visuais durante carregamento
    - _Requirements: 6.5, 6.4_

  - [ ] 5.3 Testar cenários de erro
    - Simular erro na query (desconectar internet) → Menu Lab oculto
    - Verificar logs no console para debugging
    - Garantir que aplicação continua funcionando normalmente
    - _Requirements: 1.5, 6.3_

  - [ ]* 5.4 Documentar padrão de uso
    - Adicionar comentários no código explicando o padrão
    - Criar exemplo de uso em comentário no hook
    - Documentar como reutilizar em outros componentes
    - _Requirements: 4.4, 4.5_
