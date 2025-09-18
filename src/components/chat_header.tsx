import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, User, Settings, LogOut } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import PainelUsuario from '@/components/painel_usuario';
import UserAvatar from '@/components/ui/user-avatar';
import UserDropdown from '@/components/ui/user-dropdown';

export default function ChatHeader() {
  const navigate = useNavigate();
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isPainelUsuarioOpen, setIsPainelUsuarioOpen] = useState(false);
  const { user, profile, logout } = useAuth();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      
      // Close user dropdown if clicking outside
      if (isUserDropdownOpen && !target.closest('.user-dropdown-chat')) {
        setIsUserDropdownOpen(false);
      }
    };

    if (isUserDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserDropdownOpen]);

  const handleLogout = async () => {
    await logout();
    setIsUserDropdownOpen(false);
    navigate('/');
  };

  const handlePainelUsuario = () => {
    setIsUserDropdownOpen(false);
    setIsPainelUsuarioOpen(true);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-[9999] max-h-[60px] h-[60px] w-full bg-gray-100 border-b border-gray-200">
        <div className="flex items-center justify-between h-full pl-4 pr-6">
        {/* Logo no canto esquerdo */}
        <button 
          onClick={() => navigate('/')}
          className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
        >
          <div className="p-2 rounded-lg w-9 h-9" style={{ backgroundColor: '#3D1413' }}>
            <Brain className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-neutral-900">Dante-IA</span>
        </button>

          {/* Avatar do usuário no canto direito */}
          {user && (
            <div className="relative user-dropdown-chat">
              <UserAvatar 
                size="md"
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
              />
              
              <UserDropdown
                isOpen={isUserDropdownOpen}
                onClose={() => setIsUserDropdownOpen(false)}
                onOpenPanel={handlePainelUsuario}
                onLogout={handleLogout}
              />
            </div>
          )}
        </div>
      </header>

      <PainelUsuario 
        isOpen={isPainelUsuarioOpen}
        onClose={() => setIsPainelUsuarioOpen(false)}
      />
    </>
  );
}