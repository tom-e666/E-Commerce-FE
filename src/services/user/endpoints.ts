import { gql } from '@apollo/client';
import { apolloClient } from '@/services/apollo/client';

export const GET_USERS = gql`
  query GetUsers {
    getUsers {
      code
      message
      users {
        id
        email
        full_name
        phone
        created_at
        role
      }
    }
  }
`;

export const AUDIT_ROLE = gql`
  mutation AuditRole($userId: ID!, $role: String!) {
    auditRole(
      user_id: $userId,
      role: $role
    ) {
      code
      message
    }
  }
`;

export const getUsersAPI = async () => {
  try {
    // Kiểm tra token trước khi gọi API
    const token = localStorage.getItem('token') || localStorage.getItem('access_token');
    if (!token) {
      console.error('No token available for getUsersAPI');
      throw new Error('Vui lòng đăng nhập lại để xem danh sách người dùng');
    }

    console.log('Calling getUsers API with token:', token.substring(0, 15) + '...');

    const response = await apolloClient.query({
      query: GET_USERS,
      fetchPolicy: 'network-only',
      context: {
        requiresAuth: true,
        headers: {
          authorization: `Bearer ${token}` // Thêm token vào header
        }
      }
    });

    console.log('getUsers API response:', response);
    return response;
  } catch (error) {
    console.error('Error fetching users:', error);
    // Trả về một đối tượng giả để tránh lỗi "Cannot read properties of undefined"
    return {
      data: {
        getUsers: {
          code: 500,
          message: 'Lỗi khi lấy danh sách người dùng',
          users: []
        }
      }
    };
  }
};

export const auditRoleAPI = async (userId: string, role: string) => {
  try {
    const response = await apolloClient.mutate({
      mutation: AUDIT_ROLE,
      variables: {
        userId,
        role
      },
      context: {
        requiresAuth: true
      }
    });
    return response;
  } catch (error) {
    throw error;
  }
};