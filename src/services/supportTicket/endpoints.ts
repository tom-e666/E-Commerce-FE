import { gql } from "@apollo/client";
import { apolloClient } from "../apollo/client";

// Query: Get a single support ticket by ID
export const GET_SUPPORT_TICKET = gql`
  query GetSupportTicket($id: ID!) {
    getSupportTicket(id: $id) {
      code
      message
      supportTicket {
        id
        subject
        message
        status
        user_id
        created_at
        responses {
          id
          subject
          message
          ticket_id
          user_id
          created_at
          user {
            id
            role
            full_name
          }
        }
      }
    }
  }
`;

// Query: Get all support tickets with filters
export const GET_SUPPORT_TICKETS = gql`
  query GetSupportTickets($userId: ID, $status: String, $createdAfter: String, $createdBefore: String) {
    getSupportTickets(
      user_id: $userId, 
      status: $status, 
      created_after: $createdAfter, 
      created_before: $createdBefore
    ) {
      code
      message
      supportTickets {
        id
        subject
        message
        status
        user_id
        created_at
      }
    }
  }
`;

// Query: Get responses for a specific ticket
export const GET_SUPPORT_TICKET_RESPONSES = gql`
  query GetSupportTicketResponses($ticketId: ID!) {
    getSupportTicketResponses(ticket_id: $ticketId) {
      code
      message
      supportTicketResponses {
        id
        subject
        message
        ticket_id
        user_id
        created_at
        user {
          id
          role
          full_name
        }
      }
    }
  }
`;

// Mutation: Create a new support ticket
export const CREATE_SUPPORT_TICKET = gql`
  mutation CreateSupportTicket($subject: String!, $message: String!) {
    createSupportTicket(subject: $subject, message: $message) {
      code
      message
      supportTicket {
        id
        subject
        message
        status
        user_id
        created_at
      }
    }
  }
`;

// Mutation: Update an existing ticket
export const UPDATE_SUPPORT_TICKET = gql`
  mutation UpdateSupportTicket($id: ID!, $subject: String, $message: String, $status: String) {
    updateSupportTicket(
      id: $id, 
      subject: $subject, 
      message: $message, 
      status: $status
    ) {
      code
      message
      supportTicket {
        id
        subject
        message
        status
        user_id
        created_at
      }
    }
  }
`;

// Mutation: Add a response to a support ticket
export const CREATE_SUPPORT_TICKET_RESPONSE = gql`
  mutation CreateSupportTicketResponse($ticketId: ID!, $subject: String, $message: String!) {
    createSupportTicketResponse(
      ticket_id: $ticketId, 
      subject: $subject, 
      message: $message
    ) {
      code
      message
      supportTicketResponse {
        id
        subject
        message
        ticket_id
        user_id
        created_at
        user {
          id
          role
          full_name
        }
      }
    }
  }
`;

// Mutation: Update a support ticket response
export const UPDATE_SUPPORT_TICKET_RESPONSE = gql`
  mutation UpdateSupportTicketResponse($id: ID!, $subject: String, $message: String) {
    updateSupportTicketResponse(
      id: $id,
      subject: $subject,
      message: $message
    ) {
      code
      message
      supportTicketResponse {
        id
        subject
        message
        ticket_id
        user_id
        created_at
        user {
          id
          role
          full_name
        }
      }
    }
  }
`;

// Mutation: Delete a support ticket
export const DELETE_SUPPORT_TICKET = gql`
  mutation DeleteSupportTicket($id: ID!) {
    deleteSupportTicket(id: $id) {
      code
      message
    }
  }
`;

// Mutation: Delete a support ticket response
export const DELETE_SUPPORT_TICKET_RESPONSE = gql`
  mutation DeleteSupportTicketResponse($id: ID!) {
    deleteSupportTicketResponse(id: $id) {
      code
      message
    }
  }
`;

// Helper function to get a support ticket by ID
export const getSupportTicket = async (id: string) => {
  try {
    const { data } = await apolloClient.query({
      query: GET_SUPPORT_TICKET,
      variables: { id },
      context: {
        requiresAuth: true
      },
      fetchPolicy: 'network-only'
    });
    return data.getSupportTicket;
  } catch (error) {
    console.error("Error fetching support ticket:", error);
    throw error;
  }
};

// Helper function to get all support tickets with filters
export const getSupportTickets = async (filters?: {
  userId?: string;
  status?: string;
  createdAfter?: string;
  createdBefore?: string;
}) => {
  try {
    const { data } = await apolloClient.query({
      query: GET_SUPPORT_TICKETS,
      variables: filters || {},
      context: {
        requiresAuth: true
      },
      fetchPolicy: 'network-only'
    });
    return data.getSupportTickets;
  } catch (error) {
    console.error("Error fetching support tickets:", error);
    throw error;
  }
};

