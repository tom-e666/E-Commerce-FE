'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { refreshTokenAPI } from '@/services/auth/endpoints';
import { tokenEvents, AUTH_STATE_CHANGED, TOKEN_UPDATED, TOKEN_REMOVED } from '@/services/auth/tokenEvents';
import { jwtDecode } from 'jwt-decode';

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
  saveAuthData: (accessToken: string, refreshToken: string, expiresAt: string) => void;
  clearAuthStorage: () => void;
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
  const checkAuth = async () => {
    try {
      setIsLoading(true);
      // Kiểm tra cả hai kiểu key để đảm bảo tương thích
      const token = localStorage.getItem('token') || localStorage.getItem('access_token');
      const refreshToken = localStorage.getItem('refreshToken') || localStorage.getItem('refresh_token');
      const expiresAt = localStorage.getItem('expiresAt');
      
      if (!token) {
        console.log("No token found");
        setIsAuthenticated(false);
        setUser(null);
        return;
      }

      // Kiểm tra token hết hạn chưa và thử refresh nếu cần
      if (expiresAt && new Date() > new Date(expiresAt) && refreshToken) {
        console.log("Token expired, attempting to refresh");
        try {
          const refreshResponse = await refreshTokenAPI(refreshToken);
          if (refreshResponse.code === 200 && refreshResponse.access_token) {
            // Cập nhật token mới vào localStorage
            localStorage.setItem('token', refreshResponse.access_token);
            localStorage.setItem('access_token', refreshResponse.access_token); // Lưu token với cả hai key
            if (refreshResponse.refresh_token) {
              localStorage.setItem('refreshToken', refreshResponse.refresh_token);
              localStorage.setItem('refresh_token', refreshResponse.refresh_token); // Lưu refresh token với cả hai key
            }
            if (refreshResponse.expires_at) {
              localStorage.setItem('expiresAt', refreshResponse.expires_at);
            }
          } else {
            // Refresh thất bại, đăng xuất
            console.log("Token refresh failed");
            localStorage.removeItem('token');
            localStorage.removeItem('access_token');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('expiresAt');
            setIsAuthenticated(false);
            setUser(null);
            return;
          }
        } catch (error) {
          console.error("Error refreshing token:", error);
          clearAuthStorage();
          setIsAuthenticated(false);
          setUser(null);
          return;
        }
      }

      try{
        const token =localStorage.getItem('access_token');
        if(token){
          const decodeUser = jwtDecode<User>(token);
          const userData: User = {
            id: decodeUser.id,
            full_name: decodeUser.full_name,
            role: decodeUser.role
          }
          setUser(userData);
          setIsAuthenticated(true);
        }
      } catch(error){
        console.error("Error decoding token:", error);
        clearAuthStorage();
        setIsAuthenticated(false);
        setUser(null);
        return;
      }

      // Nếu có token (mới hoặc cũ chưa hết hạn), gọi API để lấy thông tin người dùng
      // const userData = await getCurrentUser();
      // if (userData.code === 200 && userData.user) {
      //   console.log("User authenticated:", userData.user);
      //   setUser(userData.user);
      //   setIsAuthenticated(true);
      // } else {
      //   console.log("Invalid user data:", userData);
      //   clearAuthStorage();
      //   setIsAuthenticated(false);
      //   setUser(null);
      // }
    } catch (error) {
      console.error("Authentication error:", error);
      clearAuthStorage();
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Xóa toàn bộ thông tin xác thực khỏi localStorage
  const clearAuthStorage = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('access_token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('expiresAt');
    }
    
    setUser(null);
    setIsAuthenticated(false);
  };

  // Lưu thông tin xác thực vào localStorage
  const saveAuthData = (accessToken: string, refreshToken: string, expiresAt: string) => {
    localStorage.setItem('token', accessToken);
    localStorage.setItem('access_token', accessToken); // Lưu token với cả hai key
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('refresh_token', refreshToken); // Lưu refresh token với cả hai key
    localStorage.setItem('expiresAt', expiresAt);
  };

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

  // Listen for auth state change events
  useEffect(() => {
    const unsubscribe = tokenEvents.on(AUTH_STATE_CHANGED, () => {
      console.log("Auth state change event received, checking auth state");
      checkAuth();
    });
    
    return () => {
      unsubscribe();
    };
  }, []);
  
  // Listen for token updates
  useEffect(() => {
    const unsubscribe = tokenEvents.on(TOKEN_UPDATED, () => {
      console.log("Token updated event received, checking auth state");
      checkAuth();
    });
    
    return () => {
      unsubscribe();
    };
  }, []);
  
  // Listen for token removals
  useEffect(() => {
    const unsubscribe = tokenEvents.on(TOKEN_REMOVED, () => {
      console.log("Token removed event received, clearing auth state");
      setIsAuthenticated(false);
      setUser(null);
    });
    
    return () => {
      unsubscribe();
    };
  }, []);
  
  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      isLoading, 
      user, 
      hasRole,
      updateUserData,
      saveAuthData,
      clearAuthStorage
    }}>
      {children}
    </AuthContext.Provider>
  );
};