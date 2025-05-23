import { gql } from '@apollo/client';
import { apolloClient } from '../apollo/client';

// Define GraphQL Queries and Mutations
export const GET_PAYMENT = gql`
  query GetPayment($orderId: String!) {
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
  mutation CreateCODPayment($orderId: String!) {
    createPaymentCOD(order_id: $orderId) {
      code
      message
      transaction_id
    }
  }
`;

export const CREATE_ZALOPAY_PAYMENT = gql`
  mutation CreateZaloPayPayment($orderId: String!) {
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
    $orderId: String!
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
      mutation: CREATE_VNPAY_PAYMENT,
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