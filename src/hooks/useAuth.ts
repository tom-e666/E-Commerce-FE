'use client'
import { useState } from "react";
import { login,logout, signup } from "@/services/auth/endpoints";
import { useAuthContext } from "@/contexts/AuthContext";
export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const {refresh_token,onSuccessLogIn,onSuccessLogout}= useAuthContext();
  const handleLogin = async (username: string, password: string) => {
    setLoading(true);
        try {
          const response = await login(username, password);
          const { 
            code,
            user,
            access_token,
            refresh_token,
            expires_at
                } = response.data.login;
            console.log(code);
          if (code === 200) {
            await onSuccessLogIn(user,access_token,refresh_token,expires_at);      
            return "Đăng nhập thành công!";
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
      }catch (error)
      {
        console.log(error);
        throw new Error("Lỗi Server. Đăng xuất thất bại");
        

      }finally{
        setLoading(false);
      }
    }
    const handleSignup =async(
      email:string,phone:string,password:string,full_name:string
    )=>{
      const response= await signup(
        email,
        phone,
        password,
        full_name
      );
      const{code,message}=response.data.signup;
      if(code===200)
        return "Đăng kí thành công";
      else
      {
        if(code===400)
        {
          throw new Error(message);
        }
        else
        {
          throw new Error("Lỗi Server")
        }
      }
    }
  return {
    loading,
    login: handleLogin,
    logout: handleLogout,
    signup: handleSignup,
  };
};