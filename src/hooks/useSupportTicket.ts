'use client'

import { useState } from 'react';
import {
  getSupportTicket,
  getSupportTickets,
  getSupportTicketResponses,
  createSupportTicket,
  createSupportTicketResponse,
  updateSupportTicket,
  updateSupportTicketResponse,
//   deleteSupportTicket,
  deleteSupportTicketResponse,
  SupportTicket,
  TicketResponse
} from '@/services/supportTicket/endpoints';

export const useSupportTicket = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [currentTicket, setCurrentTicket] = useState<SupportTicket | null>(null);
  const [responses, setResponses] = useState<TicketResponse[]>([]);

  // Get all tickets for the current user
  const fetchUserTickets = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getSupportTickets();
      if (response.code === 200) {
        // Ensure tickets is always an array
        const ticketsArray = Array.isArray(response.supportTickets) 
          ? response.supportTickets 
          : [];
        setTickets(ticketsArray);
      } else {
        setError(response.message);
        // Initialize with empty array in case of error
        setTickets([]);
      }
    } catch (err) {
      setError('Failed to fetch tickets');
      console.error(err);
      // Initialize with empty array in case of error
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  // Get a single ticket by ID
  const fetchTicket = async (ticketId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getSupportTicket(ticketId);
      if (response.code === 200 && response.supportTicket) {
        setCurrentTicket(response.supportTicket);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError('Failed to fetch ticket details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Get all responses for a ticket
  const fetchTicketResponses = async (ticketId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getSupportTicketResponses(ticketId);
      if (response.code === 200) {
        // First fetch the ticket itself to ensure we have the latest data
        const ticketResponse = await getSupportTicket(ticketId);
        if (ticketResponse.code === 200 && ticketResponse.supportTicket) {
          setCurrentTicket(ticketResponse.supportTicket);
        }
        
        // Now set the responses
        const responsesArray = Array.isArray(response.supportTicketResponses) 
          ? response.supportTicketResponses 
          : [];
        setResponses(responsesArray);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError('Failed to fetch ticket responses');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Create a new ticket
  const handleCreateTicket = async (subject: string, message: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await createSupportTicket(subject, message);
      if (response.code === 200 && response.supportTicket) {
        setCurrentTicket(response.supportTicket);
        return response.supportTicket;
      } else {
        setError(response.message);
        return null;
      }
    } catch (err) {
      setError('Failed to create ticket');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Add a response to a ticket
  const handleAddResponse = async (ticketId: string, message: string, subject?: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await createSupportTicketResponse(ticketId, message, subject);
      if (response.code === 200) {
        // Refresh ticket data to include the new response
        await fetchTicketResponses(ticketId);
        return true;
      } else {
        setError(response.message);
        return false;
      }
    } catch (err) {
      setError('Failed to add response');
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Update a response
  const handleUpdateResponse = async (
    responseId: string, 
    updates: { subject?: string; message?: string }
  ) => {
    setLoading(true);
    setError(null);
    try {
      const response = await updateSupportTicketResponse(responseId, updates);
      if (response.code === 200) {
        // Update the response in the local state
        setResponses(prev => 
          prev.map(resp => 
            resp.id === responseId 
              ? { ...resp, ...updates } 
              : resp
          )
        );
        return true;
      } else {
        setError(response.message);
        return false;
      }
    } catch (err) {
      setError('Failed to update response');
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Delete a response
  const handleDeleteResponse = async (responseId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await deleteSupportTicketResponse(responseId);
      if (response.code === 200) {
        // Remove the response from the local state
        setResponses(prev => 
          prev.filter(resp => resp.id !== responseId)
        );
        return true;
      } else {
        setError(response.message);
        return false;
      }
    } catch (err) {
      setError('Failed to delete response');
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Close a ticket
  const handleCloseTicket = async (ticketId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await updateSupportTicket(ticketId, { status: 'closed' });
      if (response.code === 200) {
        // Update the current ticket with the new status
        if (currentTicket && currentTicket.id === ticketId) {
          setCurrentTicket({
            ...currentTicket,
            status: 'closed'
          });
        }
        // Update ticket in the tickets list
        setTickets(prev => 
          prev.map(ticket => 
            ticket.id === ticketId 
              ? { ...ticket, status: 'closed' } 
              : ticket
          )
        );
        return true;
      } else {
        setError(response.message);
        return false;
      }
    } catch (err) {
      setError('Failed to close ticket');
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    tickets,
    currentTicket,
    responses,
    fetchUserTickets,
    fetchTicket,
    fetchTicketResponses,
    createTicket: handleCreateTicket,
    addResponse: handleAddResponse,
    updateResponse: handleUpdateResponse,
    deleteResponse: handleDeleteResponse,
    closeTicket: handleCloseTicket,
  };
};
