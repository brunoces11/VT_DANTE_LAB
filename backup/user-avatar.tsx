import React from 'react';
import { User } from 'lucide-react';
import { useAuth } from '../auth/AuthProvider';

interface UserAvatarProps {
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  className?: string;
  showTooltip?: boolean;
}

export default function UserAvatar({ 
  size = 'md', 
  onClick, 
  className = '',
  showTooltip = true 
}: UserAvatarProps) {
  const { user, profile } = useAuth();

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

  if (!user) return null;

  return (
    <button
      onClick={onClick}
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
      {profile?.avatar_url ? (
        <img 
          src={profile.avatar_url} 
          alt="Avatar" 
          className="w-full h-full object-cover"
        />
      ) : (
        <User className={`${iconSizes[size]} text-neutral-600`} />
      )}
    </button>
  );
}