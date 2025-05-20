'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getCurrentUser } from '@/services/auth/endpoints';

interface User {
  id: string;
  full_name: string;
  role: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  hasRole: (roles: string[]) => boolean;
  updateUserData: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Kiểm tra người dùng hiện tại khi load trang
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        // Kiểm tra localStorage có token hay không
        const token = localStorage.getItem('token');
        
        if (!token) {
          console.log("No token found");
          setIsAuthenticated(false);
          setUser(null);
          return;
        }

        // Nếu có token, gọi API để lấy thông tin người dùng
        const userData = await getCurrentUser();
        if (userData.code === 200 && userData.user) {
          console.log("User authenticated:", userData.user);
          setUser(userData.user);
          setIsAuthenticated(true);
        } else {
          console.log("Invalid user data:", userData);
          localStorage.removeItem('token');
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        console.error("Authentication error:", error);
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Kiểm tra nếu người dùng có một trong các role được chỉ định
  const hasRole = (roles: string[]): boolean => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  // Cập nhật thông tin người dùng
  const updateUserData = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      isLoading, 
      user, 
      hasRole,
      updateUserData
    }}>
      {children}
    </AuthContext.Provider>
  );
};