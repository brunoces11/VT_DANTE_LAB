import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/auth/AuthProvider';
import UserProfileIcon from '@/components/user_profile_icon';
import { useTheme } from '@/contexts/ThemeContext';

export default function ChatHeader() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { theme } = useTheme();

  const handleLogout = async () => {
    console.log('🏠 ChatHeader: handleLogout chamado');
    try {
      console.log('🚪 ChatHeader: Executando logout...');
      await logout();
      console.log('✅ ChatHeader: Logout concluído, redirecionando...');
      navigate('/'); // Redireciona para a página inicial após logout
    } catch (error) {
      console.error('❌ ChatHeader: Erro no logout:', error);
      // Mesmo com erro, redireciona para garantir que o usuário saia
      navigate('/');
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 max-h-[60px] h-[60px] w-full bg-muted border-b border-border">
      <div className="flex items-center justify-between h-full pl-4 pr-6">
        {/* Logo no canto esquerdo */}
        <button
          onClick={() => navigate('/')}
          className="hover:opacity-80 transition-opacity"
        >
          <img
            src={theme === 'dark'
              ? "/src/assets/DANTE_IA_LOGO_DARK_MODE.svg"
              : "/src/assets/DANTE_IA_LOGO_LIGHT_MODE.svg"
            }
            alt="Dante-IA"
            className="h-9 w-auto"
          />
        </button>

        {/* Avatar do usuário no canto direito */}
        {user && (
          <UserProfileIcon 
            size="md" 
            onLogout={handleLogout}
          />
        )}
      </div>
    </header>
  );
}