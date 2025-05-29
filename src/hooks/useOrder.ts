import { useState } from 'react';
import {
    createOrderFromCartAPI,
    getOrderAPI,
    getUserOrdersAPI,
    getAllOrdersAPI,
    getOrderByTransactionAPI,
    updateOrderItemAPI,
    deleteOrderItemAPI,
    cancelOrderAPI,
    confirmOrderAPI,
    shipOrderAPI,
    deliverOrderAPI,
    OrderItemInterface,
    OrderInterface
} from '@/services/order/endpoints';

export type OrderItem = OrderItemInterface;
export type Order = OrderInterface;

export interface OrderInput {
    order_id: string;
    shipping_address?: string;
    payment_method?: string;
    payment_status?: string;
    notes?: string;
    recipient_name?: string;
    recipient_phone?: string;
}

export interface OrderFilter {
    userId?: string;
    status?: string;
    createdAfter?: string;
    createdBefore?: string;
}

export const useOrder = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [orders, setOrders] = useState<Order[]>([]);
    const [currentOrder, setCurrentOrder] = useState<Order | null>(null);

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
            const { userId, status, createdAfter, createdBefore } = filters || {};

            console.log("Fetching orders with filters:", { userId, status, createdAfter, createdBefore });

            // Check for token before API call
            const token = localStorage.getItem('token') || localStorage.getItem('access_token');
            if (!token) {
                console.error("No authentication token found for getOrders");
                throw new Error("Vui lòng đăng nhập lại để xem danh sách đơn hàng");
            }

            const response = await getAllOrdersAPI(userId, status, createdAfter, createdBefore);
            console.log("Orders API response:", response);

            if (!response) {
                console.error("Empty response from getAllOrders API");
                throw new Error("Không thể lấy danh sách đơn hàng - Phản hồi trống");
            }

            if (!response.data) {
                console.error("Response missing data property:", response);
                throw new Error("Không thể lấy danh sách đơn hàng - Thiếu dữ liệu");
            }

            if (!response.data.getAllOrders) {
                console.error("Response missing getAllOrders property:", response.data);
                throw new Error("Không thể lấy danh sách đơn hàng - Cấu trúc không hợp lệ");
            }

            const { code, message, orders } = response.data.getAllOrders;

            if (code === 200) {
                console.log("Successfully fetched orders:", orders?.length || 0);
                setOrders(orders || []);
                return orders;
            } else {
                console.error("API returned error:", { code, message });
                throw new Error(message || "Không thể lấy danh sách đơn hàng");
            }
        } catch(error) {
            console.error("Error fetching admin orders:", error);
            // Return empty array to avoid UI crash
            setOrders([]);
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

    const getOrderByTransaction = async (transactionId: string) => {
        setLoading(true);
        try {
            const response = await getOrderByTransactionAPI(transactionId);
            if (response?.data?.getOrderByTransaction) {
                return response?.data?.getOrderByTransaction;
            }
            throw new Error("Không thể lấy đơn hàng theo Transaction ID");
        } catch (error) {
            console.error("Error fetching order by transaction:", error);
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

            const { code, message, order } = response.data.confirmOrder;

            if (code === 200 && order) {
                // Update the current order if it matches
                if (currentOrder && currentOrder.id === orderId) {
                    setCurrentOrder(order);
                }
                
                // Update the order in the orders list
                setOrders(prevOrders =>
                    prevOrders.map(o => o.id === orderId ? order : o)
                );

                return order;
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

            const { code, message, order } = response.data.shipOrder;

            if (code === 200 && order) {
                // Update the current order if it matches
                if (currentOrder && currentOrder.id === orderId) {
                    setCurrentOrder(order);
                }
                
                // Update the order in the orders list
                setOrders(prevOrders =>
                    prevOrders.map(o => o.id === orderId ? order : o)
                );

                return order;
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

            const { code, message, order } = response.data.deliverOrder;

            if (code === 200 && order) {
                // Update the current order if it matches
                if (currentOrder && currentOrder.id === orderId) {
                    setCurrentOrder(order);
                }
                
                // Update the order in the orders list
                setOrders(prevOrders =>
                    prevOrders.map(o => o.id === orderId ? order : o)
                );

                return order;
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
        getOrderByTransaction,
        createOrderFromCart,
        createOrder,
        updateOrderItem,
        deleteOrderItem,
        cancelOrder,
        confirmOrder,
        shipOrder,
        deliverOrder,
        setCurrentOrder,
    };
};

export default useOrder;