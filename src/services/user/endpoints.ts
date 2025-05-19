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
    const response = await apolloClient.query({
      query: GET_USERS,
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