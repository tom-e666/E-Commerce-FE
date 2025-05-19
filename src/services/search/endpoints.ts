import { gql } from '@apollo/client';
import { apolloClient } from '@/services/apollo/client';

export const SMART_SEARCH = gql`
  query SmartSearch($query: String!) {
    smartSearch(query: $query) {
      code
      message
      products {
        id
        name
        price
        stock
        status
        details {
          description
          images
        }
      }
      total
      filters {
        brands {
          id
          name
          count
        }
        categories {
          id
          name
          count
        }
        price_range {
          min
          max
        }
      }
      metadata {
        original_query
        interpreted_query
        processing_time_ms
      }
    }
  }
`;

export interface SearchProduct {
  id: string;
  name: string;
  price: number;
  stock: number;
  status: boolean;
  details: {
    description: string;
    images: string[];
  };
}

export interface SearchFilters {
  brands: {
    id: string;
    name: string;
    count: number;
  }[];
  categories: {
    id: string;
    name: string;
    count: number;
  }[];
  price_range: {
    min: number;
    max: number;
  };
}

export interface SearchMetadata {
  original_query: string;
  interpreted_query: string;
  processing_time_ms: number;
}

export interface SmartSearchResponse {
  code: number;
  message: string;
  products: SearchProduct[];
  total: number;
  filters: SearchFilters;
  metadata: SearchMetadata;
}

export const smartSearchAPI = async (query: string): Promise<SmartSearchResponse> => {
  try {
    const response = await apolloClient.query({
      query: SMART_SEARCH,
      variables: { query },
      fetchPolicy: 'network-only',
    });
    return response.data.smartSearch;
  } catch (error) {
    console.error('Error performing smart search:', error);
    throw error;
  }
};