// Helper function to get responses for a specific ticket
export const getSupportTicketResponses = async (ticketId: string) => {
  try {
    const { data } = await apolloClient.query({
      query: GET_SUPPORT_TICKET_RESPONSES,
      variables: { ticketId },
      context: {
        requiresAuth: true
      },
      fetchPolicy: 'network-only'
    });
    return data.getSupportTicketResponses;
  } catch (error) {
    console.error("Error fetching ticket responses:", error);
    throw error;
  }
};

// Helper function to create a new support ticket
export const createSupportTicket = async (subject: string, message: string) => {
  try {
    const { data } = await apolloClient.mutate({
      mutation: CREATE_SUPPORT_TICKET,
      variables: { subject, message },
      context: {
        requiresAuth: true
      }
    });
    return data.createSupportTicket;
  } catch (error) {
    console.error("Error creating support ticket:", error);
    throw error;
  }
};

// Helper function to update an existing ticket
export const updateSupportTicket = async (
  id: string,
  updates: {
    subject?: string;
    message?: string;
    status?: string;
  }
) => {
  try {
    const { data } = await apolloClient.mutate({
      mutation: UPDATE_SUPPORT_TICKET,
      variables: { id, ...updates },
      context: {
        requiresAuth: true
      }
    });
    return data.updateSupportTicket;
  } catch (error) {
    console.error("Error updating support ticket:", error);
    throw error;
  }
};

// Helper function to add a response to a ticket
export const createSupportTicketResponse = async (
  ticketId: string, 
  message: string,
  subject?: string
) => {
  try {
    const { data } = await apolloClient.mutate({
      mutation: CREATE_SUPPORT_TICKET_RESPONSE,
      variables: { ticketId, message, subject },
      context: {
        requiresAuth: true
      }
    });
    return data.createSupportTicketResponse;
  } catch (error) {
    console.error("Error responding to support ticket:", error);
    throw error;
  }
};

// Helper function to update a response
export const updateSupportTicketResponse = async (
  id: string,
  updates: {
    subject?: string;
    message?: string;
  }
) => {
  try {
    const { data } = await apolloClient.mutate({
      mutation: UPDATE_SUPPORT_TICKET_RESPONSE,
      variables: { id, ...updates },
      context: {
        requiresAuth: true
      }
    });
    return data.updateSupportTicketResponse;
  } catch (error) {
    console.error("Error updating support ticket response:", error);
    throw error;
  }
};

// Helper function to delete a support ticket
export const deleteSupportTicket = async (id: string) => {
  try {
    const { data } = await apolloClient.mutate({
      mutation: DELETE_SUPPORT_TICKET,
      variables: { id },
      context: {
        requiresAuth: true
      }
    });
    return data.deleteSupportTicket;
  } catch (error) {
    console.error("Error deleting support ticket:", error);
    throw error;
  }
};

// Helper function to delete a support ticket response
export const deleteSupportTicketResponse = async (id: string) => {
  try {
    const { data } = await apolloClient.mutate({
      mutation: DELETE_SUPPORT_TICKET_RESPONSE,
      variables: { id },
      context: {
        requiresAuth: true
      }
    });
    return data.deleteSupportTicketResponse;
  } catch (error) {
    console.error("Error deleting support ticket response:", error);
    throw error;
  }
};

// Types for support ticket
export interface SupportTicket {
  id: string;
  subject: string;
  message: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  user_id: string;
  created_at: string;
  responses?: TicketResponse[];
}

// Types for user
export interface UserCredential {
  id: string;
  full_name: string;
  email?: string;
  role?: string;
}

// Types for support ticket response
export interface TicketResponse {
  id: string;
  subject: string;
  message: string;
  ticket_id: string;
  user_id: string;
  created_at: string;
  user?: UserCredential;
}

// Response types
export interface SupportTicketResponse {
  code: number;
  message: string;
  supportTicket?: SupportTicket;
}

export interface SupportTicketsResponse {
  code: number;
  message: string;
  supportTickets: SupportTicket[];
}

export interface TicketResponsesResponse {
  code: number;
  message: string;
  supportTicketResponses: TicketResponse[];
}

export interface SingleTicketResponseResponse {
  code: number;
  message: string;
  supportTicketResponse: TicketResponse;
}

export interface BaseResponse {
  code: number;
  message: string;
}