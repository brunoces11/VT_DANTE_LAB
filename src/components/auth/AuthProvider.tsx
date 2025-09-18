import React, { createContext, useContext, ReactNode, useState } from 'react';

interface User {
  id: string;
  email?: string;
}

interface UserProfile {
  id: string;
  avatar_url?: string;
  [key: string]: any;
}

interface AuthContextType { 
  user: User | null;
  profile: UserProfile | null;
  session: any;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error?: any }>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<{ error?: any }>;
  refreshProfile: () => Promise<void>;
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
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const refreshProfile = async () => {
    // Mock implementation for demo
    console.log('Profile refresh requested');
  };

  const login = async (email: string, password: string) => {
    // Mock login for demo
    const mockUser = { id: '1', email };
    setUser(mockUser);
    return { error: null };
  };

  const logout = async () => {
    setUser(null);
    setProfile(null);
    setSession(null);
  };

  const register = async (email: string, password: string, name: string) => {
    // Mock register for demo
    const mockUser = { id: '1', email };
    setUser(mockUser);
    return { error: null };
  };

  const authValue: AuthContextType = {
    user,
    profile,
    session,
    loading,
    login,
    logout,
    register,
    refreshProfile,
  };

  return (
    <AuthContext.Provider value={authValue}>
      {children}
    </AuthContext.Provider>
  );
};