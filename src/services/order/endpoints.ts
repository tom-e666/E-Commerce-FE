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
        total_price
        created_at
        items {
          id
          product_id
          quantity
          price
        }
      }
    }
  }
`;

export const UPDATE_ORDER_ITEM = gql`
  mutation UpdateOrderItem($orderItemId: ID!, $quantity: Int!) {
    updateOrderItem(order_item_id: $orderItemId, quantity: $quantity) {
      code
      message
    }
  }
`;

export const DELETE_ORDER_ITEM = gql`
  mutation DeleteOrderItem($orderItemId: ID!) {
    deleteOrderItem(order_item_id: $orderItemId) {
      code
      message
    }
  }
`;

export const CANCEL_ORDER = gql`
  mutation CancelOrder($orderId: ID!) {
    cancelOrder(order_id: $orderId) {
      code
      message
    }
  }
`;

export const CONFIRM_ORDER = gql`
  mutation ConfirmOrder($orderId: ID!) {
    confirmOrder(order_id: $orderId) {
      code
      message
    }
  }
`;

export const SHIP_ORDER = gql`
  mutation ShipOrder($orderId: ID!) {
    shipOrder(order_id: $orderId) {
      code
      message
    }
  }
`;

export const DELIVER_ORDER = gql`
  mutation DeliverOrder($orderId: ID!) {
    deliverOrder(order_id: $orderId) {
      code
      message
    }
  }
`;

export const GET_ORDER = gql`
  query GetOrder($orderId: ID!) {
    getOrder(order_id: $orderId) {
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
          order_id
          product_id
          quantity
          price
          product {
            id
            name
            price
          }
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
        status
        total_price
        created_at
        items {
          id
          product_id
          quantity
          price
        }
      }
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
    throw error;
  }
};
export const updateOrderItemAPI = async (orderItemId: string, quantity: number) => {
  try {
    const response = await apolloClient.mutate({
      mutation: UPDATE_ORDER_ITEM,
      variables: { orderItemId, quantity },
      context: {
        requiresAuth: true
      }
    });
    return response;
  } catch (error) {
    throw error;
  }
};
export const deleteOrderItemAPI = async (orderItemId: string) => {
  try {
    const response = await apolloClient.mutate({
      mutation: DELETE_ORDER_ITEM,
      variables: { orderItemId },
      context: {
        requiresAuth: true
      }
    });
    return response;
  } catch (error) {
    throw error;
  }
};
export const cancelOrderAPI = async (orderId: string) => {
  try {
    const response = await apolloClient.mutate({
      mutation: CANCEL_ORDER,
      variables: { orderId },
      context: {
        requiresAuth: true
      }
    });
    return response;
  } catch (error) {
    throw error;
  }
};
export const confirmOrderAPI = async (orderId: string) => {
  try {
    const response = await apolloClient.mutate({
      mutation: CONFIRM_ORDER,
      variables: { orderId },
      context: {
        requiresAuth: true
      }
    });
    return response;
  } catch (error) {
    throw error;
  }
};
export const shipOrderAPI = async (orderId: string) => {
  try {
    const response = await apolloClient.mutate({
      mutation: SHIP_ORDER,
      variables: { orderId },
      context: {
        requiresAuth: true
      }
    });
    return response;
  } catch (error) {
    throw error;
  }
};
export const deliverOrderAPI = async (orderId: string) => {
  try {
    const response = await apolloClient.mutate({
      mutation: DELIVER_ORDER,
      variables: { orderId },
      context: {
        requiresAuth: true
      }
    });
    return response;
  } catch (error) {
    throw error;
  }
};
export const getOrderAPI = async (orderId: string) => {
  try {
    const response = await apolloClient.query({
      query: GET_ORDER,
      variables: { orderId },
      fetchPolicy: 'network-only',
      context: {
        requiresAuth: true
      }
    });
    return response;
  } catch (error) {
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
    throw error;
  }
};
