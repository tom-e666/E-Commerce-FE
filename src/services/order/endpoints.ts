import { gql } from '@apollo/client';
import { apolloClient } from '@/services/apollo/client';

// Define GraphQL Queries and Mutations
export const CREATE_ORDER_FROM_CART = gql`
  mutation CreateOrderFromCart {
    createOrderFromCart {
      code
      message
      order {
        id
        user_id
        status
        created_at
        total_price
        items {
          id
          product_id
          name
          quantity
          price
          image
        }
      }
    }
  }
`;

export const CREATE_ORDER = gql`
  mutation CreateOrder($items: [OrderItemInput!]!) {
    createOrder(typeOrder: "cart", items: $items) {
      code
      message
      order {
        id
        user_id
        status
        created_at
        total_price
        items {
          id
          product_id
          name
          quantity
          price
          image
        }
      }
    }
  }
`;

export const CREATE_ORDER_ITEM = gql`
  mutation CreateOrderItem($order_id: ID!, $product_id: ID!, $quantity: Int!, $price: Float!) {
    createOrderItem(order_id: $order_id, product_id: $product_id, quantity: $quantity, price: $price) {
      code
      message
    }
  }
`;

export const UPDATE_ORDER_ITEM = gql`
  mutation UpdateOrderItem($order_item_id: ID!, $quantity: Int!) {
    updateOrderItem(order_item_id: $order_item_id, quantity: $quantity) {
      code
      message
    }
  }
`;

export const DELETE_ORDER_ITEM = gql`
  mutation DeleteOrderItem($order_item_id: ID!) {
    deleteOrderItem(order_item_id: $order_item_id) {
      code
      message
    }
  }
`;

export const CANCEL_ORDER = gql`
  mutation CancelOrder($order_id: ID!) {
    cancelOrder(order_id: $order_id) {
      code
      message
      order {
        id
        user_id
        status
        created_at
        total_price
        items {
          id
          product_id
          name
          quantity
          price
          image
        }
      }
    }
  }
`;

export const CONFIRM_ORDER = gql`
  mutation ConfirmOrder($order_id: ID!) {
    confirmOrder(order_id: $order_id) {
      code
      message
      order {
        id
        user_id
        status
        created_at
        total_price
        items {
          id
          product_id
          name
          quantity
          price
          image
        }
      }
    }
  }
`;

export const PROCESSING_ORDER = gql`
  mutation ProcessingOrder($order_id: ID!) {
    processingOrder(order_id: $order_id) {
      code
      message
      order {
        id
        user_id
        status
        created_at
        total_price
        items {
          id
          product_id
          name
          quantity
          price
          image
        }
      }
    }
  }
`;

export const SHIP_ORDER = gql`
  mutation ShipOrder($order_id: ID!) {
    shipOrder(order_id: $order_id) {
      code
      message
      order {
        id
        user_id
        status
        created_at
        total_price
        items {
          id
          product_id
          name
          quantity
          price
          image
        }
      }
    }
  }
`;

export const COMPLETE_DELIVERY = gql`
  mutation CompleteDelivery($order_id: ID!) {
    completeDelivery(order_id: $order_id) {
      code
      message
      order {
        id
        user_id
        status
        created_at
        total_price
        items {
          id
          product_id
          name
          quantity
          price
          image
        }
      }
    }
  }
`;

export const UPDATE_ORDER = gql`
  mutation UpdateOrder($order_id: ID!, $status: String, $total_price: Float) {
    updateOrder(order_id: $order_id, status: $status, total_price: $total_price) {
      code
      message
      order {
        id
        user_id
        status
        created_at
        total_price
        items {
          id
          product_id
          name
          quantity
          price
          image
        }
      }
    }
  }
`;

export const DELETE_ORDER = gql`
  mutation DeleteOrder($order_id: ID!, $user_id: ID!) {
    deleteOrder(order_id: $order_id, user_id: $user_id) {
      code
      message
    }
  }
`;

// Deprecated mutation - keeping for backward compatibility
export const DELIVER_ORDER = gql`
  mutation DeliverOrder($order_id: ID!) {
    deliverOrder(order_id: $order_id) {
      code
      message
      order {
        id
        user_id
        status
        created_at
        total_price
        items {
          id
          product_id
          name
          quantity
          price
          image
        }
      }
    }
  }
`;

export const GET_ORDER = gql`
  query GetOrder($order_id: ID!) {
    getOrder(order_id: $order_id) {
      code
      message
      order {
        id
        user_id
        status
        created_at
        total_price
        items {
          id
          product_id
          name
          quantity
          price
          image
        }
      }
    }
  }
`;

export const GET_USER_ORDERS = gql`
  query GetUserOrders {
    getUserOrders {
      code
      message
      orders {
        id
        user_id
        status
        created_at
        total_price
        items {
          id
          product_id
          name
          quantity
          price
          image
        }
      }
    }
  }
`;

