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

  // Aplicar tema no <html> e salvar no localStorage
  useEffect(() => {
    const root = window.document.documentElement;

    // Remover classe anterior
    root.classList.remove('light', 'dark');

    // Adicionar nova classe
    root.classList.add(theme);

    // Salvar no localStorage
    localStorage.setItem('theme', theme);

    console.log('🎨 Tema aplicado:', theme);
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
