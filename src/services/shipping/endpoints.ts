import { gql } from '@apollo/client';
import { apolloClient } from '../apollo/client';

// Define GraphQL Queries and Mutations
export const GET_SHIPPING_BY_ORDER = gql`
  query GetShippingForOrder($orderId: String!) {
    getShippingByOrder(order_id: $orderId) {
      code
      message
      shipping {
        id
        tracking_code
        carrier
        estimated_date
        status
        address
        order_id
        recipient_name
        recipient_phone
        note
        created_at
        updated_at
      }
    }
  }
`;

export const GET_SHIPPINGS_LIST = gql`
  query GetShippingsList($status: String) {
    getShippings(status: $status) {
      code
      message
      shippings {
        id
        tracking_code
        carrier
        estimated_date
        status
        address
        order_id
        recipient_name
        recipient_phone
        note
        created_at
        updated_at
      }
    }
  }
`;

export const CREATE_SHIPPING = gql`
  mutation CreateNewShipping(
    $orderId: ID!,
    $trackingCode: String!,
    $carrier: String!,
    $estimatedDate: String!,
    $status: String!,
    $address: String!,
    $recipientName: String,
    $recipientPhone: String,
    $note: String
  ) {
    createShipping(
      order_id: $orderId,
      tracking_code: $trackingCode,
      carrier: $carrier,
      estimated_date: $estimatedDate,
      status: $status,
      address: $address
      recipient_name: $recipientName,
      recipient_phone: $recipientPhone,
      note: $note
    ) {
      code
      message
    }
  }
`;

export const UPDATE_SHIPPING = gql`
  mutation UpdateShippingDetails(
    $orderId: ID!,
    $carrier: String,
    $address: String,
    $recipientName: String,
    $recipientPhone: String,
    $note: String
  ) {
    updateShipping(
      order_id: $orderId,
      tracking_code: $trackingCode,
      carrier: $carrier,
      estimated_date: $estimatedDate,
      status: $status,
      address: $address,
      note: $note
    ) {
      code
      message
    }
  }
`;

export const UPDATE_SHIPPING_STATUS = gql`
  mutation UpdateSpecificShippingStatus($shippingId: ID!, $newStatus: String!) {
    updateShippingStatus(id: $shippingId, status: $newStatus) {
      code
      message
    }
  }
`;

// API function implementations remain the same
export const getShippingByOrder = async (orderId: string) => {
  try {
    const response = await apolloClient.query({
      query: GET_SHIPPING_BY_ORDER,
      variables: { orderId },
      fetchPolicy: 'network-only',
      context: {
        requiresAuth: true
      }
    });
    return response;
  } catch (error) {
    console.error('Error fetching shipping by order:', error);
    throw error;
  }
};

export const getShippingsList = async (status?: string) => {
  try {
    const response = await apolloClient.query({
      query: GET_SHIPPINGS_LIST,
      variables: { status },
      fetchPolicy: 'network-only',
      context: {
        requiresAuth: true
      }
    });
    return response;
  } catch (error) {
    console.error('Error fetching shippings list:', error);
    throw error;
  }
};

export const createShipping = async (
  orderId: string,
  trackingCode: string,
  carrier: string,
  estimatedDate: string,
  status: string,
  address: string,
  recipientName?: string,
  recipientPhone?: string,
  note?: string
) => {
  try {
    const response = await apolloClient.mutate({
      mutation: CREATE_SHIPPING,
      variables: {
        orderId,
        trackingCode,
        carrier,
        estimatedDate,
        status,
        address,
        recipientName,
        recipientPhone,
        note
      },
      context: {
        requiresAuth: true
      }
    });
    return response;
  } catch (error) {
    console.error('Error creating shipping:', error);
    throw error;
  }
};

export const updateShipping = async (
  orderId: string,
  carrier?: string,
  address?: string,
  recipient_name?:string,
  recipient_phone?:string,
  note?:string

) => {
  try {
    const response = await apolloClient.mutate({
      mutation: UPDATE_SHIPPING,
      variables: {
        orderId,
        carrier,
        address,
        recipient_name,
        recipient_phone,
        note
      },
      context: {
        requiresAuth: true
      }
    });
    return response;
  } catch (error) {
    console.error('Error updating shipping:', error);
    throw error;
  }
};

export const updateShippingStatus = async (shippingId: string, newStatus: string) => {
  try {
    const response = await apolloClient.mutate({
      mutation: UPDATE_SHIPPING_STATUS,
      variables: {
        shippingId,
        newStatus
      },
      context: {
        requiresAuth: true
      }
    });
    return response;
  } catch (error) {
    console.error('Error updating shipping status:', error);
    throw error;
  }
};