export const GET_ALL_ORDERS = gql`
  query GetAllOrders($user_id: ID, $status: String, $created_after: String, $created_before: String) {
    getAllOrders(
      user_id: $user_id
      status: $status
      created_after: $created_after
      created_before: $created_before
    ) {
      code
      message
      orders {
        id
        user_id
        status
        created_at
        total_price
        items {
          id
          product_id
          name
          quantity
          price
          image
        }
      }
    }
  }
`;

export const GET_ORDER_BY_TRANSACTION = gql`
  query GetOrderByTransaction($transaction_id: String!) {
    getOrderByTransaction(transaction_id: $transaction_id) {
      code
      message
      order {
        id
        status
        created_at
        total_price
        items {
          product_id
          name
          quantity
          price
          image
        }
      }
    }
  }
`;

export const GET_PAGINATED_ORDERS = gql`
  query GetPaginatedOrders(
    $status: String
    $created_after: String
    $created_before: String
    $search: String
    $sort_field: String
    $sort_direction: String
    $page: Int
    $per_page: Int
  ) {
    getPaginatedOrders(
      status: $status
      created_after: $created_after
      created_before: $created_before
      search: $search
      sort_field: $sort_field
      sort_direction: $sort_direction
      page: $page
      per_page: $per_page
      ) {
      code
      message
      orders {
        id
        user_id
        status
        created_at
        total_price
        items {
          id
          product_id
          name
          quantity
          price
          image
        }
      }
      pagination {
        total
        current_page
        per_page
        last_page
        from
        to
        has_more_pages
      }
    }
  }
`;

export const MARK_ORDER_AS_FAILED = gql`
  mutation MarkOrderAsFailed($order_id: ID!) {
    markOrderAsFailed(order_id: $order_id) {
      code
      message
      }
    }
`;

// API function implementations
export const createOrderFromCartAPI = async () => {
  try {
    const response = await apolloClient.mutate({
      mutation: CREATE_ORDER_FROM_CART,
      context: {
        requiresAuth: true
      }
    });
    return response;
  } catch (error) {
    console.error('Error creating order from cart:', error);
    throw error;
  }
};

