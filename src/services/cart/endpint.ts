import { gql } from '@apollo/client';
import { apolloClient } from "../apollo/client";
export const GET_CART_ITEMS = gql`
  query GetCartItems {
    getCartItems {
      code
      message
      items {
        product_id
        quantity
      }
    }
  }
`;
export const ADD_TO_CART = gql`
  mutation AddToCart($productId: ID!, $quantity: Int!) {
    addCartItem(
      product_id: $productId
      quantity: $quantity
    ) {
      code
      message
      item {
        product_id
        quantity
      }
    }
  }
`;

export const REMOVE_FROM_CART = gql`
  mutation RemoveFromCart($productId: ID!) {
    removeCartItem(
      product_id: $productId
    ) {
      code
      message
    }
  }
`;
export const getCartItems = async () => {
  try {
    const response = await apolloClient.query({
      query: GET_CART_ITEMS,
      fetchPolicy: 'network-only'
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching cart items:', error);
    throw error;
  }
};

export const addToCart = async (productId: string, quantity: number = 1) => {
  try {
    const response = await apolloClient.mutate({
      mutation: ADD_TO_CART,
      variables: { productId, quantity },
      refetchQueries: [{ query: GET_CART_ITEMS }]
    });
    return response.data;
  } catch (error) {
    console.error('Error adding item to cart:', error);
    throw error;
  }
};
export const removeFromCart = async (productId: string) => {
  try {
    const response = await apolloClient.mutate({
      mutation: REMOVE_FROM_CART,
      variables: { productId },
      refetchQueries: [{ query: GET_CART_ITEMS }]
    });
    return response.data;
  } catch (error) {
    console.error('Error removing item from cart:', error);
    throw error;
  }
};

export const updateCartItemQuantity = async (productId: string, quantity: number) => {
  try {
    const response = await apolloClient.mutate({
      mutation: ADD_TO_CART,
      variables: { productId, quantity },
      refetchQueries: [{ query: GET_CART_ITEMS }]
    });
    return response.data;
  } catch (error) {
    console.error('Error updating cart item quantity:', error);
    throw error;
  }
};