import { useState } from "react";
import { login } from "@/services/auth/mutation";

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  
  const handleLogin = async (username: string, password: string) => {
    setLoading(true);
    
    return async () => {
        try {
          const response = await login(username, password);
          const { 
            access_token,
            refresh_token
            expires_at,
                } = response.data.login;
          if (code === 200) {
            localStorage.setItem('token', token);
            return "Login successful";
          } else {
            throw new Error(message);
          }
        } finally {
          setLoading(false);
        }
      }
  };
  return {
    loading,
    login: handleLogin,
  };
};