import { useState } from "react";
import { login,logout } from "@/services/auth/mutation";
import { useAuthContext } from "@/contexts/AuthContext";


export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [refresh_token,setRefreshToken]=useState<string | null>(null);
  const {onSuccessLogIn,onSuccessLogout}= useAuthContext();
  const handleLogin = async (username: string, password: string) => {
    setLoading(true);
        try {
          const response = await login(username, password);
          const { 
            code,
            user,
            token,
            refresh_token,
                } = response.data.login;
            console.log(code);
          if (code === 200) {
            setRefreshToken(refresh_token);
            await onSuccessLogIn(user,token,refresh_token);      
            return "Login successful";
          } else if(code === 401) {
            throw new Error("Thông tin đăng nhập không chính xác");
          }else
          {
            throw new Error("Lỗi Server");
          }
        } finally {
          setLoading(false);
        }
      } ;                                                                                                                                                                                                                                                                                                                                                                                      
    const handleLogout= async()=>{
      try{
        setLoading(true);
        if(!refresh_token)
          throw new Error("Lỗi logic. Người dùng chưa đăng nhập");
        await logout(refresh_token);
        await onSuccessLogout();
      }catch
      {
        throw new Error("Lỗi Server. Đăng xuất thất bại");
      }finally{
        setLoading(false);
      }
    }
  return {
    loading,
    login: handleLogin,
    logout: handleLogout,
  };
};