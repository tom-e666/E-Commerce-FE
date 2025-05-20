import { gql } from "@apollo/client";
import { apolloClient } from "../apollo/client";

// Interface cho response từ API get current user
interface CurrentUserResponse {
  code: number;
  message: string;
  user: {
    id: string;
    full_name: string;
    role: string;
    email?: string;
    phone?: string;
  } | null;
}

export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      code
      message
      access_token
      refresh_token
      expires_at
      user{
        id
        full_name
        role
      }
    }
  }
`;

export const login = async (email: string, password: string) => {
  return apolloClient.mutate({
    mutation: LOGIN_MUTATION,
    variables: {
      email,
      password
    }
  });
};

export const SIGNUP_MUTATION = gql`
  mutation Signup(
    $email:String!
    $phone:String!
    $password:String!
    $full_name:String!
    ) {

    signup(email: $email,phone: $phone,password: $password,full_name: $full_name) {
      code
      message
    }
  }
`;

export const signup = async (email: string, phone: string, password: string, full_name: string) => {
  return apolloClient.mutate({
    mutation: SIGNUP_MUTATION,
    variables: {
      email,
      phone,
      password,
      full_name
    }
  });
}

// Get Current User Query
export const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    getCurrentUser {
      code
      message
      user {
        id
        full_name
        role
        email
        phone
      }
    }
  }
`;

// Thêm hàm getCurrentUser
export const getCurrentUser = async (): Promise<CurrentUserResponse> => {
  try {
    // Kiểm tra token trước khi gọi API
    const token = localStorage.getItem('token') || localStorage.getItem('access_token');
    if (!token) {
      console.log('No token available for getCurrentUser');
      return {
        code: 401,
        message: 'No authentication token found',
        user: null
      };
    }

    // Thử lấy thông tin user từ localStorage trước
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      try {
        const userData = JSON.parse(storedUserData);
        console.log('Using stored user data:', userData);
        // Trả về dữ liệu từ localStorage nếu có
        return {
          code: 200,
          message: 'User data retrieved from localStorage',
          user: userData
        };
      } catch (parseError) {
        console.warn('Error parsing stored user data, will try API call:', parseError);
      }
    }

    // Nếu không có dữ liệu trong localStorage hoặc parse thất bại, gọi API
    console.log('Calling getCurrentUser API with token:', token.substring(0, 15) + '...');

    const response = await apolloClient.query({
      query: GET_CURRENT_USER,
      fetchPolicy: 'network-only', // Không sử dụng cache để luôn lấy dữ liệu mới nhất
      context: {
        requiresAuth: true, // Cần token xác thực
        headers: {
          authorization: `Bearer ${token}` // Thêm token vào header
        }
      }
    });

    console.log('getCurrentUser API response:', response);

    // Kiểm tra response trước khi truy cập data
    if (!response) {
      console.error('Empty response from server');
      return {
        code: 500,
        message: 'Empty response from server',
        user: null
      };
    }

    if (!response.data) {
      console.error('Response missing data property:', response);
      return {
        code: 500,
        message: 'Response missing data property',
        user: null
      };
    }

    if (!response.data.getCurrentUser) {
      console.error('Response missing getCurrentUser property:', response.data);
      return {
        code: 500,
        message: 'Response missing getCurrentUser property',
        user: null
      };
    }

    // Lưu thông tin user vào localStorage để sử dụng sau này
    if (response.data.getCurrentUser.user) {
      localStorage.setItem('userData', JSON.stringify(response.data.getCurrentUser.user));
    }

    return response.data.getCurrentUser;
  } catch (error) {
    console.error('Error fetching current user:', error);
    // Trả về một response mặc định khi có lỗi
    return {
      code: 401,
      message: 'Unauthorized or error fetching user data',
      user: null
    };
  }
};

export const LOGOUT_MUTATION = gql`
  mutation Logout (
    $refresh_token:String!
  ){
      logout(refresh_token: $refresh_token) {
      code
      message
    }
  }
`;
export const logout = async (refresh_token: string) => {
  return apolloClient.mutate({
    mutation: LOGOUT_MUTATION,
    variables: {
      refresh_token
    }
  });
}
export const REFRESHTOKEN_MUTATION = gql`
mutation refresh_token( $refresh_token:String!){
  refreshToken(
    refresh_token:$refresh_token
  ){
    code
    access_token
    refresh_token
    user
    {
      full_name
      id
      role
    }
    expires_at
  }
}`;
export const refreshTokenAPI = async (refresh_token: string) => {
return apolloClient.mutate({
  mutation: REFRESHTOKEN_MUTATION,
  variables: {
    refresh_token
  }
});
}



