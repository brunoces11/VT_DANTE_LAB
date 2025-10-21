# Requirements Document

## Introduction

Este documento define os requisitos para implementação de um rodapé global que será aplicado em todas as páginas do site VT_DANTE, exceto na página de chat. O rodapé deve seguir o design system existente e utilizar a mesma cor marrom do ícone da logo presente no header.

## Requirements

### Requirement 1

**User Story:** Como um visitante do site, eu quero ver um rodapé consistente em todas as páginas para ter acesso fácil a informações importantes e links de navegação.

#### Acceptance Criteria

1. WHEN um usuário acessa qualquer página do site THEN o sistema SHALL exibir o rodapé global na parte inferior
2. WHEN um usuário acessa a página de chat THEN o sistema SHALL NOT exibir o rodapé
3. WHEN o rodapé é renderizado THEN o sistema SHALL usar a mesma cor marrom fechado do ícone da logo do header como cor de fundo

### Requirement 2

**User Story:** Como um visitante do site, eu quero ver informações organizadas sobre o Dante IA no rodapé para entender melhor o produto.

#### Acceptance Criteria

1. WHEN o rodapé é exibido THEN o sistema SHALL mostrar três colunas de conteúdo
2. WHEN a primeira coluna é renderizada THEN o sistema SHALL exibir um breve parágrafo descritivo sobre o Dante IA
3. WHEN o conteúdo é exibido THEN o sistema SHALL usar tipografia consistente com o design system

### Requirement 3

**User Story:** Como um visitante do site, eu quero acessar os links principais de navegação através do rodapé para navegar facilmente pelo site.

#### Acceptance Criteria

1. WHEN a segunda coluna do rodapé é renderizada THEN o sistema SHALL exibir links do menu principal
2. WHEN os links são listados THEN o sistema SHALL NOT incluir o link de contato (reservado para coluna 3)
3. WHEN um usuário clica em um link THEN o sistema SHALL navegar para a página correspondente
4. WHEN os links são exibidos THEN o sistema SHALL usar hover states consistentes

### Requirement 4

**User Story:** Como um visitante do site, eu quero encontrar informações de contato facilmente no rodapé para poder entrar em contato com a empresa.

#### Acceptance Criteria

1. WHEN a terceira coluna do rodapé é renderizada THEN o sistema SHALL exibir seção de contato
2. WHEN a seção de contato é exibida THEN o sistema SHALL mostrar o título "Contato"
3. WHEN as informações de contato são listadas THEN o sistema SHALL exibir "contato@dante-ia.com"
4. WHEN a localização é mostrada THEN o sistema SHALL exibir "Santa Catarina, SC / Brasil"

### Requirement 5

**User Story:** Como um visitante do site, eu quero ver informações de copyright no rodapé para entender os direitos autorais do conteúdo.

#### Acceptance Criteria

1. WHEN o rodapé é renderizado THEN o sistema SHALL exibir uma linha divisória elegante abaixo das três colunas
2. WHEN a linha divisória é exibida THEN o sistema SHALL usar uma linha fina e elegante
3. WHEN a seção de copyright é renderizada THEN o sistema SHALL exibir "© 2025 Copyright. Todos os direitos reservados a Dante-IA ©"
4. WHEN o copyright é exibido THEN o sistema SHALL centralizar o texto

### Requirement 6

**User Story:** Como um desenvolvedor, eu quero que o rodapé seja um componente reutilizável para manter consistência e facilitar manutenção.

#### Acceptance Criteria

1. WHEN o rodapé é implementado THEN o sistema SHALL criar um componente React reutilizável
2. WHEN o componente é criado THEN o sistema SHALL seguir as convenções de nomenclatura do projeto
3. WHEN o rodapé é integrado THEN o sistema SHALL ser aplicado automaticamente em todas as páginas exceto chat
4. WHEN o componente é desenvolvido THEN o sistema SHALL usar TypeScript para type safety

### Requirement 7

**User Story:** Como um usuário mobile, eu quero que o rodapé seja responsivo para ter uma boa experiência em dispositivos móveis.

#### Acceptance Criteria

1. WHEN o rodapé é exibido em dispositivos móveis THEN o sistema SHALL adaptar o layout para telas menores
2. WHEN em breakpoint mobile THEN o sistema SHALL empilhar as colunas verticalmente
3. WHEN o layout é adaptado THEN o sistema SHALL manter legibilidade e espaçamento adequados
4. WHEN em diferentes tamanhos de tela THEN o sistema SHALL manter a hierarquia visual