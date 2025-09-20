import React, { useState, useEffect, useRef } from 'react';
import { User, Settings, LogOut } from 'lucide-react';
import { useAuth } from './auth/AuthProvider';
import UserProfilePanel from './user_profile_panel';

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
    setIsDropdownOpen(false);
    if (onLogout) {
      onLogout(); // Usa o callback customizado se fornecido
    } else {
      await logout(); // Usa o logout padrão se não houver callback
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
          <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-neutral-200 py-2 z-50">
            <button
              onClick={handleOpenPanel}
              className="w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 flex items-center space-x-2"
            >
              <Settings className="h-4 w-4" />
              <span>Painel do Usuário</span>
            </button>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
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