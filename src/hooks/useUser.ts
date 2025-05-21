import { useState } from 'react';
import { 
  getAllUsersAPI, 
  getUserAPI, 
  updateUserRoleAPI, 
  deleteUserAPI,
  User
} from '@/services/user/endpoints';

export const useUser = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Get all users with optional filters
  const getUsers = async (role?: string, search?: string) => {
    setLoading(true);
    try {
      const response = await getAllUsersAPI(role, search);
      
      if (response.code === 200) {
        setUsers(response.users || []);
        return response.users;
      } else {
        throw new Error(response.message || "Không thể lấy danh sách người dùng");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Get user by ID
  const getUser = async (userId: string) => {
    setLoading(true);
    try {
      const response = await getUserAPI(userId);
      
      if (response.code === 200) {
        setSelectedUser(response.user);
        return response.user;
      } else {
        throw new Error(response.message || "Không thể lấy thông tin người dùng");
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update user role
  const updateUserRole = async (userId: string, role: string) => {
    setLoading(true);
    try {
      const response = await updateUserRoleAPI(userId, role);
      
      if (response.code === 200) {
        // Update users list if the user exists in it
        setUsers(prevUsers =>
          prevUsers.map(user =>
            user.id === userId
              ? { ...user, role } // Update just the role property
              : user
          )
        );
        
        // Update selected user if it's the one being modified
        if (selectedUser && selectedUser.id === userId) {
          setSelectedUser({...selectedUser, role});
        }
        
        return response;
      } else {
        throw new Error(response.message || "Không thể cập nhật vai trò người dùng");
      }
    } catch (error) {
      console.error("Error updating user role:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Delete user
  const deleteUser = async (userId: string) => {
    setLoading(true);
    try {
      const response = await deleteUserAPI(userId);
      
      if (response.code === 200) {
        // Remove user from the list
        setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
        
        // Clear selected user if it's the one being deleted
        if (selectedUser && selectedUser.id === userId) {
          setSelectedUser(null);
        }
        
        return response;
      } else {
        throw new Error(response.message || "Không thể xóa người dùng");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Helper to manually select a user
  const selectUser = (user: User | null) => {
    setSelectedUser(user);
  };

  return {
    loading,
    users,
    selectedUser,
    getUsers,
    getUser,
    selectUser,
    updateUserRole,
    deleteUser,
    // Empty user object for type usage
    User: {} as User 
  };
};

export default useUser;