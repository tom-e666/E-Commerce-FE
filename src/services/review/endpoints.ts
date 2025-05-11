import { gql } from '@apollo/client';
import { apolloClient } from '@/services/apollo/client';

// Define GraphQL Queries and Mutations
export const GET_REVIEWS_BY_USER = gql`
  query GetReviewsByUser {
    getReviewsByUser {
      code
      message
      reviews {
        id
        product_id
        user_id
        rating
        comment
        created_at
        updated_at
      }
    }
  }
`;

export const GET_REVIEWS_BY_PRODUCT = gql`
  query GetReviewByProduct($productId: ID!, $amount: Int!) {
    getReviewsByProduct(product_id: $productId, amount: $amount) {
      code
      message
      reviews {
        id
        product_id
        user_id
        rating
        comment
        created_at
        updated_at
      }
    }
  }
`;

export const CREATE_REVIEW = gql`
  mutation CreateReview($orderItemId: ID!, $rating: Int, $comment: String) {
    createReview(order_item_id: $orderItemId, rating: $rating, comment: $comment) {
      code
      message
    }
  }
`;

export const UPDATE_REVIEW = gql`
  mutation UpdateReview($reviewId: ID!, $rating: Int, $comment: String) {
    updateReview(review_id: $reviewId, rating: $rating, comment: $comment) {
      code
      message
    }
  }
`;

export const DELETE_REVIEW = gql`
  mutation DeleteReview($reviewId: ID!) {
    deleteReview(review_id: $reviewId) {
      code
      message
    }
  }
`;

// API functions implementations
export const getReviewsByUser = async () => {
  try {
    const response = await apolloClient.query({
      query: GET_REVIEWS_BY_USER,
      fetchPolicy: 'network-only',
      context: {
        requiresAuth: true
      }
    });
    return response;
  } catch (error) {
    console.error('Error fetching user reviews:', error);
    throw error;
  }
};

export const getReviewsByProduct = async (productId: string, amount: number = 10) => {
  try {
    const response = await apolloClient.query({
      query: GET_REVIEWS_BY_PRODUCT,
      variables: { productId, amount },
      fetchPolicy: 'network-only'
      // No requiresAuth since product reviews are likely public
    });
    return response;
  } catch (error) {
    console.error('Error fetching product reviews:', error);
    throw error;
  }
};

export const createReview = async (orderItemId: string, rating?: number, comment?: string) => {
  try {
    const response = await apolloClient.mutate({
      mutation: CREATE_REVIEW,
      variables: { orderItemId, rating, comment },
      context: {
        requiresAuth: true
      }
    });
    return response;
  } catch (error) {
    console.error('Error creating review:', error);
    throw error;
  }
};

export const updateReview = async (reviewId: string, rating?: number, comment?: string) => {
  try {
    const response = await apolloClient.mutate({
      mutation: UPDATE_REVIEW,
      variables: { reviewId, rating, comment },
      context: {
        requiresAuth: true
      }
    });
    return response;
  } catch (error) {
    console.error('Error updating review:', error);
    throw error;
  }
};

export const deleteReview = async (reviewId: string) => {
  try {
    const response = await apolloClient.mutate({
      mutation: DELETE_REVIEW,
      variables: { reviewId },
      context: {
        requiresAuth: true
      }
    });
    return response;
  } catch (error) {
    console.error('Error deleting review:', error);
    throw error;
  }
};