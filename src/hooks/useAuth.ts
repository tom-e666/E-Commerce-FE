'use client'
import { useState } from "react";
import { login as loginAPI, signup as signupAPI, logout as logoutAPI } from "@/services/auth/endpoints";
import { useAuthContext } from '@/contexts/AuthContext';
import { tokenEvents, AUTH_STATE_CHANGED, TOKEN_REMOVED } from "@/services/auth/tokenEvents";

export const useAuth = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { saveAuthData, clearAuthStorage } = useAuthContext();

  const login = async (email: string, password: string): Promise<{message: string, user?: any}> => {
    setLoading(true);
    try {
      const response = await loginAPI(email, password);

      if (response?.data?.login?.code === 200) {
        const { access_token, refresh_token, expires_at, user } = response.data.login;

        // Lưu thông tin xác thực đầy đủ
        saveAuthData(access_token, refresh_token, expires_at);
        
        console.log("Đăng nhập thành công với vai trò:", user?.role);
        
        // Emit an event that authentication state has changed
        // This helps components react to auth changes
        setTimeout(() => {
          tokenEvents.emit(AUTH_STATE_CHANGED);
        }, 100);

        // Trả về thông tin người dùng
        return {
          message: "Đăng nhập thành công",
          user: user
        };
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

  const logout = async (): Promise<{message: string}> => {
    setLoading(true);
    try {
      // Gọi API logout
      await logoutAPI();
      
      // Xóa thông tin xác thực
      clearAuthStorage();
      
      // Emit event for logout
      tokenEvents.emit(TOKEN_REMOVED);
      
      return { message: "Đăng xuất thành công" };
    } catch (error) {
      console.error("Logout error:", error);
      
      // Still clear auth storage on error
      clearAuthStorage();
      tokenEvents.emit(TOKEN_REMOVED);
      
      return { message: "Đăng xuất thành công" };
    } finally {
      setLoading(false);
    }
  };

  return { login, signup, logout, loading };
};