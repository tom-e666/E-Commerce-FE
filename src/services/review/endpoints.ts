import { gql } from '@apollo/client';
import { apolloClient } from '@/services/apollo/client';

// Types for reviews
export interface User {
  id: string;
  username: string;
}

export interface ProductInfo {
  id: string;
  name: string;
  image: string;
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  user?: User;
  product?: ProductInfo;
}

export interface ReviewResponse {
  code: number;
  message: string;
  review?: Review;
}

export interface ReviewsResponse {
  code: number;
  message: string;
  reviews: Review[];
  total: number;
}

// Define GraphQL Queries and Mutations
export const GET_PRODUCT_REVIEWS = gql`
  query GetProductReviews($productId: ID!, $rating: Int, $sortField: String, $sortDirection: String) {
    getProductReviews(
      product_id: $productId
      rating: $rating
      sort_field: $sortField
      sort_direction: $sortDirection
    ) {
      code
      message
      reviews {
        id
        rating
        comment
        created_at
        user {
          id
          username
        }
        product {
          id
          name
          image
        }
      }
      total
    }
  }
`;

export const GET_USER_REVIEWS = gql`
  query GetUserReviews {
    getUserReviews {
      code
      message
      reviews {
        id
        rating
        comment
        created_at
        product {
          id
          name
          image
        }
      }
      total
    }
  }
`;

export const GET_ALL_REVIEWS = gql`
  query GetAllReviews($userId: ID, $productId: ID, $rating: Int, $dateFrom: String, $dateTo: String) {
    getAllReviews(
      user_id: $userId
      product_id: $productId
      rating: $rating
      date_from: $dateFrom
      date_to: $dateTo
    ) {
      code
      message
      reviews {
        id
        rating
        comment
        created_at
        user {
          id
          username
        }
        product {
          id
          name
          image
        }
      }
      total
    }
  }
`;

export const CREATE_REVIEW = gql`
  mutation CreateReview($orderItemId: ID!, $rating: Int!, $comment: String) {
    createReview(
      order_item_id: $orderItemId
      rating: $rating
      comment: $comment
    ) {
      code
      message
      review {
        id
        rating
        comment
        created_at
      }
    }
  }
`;

export const UPDATE_REVIEW = gql`
  mutation UpdateReview($reviewId: ID!, $rating: Int, $comment: String) {
    updateReview(
      review_id: $reviewId
      rating: $rating
      comment: $comment
    ) {
      code
      message
      review {
        id
        rating
        comment
        created_at
      }
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
export const getProductReviews = async (
  productId: string, 
  options?: {
    rating?: number;
    sortField?: string;
    sortDirection?: string;
  }
): Promise<ReviewsResponse> => {
  try {
    const { data } = await apolloClient.query({
      query: GET_PRODUCT_REVIEWS,
      variables: { 
        productId, 
        ...options 
      },
      fetchPolicy: 'network-only'
      // No requiresAuth since product reviews are publicly accessible
    });
    return data.getProductReviews;
  } catch (error) {
    console.error('Error fetching product reviews:', error);
    throw error;
  }
};

export const getUserReviews = async (): Promise<ReviewsResponse> => {
  try {
    const { data } = await apolloClient.query({
      query: GET_USER_REVIEWS,
      fetchPolicy: 'network-only',
      context: {
        requiresAuth: true
      }
    });
    return data.getUserReviews;
  } catch (error) {
    console.error('Error fetching user reviews:', error);
    throw error;
  }
};

export const getAllReviews = async (filters?: {
  userId?: string;
  productId?: string;
  rating?: number;
  dateFrom?: string;
  dateTo?: string;
}): Promise<ReviewsResponse> => {
  try {
    const { data } = await apolloClient.query({
      query: GET_ALL_REVIEWS,
      variables: filters || {},
      fetchPolicy: 'network-only',
      context: {
        requiresAuth: true // Admin/staff only endpoint
      }
    });
    return data.getAllReviews;
  } catch (error) {
    console.error('Error fetching all reviews:', error);
    throw error;
  }
};

export const createReview = async (
  orderItemId: string, 
  rating: number, 
  comment?: string
): Promise<ReviewResponse> => {
  try {
    const { data } = await apolloClient.mutate({
      mutation: CREATE_REVIEW,
      variables: { 
        orderItemId, 
        rating, 
        comment 
      },
      context: {
        requiresAuth: true
      }
    });
    return data.createReview;
  } catch (error) {
    console.error('Error creating review:', error);
    throw error;
  }
};

export const updateReview = async (
  reviewId: string, 
  options: {
    rating?: number;
    comment?: string;
  }
): Promise<ReviewResponse> => {
  try {
    const { data } = await apolloClient.mutate({
      mutation: UPDATE_REVIEW,
      variables: { 
        reviewId, 
        ...options 
      },
      context: {
        requiresAuth: true
      }
    });
    return data.updateReview;
  } catch (error) {
    console.error('Error updating review:', error);
    throw error;
  }
};

export const deleteReview = async (reviewId: string): Promise<{ code: number; message: string }> => {
  try {
    const { data } = await apolloClient.mutate({
      mutation: DELETE_REVIEW,
      variables: { reviewId },
      context: {
        requiresAuth: true
      }
    });
    return data.deleteReview;
  } catch (error) {
    console.error('Error deleting review:', error);
    throw error;
  }
};