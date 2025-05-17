import { useState } from "react";
import {
  getShippingByOrder,
  getShippingsList,
  createShipping,
  updateShipping,
  updateShippingStatus
} from "../services/shipping/endpoints";

export interface ShippingData {
  id: string;
  tracking_code: string;
  carrier: string;
  estimated_date: string;
  status: string;
  address: string;
  order_id?: string;
  recipient_name?: string;
  recipient_phone?: string;
  note?: string;
  created_at?: string;
  updated_at?: string;
}

export const useShipping = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [shippingData, setShippingData] = useState<ShippingData | null>(null);
  const [shippingsList, setShippingsList] = useState<ShippingData[]>([]);

  const handleFetchShippingByOrder = async (orderId: string): Promise<ShippingData> => {
    setLoading(true);
    try {
      const response = await getShippingByOrder(orderId);
      const { code, message, shipping } = response.data.getShippingByOrder;
      
      if (code === 200 && shipping) {
        setShippingData(shipping);
        return shipping;
      } else {
        throw new Error(message || "Không thể lấy thông tin vận chuyển");
      }
    } catch (err) {
      if (err instanceof Error) throw err;
      throw new Error("Lỗi khi lấy thông tin vận chuyển");
    } finally {
      setLoading(false);
    }
  };

  const handleFetchShippingsList = async (status?: string): Promise<ShippingData[]> => {
    setLoading(true);
    try {
      const response = await getShippingsList(status);
      const { code, message, shippings } = response.data.getShippings;
      
      if (code === 200) {
        setShippingsList(shippings || []);
        return shippings || [];
      } else {
        throw new Error(message || "Không thể lấy danh sách vận chuyển");
      }
    } catch (err) {
      if (err instanceof Error) throw err;
      throw new Error("Lỗi khi lấy danh sách vận chuyển");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateShipping = async (
    orderId: string,
    trackingCode: string,
    carrier: string,
    estimatedDate: string,
    status: string,
    address: string,
    recipientName?: string,
    recipientPhone?: string,
    note?: string
  ): Promise<{ code: number; message: string }> => {
    setLoading(true);
    try {
      const response = await createShipping(
        orderId,
        trackingCode,
        carrier,
        estimatedDate,
        status,
        address,
        recipientName,
        recipientPhone,
        note
      );
      
      const { code, message } = response.data.createShipping;
      
      if (code === 200) {
        // Assuming handleFetchShippingByOrder will throw on its own error
        await handleFetchShippingByOrder(orderId); 
        return { code, message };
      } else {
        throw new Error(message || "Không thể tạo đơn vận chuyển");
      }
    } catch (err) {
      if (err instanceof Error) throw err;
      throw new Error("Lỗi khi tạo đơn vận chuyển");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateShipping = async (
    orderId: string,
    carrier?: string,
    address?: string,
    recipientName?: string,
    recipientPhone?: string,
    note?: string
  ): Promise<{ code: number; message: string }> => {
    setLoading(true);
    try {
      const response = await updateShipping(
        orderId,
        carrier,
        address,
        recipientName,
        recipientPhone,
        note
      );
      
      const { code, message } = response.data.updateShipping;
      
      if (code === 200) {
        await handleFetchShippingByOrder(orderId); 
        return { code, message };
      } else {
        throw new Error(message || "Không thể cập nhật đơn vận chuyển");
      }
    } catch (err) {
      if (err instanceof Error) throw err;
      throw new Error("Lỗi khi cập nhật đơn vận chuyển");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateShippingStatus = async (shippingId: string, newStatus: string): Promise<{ code: number; message: string }> => {
    setLoading(true);
    try {
      const response = await updateShippingStatus(shippingId, newStatus);
      const { code, message } = response.data.updateShippingStatus;
      
      if (code === 200) {
        // Assuming handleFetchShippingsList will throw on its own error
        await handleFetchShippingsList(); 
        if (shippingData && shippingData.id === shippingId) {
            setShippingData(prev => prev ? { ...prev, status: newStatus } : null);
        }
        return { code, message };
      } else {
        throw new Error(message || "Không thể cập nhật trạng thái vận chuyển");
      }
    } catch (err) {
      if (err instanceof Error) throw err;
      throw new Error("Lỗi khi cập nhật trạng thái vận chuyển");
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    shippingData,
    shippingsList,
    handleFetchShippingByOrder,
    handleFetchShippingsList,
    handleCreateShipping,
    handleUpdateShipping,
    handleUpdateShippingStatus
  };
};