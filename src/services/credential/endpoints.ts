import { gql } from '@apollo/client';
import { apolloClient } from '../apollo/client';

// Define GraphQL Queries and Mutations
export const GET_USER_CREDENTIAL = gql`
  query GetMyUserCredential {
    getUserCredential {
      code
      message
      user {
        id
        email
        phone
        full_name
      }
    }
  }
`;

export const UPDATE_USER_INFO = gql`
  mutation UpdateMyUserInfo($fullName: String, $phone: String) {
    updateUserInfo(full_name: $fullName, phone: $phone) {
      code
      message
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

// API function implementations
export const getUserCredential = async () => {
  try {
    const response = await apolloClient.query({
      query: GET_USER_CREDENTIAL,
      fetchPolicy: 'network-only',
      context: {
        requiresAuth: true
      }
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateUserInfo = async (fullName?: string, phone?: string) => {
  try {
    const response = await apolloClient.mutate({
      mutation: UPDATE_USER_INFO,
      variables: { fullName, phone },
      context: {
        requiresAuth: true
      }
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const changePassword = async (oldPassword: string, newPassword: string) => {
  try {
    const response = await apolloClient.mutate({
      mutation: CHANGE_PASSWORD,
      variables: { oldPassword, newPassword },
      context: {
        requiresAuth: true
      }
    });
    return response;
  } catch (error) {
    throw error;
  }
};