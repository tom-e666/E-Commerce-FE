import { useState } from "react";
import {
  getShippingByOrderId,
  createShipping as apiCreateShipping,
  updateShipping as apiUpdateShipping,
  updateShippingStatus as apiUpdateShippingStatus
} from "../services/shipping/endpoints";

export interface ShippingData {
  id: string;
  order_id: string;
  estimated_date: string;
  status: string;
  address: string;
  recipient_name: string;
  recipient_phone: string;
  note?: string;
  ghn_order_code?: string;
  province_name: string;
  district_name: string;
  ward_name: string;
  shipping_fee: number;
  expected_delivery_time?: string;
  created_at: string;
  updated_at: string;
  shipping_method: string;
  code?: number;
  message?: string;
}

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
    toDistrictId: string,
    toWardCode: string,
    shippingMethod: string = 'SHOP',
    shippingFee: number = 0,
    note?: string,
    estimatedDate?: string
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
        toDistrictId,
        toWardCode,
        shippingMethod,
        shippingFee,
        note,
        estimatedDate
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
    address?: string,
    recipientName?: string,
    recipientPhone?: string,
    note?: string
  ): Promise<{ code: number; message: string }> => {
    setLoading(true);
    try {
      const response = await apiUpdateShipping(
        shippingId,
        address,
        recipientName,
        recipientPhone,
        note
      );
      
      if (response.code === 200) {
        // If we have current shipping data and it matches the ID, update it
        if (shippingData && shippingData.id === shippingId) {
          setShippingData(prev => {
            if (!prev) return null;
            
            return {
              ...prev,
              address: address || prev.address,
              recipient_name: recipientName || prev.recipient_name,
              recipient_phone: recipientPhone || prev.recipient_phone,
              note: note !== undefined ? note : prev.note
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
  ): Promise<{ code: number; message: string }> => {
    setLoading(true);
    try {
      const response = await apiUpdateShippingStatus(shippingId, newStatus);
      
      if (response.code === 200) {
        // If we have current shipping data and it matches the ID, update its status
        if (shippingData && shippingData.id === shippingId) {
          setShippingData(prev => prev ? { ...prev, status: newStatus } : null);
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

  return {
    loading,
    shippingData,
    handleFetchShippingByOrderId,
    handleCreateShipping,
    handleUpdateShipping,
    handleUpdateShippingStatus
  };
};