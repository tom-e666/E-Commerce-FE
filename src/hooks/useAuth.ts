'use client'
import { useState } from "react";
import { login as loginAPI, signup as signupAPI } from "@/services/auth/endpoints";
import { useRouter } from "next/navigation";

export const useAuth = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const login = async (email: string, password: string): Promise<{message: string, user?: any}> => {
    setLoading(true);
    try {
      const response = await loginAPI(email, password);

      if (response?.data?.login?.code === 200) {
        const { access_token, refresh_token, expires_at, user } = response.data.login;

        // Lưu thông tin xác thực vào localStorage
        // Lưu cả hai cách để đảm bảo tương thích
        localStorage.setItem('token', access_token);
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('refreshToken', refresh_token);
        localStorage.setItem('refresh_token', refresh_token);
        localStorage.setItem('expiresAt', expires_at);

        // Lưu thêm thông tin user để dễ truy cập
        if (user) {
          localStorage.setItem('userRole', user.role);
          localStorage.setItem('userId', user.id);
          localStorage.setItem('userName', user.full_name);

          // Lưu toàn bộ thông tin user dưới dạng JSON
          localStorage.setItem('userData', JSON.stringify(user));
        }

        console.log("Đăng nhập thành công với vai trò:", user?.role);
        console.log("Token đã được lưu:", access_token.substring(0, 15) + "...");

        // Trả về thông báo thành công và thông tin user
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

  const logout = () => {
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

    console.log("Đã đăng xuất và xóa tất cả thông tin xác thực");

    // Chuyển hướng về trang đăng nhập
    router.push('/login');
  };

  return { login, signup, logout, loading };
};