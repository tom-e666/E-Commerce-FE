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

        // Kiểm tra localStorage có token hay không (kiểm tra cả hai cách lưu)
        const token = localStorage.getItem('token') || localStorage.getItem('access_token');

        if (!token) {
          console.log("No token found in localStorage");
          setIsAuthenticated(false);
          setUser(null);
          return;
        }

        console.log("Token found, attempting to get user data");

        // Kiểm tra xem có thông tin user đã lưu trong localStorage không
        const storedUserData = localStorage.getItem('userData');
        if (storedUserData) {
          try {
            // Nếu có, sử dụng thông tin đó trước
            const parsedUser = JSON.parse(storedUserData);
            console.log("Using stored user data:", parsedUser);
            setUser(parsedUser);
            setIsAuthenticated(true);

            // Vẫn gọi API để cập nhật thông tin mới nhất
            getCurrentUser().then(freshUserData => {
              if (freshUserData.code === 200 && freshUserData.user) {
                console.log("Updated user data from API:", freshUserData.user);
                setUser(freshUserData.user);

                // Cập nhật lại localStorage
                localStorage.setItem('userData', JSON.stringify(freshUserData.user));
                localStorage.setItem('userRole', freshUserData.user.role);
              }
            }).catch(err => {
              console.warn("Could not refresh user data, using stored data instead:", err);
            });

            return;
          } catch (parseError) {
            console.error("Error parsing stored user data:", parseError);
            // Tiếp tục với API call nếu parse thất bại
          }
        }

        // Nếu không có thông tin user trong localStorage hoặc parse thất bại, gọi API
        console.log("Calling getCurrentUser API...");
        const userData = await getCurrentUser();
        console.log("getCurrentUser API response:", userData);

        if (userData.code === 200 && userData.user) {
          console.log("User authenticated via API:", userData.user);

          // Lưu thông tin user vào localStorage
          localStorage.setItem('userData', JSON.stringify(userData.user));
          localStorage.setItem('userRole', userData.user.role);
          localStorage.setItem('userId', userData.user.id);
          localStorage.setItem('userName', userData.user.full_name);

          setUser(userData.user);
          setIsAuthenticated(true);

          // Log thêm thông tin để debug
          if (userData.user.role === 'admin' || userData.user.role === 'staff') {
            console.log("Admin/staff user detected in AuthContext");
          }
        } else {
          console.log("Invalid user data or authentication failed:", userData);
          // Xóa tất cả thông tin xác thực
          localStorage.removeItem('token');
          localStorage.removeItem('access_token');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('expiresAt');
          localStorage.removeItem('userRole');
          localStorage.removeItem('userId');
          localStorage.removeItem('userName');
          localStorage.removeItem('userData');

          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        console.error("Authentication error:", error);
        // Xóa tất cả thông tin xác thực
        localStorage.removeItem('token');
        localStorage.removeItem('access_token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('expiresAt');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userId');
        localStorage.removeItem('userName');
        localStorage.removeItem('userData');

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
    // Kiểm tra từ user object trước
    if (user && roles.includes(user.role)) {
      console.log("Role check from user object:", user.role);
      return true;
    }

    // Kiểm tra từ localStorage nếu không có user object
    const storedRole = localStorage.getItem('userRole');
    if (storedRole && roles.includes(storedRole)) {
      console.log("Role check from localStorage:", storedRole);
      return true;
    }

    console.log("Role check failed. User role:", user?.role, "Stored role:", storedRole);
    return false;
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