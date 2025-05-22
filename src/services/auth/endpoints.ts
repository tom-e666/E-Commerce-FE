import { gql } from "@apollo/client";
import { apolloClient } from "../apollo/client";

// Interface cho response từ API get current user
interface CurrentUserResponse {
  code: number;
  message: string;
  user: {
    id: string;
    full_name: string;
    email?: string;
    phone?: string;
    role: string;
    email_verified: boolean;
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
  mutation Signup($email: String!, $phone: String!, $password: String!, $fullName: String!) {
    signup(
      email: $email
      phone: $phone
      password: $password
      full_name: $fullName
    ) {
      code
      message
      user {
        id
        email
        phone
        full_name
        email_verified
      }
    }
  }
`;

export const signup = async (email: string, phone: string, password: string, fullName: string) => {
  return apolloClient.mutate({
    mutation: SIGNUP_MUTATION,
    variables: {
      email,
      phone,
      password,
      fullName
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
        email
        phone
        full_name
        role
        email_verified
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

// Logout Mutation
export const LOGOUT_MUTATION = gql`
  mutation Logout($refreshToken: String!) {
    logout(refresh_token: $refreshToken) {
      code
      message
    }
  }
`;

export const logout = async (refreshToken: string) => {
  try {
    const response = await apolloClient.mutate({
      mutation: LOGOUT_MUTATION,
      variables: { refreshToken },
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

export const REFRESH_TOKEN_MUTATION = gql`
  mutation RefreshToken($refreshToken: String!) {
    refreshToken(refresh_token: $refreshToken) {
      code
      message
      access_token
      refresh_token
      expires_at
      user {
        id
        email
        full_name
      }
    }
  }
`;

export const refreshTokenAPI = async (refreshToken: string) => {
  return apolloClient.mutate({
    mutation: REFRESH_TOKEN_MUTATION,
    variables: {
      refreshToken
    }
  });
};

// Email verification mutations
export const SEND_VERIFICATION_EMAIL = gql`
  mutation SendVerificationEmail {
    sendVerificationEmail {
      code
      message
    }
  }
`;

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
export const FORGOT_PASSWORD_MUTATION = gql`
  mutation ForgotPassword($email: String!) {
    forgotPassword(email: $email) {
      code
      message
    }
  }
`;
export const forgotPassword = async (email: string): Promise<BaseResponse> => {
  try {
    const { data } = await apolloClient.mutate({
      mutation: FORGOT_PASSWORD_MUTATION,
      variables: { email }
    });
    return data.forgotPassword;
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return {
      code: 500,
      message: 'An error occurred while sending password reset email'
    };
  }
};

// Reset Password Mutation
export const RESET_PASSWORD_MUTATION = gql`
  mutation ResetPassword(
    $userId: ID!,
    $token: String!,
    $password: String!,
    $passwordConfirmation: String!
  ) {
    resetPassword(
      user_id: $userId,
      token: $token,
      password: $password,
      password_confirmation: $passwordConfirmation
    ) {
      code
      message
    }
  }
`;

export interface ResetPasswordParams {
  userId: string;
  token: string;
  password: string;
  passwordConfirmation: string;
}

// Update the VERIFY_PASSWORD_RESET_TOKEN mutation to match the GraphQL schema
export const VERIFY_PASSWORD_RESET_TOKEN = gql`
  mutation VerifyPasswordResetToken($user_id: ID!, $token: String!) {
    verifyPasswordResetToken(user_id: $user_id, token: $token) {
      code
      message
    }
  }
`;

/**
 * Verify password reset token
 * @param userId User ID
 * @param token Reset token
 */
export const verifyPasswordResetToken = async (userId: string, token: string): Promise<BaseResponse> => {
  try {
    const { data } = await apolloClient.mutate({
      mutation: VERIFY_PASSWORD_RESET_TOKEN,
      variables: { 
        user_id: userId,  // Use user_id to match the GraphQL schema
        token 
      }
    });
    return data.verifyPasswordResetToken;
  } catch (error) {
    console.error('Error verifying password reset token:', error);
    return {
      code: 500,
      message: 'An error occurred while verifying password reset token'
    };
  }
};

const RESET_PASSWORD_WITH_TOKEN = gql`
  mutation ResetPasswordWithToken(
    $user_id: ID!,
    $token: String!,
    $password: String!,
    $password_confirmation: String!
  ) {
    resetPassword(
      user_id: $user_id,
      token: $token,
      password: $password,
      password_confirmation: $password_confirmation
    ) {
      code
      message
    }
  }
`;
export const resetPasswordWithToken = async (
  userId: string, 
  token: string, 
  newPassword: string
): Promise<BaseResponse> => {
  try {
    const { data } = await apolloClient.mutate({
      mutation: RESET_PASSWORD_WITH_TOKEN,
      variables: { 
        user_id: userId, // Use user_id to match the GraphQL schema
        token,
        password: newPassword,
        password_confirmation: newPassword  // Add password confirmation to match mutation
      }
    });
    return data.resetPassword;
  } catch (error) {
    console.error('Error resetting password:', error);
    return {
      code: 500,
      message: 'An error occurred while resetting password'
    };
  }
};