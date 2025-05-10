import { gql } from '@apollo/client';
import { apolloClient } from "../apollo/client";

export const GET_CART_ITEMS = gql`
  query GetCartItems {
    getCartItems {
      code
      message
      cart_items {
        id
        quantity
        product {
          image
          name
          price
          product_id
          status
          stock
        }
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
    }
  }
`;

export const REMOVE_FROM_CART = gql`
  mutation RemoveCartItem($productId: ID!) {
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

export const addToCart = async (productId: string, quantity: number = 1) => {
  try {
    const response = await apolloClient.mutate({
      mutation: ADD_TO_CART,
      variables: { productId, quantity },
      refetchQueries: [{ query: GET_CART_ITEMS }],
      context: {
        requiresAuth: true
      }
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const removeFromCart = async (productId: string) => {
  try {
    const response = await apolloClient.mutate({
      mutation: REMOVE_FROM_CART,
      variables: { productId },
      refetchQueries: [{ query: GET_CART_ITEMS }],
      context: {
        requiresAuth: true
      }
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateCartItemQuantity = async (productId: string, quantity: number) => {
  try {
    const response = await apolloClient.mutate({
      mutation: ADD_TO_CART,
      variables: { productId, quantity },
      refetchQueries: [{ query: GET_CART_ITEMS }],
      context: {
        requiresAuth: true
      }
    });
    return response;
  } catch (error) {
    throw error;
  }
};