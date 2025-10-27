import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Inicializar com preferência do localStorage ou sistema
  const [theme, setThemeState] = useState<Theme>(() => {
    // 1. Verificar localStorage primeiro
    const stored = localStorage.getItem('theme') as Theme | null;
    if (stored === 'light' || stored === 'dark') {
      return stored;
    }

    // 2. Fallback: preferência do sistema
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }

    // 3. Default: light
    return 'light';
  });

  // 🎯 MONITORAR MUDANÇAS DE ROTA PARA APLICAR DARK MODE APENAS NO CHATPAGE
  useEffect(() => {
    const checkRoute = () => {
      const currentPath = window.location.pathname;
      const darkModeAllowedRoutes = ['/chat-page'];
      const isDarkModeAllowed = darkModeAllowedRoutes.includes(currentPath);

      const root = window.document.documentElement;

      // Remover classe anterior
      root.classList.remove('light', 'dark');

      // 🎯 APLICAR DARK MODE APENAS SE ESTIVER EM ROTA PERMITIDA
      if (isDarkModeAllowed && theme === 'dark') {
        root.classList.add('dark');
        console.log('🎨 Dark mode aplicado (ChatPage)');
      } else {
        root.classList.add('light');
        console.log('🎨 Light mode forçado (outras páginas)');
      }

      // Salvar no localStorage
      localStorage.setItem('theme', theme);
    };

    // Verificar rota inicial
    checkRoute();

    // Monitorar mudanças de rota
    window.addEventListener('popstate', checkRoute);
    
    // Observar mudanças no pathname (para navegação programática)
    const observer = new MutationObserver(checkRoute);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('popstate', checkRoute);
      observer.disconnect();
    };
  }, [theme]);

  // Função para alternar tema
  const toggleTheme = () => {
    setThemeState(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Função para definir tema específico
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Hook para usar o tema
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
