# VT_DANTE - Visão Geral do Projeto

## 🎯 Descrição
**VT_DANTE** é uma aplicação web de IA especializada em **Registro de Imóveis** e questões jurídicas relacionadas. É um chatbot inteligente que consulta base legal vigente para fornecer orientações sobre procedimentos registrais.

## 🏗️ Arquitetura Técnica

### Stack Principal
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + Radix UI
- **Backend**: Supabase (PostgreSQL + Edge Functions)
- **Autenticação**: Supabase Auth
- **Roteamento**: React Router DOM v7

### Configuração do Ambiente
- **Supabase URL**: `https://oifhsdqivbiyyvfheofx.supabase.co`
- **Database**: PostgreSQL via Supabase
- **Edge Functions**: Deno runtime

## 🔧 Funcionalidades Principais

### 1. Sistema de Autenticação
- Login/Registro com email/senha
- Recuperação de senha via email
- Confirmação de email
- Gerenciamento de sessão persistente
- Perfil do usuário com painel

### 2. Chat Inteligente
- Interface de chat em tempo real
- Simulação de consulta à base legal
- Respostas contextualizadas sobre Registro de Imóveis
- Loading states elaborados com sequência
- Histórico de mensagens na sessão

### 3. Páginas Institucionais
- **HomePage**: Landing page com hero, features, testimonials
- **Como Funciona**: Explicação do sistema
- **Base Legal**: Informações sobre legislação
- **Contato**: Formulário de contato
- **Planos**: Informações de assinatura

### 4. Área de Desenvolvimento
- **DanteUI**: Paleta de cores e componentes de design
- **PayloadTest**: Testes de integração
- **TestePage**: Página de testes diversos

## 🎨 Design System

### Paleta de Cores
- **Primária**: Orange (500-700) - `#F97316` a `#C2410C`
- **Neutros**: Neutral/Gray (50-900)
- **Logo**: Marrom escuro `#3D1413`
- **Acentos**: Red, Green, Sky, Purple, Amber

### Componentes UI
- Sistema baseado em Radix UI
- Componentes customizados (Button, Dialog, Input, Tooltip)
- Design responsivo mobile-first
- Animações com Tailwind CSS

## 🔄 Fluxos Principais

### Fluxo de Autenticação
1. Usuário acessa homepage
2. Clica em "Iniciar Chat" ou "Entrar"
3. Modal de autenticação abre
4. Login/registro via Supabase Auth
5. Redirecionamento para `/chat-page`

### Fluxo de Chat
1. Usuário autenticado acessa `/chat-page`
2. Nova sessão é criada via Edge Function `DT_LOGIN_NEW_SESSION`
3. Interface carrega com mensagem de boas-vindas
4. Usuário envia mensagem
5. Sistema simula consulta à base legal com loading sequence
6. Resposta contextualizada sobre Registro de Imóveis é exibida

## 🛠️ Recursos Técnicos

### Gerenciamento de Estado
- Context API para autenticação global
- useState local para componentes
- Supabase para persistência de dados

### Utilitários
- **Timezone**: Conversão UTC ↔ São Paulo (`src/utils/timezone.ts`)
- **Error Boundary**: Tratamento global de erros
- **Loading States**: UX aprimorada com feedback visual

### Segurança
- Tokens JWT via Supabase Auth
- Validação de sessão em tempo real
- CORS configurado nas Edge Functions
- Sanitização de dados de entrada

## 📱 Responsividade
- Design mobile-first com Tailwind
- Menu hambúrguer para dispositivos móveis
- Layout adaptativo em todas as páginas
- Componentes otimizados para touch

## 🚀 Deploy e Desenvolvimento

### Scripts Disponíveis
- `npm run dev`: Servidor de desenvolvimento
- `npm run build`: Build de produção
- `npm run lint`: Verificação de código
- `npm run preview`: Preview do build

### Estrutura de Build
- **Bundler**: Vite (otimizado)
- **Output**: `dist/` directory
- **Assets**: Otimização automática
- **Source Maps**: Desabilitados em produção