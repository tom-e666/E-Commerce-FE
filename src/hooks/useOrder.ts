import { useState, useEffect } from 'react';
import { 
    createOrderFromCartAPI, 
    getOrderAPI, 
    getUserOrdersAPI,
    updateOrderItemAPI,
    deleteOrderItemAPI,
    cancelOrderAPI,
    confirmOrderAPI,
    shipOrderAPI,
    deliverOrderAPI,
    getOrdersAPI  
} from '@/services/order/endpoints';

interface OrderProduct {
    product_id?: string;
    id?: string;
    name: string;
    price: number;
    image?: string;
    stock?: number;
    status?: string;
}
interface OrderItem {
    id: string;
    order_id?: string;
    product_id?: string;
    quantity: number;
    price: number;
    product?: OrderProduct;
}
interface Order {
    id: string;
    user_id?: string;
    status: string;
    total_price: number;
    created_at: string;
    payment_status?: string;
    payment_method?: string;
    shipping_address?: string;
    recipient_name?: string;
    recipient_phone?: string;
    notes?: string;
    items: OrderItem[];
}

interface OrderInput {
    order_id: string;
    shipping_address?: string;
    payment_method?: string;
    payment_status?: string;
    notes?: string;
    recipient_name?: string;
    recipient_phone?: string;
}
interface OrderFilter {
    status?: string;
    createdAfter?: string;
    createdBefore?: string;
}
export const useOrder = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [orders, setOrders] = useState<Order[]>([]);
    const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
    
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                await getUserOrders();
            } catch {
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [orders]);
    const getUserOrders = async () => {
        setLoading(true);
        try {
            const response = await getUserOrdersAPI();
            if (!response?.data) {
                throw new Error("Không thể lấy danh sách đơn hàng");
            }
            
            const { code, message, orders } = response.data.getUserOrders;
            
            if (code === 200) {
                setOrders(orders || []);
                return orders;
            } else {
                throw new Error(message || "Không thể lấy danh sách đơn hàng");
            }
        } catch(error) {
            console.error("Error fetching orders:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };
    const getOrders = async (filters?: OrderFilter) => {
        setLoading(true);
        try {
            const { status, createdAfter, createdBefore } = filters || {};
            
            const response = await getOrdersAPI(status, createdAfter, createdBefore);
            if (!response?.data) {
                throw new Error("Không thể lấy danh sách đơn hàng");
            }
            
            const { code, message, orders } = response.data.getOrders;
            
            if (code === 200) {
                setOrders(orders || []);
                return orders;
            } else {
                throw new Error(message || "Không thể lấy danh sách đơn hàng");
            }
        } catch(error) {
            console.error("Error fetching admin orders:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const getOrder = async (orderId: string) => {
        setLoading(true);
        try {
            const response = await getOrderAPI(orderId);
            if (!response?.data) {
                throw new Error("Không thể lấy thông tin đơn hàng");
            }
            
            const { code, message, order } = response.data.getOrder;
            
            if (code === 200 && order) {
                setCurrentOrder(order);
                return order;
            } else {
                throw new Error(message || "Không thể lấy thông tin đơn hàng");
            }
        } catch (error) {
            console.error("Error fetching order:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const createOrderFromCart = async () => {
        setLoading(true);
        try {
            const response = await createOrderFromCartAPI();
            if (!response?.data) {
                throw new Error("Không thể tạo đơn hàng");
            }
            
            const { code, message, order } = response.data.createOrderFromCart;
            
            if (code === 200 && order) {
                setCurrentOrder(order);
                return order;
            } else {
                throw new Error(message || "Không thể tạo đơn hàng");
            }
        } catch (error) {
            console.error("Error creating order from cart:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };
    const createOrder = async (orderData: OrderInput) => {
        setLoading(true);
        try {
 
            
            if (currentOrder && currentOrder.id === orderData.order_id) {
                const updatedOrder = {
                    ...currentOrder,
                    shipping_address: orderData.shipping_address || currentOrder.shipping_address,
                    payment_method: orderData.payment_method || currentOrder.payment_method,
                    payment_status: orderData.payment_status || currentOrder.payment_status || 'pending',
                    notes: orderData.notes || currentOrder.notes,
                    recipient_name: orderData.recipient_name || currentOrder.recipient_name,
                    recipient_phone: orderData.recipient_phone || currentOrder.recipient_phone
                };
                
                setCurrentOrder(updatedOrder);
                
                setOrders(prevOrders => 
                    prevOrders.map(order => 
                        order.id === orderData.order_id 
                            ? updatedOrder 
                            : order
                    )
                );
                
                return {
                    code: 200,
                    message: "Đơn hàng đã được cập nhật",
                    order_id: orderData.order_id
                };
            }
            
            throw new Error("Không tìm thấy đơn hàng để cập nhật");
        } catch (error) {
            console.error("Error updating order:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const updateOrderItem = async (orderItemId: string, quantity: number) => {
        setLoading(true);
        try {
            const response = await updateOrderItemAPI(orderItemId, quantity);
            if (!response?.data) {
                throw new Error("Không thể cập nhật sản phẩm trong đơn hàng");
            }
            
            const { code, message } = response.data.updateOrderItem;
            
            if (code === 200) {
                if (currentOrder) {
                    const updatedItems = currentOrder.items.map(item => 
                        item.id === orderItemId 
                            ? { ...item, quantity } 
                            : item
                    );
                    
                    const newTotalPrice = updatedItems.reduce(
                        (sum, item) => sum + (item.price * item.quantity), 
                        0
                    );
                    
                    setCurrentOrder({
                        ...currentOrder,
                        items: updatedItems,
                        total_price: newTotalPrice
                    });
                }
                return "Cập nhật sản phẩm thành công";
            } else {
                throw new Error(message || "Không thể cập nhật sản phẩm trong đơn hàng");
            }
        } catch (error) {
            console.error("Error updating order item:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };
    const deleteOrderItem = async (orderItemId: string) => {
        setLoading(true);
        try {
            const response = await deleteOrderItemAPI(orderItemId);
            if (!response?.data) {
                throw new Error("Không thể xóa sản phẩm khỏi đơn hàng");
            }
            
            const { code, message } = response.data.deleteOrderItem;
            
            if (code === 200) {
                if (currentOrder) {
                    const updatedItems = currentOrder.items.filter(item => item.id !== orderItemId);
                    
                    const newTotalPrice = updatedItems.reduce(
                        (sum, item) => sum + (item.price * item.quantity), 
                        0
                    );
                    
                    setCurrentOrder({
                        ...currentOrder,
                        items: updatedItems,
                        total_price: newTotalPrice
                    });
                }
                return "Đã xóa sản phẩm khỏi đơn hàng";
            } else {
                throw new Error(message || "Không thể xóa sản phẩm khỏi đơn hàng");
            }
        } catch (error) {
            console.error("Error deleting order item:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const cancelOrder = async (orderId: string) => {
        setLoading(true);
        try {
            const response = await cancelOrderAPI(orderId);
            if (!response?.data) {
                throw new Error("Không thể hủy đơn hàng");
            }
            
            const { code, message } = response.data.cancelOrder;
            
            if (code === 200) {
                if (currentOrder && currentOrder.id === orderId) {
                    setCurrentOrder({
                        ...currentOrder,
                        status: 'cancelled'
                    });
                }
                
                setOrders(prevOrders => 
                    prevOrders.map(order => 
                        order.id === orderId 
                            ? { ...order, status: 'cancelled' } 
                            : order
                    )
                );
                
                return "Đơn hàng đã được hủy";
            } else {
                throw new Error(message || "Không thể hủy đơn hàng");
            }
        } catch (error) {
            console.error("Error canceling order:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const confirmOrder = async (orderId: string) => {
        setLoading(true);
        try {
            const response = await confirmOrderAPI(orderId);
            if (!response?.data) {
                throw new Error("Không thể xác nhận đơn hàng");
            }
            
            const { code, message } = response.data.confirmOrder;
            
            if (code === 200) {
                if (currentOrder && currentOrder.id === orderId) {
                    setCurrentOrder({
                        ...currentOrder,
                        status: 'confirmed'
                    });
                }
                
                setOrders(prevOrders => 
                    prevOrders.map(order => 
                        order.id === orderId 
                            ? { ...order, status: 'confirmed' } 
                            : order
                    )
                );
                
                return "Đơn hàng đã được xác nhận";
            } else {
                throw new Error(message || "Không thể xác nhận đơn hàng");
            }
        } catch (error) {
            console.error("Error confirming order:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const shipOrder = async (orderId: string) => {
        setLoading(true);
        try {
            const response = await shipOrderAPI(orderId);
            if (!response?.data) {
                throw new Error("Không thể cập nhật trạng thái giao hàng");
            }
            
            const { code, message } = response.data.shipOrder;
            
            if (code === 200) {
                if (currentOrder && currentOrder.id === orderId) {
                    setCurrentOrder({
                        ...currentOrder,
                        status: 'shipped'
                    });
                }
                
                setOrders(prevOrders => 
                    prevOrders.map(order => 
                        order.id === orderId 
                            ? { ...order, status: 'shipped' } 
                            : order
                    )
                );
                
                return "Đơn hàng đã được giao cho đơn vị vận chuyển";
            } else {
                throw new Error(message || "Không thể cập nhật trạng thái giao hàng");
            }
        } catch (error) {
            console.error("Error shipping order:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const deliverOrder = async (orderId: string) => {
        setLoading(true);
        try {
            const response = await deliverOrderAPI(orderId);
            if (!response?.data) {
                throw new Error("Không thể cập nhật trạng thái giao hàng");
            }
            
            const { code, message } = response.data.deliverOrder;
            
            if (code === 200) {
                if (currentOrder && currentOrder.id === orderId) {
                    setCurrentOrder({
                        ...currentOrder,
                        status: 'delivered'
                    });
                }
                
                setOrders(prevOrders => 
                    prevOrders.map(order => 
                        order.id === orderId 
                            ? { ...order, status: 'delivered' } 
                            : order
                    )
                );
                
                return "Đơn hàng đã được giao thành công";
            } else {
                throw new Error(message || "Không thể cập nhật trạng thái giao hàng");
            }
        } catch (error) {
            console.error("Error delivering order:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        orders,
        currentOrder,
        getUserOrders,
        getOrders,      
        getOrder,
        createOrderFromCart,
        createOrder,
        updateOrderItem,
        deleteOrderItem,
        cancelOrder,
        confirmOrder,
        shipOrder,
        deliverOrder
    };
};

export default useOrder;