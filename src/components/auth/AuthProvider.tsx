import React, { createContext, useContext, ReactNode } from 'react';

interface AuthContextType {
  user: any;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Placeholder implementation for Supabase integration
  const authValue: AuthContextType = {
    user: null,
    login: async (email: string, password: string) => {
      // TODO: Implement Supabase authentication
      console.log('Login:', email, password);
    },
    logout: async () => {
      // TODO: Implement Supabase logout
      console.log('Logout');
    },
    register: async (email: string, password: string) => {
      // TODO: Implement Supabase registration
      console.log('Register:', email, password);
    },
  };

  return (
    <AuthContext.Provider value={authValue}>
      {children}
    </AuthContext.Provider>
  );
};