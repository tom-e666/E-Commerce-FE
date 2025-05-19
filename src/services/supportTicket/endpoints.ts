import { gql } from "@apollo/client";
import { apolloClient } from "../apollo/client";

// Query: Get a single support ticket by ID
export const GET_SUPPORT_TICKET = gql`
  query GetSupportTicket($id: ID!) {
    getSupportTicket(ticket_id: $id) {
      code
      message
      supportTicket {
        id
        subject
        message
        status
        created_at
        user {
          id
          full_name
        }
      }
    }
  }
`;

// Query: Get all support tickets with filters
export const GET_SUPPORT_TICKETS = gql`
  query GetSupportTickets($status: String, $page: Int, $per_page: Int) {
    getSupportTickets(status: $status, page: $page, per_page: $per_page) {
      code
      message
      supportTickets {
        id
        subject
        status
        created_at
        user {
          id
          full_name
        }
      }
      total
      current_page
      per_page
    }
  }
`;

// Query: Get responses for a specific ticket
export const GET_SUPPORT_TICKET_RESPONSES = gql`
  query GetSupportTicketResponses($ticketId: ID!) {
    getSupportTicketResponses(ticket_id: $ticketId) {
      code
      message
      responses {
        id
        message
        created_at
        user {
          id
          full_name
          role
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
        created_at
      }
    }
  }
`;

// Mutation: Update an existing ticket
export const UPDATE_SUPPORT_TICKET = gql`
  mutation UpdateSupportTicket($id: ID!, $subject: String, $message: String) {
    updateSupportTicket(ticket_id: $id, subject: $subject, message: $message) {
      code
      message
      supportTicket {
        id
        subject
        message
        status
        updated_at
      }
    }
  }
`;

// Mutation: Update ticket status (admin/staff only)
export const UPDATE_SUPPORT_TICKET_STATUS = gql`
  mutation UpdateSupportTicketStatus($id: ID!, $status: String!) {
    updateSupportTicketStatus(ticket_id: $id, status: $status) {
      code
      message
      supportTicket {
        id
        status
        updated_at
      }
    }
  }
`;

// Mutation: Add a response to a ticket
export const RESPOND_TO_SUPPORT_TICKET = gql`
  mutation RespondToSupportTicket($ticketId: ID!, $message: String!) {
    respondToSupportTicket(ticket_id: $ticketId, message: $message) {
      code
      message
      response {
        id
        message
        created_at
        user {
          id
          full_name
          role
        }
      }
      ticket {
        id
        status
      }
    }
  }
`;

// Mutation: Delete a support ticket (admin/staff only)
export const DELETE_SUPPORT_TICKET = gql`
  mutation DeleteSupportTicket($id: ID!) {
    deleteSupportTicket(ticket_id: $id) {
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
      }
    });
    return data.getSupportTicket;
  } catch (error) {
    console.error("Error fetching support ticket:", error);
    throw error;
  }
};

// Helper function to get all support tickets with filters
export const getSupportTickets = async (
  status?: string,
  page: number = 1,
  per_page: number = 10
) => {
  try {
    const { data } = await apolloClient.query({
      query: GET_SUPPORT_TICKETS,
      variables: { status, page, per_page },
      context: {
        requiresAuth: true
      }
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
      }
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
  subject?: string,
  message?: string
) => {
  try {
    const { data } = await apolloClient.mutate({
      mutation: UPDATE_SUPPORT_TICKET,
      variables: { id, subject, message },
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

// Helper function to update ticket status (admin/staff only)
export const updateSupportTicketStatus = async (id: string, status: string) => {
  try {
    const { data } = await apolloClient.mutate({
      mutation: UPDATE_SUPPORT_TICKET_STATUS,
      variables: { id, status },
      context: {
        requiresAuth: true
      }
    });
    return data.updateSupportTicketStatus;
  } catch (error) {
    console.error("Error updating ticket status:", error);
    throw error;
  }
};

// Helper function to add a response to a ticket
export const respondToSupportTicket = async (ticketId: string, message: string) => {
  try {
    const { data } = await apolloClient.mutate({
      mutation: RESPOND_TO_SUPPORT_TICKET,
      variables: { ticketId, message },
      context: {
        requiresAuth: true
      }
    });
    return data.respondToSupportTicket;
  } catch (error) {
    console.error("Error responding to support ticket:", error);
    throw error;
  }
};

// Helper function to delete a support ticket (admin/staff only)
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

// Types for support ticket
export interface SupportTicket {
  id: string;
  subject: string;
  message: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  created_at: string;
  updated_at?: string;
  user: {
    id: string;
    full_name: string;
  };
}

// Types for support ticket response
export interface TicketResponse {
  id: string;
  message: string;
  created_at: string;
  user: {
    id: string;
    full_name: string;
    role?: string;
  };
}

// Types for pagination
export interface PaginationData {
  total: number;
  current_page: number;
  per_page: number;
}

// Response types
export interface SupportTicketResponse {
  code: number;
  message: string;
  supportTicket?: SupportTicket;
}

export interface SupportTicketsResponse extends PaginationData {
  code: number;
  message: string;
  supportTickets: SupportTicket[];
}

export interface TicketResponsesResponse {
  code: number;
  message: string;
  responses: TicketResponse[];
}

export interface RespondToTicketResponse {
  code: number;
  message: string;
  response: TicketResponse;
  ticket: {
    id: string;
    status: string;
  };
}