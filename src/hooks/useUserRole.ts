import { useAuth } from '@/components/auth/AuthProvider';

/**
 * Hook customizado para acessar o user_role do usuário autenticado
 * 
 * @returns user_role do usuário atual ou null se não autenticado/carregando
 * 
 * @example
 * ```tsx
 * // Uso básico - renderização condicional
 * const role = useUserRole();
 * {role === 'sadmin' && <AdminPanel />}
 * 
 * // Uso em lógica
 * const role = useUserRole();
 * const isAdmin = role === 'sadmin' || role === 'admin';
 * 
 * // Uso com múltiplos roles
 * const role = useUserRole();
 * const isPremium = ['pro', 'premium', 'sadmin'].includes(role || '');
 * ```
 * 
 * @throws Error se usado fora do AuthProvider
 */
export function useUserRole(): string | null {
  const context = useAuth();
  
  if (context === undefined) {
    throw new Error('useUserRole must be used within an AuthProvider');
  }
  
  return context.userRole;
}
