'use client'
import { useState } from "react";
import { login as loginAPI, signup as signupAPI } from "@/services/auth/endpoints";
import { useRouter } from "next/navigation";

export const useAuth = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const login = async (email: string, password: string): Promise<string> => {
    setLoading(true);
    try {
      const response = await loginAPI(email, password);
      
      if (response?.data?.login?.code === 200) {
        const { access_token, refresh_token, expires_at, user } = response.data.login;
        
        // Lưu thông tin xác thực vào localStorage
        localStorage.setItem('token', access_token);
        localStorage.setItem('refreshToken', refresh_token);
        localStorage.setItem('expiresAt', expires_at);
        
        console.log("Đăng nhập thành công với vai trò:", user?.role);
        
        // Trả về thông báo thành công
        return "Đăng nhập thành công";
      } else {
        throw new Error(response?.data?.login?.message || "Đăng nhập thất bại");
      }
    } catch (error: any) {
      const errorMessage = error?.graphQLErrors?.[0]?.message || error.message || "Đăng nhập thất bại";
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, phone: string, password: string, full_name: string): Promise<string> => {
    setLoading(true);
    try {
      const response = await signupAPI(email, phone, password, full_name);
      
      if (response?.data?.signup?.code === 200) {
        return "Đăng ký thành công";
      } else {
        throw new Error(response?.data?.signup?.message || "Đăng ký thất bại");
      }
    } catch (error: any) {
      const errorMessage = error?.graphQLErrors?.[0]?.message || error.message || "Đăng ký thất bại";
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    // Xóa thông tin xác thực
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('expiresAt');
    
    // Chuyển hướng về trang đăng nhập
    router.push('/login');
  };

  return { login, signup, logout, loading };
};