import { gql } from '@apollo/client';
import { apolloClient } from '@/services/apollo/client';

// Interfaces
export interface User {
  id: string;
  email: string;
  phone: string;
  full_name: string;
  role: string;
  email_verified: boolean;
}

export interface BaseResponse {
  code: number;
  message: string;
}

export interface UserResponse extends BaseResponse {
  user: User | null;
}

export interface UsersResponse extends BaseResponse {
  users: User[];
}

// User Queries
export const GET_USER_INFO = gql`
  query GetUserInfo {
    getUserInfo {
      code
      message
      user {
        id
        email
        phone
        full_name
        role
        email_verified
      }
    }
  }
`;

export const GET_USER_CREDENTIAL = gql`
  query GetUserCredential {
    getUserCredential {
      code
      message
      user {
        id
        email
        phone
        full_name
        role
        email_verified
      }
    }
  }
`;

export const GET_ALL_USERS = gql`
  query GetAllUsers($role: String, $search: String) {
    getAllUsers(role: $role, search: $search) {
      code
      message
      users {
        id
        email
        phone
        full_name
        role
        email_verified
        created_at
      }
    }
  }
`;

export const GET_USER = gql`
  query GetUser($userId: ID!) {
    getUser(user_id: $userId) {
      code
      message
      user {
        id
        email
        phone
        full_name
        role
        email_verified
      }
    }
  }
`;

// User Mutations
export const UPDATE_USER_INFO = gql`
  mutation UpdateUserInfo($email: String, $phone: String, $fullName: String) {
    updateUserInfo(email: $email, phone: $phone, full_name: $fullName) {
      code
      message
      user {
        id
        email
        phone
        full_name
        role
        email_verified
      }
    }
  }
`;

export const CHANGE_PASSWORD = gql`
  mutation ChangePassword($oldPassword: String!, $newPassword: String!) {
    changePassword(old_password: $oldPassword, new_password: $newPassword) {
      code
      message
    }
  }
`;

export const UPDATE_USER_ROLE = gql`
  mutation UpdateUserRole($userId: ID!, $role: String!) {
    updateUserRole(user_id: $userId, role: $role) {
      code
      message
      user {
        id
        email
        phone
        full_name
        role
        email_verified
      }
    }
  }
`;

export const DELETE_USER = gql`
  mutation DeleteUser($userId: ID!) {
    deleteUser(user_id: $userId) {
      code
      message
    }
  }
`;

// API Functions
export const getUserInfoAPI = async (): Promise<UserResponse> => {
  try {
    const response = await apolloClient.query({
      query: GET_USER_INFO,
      fetchPolicy: 'network-only',
      context: {
        requiresAuth: true
      }
    });
    return response.data.getUserInfo;
  } catch (error) {
    console.error('Error fetching user info:', error);
    return {
      code: 500,
      message: 'Lỗi khi lấy thông tin người dùng',
      user: null
    };
  }
};

export const getUserCredentialAPI = async (): Promise<UserResponse> => {
  try {
    const response = await apolloClient.query({
      query: GET_USER_CREDENTIAL,
      fetchPolicy: 'network-only',
      context: {
        requiresAuth: true
      }
    });
    return response.data.getUserCredential;
  } catch (error) {
    console.error('Error fetching user credential:', error);
    return {
      code: 500,
      message: 'Lỗi khi lấy thông tin người dùng',
      user: null
    };
  }
};

export const getAllUsersAPI = async (role?: string, search?: string): Promise<UsersResponse> => {
  try {
    const response = await apolloClient.query({
      query: GET_ALL_USERS,
      variables: { role, search },
      fetchPolicy: 'network-only',
      context: {
        requiresAuth: true
      }
    });
    return response.data.getAllUsers;
  } catch (error) {
    console.error('Error fetching all users:', error);
    return {
      code: 500,
      message: 'Lỗi khi lấy danh sách người dùng',
      users: []
    };
  }
};

export const getUserAPI = async (userId: string): Promise<UserResponse> => {
  try {
    const response = await apolloClient.query({
      query: GET_USER,
      variables: { userId },
      fetchPolicy: 'network-only',
      context: {
        requiresAuth: true
      }
    });
    return response.data.getUser;
  } catch (error) {
    console.error('Error fetching user:', error);
    return {
      code: 500,
      message: 'Lỗi khi lấy thông tin người dùng',
      user: null
    };
  }
};

export const updateUserInfoAPI = async (email?: string, phone?: string, fullName?: string): Promise<UserResponse> => {
  try {
    const response = await apolloClient.mutate({
      mutation: UPDATE_USER_INFO,
      variables: { email, phone, fullName },
      context: {
        requiresAuth: true
      }
    });
    return response.data.updateUserInfo;
  } catch (error) {
    console.error('Error updating user info:', error);
    throw error;
  }
};

export const changePasswordAPI = async (oldPassword: string, newPassword: string): Promise<BaseResponse> => {
  try {
    const response = await apolloClient.mutate({
      mutation: CHANGE_PASSWORD,
      variables: { oldPassword, newPassword },
      context: {
        requiresAuth: true
      }
    });
    return response.data.changePassword;
  } catch (error) {
    console.error('Error changing password:', error);
    throw error;
  }
};

export const updateUserRoleAPI = async (userId: string, role: string): Promise<UserResponse> => {
  try {
    const response = await apolloClient.mutate({
      mutation: UPDATE_USER_ROLE,
      variables: { userId, role },
      context: {
        requiresAuth: true
      }
    });
    return response.data.updateUserRole;
  } catch (error) {
    console.error('Error updating user role:', error);
    throw error;
  }
};

export const deleteUserAPI = async (userId: string): Promise<BaseResponse> => {
  try {
    const response = await apolloClient.mutate({
      mutation: DELETE_USER,
      variables: { userId },
      context: {
        requiresAuth: true
      }
    });
    return response.data.deleteUser;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};