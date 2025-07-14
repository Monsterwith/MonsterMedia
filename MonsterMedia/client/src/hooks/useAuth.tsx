import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User } from '@/lib/types';
import { getCurrentUser } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoading: boolean;
  error: Error | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  isLoading: false,
  error: null,
});

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);

  // Query to check if the user is already logged in
  const { isLoading, error } = useQuery({
    queryKey: ['/api/auth/me'],
    queryFn: async () => {
      try {
        const userData = await getCurrentUser();
        setUser(userData);
        return userData;
      } catch (err) {
        // User is not logged in - not an error for our purposes
        return null;
      }
    },
    retry: false,
    refetchOnWindowFocus: false,
  });

  return (
    <AuthContext.Provider value={{ user, setUser, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
