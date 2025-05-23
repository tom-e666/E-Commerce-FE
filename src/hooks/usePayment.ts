import { useState } from 'react';
import {
  getPayment as apiGetPayment,
  createCODPayment as apiCreateCODPayment,
  createZaloPayPayment as apiCreateZaloPayPayment,
  createVNPayPayment as apiCreateVNPayPayment,
  Payment,
  PaymentResponse,
  CODPaymentResponse,
  ZaloPayPaymentResponse,
  VNPayPaymentResponse
} from '../services/payment/endpoints';

export interface PaymentHookReturn {
  loading: boolean;
  paymentData: Payment | null;
  fetchPayment: (orderId: string) => Promise<PaymentResponse>;
  createCODPayment: (orderId: string) => Promise<CODPaymentResponse>;
  createZaloPayPayment: (orderId: string) => Promise<ZaloPayPaymentResponse>;
  createVNPayPayment: (
    orderId: string,
    amount: number,
    orderInfo: string,
    orderType: string,
    bankCode: string
  ) => Promise<VNPayPaymentResponse>;
  isPaymentComplete: (orderId: string) => Promise<boolean>;
  verifyPayment: (orderId: string, transaction_id: string) => Promise<boolean>;
}

export const usePayment = (): PaymentHookReturn => {
  const [loading, setLoading] = useState<boolean>(false);
  const [paymentData, setPaymentData] = useState<Payment | null>(null);

  /**
   * Fetch payment details for a specific order
   */
  const fetchPayment = async (orderId: string): Promise<PaymentResponse> => {
    setLoading(true);
    try {
      const response = await apiGetPayment(orderId);
      
      if (response.code === 200 && response.payment) {
        setPaymentData(response.payment);
      } else {
        setPaymentData(null);
      }
      
      return response;
    } catch (error) {
      console.error("Error fetching payment:", error);
      throw new Error(error instanceof Error ? error.message : "Lỗi khi lấy thông tin thanh toán");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Create a new Cash On Delivery (COD) payment for an order
   */
  const createCODPayment = async (orderId: string): Promise<CODPaymentResponse> => {
    setLoading(true);
    try {
      const response = await apiCreateCODPayment(orderId);
      
      if (response.code === 200) {
        // Refresh payment data after creating a payment
        await fetchPayment(orderId);
      }
      
      return response;
    } catch (error) {
      console.error("Error creating COD payment:", error);
      throw new Error(error instanceof Error ? error.message : "Lỗi khi tạo thanh toán COD");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Create a new ZaloPay payment for an order and get the payment URL
   */
  const createZaloPayPayment = async (orderId: string): Promise<ZaloPayPaymentResponse> => {
    setLoading(true);
    try {
      const response = await apiCreateZaloPayPayment(orderId);
      
      if (response.code === 200 && response.transaction_id) {
        // Store transaction ID for later verification
        localStorage.setItem(`payment_transaction_${orderId}`, response.transaction_id);
      }
      
      return response;
    } catch (error) {
      console.error("Error creating ZaloPay payment:", error);
      throw new Error(error instanceof Error ? error.message : "Lỗi khi tạo thanh toán ZaloPay");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Create a new VNPay payment
   */
  const createVNPayPayment = async (
    orderId: string,
    amount: number,
    orderInfo: string,
    orderType: string,
    bankCode: string
  ): Promise<VNPayPaymentResponse> => {
    setLoading(true);
    try {
      const response = await apiCreateVNPayPayment(orderId, amount, orderInfo, orderType, bankCode);
      
      if (response.code === 200 && response.payment_url) {
        // You can store transaction ID if needed, similar to ZaloPay
        // localStorage.setItem(`payment_transaction_${orderId}`, response.transaction_id || '');
      }
      
      return response;
    } catch (error) {
      console.error("Error creating VNPay payment:", error);
      throw new Error(error instanceof Error ? error.message : "Lỗi khi tạo thanh toán VNPay");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Check if payment is complete for an order
   */
  const isPaymentComplete = async (orderId: string): Promise<boolean> => {
    try {
      const response = await fetchPayment(orderId);
      
      if (response.payment) {
        return response.payment.payment_status === 'completed';
      }
      
      return false;
    } catch (error) {
      console.error("Error checking payment status:", error);
      return false;
    }
  };

  /**
   * Verify a payment transaction
   * This would typically be called after returning from a payment gateway
   */
  const verifyPayment = async (orderId: string, transaction_id: string): Promise<boolean> => {
    setLoading(true);
    try {
      // In a real implementation, you would have a specific API endpoint
      // to verify the payment with the transaction ID
      // For now, we'll fetch the payment and check if its transaction ID matches
      
      const response = await fetchPayment(orderId);
      
      if (
        response.code === 200 && 
        response.payment && 
        response.payment.transaction_id === transaction_id &&
        response.payment.payment_status === 'completed'
      ) {
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Error verifying payment:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    paymentData,
    fetchPayment,
    createCODPayment,
    createZaloPayPayment,
    createVNPayPayment,
    isPaymentComplete,
    verifyPayment
  };
};