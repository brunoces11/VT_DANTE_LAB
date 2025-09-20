import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Brain } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import UserProfileIcon from '@/components/user_profile_icon';

export default function ChatHeader() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/'); // Redireciona para a página inicial após logout
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 max-h-[60px] h-[60px] w-full bg-gray-100 border-b border-gray-200">
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
          <UserProfileIcon 
            size="md" 
            onLogout={handleLogout}
          />
        )}
      </div>
    </header>
  );
}