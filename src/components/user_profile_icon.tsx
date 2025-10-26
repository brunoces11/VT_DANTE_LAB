import React, { useState, useEffect, useRef } from 'react';
import { User, Settings, LogOut, Moon, Sun } from 'lucide-react';
import { useAuth } from './auth/AuthProvider';
import { useNavigate } from 'react-router-dom';
import UserProfilePanel from './user_profile_panel';
import { useTheme } from '@/contexts/ThemeContext';

interface UserProfileIconProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showTooltip?: boolean;
  onLogout?: () => void;
}

export default function UserProfileIcon({
  size = 'md',
  className = '',
  showTooltip = true,
  onLogout
}: UserProfileIconProps) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Definir tamanhos
  const sizeClasses = {
    sm: 'w-8 h-8', // 32px
    md: 'w-9 h-9', // 36px  
    lg: 'w-12 h-12' // 48px
  };

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5', 
    lg: 'h-6 w-6'
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleAvatarClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleOpenPanel = () => {
    setIsDropdownOpen(false);
    setIsPanelOpen(true);
  };

  const handleLogout = async () => {
    console.log('🔘 UserProfileIcon: Botão Sair clicado');
    setIsDropdownOpen(false);
    
    if (onLogout) {
      console.log('🎯 UserProfileIcon: Usando callback customizado');
      onLogout(); // Usa o callback customizado se fornecido
    } else {
      console.log('🔄 UserProfileIcon: Usando logout padrão');
      try {
        console.log('🚪 Iniciando logout...');
        await logout(); // Usa o logout padrão se não houver callback
        console.log('✅ Logout concluído, redirecionando...');
        // Usar React Router em vez de window.location
        navigate('/', { replace: true });
      } catch (error) {
        console.error('❌ Erro no logout:', error);
        // Mesmo com erro, redireciona para garantir que o usuário saia
        navigate('/', { replace: true });
      }
    }
  };

  if (!user) return null;

  return (
    <>
      <div className="relative" ref={dropdownRef}>
        {/* Avatar Button */}
        <button
          onClick={handleAvatarClick}
          className={`
            ${sizeClasses[size]}
            rounded-full 
            bg-neutral-100 
            border-2 
            border-white 
            flex 
            items-center 
            justify-center 
            cursor-pointer 
            hover:bg-neutral-200 
            transition-colors 
            overflow-hidden
            ${className}
          `}
          style={{
            boxShadow: '0 0 0 2px white, 0 4px 7px rgba(0, 0, 0, 0.115)'
          }}
          title={showTooltip ? (user.email || 'Usuário logado') : undefined}
        >
          <User className={`${iconSizes[size]} text-neutral-600`} />
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-neutral-800 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-700 py-2 z-[9999]">
            {/* Dark Mode Toggle */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleTheme();
              }}
              className="w-full text-left px-4 py-2 text-sm text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-700 hover:text-neutral-900 dark:hover:text-neutral-100 flex items-center justify-between"
            >
              <div className="flex items-center space-x-2">
                {theme === 'dark' ? (
                  <Moon className="h-4 w-4" />
                ) : (
                  <Sun className="h-4 w-4" />
                )}
                <span>{theme === 'dark' ? 'Modo Escuro' : 'Modo Claro'}</span>
              </div>
              {/* Switch Visual */}
              <div className={`
                relative inline-flex h-5 w-9 items-center rounded-full transition-colors
                ${theme === 'dark' ? 'bg-orange-500' : 'bg-neutral-300'}
              `}>
                <span className={`
                  inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                  ${theme === 'dark' ? 'translate-x-5' : 'translate-x-0.5'}
                `} />
              </div>
            </button>

            {/* Divider */}
            <div className="border-t border-neutral-200 dark:border-neutral-700 my-1" />

            <button
              onClick={handleOpenPanel}
              className="w-full text-left px-4 py-2 text-sm text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-700 hover:text-neutral-900 dark:hover:text-neutral-100 flex items-center space-x-2"
            >
              <Settings className="h-4 w-4" />
              <span>Painel do Usuário</span>
            </button>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center space-x-2"
              style={{ zIndex: 9999 }}
            >
              <LogOut className="h-4 w-4" />
              <span>Sair</span>
            </button>
          </div>
        )}
      </div>

      {/* User Profile Panel Modal */}
      <UserProfilePanel 
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
      />
    </>
  );
}