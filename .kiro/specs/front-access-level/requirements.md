# Requirements Document - Front Access Level

## Introduction

Este documento define os requisitos para implementar um sistema minimalista de controle de exibição de elementos de UI baseado no `user_role` do usuário autenticado. O objetivo principal é ocultar/exibir componentes visuais condicionalmente de acordo com o perfil de acesso do usuário, começando com o item de menu "Lab" no header, que deve ser visível apenas para usuários com role `sadmin` (super admin).

O sistema deve ser simples, reutilizável e seguir o padrão Supabase, utilizando dados já existentes na tabela `tab_user` sem necessidade de Edge Functions adicionais.

## Requirements

### Requirement 1: Buscar Role do Usuário no Login

**User Story:** Como desenvolvedor, eu quero que o sistema busque automaticamente o `user_role` do usuário durante o login, para que essa informação esteja disponível globalmente na aplicação.

#### Acceptance Criteria

1. WHEN o usuário faz login com sucesso THEN o sistema SHALL buscar o campo `user_role` da tabela `tab_user` usando o `user_id` da sessão autenticada
2. WHEN o `user_role` é recuperado do banco THEN o sistema SHALL armazenar esse valor no contexto de autenticação existente (`AuthProvider`)
3. IF o campo `user_role` for `null` no banco THEN o sistema SHALL tratar como usuário sem permissões especiais
4. WHEN o usuário faz logout THEN o sistema SHALL limpar o `user_role` do contexto
5. WHEN ocorrer erro ao buscar o `user_role` THEN o sistema SHALL assumir que o usuário não tem permissões especiais e continuar a execução normalmente

### Requirement 2: Expor Role via Hook Customizado

**User Story:** Como desenvolvedor, eu quero um hook React simples que retorne o `user_role` do usuário atual, para que eu possa usar essa informação em qualquer componente da aplicação.

#### Acceptance Criteria

1. WHEN um componente chama o hook `useUserRole()` THEN o sistema SHALL retornar o valor atual de `user_role` do contexto de autenticação
2. IF o usuário não estiver autenticado THEN o hook SHALL retornar `null`
3. IF o `user_role` ainda estiver sendo carregado THEN o hook SHALL retornar `null` (comportamento fail-safe)
4. WHEN o `user_role` muda no contexto THEN todos os componentes usando o hook SHALL re-renderizar automaticamente com o novo valor
5. WHEN o hook é usado fora do `AuthProvider` THEN o sistema SHALL lançar um erro informativo

### Requirement 3: Controlar Visibilidade do Menu "Lab"

**User Story:** Como super administrador do sistema, eu quero que o item de menu "Lab" no header seja visível apenas para usuários com role `sadmin`, para que funcionalidades administrativas fiquem ocultas de usuários comuns e administradores regulares.

#### Acceptance Criteria

1. WHEN um usuário com `user_role = 'sadmin'` está autenticado THEN o item de menu "Lab" SHALL ser exibido no header
2. WHEN um usuário com `user_role` diferente de `'sadmin'` está autenticado THEN o item de menu "Lab" SHALL permanecer oculto
3. WHEN um usuário com `user_role = null` está autenticado THEN o item de menu "Lab" SHALL permanecer oculto
4. WHEN nenhum usuário está autenticado THEN o item de menu "Lab" SHALL permanecer oculto
5. WHEN o `user_role` ainda está sendo carregado após o login THEN o item de menu "Lab" SHALL permanecer oculto até a confirmação do role
6. WHEN o usuário faz logout THEN o item de menu "Lab" SHALL desaparecer imediatamente

### Requirement 4: Garantir Reutilização da Solução

**User Story:** Como desenvolvedor, eu quero que a solução de controle de visibilidade seja facilmente reutilizável em outros componentes, para que eu possa aplicar a mesma lógica em diferentes partes da aplicação sem duplicar código.

#### Acceptance Criteria

1. WHEN a solução é implementada THEN ela SHALL ser baseada em um hook customizado que pode ser importado em qualquer componente
2. WHEN um desenvolvedor precisa controlar visibilidade baseada em role THEN ele SHALL poder usar o mesmo padrão aplicado no menu "Lab"
3. WHEN a lógica de verificação de role precisa ser alterada THEN a mudança SHALL afetar todos os componentes que usam o hook automaticamente
4. WHEN novos casos de uso surgem THEN o hook SHALL funcionar sem modificações adicionais
5. WHEN a documentação é consultada THEN ela SHALL incluir exemplos claros de como reutilizar o hook em diferentes cenários

### Requirement 5: Manter Compatibilidade com Padrão Supabase

**User Story:** Como arquiteto de software, eu quero que a solução siga rigorosamente o padrão Supabase de desenvolvimento, para garantir compatibilidade, manutenibilidade e alinhamento com as melhores práticas do ecossistema.

#### Acceptance Criteria

1. WHEN dados do usuário são buscados THEN o sistema SHALL usar o cliente Supabase oficial (`@supabase/supabase-js`)
2. WHEN queries são executadas THEN elas SHALL usar a API do Supabase Client ao invés de chamadas HTTP diretas
3. WHEN o `user_role` é buscado THEN a query SHALL referenciar corretamente a tabela `tab_user` conforme o schema definido
4. WHEN a autenticação é verificada THEN o sistema SHALL usar `supabase.auth.getUser()` ou `supabase.auth.getSession()` conforme padrão Supabase
5. IF Edge Functions forem necessárias no futuro THEN a arquitetura SHALL permitir integração sem refatoração significativa
6. WHEN funções auxiliares são criadas THEN elas SHALL ser adicionadas ao arquivo `services/supabase.ts` seguindo o padrão do projeto

### Requirement 6: Garantir Performance e UX

**User Story:** Como usuário final, eu quero que o sistema responda rapidamente e não mostre elementos que depois desaparecem, para ter uma experiência fluida e sem "flickers" visuais.

#### Acceptance Criteria

1. WHEN o usuário faz login THEN o `user_role` SHALL ser carregado uma única vez e cacheado no contexto
2. WHEN componentes verificam o role THEN eles SHALL ler do contexto sem fazer novas queries ao banco
3. WHEN o role ainda está sendo carregado THEN elementos protegidos SHALL permanecer ocultos (fail-safe)
4. WHEN o role é confirmado THEN elementos permitidos SHALL aparecer sem delay perceptível
5. WHEN o usuário navega entre páginas THEN o role SHALL permanecer disponível sem novas buscas ao banco
6. WHEN ocorre re-renderização de componentes THEN o hook SHALL retornar o valor cacheado sem causar queries adicionais
