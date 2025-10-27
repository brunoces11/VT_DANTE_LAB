# 🌓 GUIA COMPLETO: DARK MODE

## ✅ O QUE FOI IMPLEMENTADO

Dark Mode totalmente funcional com:
- ✅ Toggle no Painel do Usuário
- ✅ Persistência no localStorage
- ✅ Detecção automática da preferência do sistema
- ✅ Transição suave entre temas

---

## 🎯 COMO FUNCIONA TECNICAMENTE

### 1. **NENHUM ARQUIVO CSS É ALTERADO**

O sistema funciona através de **1 classe CSS** que é adicionada/removida:

```html
<!-- LIGHT MODE -->
<html lang="pt-BR">
  <!-- Usa variáveis CSS do :root -->
</html>

<!-- DARK MODE -->
<html lang="pt-BR" class="dark">
  <!-- Usa variáveis CSS do .dark -->
</html>
```

### 2. **SISTEMA DE VARIÁVEIS CSS (CSS Variables)**

No arquivo `src/index.css`, as cores estão definidas em **HSL**:

```css
/* LIGHT MODE - linha 22 */
:root {
  --background: 0 0% 100%;      /* #FFFFFF - branco */
  --foreground: 0 0% 3.9%;      /* #0A0A0A - quase preto */
  --card: 0 0% 100%;            /* #FFFFFF */
  --border: 0 0% 89.8%;         /* #E5E5E5 - cinza claro */
  /* ... */
}

/* DARK MODE - linha 49 */
.dark {
  --background: 0 0% 3.9%;      /* #0A0A0A - quase preto */
  --foreground: 0 0% 98%;       /* #FAFAFA - quase branco */
  --card: 0 0% 3.9%;            /* #0A0A0A */
  --border: 0 0% 14.9%;         /* #262626 - cinza escuro */
  /* ... */
}
```

### 3. **TAILWIND TRADUZ AUTOMATICAMENTE**

Quando você usa classes do Tailwind, ele lê essas variáveis:

```jsx
// ❌ CORES FIXAS (NÃO fazem dark mode)
<div className="bg-white text-black">

// ✅ CORES DINÂMICAS (fazem dark mode automaticamente)
<div className="bg-background text-foreground">
```

---

## 📁 ARQUIVOS CRIADOS/MODIFICADOS

### **NOVOS ARQUIVOS:**

1. **`src/contexts/ThemeContext.tsx`** (72 linhas)
   - Context API para gerenciar estado global do tema
   - Funções: `toggleTheme()`, `setTheme()`
   - Persistência no localStorage
   - Detecção de preferência do sistema

### **ARQUIVOS MODIFICADOS:**

1. **`src/App.tsx`**
   - Adicionado `<ThemeProvider>` envolvendo toda a aplicação
   - Apenas 5 linhas alteradas

2. **`src/components/user_profile_panel.tsx`**
   - Adicionada seção "Aparência" com botões Light/Dark
   - Uso do hook `useTheme()`
   - ~40 linhas adicionadas

3. **`src/index.css`**
   - JÁ ESTAVA CONFIGURADO! Nada foi alterado.
   - Variáveis dark mode já existiam (linhas 49-74)

---

## 🎨 COMO ADICIONAR DARK MODE EM NOVOS COMPONENTES

### **MÉTODO 1: Usar Classes Semânticas do Tailwind (RECOMENDADO)**

```jsx
// ❌ ERRADO - cores fixas
<div className="bg-white border-gray-200 text-black">
  <h1 className="text-gray-900">Título</h1>
</div>

// ✅ CORRETO - cores dinâmicas
<div className="bg-background border-border text-foreground">
  <h1 className="text-foreground">Título</h1>
</div>
```

**Classes Semânticas Disponíveis:**
- `bg-background` / `text-foreground` - fundo e texto principal
- `bg-card` / `text-card-foreground` - cards
- `bg-popover` / `text-popover-foreground` - popovers/dropdowns
- `border-border` - bordas
- `bg-muted` / `text-muted-foreground` - elementos secundários
- `bg-accent` / `text-accent-foreground` - acentos

### **MÉTODO 2: Classes Condicionais com Prefixo `dark:`**

Para casos especiais onde você precisa de cores específicas:

```jsx
<div className="bg-white dark:bg-neutral-900">
  <p className="text-neutral-900 dark:text-neutral-100">
    Este texto muda de preto para branco no dark mode
  </p>
</div>
```

**Exemplo Real:**

```jsx
// Botão que muda cor no dark mode
<button className="
  bg-neutral-100 dark:bg-neutral-800
  text-neutral-900 dark:text-neutral-100
  hover:bg-neutral-200 dark:hover:bg-neutral-700
  border-neutral-300 dark:border-neutral-600
">
  Clique Aqui
</button>
```

### **MÉTODO 3: Usar o Hook `useTheme()` (Para Lógica Condicional)**

```jsx
import { useTheme } from '@/contexts/ThemeContext';

export default function MyComponent() {
  const { theme, toggleTheme, setTheme } = useTheme();

  return (
    <div>
      <p>Tema atual: {theme}</p>

      {/* Renderização condicional baseada no tema */}
      {theme === 'dark' ? (
        <MoonIcon />
      ) : (
        <SunIcon />
      )}

      {/* Botão para trocar tema */}
      <button onClick={toggleTheme}>
        Alternar Tema
      </button>
    </div>
  );
}
```

