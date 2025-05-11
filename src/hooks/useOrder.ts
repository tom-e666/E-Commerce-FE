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
    deliverOrderAPI
} from '@/services/order/endpoints';

// Define interfaces for order data
interface OrderProduct {
    id: string;
    name: string;
    price: number;
}

interface OrderItem {
    id: string;
    order_id: string;
    product_id: string;
    quantity: number;
    price: number;
    product?: OrderProduct;
}

interface Order {
    id: string;
    user_id: string;
    status: string;
    total_price: number;
    created_at: string;
    items: OrderItem[];
}

export const useOrder = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [orders, setOrders] = useState<Order[]>([]);
    const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
    useEffect(() => {
        const prep=async()=>{
            setLoading(true);
            await getUserOrders();
            setLoading(false);
        }
        prep();
    }, []);
    // Fetch all orders for the current user
    const getUserOrders = async () => {
        setLoading(true);
        try {
            const response = await getUserOrdersAPI();
            if (!response.data) {
                throw new Error("Không thể lấy danh sách đơn hàng");
            }
            
            const { code, orders } = response.data.getUserOrders;
            
            if (code === 200) {
                setOrders(orders || []);
                return "Lấy danh sách đơn hàng thành công";
            } else {
                throw new Error("Không thể lấy danh sách đơn hàng");
            }
        } catch  {
            throw new Error("Không thể lấy danh sách đơn hàng");
        } finally {
            setLoading(false);
        }
    };

    // Get a specific order by ID
    const getOrder = async (orderId: string) => {
        setLoading(true);
        try {
            const response = await getOrderAPI(orderId);
            if (!response.data) {
                throw new Error("Không thể lấy thông tin đơn hàng");
            }
            
            const { code, order } = response.data.getOrder;
            
            if (code === 200) {
                setCurrentOrder(order);
                return "Lấy thông tin đơn hàng thành công";
            } else {
                throw new Error("Không thể lấy thông tin đơn hàng");
            }
        } catch  {
            throw new Error("Không thể lấy thông tin đơn hàng");
        } finally {
            setLoading(false);
        }
    };

    // Create a new order from the user's cart
    const createOrderFromCart = async () => {
        setLoading(true);
        try {
            const response = await createOrderFromCartAPI();
            if (!response.data) {
                throw new Error("Không thể tạo đơn hàng");
            }
            
            const { code, order } = response.data.createOrderFromCart;
            
            if (code === 200) {
                setCurrentOrder(order);
                return "Đơn hàng đã được tạo thành công";
            } else {
                throw new Error("Không thể tạo đơn hàng");
            }
        } catch  {
            throw new Error("Không thể tạo đơn hàng");
        } finally {
            setLoading(false);
        }
    };

    // Update an item in an order
    const updateOrderItem = async (orderItemId: string, quantity: number) => {
        setLoading(true);
        try {
            const response = await updateOrderItemAPI(orderItemId, quantity);
            if (!response.data) {
                throw new Error("Không thể cập nhật sản phẩm trong đơn hàng");
            }
            
            const { code } = response.data.updateOrderItem;
            
            if (code === 200) {
                // If we have the current order loaded, update its item
                if (currentOrder) {
                    setCurrentOrder({
                        ...currentOrder,
                        items: currentOrder.items.map(item => 
                            item.id === orderItemId 
                                ? { ...item, quantity } 
                                : item
                        )
                    });
                }
                return "Cập nhật sản phẩm thành công";
            } else {
                throw new Error("Không thể cập nhật sản phẩm trong đơn hàng");
            }
        } catch  {
            throw new Error("Không thể cập nhật sản phẩm trong đơn hàng");
        } finally {
            setLoading(false);
        }
    };

    // Delete an item from an order
    const deleteOrderItem = async (orderItemId: string) => {
        setLoading(true);
        try {
            const response = await deleteOrderItemAPI(orderItemId);
            if (!response.data) {
                throw new Error("Không thể xóa sản phẩm khỏi đơn hàng");
            }
            
            const { code } = response.data.deleteOrderItem;
            
            if (code === 200) {
                // If we have the current order loaded, remove the item
                if (currentOrder) {
                    setCurrentOrder({
                        ...currentOrder,
                        items: currentOrder.items.filter(item => item.id !== orderItemId)
                    });
                }
                return "Đã xóa sản phẩm khỏi đơn hàng";
            } else {
                throw new Error("Không thể xóa sản phẩm khỏi đơn hàng");
            }
        } catch  {
            throw new Error("Không thể xóa sản phẩm khỏi đơn hàng");
        } finally {
            setLoading(false);
        }
    };

    // Cancel an order
    const cancelOrder = async (orderId: string) => {
        setLoading(true);
        try {
            const response = await cancelOrderAPI(orderId);
            if (!response.data) {
                throw new Error("Không thể hủy đơn hàng");
            }
            
            const { code } = response.data.cancelOrder;
            
            if (code === 200) {
                // Update local state
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
                throw new Error("Không thể hủy đơn hàng");
            }
        } catch  {
            throw new Error("Không thể hủy đơn hàng");
        } finally {
            setLoading(false);
        }
    };

    // Confirm an order (admin function)
    const confirmOrder = async (orderId: string) => {
        setLoading(true);
        try {
            const response = await confirmOrderAPI(orderId);
            if (!response.data) {
                throw new Error("Không thể xác nhận đơn hàng");
            }
            
            const { code } = response.data.confirmOrder;
            
            if (code === 200) {
                // Update local state
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
                throw new Error("Không thể xác nhận đơn hàng");
            }
        } catch  {
            throw new Error("Không thể xác nhận đơn hàng");
        } finally {
            setLoading(false);
        }
    };

    // Ship an order (admin function)
    const shipOrder = async (orderId: string) => {
        setLoading(true);
        try {
            const response = await shipOrderAPI(orderId);
            if (!response.data) {
                throw new Error("Không thể cập nhật trạng thái giao hàng");
            }
            
            const { code } = response.data.shipOrder;
            
            if (code === 200) {
                // Update local state
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
                throw new Error("Không thể cập nhật trạng thái giao hàng");
            }
        } catch  {
            throw new Error("Không thể cập nhật trạng thái giao hàng");
        } finally {
            setLoading(false);
        }
    };

    // Mark order as delivered (admin function)
    const deliverOrder = async (orderId: string) => {
        setLoading(true);
        try {
            const response = await deliverOrderAPI(orderId);
            if (!response.data) {
                throw new Error("Không thể cập nhật trạng thái giao hàng");
            }
            
            const { code } = response.data.deliverOrder;
            
            if (code === 200) {
                // Update local state
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
                throw new Error("Không thể cập nhật trạng thái giao hàng");
            }
        } catch  {
            throw new Error("Không thể cập nhật trạng thái giao hàng");
        } finally {
            setLoading(false);
        }
    };
    return {
        loading,
        orders,
        currentOrder,
        getUserOrders,
        getOrder,
        createOrderFromCart,
        updateOrderItem,
        deleteOrderItem,
        cancelOrder,
        confirmOrder,
        shipOrder,
        deliverOrder
    };
};
export default useOrder;