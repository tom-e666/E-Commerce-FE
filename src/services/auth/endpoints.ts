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
    const response = await apolloClient.query({
      query: GET_CURRENT_USER,
      fetchPolicy: 'network-only', // Không sử dụng cache để luôn lấy dữ liệu mới nhất
      context: {
        requiresAuth: true // Cần token xác thực
      }
    });
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



