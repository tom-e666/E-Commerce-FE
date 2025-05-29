import { useState } from "react";
import {
  getShippingByOrderId,
  createShipping as apiCreateShipping,
  updateShipping as apiUpdateShipping,
  updateShippingStatus as apiUpdateShippingStatus,
  Shipping,
  BaseResponse,
  cancelShipping as apiCancelShipping,
} from "../services/shipping/endpoints";

// Use the interface from endpoints.ts instead of redefining
export type ShippingData = Shipping & {
  code?: number;
  message?: string;
};
export const useShipping = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [shippingData, setShippingData] = useState<ShippingData | null>(null);

  const handleFetchShippingByOrderId = async (orderId: string): Promise<ShippingData | null> => {
    setLoading(true);
    try {
      const response = await getShippingByOrderId(orderId);
      
      if (response.code === 200 && response.shipping) {
        setShippingData(response.shipping);
        return response.shipping;
      } else {
        // No shipping found is not necessarily an error in this case
        setShippingData(null);
        return null;
      }
    } catch (err) {
      console.error("Error fetching shipping:", err);
      throw new Error(err instanceof Error ? err.message : "Lỗi khi lấy thông tin vận chuyển");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateShipping = async (
    orderId: string,
    address: string,
    recipientName: string,
    recipientPhone: string,
    provinceName: string,
    districtName: string,
    wardName: string,
    shippingMethod: string = 'SHOP',
    note?: string
  ): Promise<ShippingData> => {
    setLoading(true);
    try {
      const response = await apiCreateShipping(
        orderId,
        address,
        recipientName,
        recipientPhone,
        provinceName,
        districtName,
        wardName,
        shippingMethod,
        note
      );
      
      if (response.code === 200 && response.shipping) {
        // Fetch the created shipping to get complete data
        await handleFetchShippingByOrderId(orderId);
        return {
          ...response.shipping,
          code: response.code,
          message: response.message
        };
      } else {
        throw new Error(response.message || "Không thể tạo đơn vận chuyển");
      }
    } catch (err) {
      console.error("Error creating shipping:", err);
      throw new Error(err instanceof Error ? err.message : "Lỗi khi tạo đơn vận chuyển");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateShipping = async (
    shippingId: string,
    data: {
      address?: string;
      recipientName?: string;
      recipientPhone?: string;
      note?: string;
      provinceName?: string;
      districtName?: string;
      wardName?: string;
    }
  ): Promise<BaseResponse> => {
    setLoading(true);
    try {
      const response = await apiUpdateShipping(shippingId, data);
      
      if (response.code === 200) {
        // If we have current shipping data and it matches the ID, update it
        if (shippingData && shippingData.id === shippingId) {
          setShippingData(prev => {
            if (!prev) return null;
            
            return {
              ...prev,
              ...response.shipping // Use the returned shipping data
            };
          });
        }
        
        return { code: response.code, message: response.message };
      } else {
        throw new Error(response.message || "Không thể cập nhật đơn vận chuyển");
      }
    } catch (err) {
      console.error("Error updating shipping:", err);
      throw new Error(err instanceof Error ? err.message : "Lỗi khi cập nhật đơn vận chuyển");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateShippingStatus = async (
    shippingId: string, 
    newStatus: string
  ): Promise<BaseResponse> => {
    setLoading(true);
    try {
      const response = await apiUpdateShippingStatus(shippingId, newStatus);
      
      if (response.code === 200) {
        // If we have current shipping data and it matches the ID, update its status
        if (shippingData && shippingData.id === shippingId) {
          setShippingData(prev => prev ? { 
            ...prev, 
            status: newStatus,
            updated_at: response.shipping.updated_at
          } : null);
        }
        
        return { code: response.code, message: response.message };
      } else {
        throw new Error(response.message || "Không thể cập nhật trạng thái vận chuyển");
      }
    } catch (err) {
      console.error("Error updating shipping status:", err);
      throw new Error(err instanceof Error ? err.message : "Lỗi khi cập nhật trạng thái vận chuyển");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelShipping = async (shippingId: string): Promise<BaseResponse> => {
    setLoading(true);
    try {
      const response = await apiCancelShipping(shippingId);
      
      if (response.code === 200) {
        // If we have current shipping data and it matches the ID, update its status to canceled
        if (shippingData && shippingData.id === shippingId) {
          setShippingData(prev => prev ? { ...prev, status: 'cancelled' } : null);
        }
        
        return { code: response.code, message: response.message };
      } else {
        throw new Error(response.message || "Không thể hủy đơn vận chuyển");
      }
    } catch (err) {
      console.error("Error canceling shipping:", err);
      throw new Error(err instanceof Error ? err.message : "Lỗi khi hủy đơn vận chuyển");
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    shippingData,
    handleFetchShippingByOrderId,
    handleCreateShipping,
    handleUpdateShipping,
    handleUpdateShippingStatus,
    handleCancelShipping
  };
};