export const createOrder = async (items: {product_id: string, quantity: number}[]) => {
  try {
    const response = await apolloClient.mutate({
      mutation: CREATE_ORDER,
      variables: {
        items
      },
      context: {
        requiresAuth: true
      }
    });
    return response;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
}

export const createOrderItemAPI = async (orderId: string, productId: string, quantity: number, price: number) => {
  try {
    const response = await apolloClient.mutate({
      mutation: CREATE_ORDER_ITEM,
      variables: { 
        order_id: orderId, 
        product_id: productId, 
        quantity, 
        price 
      },
      context: {
        requiresAuth: true
      }
    });
    return response;
  } catch (error) {
    console.error('Error creating order item:', error);
    throw error;
  }
};

export const updateOrderItemAPI = async (orderItemId: string, quantity: number) => {
  try {
    const response = await apolloClient.mutate({
      mutation: UPDATE_ORDER_ITEM,
      variables: { order_item_id: orderItemId, quantity },
      context: {
        requiresAuth: true
      }
    });
    return response;
  } catch (error) {
    console.error('Error updating order item:', error);
    throw error;
  }
};

export const deleteOrderItemAPI = async (orderItemId: string) => {
  try {
    const response = await apolloClient.mutate({
      mutation: DELETE_ORDER_ITEM,
      variables: { order_item_id: orderItemId },
      context: {
        requiresAuth: true
      }
    });
    return response;
  } catch (error) {
    console.error('Error deleting order item:', error);
    throw error;
  }
};

export const cancelOrderAPI = async (orderId: string) => {
  try {
    const response = await apolloClient.mutate({
      mutation: CANCEL_ORDER,
      variables: { order_id: orderId },
      context: {
        requiresAuth: true
      }
    });
    return response;
  } catch (error) {
    console.error('Error canceling order:', error);
    throw error;
  }
};

export const confirmOrderAPI = async (orderId: string) => {
  try {
    const response = await apolloClient.mutate({
      mutation: CONFIRM_ORDER,
      variables: { order_id: orderId },
      context: {
        requiresAuth: true
      }
    });
    return response;
  } catch (error) {
    console.error('Error confirming order:', error);
    throw error;
  }
};

export const processingOrderAPI = async (orderId: string) => {
  try {
    const response = await apolloClient.mutate({
      mutation: PROCESSING_ORDER,
      variables: { order_id: orderId },
      context: {
        requiresAuth: true
      }
    });
    return response;
  } catch (error) {
    console.error('Error processing order:', error);
    throw error;
  }
};

export const shipOrderAPI = async (orderId: string) => {
  try {
    const response = await apolloClient.mutate({
      mutation: SHIP_ORDER,
      variables: { order_id: orderId },
      context: {
        requiresAuth: true
      }
    });
    return response;
  } catch (error) {
    console.error('Error shipping order:', error);
    throw error;
  }
};

export const completeDeliveryAPI = async (orderId: string) => {
  try {
    const response = await apolloClient.mutate({
      mutation: COMPLETE_DELIVERY,
      variables: { order_id: orderId },
      context: {
        requiresAuth: true
      }
    });
    return response;
  } catch (error) {
    console.error('Error completing delivery:', error);
    throw error;
  }
};

export const updateOrderAPI = async (orderId: string, status?: string, totalPrice?: number) => {
  try {
    const response = await apolloClient.mutate({
      mutation: UPDATE_ORDER,
      variables: { 
        order_id: orderId, 
        status, 
        total_price: totalPrice 
      },
      context: {
        requiresAuth: true
      }
    });
    return response;
  } catch (error) {
    console.error('Error updating order:', error);
    throw error;
  }
};

export const deleteOrderAPI = async (orderId: string, userId: string) => {
  try {
    const response = await apolloClient.mutate({
      mutation: DELETE_ORDER,
      variables: { order_id: orderId, user_id: userId },
      context: {
        requiresAuth: true
      }
    });
    return response;
  } catch (error) {
    console.error('Error deleting order:', error);
    throw error;
  }
};

export const markOrderAsFailedAPI = async (orderId: string) => {
  try {
    const response = await apolloClient.mutate({
      mutation: MARK_ORDER_AS_FAILED,
      variables: { order_id: orderId },
      context: {
        requiresAuth: true
      }
    });
    return response;
  } catch (error) {
    console.error('Error marking order as failed:', error);
    throw error;
  }
};

// Deprecated - keeping for backward compatibility
export const deliverOrderAPI = async (orderId: string) => {
  console.warn('deliverOrderAPI is deprecated. Use completeDeliveryAPI instead.');
  return completeDeliveryAPI(orderId);
};

export const getOrderAPI = async (orderId: string) => {
  try {
    const response = await apolloClient.query({
      query: GET_ORDER,
      variables: { order_id: orderId },
      fetchPolicy: 'network-only',
      context: {
        requiresAuth: true
      }
    });
    return response;
  } catch (error) {
    console.error('Error fetching order:', error);
    throw error;
  }
};

export const getUserOrdersAPI = async () => {
  try {
    const response = await apolloClient.query({
      query: GET_USER_ORDERS,
      fetchPolicy: 'network-only',
      context: {
        requiresAuth: true
      }
    });
    return response;
  } catch (error) {
    console.error('Error fetching user orders:', error);
    throw error;
  }
};

export const getAllOrdersAPI = async (
  userId?: string,
  status?: string,
  createdAfter?: string,
  createdBefore?: string
) => {
  try {
    const response = await apolloClient.query({
      query: GET_ALL_ORDERS,
      variables: {
        user_id: userId,
        status,
        created_after: createdAfter,
        created_before: createdBefore
      },
      fetchPolicy: 'network-only',
      context: {
        requiresAuth: true
      }
    });
    return response;
  } catch (error) {
    console.error('Error fetching all orders:', error);
    return {
      data: {
        getAllOrders: {
          code: 500,
          message: 'Error fetching orders',
          orders: []
        }
      }
    };
  }
};

export const getOrderByTransactionAPI = async (transactionId: string) => {
  try {
    const response = await apolloClient.query({
      query: GET_ORDER_BY_TRANSACTION,
      variables: { transaction_id: transactionId },
      fetchPolicy: 'network-only',
      context: {
        requiresAuth: true
      }
    });
    return response;
  } catch (error) {
    console.error('Error fetching order by transaction:', error);
    throw error;
  }
};

export const getPaginatedOrdersAPI = async (
    page: number = 1,
    perPage: number = 10,
    filters?: {
        status?: string,
        createdAfter?: string,
        createdBefore?: string,
        sortField?: string,
        sortDirection?: string,
        search?: string
    }
) => {
    try {
        const { 
            status, 
            createdAfter, 
            createdBefore, 
            sortField, 
            sortDirection,
            search
        } = filters || {};

        const response = await apolloClient.query({
            query: GET_PAGINATED_ORDERS,
            variables: {
                status,
                created_after: createdAfter,
                created_before: createdBefore,
                search: search,
                sort_field: sortField,
                sort_direction: sortDirection,
                page,
                per_page: perPage
            },
            fetchPolicy: 'network-only',
            context: {
                requiresAuth: true
            }
        });
        return response;
    } catch (error) {
        console.error('Error fetching paginated orders:', error);
        throw error;
    }
}

export interface OrderItemInterface {
  id: string;
  product_id: string;
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

export interface OrderInterface {
  id: string;
  user_id: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipping' | 'completed' | 'cancelled' | 'failed' | 'delivery_failed';
  created_at: string;
  total_price: number;
  recipient_name?: string;
  recipient_phone?: string;
  recipient_address?: string;
  items: OrderItemInterface[];
  recipient_name?: string;
  recipient_phone?: string;
  shipping_address?: string;
  notes?: string;
}

export interface OrderResponse {
  code: number;
  message: string;
  order?: OrderInterface;
}

export interface OrdersResponse {
  code: number;
  message: string;
  orders: OrderInterface[];
}

export interface BaseResponse {
  code: number;
  message: string;
}

export interface PaginationInfo {
  total: number;
  current_page: number;
  per_page: number;
  last_page: number;
  from: number;
  to: number;
  has_more_pages: boolean;
}