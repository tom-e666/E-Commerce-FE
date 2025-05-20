import { useState } from 'react';
import { getUsersAPI, auditRoleAPI } from '@/services/user/endpoints';
import { User } from 'lucide-react';

interface User {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  created_at: string;
  role: string;
}

export const useUser = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const getUsers = async () => {
    setLoading(true);
    try {
      // Kiểm tra token trước khi gọi API
      const token = localStorage.getItem('token') || localStorage.getItem('access_token');
      if (!token) {
        console.error("No authentication token found for getUsers");
        throw new Error("Vui lòng đăng nhập lại để xem danh sách người dùng");
      }

      console.log("Fetching users with token:", token.substring(0, 15) + "...");

      const response = await getUsersAPI();
      console.log("Users API response:", response);

      if (!response) {
        console.error("Empty response from getUsers API");
        throw new Error("Không thể lấy danh sách người dùng - Phản hồi trống");
      }

      if (!response.data) {
        console.error("Response missing data property:", response);
        throw new Error("Không thể lấy danh sách người dùng - Thiếu dữ liệu");
      }

      if (!response.data.getUsers) {
        console.error("Response missing getUsers property:", response.data);
        throw new Error("Không thể lấy danh sách người dùng - Cấu trúc không hợp lệ");
      }

      const { code, message, users } = response.data.getUsers;

      if (code === 200) {
        console.log("Successfully fetched users:", users?.length || 0);
        setUsers(users || []);
        return users;
      } else {
        console.error("API returned error:", { code, message });
        throw new Error(message || "Không thể lấy danh sách người dùng");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      // Trả về mảng rỗng thay vì ném lỗi để tránh crash UI
      setUsers([]);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  const selectUser = (user: User | null) => {
    setSelectedUser(user);
  };
  const updateUserRole = async (userId: string, role: string) => {
    setLoading(true);
    try {
      const response = await auditRoleAPI(userId, role);
      if (!response?.data) {
        throw new Error("Không thể cập nhật vai trò người dùng");
      }

      const { code, message } = response.data.auditRole;

      if (code === 200) {
        setUsers(prevUsers =>
          prevUsers.map(user =>
            user.id === userId
              ? { ...user, role }
              : user
          )
        );
        if (selectedUser && selectedUser.id === userId) {
          setSelectedUser({ ...selectedUser, role });
        }
        return { success: true, message: "Đã cập nhật vai trò người dùng" };
      } else {
        throw new Error(message || "Không thể cập nhật vai trò người dùng");
      }
    } catch (error) {
      console.error("Error updating user role:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const searchUsers = (query: string) => {
    if (!query.trim()) {
      return users;
    }

    const lowerQuery = query.toLowerCase();
    return users.filter(user =>
      user.email.toLowerCase().includes(lowerQuery) ||
      user.full_name.toLowerCase().includes(lowerQuery) ||
      user.phone.toLowerCase().includes(lowerQuery)
    );
  };

  return {
    loading,
    users,
    selectedUser,
    getUsers,
    selectUser,
    updateUserRole,
    searchUsers,
    User
  };
};

export default useUser;