---

## 🔧 CONVERSÃO DE COMPONENTES EXISTENTES

### **Exemplo 1: Header**

```jsx
// ANTES
<header className="bg-white border-b border-gray-200">
  <h1 className="text-gray-900">Dante AI</h1>
</header>

// DEPOIS
<header className="bg-background border-b border-border">
  <h1 className="text-foreground">Dante AI</h1>
</header>
```

### **Exemplo 2: Card**

```jsx
// ANTES
<div className="bg-white rounded-lg shadow-md border border-gray-300">
  <h2 className="text-gray-900">Título</h2>
  <p className="text-gray-600">Descrição</p>
</div>

// DEPOIS
<div className="bg-card rounded-lg shadow-md border border-border">
  <h2 className="text-card-foreground">Título</h2>
  <p className="text-muted-foreground">Descrição</p>
</div>
```

### **Exemplo 3: Sidebar**

```jsx
// ANTES
<aside className="bg-gray-50 border-r border-gray-200">
  <div className="bg-white hover:bg-gray-100">
    <span className="text-gray-700">Item</span>
  </div>
</aside>

// DEPOIS
<aside className="bg-muted border-r border-border">
  <div className="bg-background hover:bg-accent">
    <span className="text-foreground">Item</span>
  </div>
</aside>
```

---

## 🎯 COMPONENTES QUE PRECISAM DE ATENÇÃO

### **❗ Componentes com Cores Fixas**

Buscar e substituir em **TODOS** os componentes:

```bash
# Buscar cores fixas comuns
bg-white          →  bg-background
bg-gray-50        →  bg-muted
text-black        →  text-foreground
text-gray-900     →  text-foreground
text-gray-600     →  text-muted-foreground
border-gray-200   →  border-border
```

### **✅ Componentes Já Compatíveis**

Componentes que usam classes semânticas **já funcionam** automaticamente:
- Todos os componentes UI (`button`, `dialog`, `input`, etc.)
- `user_profile_panel.tsx` (agora com seção de tema)
- Qualquer componente que use variáveis CSS

---

## 🌈 CUSTOMIZAR CORES DO DARK MODE

### **Opção 1: Modificar Variáveis CSS (Recomendado)**

Edite `src/index.css` na seção `.dark`:

```css
.dark {
  /* Mudar fundo para preto puro ao invés de cinza escuro */
  --background: 0 0% 0%;  /* era: 0 0% 3.9% */

  /* Mudar cor de acento */
  --accent: 24 100% 50%;  /* laranja vibrante */
}
```

### **Opção 2: Adicionar Novos Tokens de Cor**

```css
:root {
  --custom-light: 200 100% 95%;
}

.dark {
  --custom-light: 200 50% 20%;
}
```

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        'custom-light': 'hsl(var(--custom-light))',
      }
    }
  }
}
```

```jsx
// Usar no componente
<div className="bg-custom-light">
```

---

## 🚀 TESTANDO O DARK MODE

### **1. Via Interface**

1. Fazer login
2. Clicar no avatar do usuário
3. Clicar em "Painel do Usuário"
4. Na seção "Aparência", clicar em "Claro" ou "Escuro"

### **2. Via Console do Navegador**

```js
// Verificar tema atual
localStorage.getItem('theme')

// Forçar dark mode
document.documentElement.classList.add('dark')

// Forçar light mode
document.documentElement.classList.remove('dark')
```

### **3. Via DevTools**

- Abrir Chrome DevTools
- Cmd/Ctrl + Shift + P
- Digitar "dark mode"
- Selecionar "Emulate CSS prefers-color-scheme: dark"

---

## 📊 RESUMO DO QUE MUDA

| Aspecto | Light Mode | Dark Mode |
|---------|-----------|-----------|
| **Elemento `<html>`** | `<html>` | `<html class="dark">` |
| **Variáveis CSS usadas** | `:root { ... }` | `.dark { ... }` |
| **Arquivos CSS modificados** | **0 arquivos** | **0 arquivos** |
| **Componentes quebrados** | **0 componentes** | **0 componentes** |
| **localStorage** | `theme: "light"` | `theme: "dark"` |

---

## 🎯 CHECKLIST PARA NOVOS COMPONENTES

- [ ] Usar `bg-background` ao invés de `bg-white`
- [ ] Usar `text-foreground` ao invés de `text-black`
- [ ] Usar `border-border` ao invés de `border-gray-200`
- [ ] Testar visualmente em ambos os temas
- [ ] Verificar contraste de cores (WCAG AA)
- [ ] Testar todos os estados (hover, active, disabled)

---

## 🐛 TROUBLESHOOTING

### **Problema: Tema não persiste após refresh**

**Causa:** localStorage não está sendo salvo
**Solução:** Verificar console por erros no ThemeContext

### **Problema: Alguns componentes não mudam de cor**

**Causa:** Componente usa cores fixas (ex: `bg-white`)
**Solução:** Substituir por cores semânticas (ex: `bg-background`)

### **Problema: Transição muito brusca**

**Adicionar transições suaves:**

```css
/* src/index.css */
* {
  transition: background-color 0.2s ease,
              border-color 0.2s ease,
              color 0.2s ease;
}
```

---

## 📚 RECURSOS ADICIONAIS

- [Tailwind Dark Mode Docs](https://tailwindcss.com/docs/dark-mode)
- [CSS Variables MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- [WCAG Contrast Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
