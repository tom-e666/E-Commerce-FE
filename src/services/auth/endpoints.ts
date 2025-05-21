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

// Base response interface for common responses
export interface BaseResponse {
  code: number;
  message: string;
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
};

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

// Hàm getCurrentUser
export const getCurrentUser = async (): Promise<CurrentUserResponse> => {
  try {
    const response = await apolloClient.query({
      query: GET_CURRENT_USER,
      fetchPolicy: 'network-only', 
      context: {
        requiresAuth: true
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

// Logout Mutation nếu cần
export const LOGOUT_MUTATION = gql`
  mutation Logout {
    logout {
      code
      message
    }
  }
`;

export const logout = async () => {
  try {
    const response = await apolloClient.mutate({
      mutation: LOGOUT_MUTATION,
      context: {
        requiresAuth: true
      }
    });
    return response.data.logout;
  } catch (error) {
    console.error('Error logging out:', error);
    throw error;
  }
};
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

// Updated email verification mutations

export const SEND_VERIFICATION_EMAIL = gql`
  mutation SendVerificationEmail {
    sendVerificationEmail {
      code
      message
    }
  }
`;

// Updated email verification mutation to match the schema that only requires token
export const VERIFY_EMAIL = gql`
  mutation VerifyEmail($token: String!) {
    verifyEmail(token: $token) {
      code
      message
    }
  }
`;

export const RESEND_VERIFICATION_EMAIL = gql`
  mutation ResendVerificationEmail {
    resendVerificationEmail {
      code
      message
    }
  }
`;

export const sendVerificationEmail = async (): Promise<BaseResponse> => {
  try {
    const response = await apolloClient.mutate({
      mutation: SEND_VERIFICATION_EMAIL,
      context: {
        requiresAuth: true
      }
    });
    return response.data.sendVerificationEmail;
  } catch (error) {
    console.error('Error sending verification email:', error);
    return {
      code: 500,
      message: 'An error occurred while sending verification email'
    };
  }
};

export const verifyEmail = async (token: string): Promise<BaseResponse> => {
  try {
    const response = await apolloClient.mutate({
      mutation: VERIFY_EMAIL,
      variables: { token }
    });
    return response.data.verifyEmail;
  } catch (error) {
    console.error('Error verifying email:', error);
    return {
      code: 500,
      message: 'An error occurred during email verification'
    };
  }
};

export const resendVerificationEmail = async (): Promise<BaseResponse> => {
  try {
    const response = await apolloClient.mutate({
      mutation: RESEND_VERIFICATION_EMAIL,
      context: {
        requiresAuth: true
      }
    });
    return response.data.resendVerificationEmail;
  } catch (error) {
    console.error('Error resending verification email:', error);
    return {
      code: 500,
      message: 'An error occurred while resending verification email'
    };
  }
};

