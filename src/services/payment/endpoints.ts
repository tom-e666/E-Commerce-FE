import { gql } from '@apollo/client';
import { apolloClient } from '../apollo/client';

// Define GraphQL Queries and Mutations
export const GET_PAYMENT = gql`
  query GetPayment($orderId: ID!) {
    getPayment(order_id: $orderId) {
      code
      message
      payment {
        id
        order_id
        amount
        payment_method
        payment_status
        created_at
        payment_time
        transaction_id
      }
    }
  }
`;

export const CREATE_COD_PAYMENT = gql`
  mutation CreateCODPayment($orderId: ID!) {
    createPaymentCOD(order_id: $orderId) {
      code
      message
      transaction_id
    }
  }
`;

export const CREATE_ZALOPAY_PAYMENT = gql`
  mutation CreateZaloPayPayment($orderId: ID!) {
    createPaymentZalopay(order_id: $orderId) {
      code
      message
      payment_url
      transaction_id
    }
  }
`;

export const CREATE_VNPAY_PAYMENT = gql`
  mutation createPaymentVNPay(
    $orderId: ID!
    $orderType: String!
    $bankCode: String!
  ) {
    createPaymentVNPay(
      order_id: $orderId
      order_type: $orderType
      bank_code: $bankCode
    ) {
      code
      message
      payment_url
    }
  }
`;

export const CREATE_STRIPE_PAYMENT = gql`
  mutation CreateStripePayment(
    $orderId: ID!
    $successUrl: String!
    $cancelUrl: String!
  ) {
    createStripeCheckoutSession(
      order_id: $orderId
      success_url: $successUrl
      cancel_url: $cancelUrl
    ) {
      code
      message
      session_id
      checkout_url
      transaction_id
    }
  }
`;

// Define interfaces for response types
export interface Payment {
  id: string;
  order_id: string;
  amount: number;
  payment_method: string;
  payment_status: 'pending' | 'completed' | 'failed';
  created_at: string;
  payment_time?: string;
  transaction_id?: string;
}

export interface PaymentResponse {
  code: number;
  message: string;
  payment?: Payment;
}

export interface CODPaymentResponse {
  code: number;
  message: string;
  transaction_id?: string;
}

export interface ZaloPayPaymentResponse {
  code: number;
  message: string;
  payment_url?: string;
  transaction_id?: string;
}

export interface VNPayPaymentResponse {
  code: number;
  message: string;
  payment_url?: string;
}

export interface StripePaymentResponse {
  code: number;
  message: string;
  session_id?: string;
  checkout_url?: string;
  transaction_id?: string;
}

// API function implementations
export const getPayment = async (orderId: string): Promise<PaymentResponse> => {
  try {
    const response = await apolloClient.query({
      query: GET_PAYMENT,
      variables: { orderId },
      fetchPolicy: 'network-only',
      context: {
        requiresAuth: true
      }
    });
    return response.data.getPayment;
  } catch (error) {
    console.error('Error fetching payment:', error);
    throw error;
  }
};

export const createCODPayment = async (orderId: string): Promise<CODPaymentResponse> => {
  try {
    const response = await apolloClient.mutate({
      mutation: CREATE_COD_PAYMENT,
      variables: { orderId },
      context: {
        requiresAuth: true
      }
    });
    return response.data.createPaymentCOD;
  } catch (error) {
    console.error('Error creating COD payment:', error);
    throw error;
  }
};

export const createZaloPayPayment = async (orderId: string): Promise<ZaloPayPaymentResponse> => {
  try {
    const response = await apolloClient.mutate({
      mutation: CREATE_ZALOPAY_PAYMENT,
      variables: { orderId },
      context: {
        requiresAuth: true
      }
    });
    return response.data.createPaymentZalopay;
  } catch (error) {
    console.error('Error creating ZaloPay payment:', error);
    throw error;
  }
};

export const createVNPayPayment = async (
  orderId: string,
  amount: number,
  orderInfo: string,
  orderType: string,
  bankCode: string
): Promise<VNPayPaymentResponse> => {
  try {
    const response = await apolloClient.mutate({
      mutation: CREATE_VNPAY_PAYMENT,
      variables: { orderId, amount, orderInfo, orderType, bankCode },
      context: { requiresAuth: true },
    });
    return response.data.createPaymentVNPay;
  } catch (error) {
    console.error('Error creating VNPay payment:', error);
    throw error;
  }
};

export const createStripePayment = async (
  orderId: string,
  successUrl: string,
  cancelUrl: string
): Promise<StripePaymentResponse> => {
  try {
    const response = await apolloClient.mutate({
      mutation: CREATE_STRIPE_PAYMENT,
      variables: { orderId, successUrl, cancelUrl },
      context: {
        requiresAuth: true
      }
    });
    
    // Fix: Check if the response data exists and has the correct structure
    if (response.data && response.data.createStripeCheckoutSession) {
      return response.data.createStripeCheckoutSession;
    } else {
      throw new Error('Invalid response structure from Stripe payment API');
    }
  } catch (error) {
    console.error('Error creating Stripe payment:', error);
    throw error;
  }
};