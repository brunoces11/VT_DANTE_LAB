# 🎨 EXEMPLOS PRÁTICOS: CONVERSÃO PARA DARK MODE

## 📋 ÍNDICE

1. [Header / Navbar](#1-header--navbar)
2. [Sidebar / Menu Lateral](#2-sidebar--menu-lateral)
3. [Chat Area](#3-chat-area)
4. [Cards](#4-cards)
5. [Modais / Dialogs](#5-modais--dialogs)
6. [Formulários / Inputs](#6-formulários--inputs)
7. [Botões](#7-botões)
8. [Dropdown / Menu Contextual](#8-dropdown--menu-contextual)

---

## 1. HEADER / NAVBAR

### ❌ ANTES (cores fixas)

```jsx
<header className="
  fixed top-0 left-0 right-0 z-50
  bg-white                    ← FIXO: branco
  border-b border-gray-200    ← FIXO: cinza claro
  shadow-sm
">
  <div className="container mx-auto px-4 py-3 flex items-center justify-between">
    <h1 className="text-2xl font-bold text-gray-900">  ← FIXO: quase preto
      Dante AI
    </h1>
    <nav className="flex items-center space-x-4">
      <a href="#" className="text-gray-600 hover:text-gray-900">  ← FIXO
        Início
      </a>
    </nav>
  </div>
</header>
```

### ✅ DEPOIS (dark mode compatível)

```jsx
<header className="
  fixed top-0 left-0 right-0 z-50
  bg-background                    ← DINÂMICO: branco (light) / preto (dark)
  border-b border-border           ← DINÂMICO: adapta automaticamente
  shadow-sm
">
  <div className="container mx-auto px-4 py-3 flex items-center justify-between">
    <h1 className="text-2xl font-bold text-foreground">  ← DINÂMICO
      Dante AI
    </h1>
    <nav className="flex items-center space-x-4">
      <a href="#" className="
        text-muted-foreground           ← DINÂMICO: cinza adaptável
        hover:text-foreground           ← DINÂMICO: adapta no hover
      ">
        Início
      </a>
    </nav>
  </div>
</header>
```

**Resultado:**
- **Light Mode**: fundo branco, texto preto
- **Dark Mode**: fundo #0A0A0A, texto #FAFAFA

---

## 2. SIDEBAR / MENU LATERAL

### ❌ ANTES

```jsx
<aside className="
  w-64 h-screen
  bg-gray-50           ← FIXO
  border-r border-gray-200   ← FIXO
">
  <div className="p-4">
    {/* Item de chat */}
    <div className="
      p-3 rounded-lg mb-2
      bg-white              ← FIXO
      hover:bg-gray-100     ← FIXO
      border border-gray-200    ← FIXO
    ">
      <h3 className="font-medium text-gray-900">  ← FIXO
        Conversa 1
      </h3>
      <p className="text-sm text-gray-500">  ← FIXO
        Última mensagem...
      </p>
    </div>
  </div>
</aside>
```

### ✅ DEPOIS

```jsx
<aside className="
  w-64 h-screen
  bg-muted                      ← DINÂMICO: cinza claro (light) / cinza escuro (dark)
  border-r border-border        ← DINÂMICO
">
  <div className="p-4">
    {/* Item de chat */}
    <div className="
      p-3 rounded-lg mb-2
      bg-background                 ← DINÂMICO
      hover:bg-accent               ← DINÂMICO: cor de hover adaptável
      border border-border          ← DINÂMICO
    ">
      <h3 className="font-medium text-foreground">  ← DINÂMICO
        Conversa 1
      </h3>
      <p className="text-sm text-muted-foreground">  ← DINÂMICO
        Última mensagem...
      </p>
    </div>
  </div>
</aside>
```

**Cores aplicadas automaticamente:**
- `bg-muted`: #F9F9F9 → #262626
- `bg-background`: #FFFFFF → #0A0A0A
- `bg-accent (hover)`: #F5F5F5 → #262626

---

## 3. CHAT AREA

### ❌ ANTES

```jsx
{/* Mensagem do usuário */}
<div className="flex justify-end mb-4">
  <div className="
    max-w-[70%]
    bg-orange-500       ← OK (cor temática, pode manter)
    text-white
    rounded-lg p-4
  ">
    Como fazer registro de imóvel?
  </div>
</div>

{/* Mensagem do bot */}
<div className="flex justify-start mb-4">
  <div className="
    max-w-[70%]
    bg-white                ← FIXO
    text-gray-900           ← FIXO
    border border-gray-200  ← FIXO
    rounded-lg p-4
  ">
    Para fazer o registro de imóvel...
  </div>
</div>
```

### ✅ DEPOIS

```jsx
{/* Mensagem do usuário */}
<div className="flex justify-end mb-4">
  <div className="
    max-w-[70%]
    bg-orange-500       ← MANTIDO (cor de marca)
    text-white
    rounded-lg p-4
  ">
    Como fazer registro de imóvel?
  </div>
</div>

{/* Mensagem do bot */}
<div className="flex justify-start mb-4">
  <div className="
    max-w-[70%]
    bg-card                    ← DINÂMICO
    text-card-foreground       ← DINÂMICO
    border border-border       ← DINÂMICO
    rounded-lg p-4
  ">
    Para fazer o registro de imóvel...
  </div>
</div>
```

**Cores de marca (orange-500) podem ser mantidas!**

---

## 4. CARDS

### ❌ ANTES

```jsx
<div className="
  bg-white                    ← FIXO
  rounded-xl
  shadow-lg
  border border-gray-200      ← FIXO
  p-6
">
  <div className="flex items-center mb-4">
    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
      <BrainIcon className="h-6 w-6 text-orange-600" />
    </div>
    <h3 className="ml-4 text-xl font-bold text-gray-900">  ← FIXO
      Consulta Inteligente
    </h3>
  </div>
  <p className="text-gray-600">  ← FIXO
    Respostas precisas baseadas na legislação vigente.
  </p>
</div>
```

### ✅ DEPOIS (Opção 1: Classes Semânticas)

```jsx
<div className="
  bg-card                         ← DINÂMICO
  rounded-xl
  shadow-lg
  border border-border            ← DINÂMICO
  p-6
">
  <div className="flex items-center mb-4">
    <div className="
      w-12 h-12
      bg-orange-100 dark:bg-orange-900/30    ← Cor temática adaptada
      rounded-lg flex items-center justify-center
    ">
      <BrainIcon className="h-6 w-6 text-orange-600 dark:text-orange-400" />
    </div>
    <h3 className="ml-4 text-xl font-bold text-card-foreground">  ← DINÂMICO
      Consulta Inteligente
    </h3>
  </div>
  <p className="text-muted-foreground">  ← DINÂMICO
    Respostas precisas baseadas na legislação vigente.
  </p>
</div>
```

### ✅ DEPOIS (Opção 2: Prefixo `dark:`)

```jsx
<div className="
  bg-white dark:bg-neutral-900           ← Cores específicas
  rounded-xl
  shadow-lg
  border border-gray-200 dark:border-neutral-700
  p-6
">
  <h3 className="text-gray-900 dark:text-neutral-100">
    Consulta Inteligente
  </h3>
  <p className="text-gray-600 dark:text-neutral-400">
    Respostas precisas baseadas na legislação vigente.
  </p>
</div>
```

**Escolha Opção 1 (semântico) quando possível!**

---

## 5. MODAIS / DIALOGS

### ❌ ANTES

```jsx
<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent className="
    max-w-md
    bg-white                  ← FIXO
    border border-gray-300    ← FIXO
  ">
    <DialogHeader>
      <DialogTitle className="text-2xl font-bold text-gray-900">  ← FIXO
        Confirmar Ação
      </DialogTitle>
      <p className="text-sm text-gray-600 mt-2">  ← FIXO
        Tem certeza que deseja continuar?
      </p>
    </DialogHeader>

    <div className="flex justify-end space-x-2 mt-6">
      <Button variant="outline" className="border-gray-300 text-gray-700">  ← FIXO
        Cancelar
      </Button>
      <Button className="bg-orange-500 text-white">
        Confirmar
      </Button>
    </div>
  </DialogContent>
</Dialog>
```

### ✅ DEPOIS

```jsx
<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent className="
    max-w-md
    bg-popover                    ← DINÂMICO
    border border-border          ← DINÂMICO
  ">
    <DialogHeader>
      <DialogTitle className="text-2xl font-bold text-foreground">  ← DINÂMICO
        Confirmar Ação
      </DialogTitle>
      <p className="text-sm text-muted-foreground mt-2">  ← DINÂMICO
        Tem certeza que deseja continuar?
      </p>
    </DialogHeader>

    <div className="flex justify-end space-x-2 mt-6">
      <Button variant="outline">  ← Componente já adapta automaticamente
        Cancelar
      </Button>
      <Button className="bg-orange-500 text-white">  ← Cor de marca mantida
        Confirmar
      </Button>
    </div>
  </DialogContent>
</Dialog>
```

**Os componentes UI (shadcn/Radix) já são dark mode compatíveis!**

---

## 6. FORMULÁRIOS / INPUTS

### ❌ ANTES

```jsx
<form className="space-y-4">
  <div>
    <label className="
      block text-sm font-medium
      text-gray-700           ← FIXO
      mb-2
    ">
      Email
    </label>
    <input
      type="email"
      className="
        w-full px-4 py-2
        bg-white              ← FIXO
        border border-gray-300    ← FIXO
        text-gray-900         ← FIXO
        placeholder:text-gray-400  ← FIXO
        focus:ring-2 focus:ring-orange-500
        rounded-lg
      "
      placeholder="seu@email.com"
    />
  </div>
</form>
```

### ✅ DEPOIS (Usando componente Input)

```jsx
import { Input } from '@/components/ui/input';

<form className="space-y-4">
  <div>
    <label className="
      block text-sm font-medium
      text-foreground           ← DINÂMICO
      mb-2
    ">
      Email
    </label>
    <Input                      ← Componente já adapta!
      type="email"
      placeholder="seu@email.com"
    />
  </div>
</form>
```

### ✅ DEPOIS (Input customizado)

```jsx
<input
  type="email"
  className="
    w-full px-4 py-2
    bg-background                      ← DINÂMICO
    border border-input                ← DINÂMICO
    text-foreground                    ← DINÂMICO
    placeholder:text-muted-foreground  ← DINÂMICO
    focus:ring-2 focus:ring-orange-500
    rounded-lg
  "
  placeholder="seu@email.com"
/>
```

---

## 7. BOTÕES

### ❌ ANTES

```jsx
{/* Botão Primário */}
<button className="
  px-4 py-2
  bg-orange-500
  text-white
  hover:bg-orange-600
  rounded-lg
">
  Enviar
</button>

{/* Botão Secundário */}
<button className="
  px-4 py-2
  bg-gray-100           ← FIXO
  text-gray-900         ← FIXO
  hover:bg-gray-200     ← FIXO
  border border-gray-300    ← FIXO
  rounded-lg
">
  Cancelar
</button>
```

### ✅ DEPOIS (Usando componente Button)

```jsx
import { Button } from '@/components/ui/button';

{/* Botão Primário */}
<Button className="bg-orange-500 hover:bg-orange-600 text-white">
  Enviar
</Button>

{/* Botão Secundário */}
<Button variant="outline">  ← Adapta automaticamente!
  Cancelar
</Button>
```

### ✅ DEPOIS (Botão customizado)

```jsx
{/* Botão Secundário com dark mode */}
<button className="
  px-4 py-2
  bg-secondary                    ← DINÂMICO
  text-secondary-foreground       ← DINÂMICO
  hover:bg-secondary/80           ← DINÂMICO com opacidade
  border border-border            ← DINÂMICO
  rounded-lg
">
  Cancelar
</button>
```

---

## 8. DROPDOWN / MENU CONTEXTUAL

### ❌ ANTES

```jsx
{isDropdownOpen && (
  <div className="
    absolute right-0 top-full mt-2
    w-48
    bg-white                  ← FIXO
    rounded-lg shadow-lg
    border border-gray-200    ← FIXO
    py-2
    z-50
  ">
    <button className="
      w-full text-left px-4 py-2
      text-sm text-gray-700     ← FIXO
      hover:bg-gray-50          ← FIXO
      hover:text-gray-900       ← FIXO
      flex items-center space-x-2
    ">
      <SettingsIcon className="h-4 w-4" />
      <span>Configurações</span>
    </button>

    <button className="
      w-full text-left px-4 py-2
      text-sm text-red-600
      hover:bg-red-50           ← FIXO (mas ok, é warning)
      flex items-center space-x-2
    ">
      <LogOutIcon className="h-4 w-4" />
      <span>Sair</span>
    </button>
  </div>
)}
```

### ✅ DEPOIS

```jsx
{isDropdownOpen && (
  <div className="
    absolute right-0 top-full mt-2
    w-48
    bg-popover                      ← DINÂMICO
    rounded-lg shadow-lg
    border border-border            ← DINÂMICO
    py-2
    z-50
  ">
    <button className="
      w-full text-left px-4 py-2
      text-sm text-popover-foreground     ← DINÂMICO
      hover:bg-accent                     ← DINÂMICO
      hover:text-accent-foreground        ← DINÂMICO
      flex items-center space-x-2
    ">
      <SettingsIcon className="h-4 w-4" />
      <span>Configurações</span>
    </button>

    <button className="
      w-full text-left px-4 py-2
      text-sm text-red-600 dark:text-red-400    ← Cor semântica adaptada
      hover:bg-red-50 dark:hover:bg-red-900/20  ← Hover adaptado
      flex items-center space-x-2
    ">
      <LogOutIcon className="h-4 w-4" />
      <span>Sair</span>
    </button>
  </div>
)}
```

---

## 🎨 TABELA DE CONVERSÃO RÁPIDA

| ❌ Classe Fixa | ✅ Classe Dinâmica | Contexto |
|---------------|-------------------|----------|
| `bg-white` | `bg-background` | Fundo principal |
| `bg-gray-50` | `bg-muted` | Fundo secundário |
| `text-black` | `text-foreground` | Texto principal |
| `text-gray-900` | `text-foreground` | Texto principal |
| `text-gray-600` | `text-muted-foreground` | Texto secundário |
| `text-gray-500` | `text-muted-foreground` | Texto terciário |
| `border-gray-200` | `border-border` | Bordas |
| `border-gray-300` | `border-border` | Bordas |
| `bg-gray-100` | `bg-secondary` | Botões secundários |
| `hover:bg-gray-100` | `hover:bg-accent` | Hover states |

---

## 🔍 BUSCAR E SUBSTITUIR

Use estes comandos no seu editor (VS Code: Ctrl+Shift+H):

```
Buscar: bg-white\b
Substituir: bg-background

Buscar: text-gray-900\b
Substituir: text-foreground

Buscar: border-gray-200\b
Substituir: border-border

Buscar: text-gray-600\b
Substituir: text-muted-foreground
```

⚠️ **ATENÇÃO:** Revise cada substituição! Nem sempre é 1:1.

---

## ✅ CHECKLIST DE CONVERSÃO

Para cada componente:

- [ ] Substituir `bg-white` → `bg-background` ou `bg-card`
- [ ] Substituir `text-gray-900` → `text-foreground`
- [ ] Substituir `text-gray-600` → `text-muted-foreground`
- [ ] Substituir `border-gray-200` → `border-border`
- [ ] Substituir `bg-gray-50` → `bg-muted`
- [ ] Substituir `hover:bg-gray-100` → `hover:bg-accent`
- [ ] Testar visualmente em **ambos** os temas
- [ ] Verificar contraste de texto (deve ser legível)
- [ ] Testar todos os estados (hover, active, focus, disabled)
