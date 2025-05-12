import { useState } from 'react';
import { getUserCredential, updateUserInfo } from '../services/credential/endpoints';
export interface UserCredential {
  id: string;
  email: string;
  phone: string;
  full_name: string;
}
export const useCredential = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [userCredential, setUserCredential] = useState<UserCredential | null>(null);
  const fetchUserCredential = async (): Promise<UserCredential> => {
    setLoading(true);
    try {
      const response = await getUserCredential();
      const { code, message, user } = response.data.getUserCredential;
      
      if (code === 200 && user) {
        setUserCredential(user);
        return user;
      } else {
        throw new Error(message || "Không thể lấy thông tin người dùng");
      }
    } catch (err) {
      if (err instanceof Error) throw err;
      throw new Error("Lỗi khi lấy thông tin người dùng");
    } finally {
      setLoading(false);
    }
  };

  const updateUserInformation = async (
    fullName?: string,
    email?: string,
    phone?: string
  ): Promise<{ code: number; message: string }> => {
    setLoading(true);
    try {
      const response = await updateUserInfo(fullName, email, phone);
      const { code, message } = response.data.updateUserInfo;
      
      if (code === 200) {
        // Refresh user credential data after successful update
        await fetchUserCredential(); 
        return { code, message };
      } else {
        throw new Error(message || "Không thể cập nhật thông tin người dùng");
      }
    } catch (err) {
      if (err instanceof Error) throw err;
      throw new Error("Lỗi khi cập nhật thông tin người dùng");
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    userCredential,
    fetchUserCredential,
    updateUserInformation,
  };
};