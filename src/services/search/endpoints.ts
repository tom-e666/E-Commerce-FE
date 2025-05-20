import { gql } from '@apollo/client';
import { apolloClient } from '@/services/apollo/client';
import { SMART_SEARCH } from '@/services/product/endpoint';

export interface SearchProduct {
  id: string;
  name: string;
  price: number;
  stock: number;
  status: boolean;
  brand_id: string;
  weight: number;
  details: {
    description: string;
    images: string[];
    keywords: string[];
    specifications: {
      name: string;
      value: string;
    }[];
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
  metadata?: SearchMetadata; // Làm cho metadata là tùy chọn vì truy vấn mới không có trường này
}

export const smartSearchAPI = async (query: string): Promise<SmartSearchResponse> => {
  try {
    const response = await apolloClient.query({
      query: SMART_SEARCH,
      variables: { query },
      fetchPolicy: 'network-only',
      errorPolicy: 'all', // Thêm errorPolicy để nhận cả data và errors
    });

    console.log('SmartSearch API response:', response);

    // Kiểm tra xem có lỗi không
    if (response.errors) {
      console.error('GraphQL errors:', response.errors);
      // Tạo một đối tượng SmartSearchResponse mặc định
      return {
        code: 500,
        message: 'Có lỗi xảy ra khi tìm kiếm',
        products: [],
        total: 0,
        filters: {
          brands: [],
          categories: [],
          price_range: { min: 0, max: 0 }
        }
      };
    }

    // Kiểm tra xem có data.smartSearch không
    if (!response.data || !response.data.smartSearch) {
      console.error('No data returned from SmartSearch API');
      // Tạo một đối tượng SmartSearchResponse mặc định
      return {
        code: 404,
        message: 'Không tìm thấy kết quả',
        products: [],
        total: 0,
        filters: {
          brands: [],
          categories: [],
          price_range: { min: 0, max: 0 }
        }
      };
    }

    // Tạo một bản sao của đối tượng kết quả và thêm metadata nếu không có
    const result = response.data.smartSearch;

    // Tạo một đối tượng mới với tất cả thuộc tính từ result
    const resultWithMetadata = {
      ...result,
      // Thêm metadata nếu không có
      metadata: result.metadata || {
        original_query: query,
        interpreted_query: query,
        processing_time_ms: 0
      }
    };

    return resultWithMetadata;
  } catch (error) {
    console.error('Error performing smart search:', error);

    // Tạo một đối tượng SmartSearchResponse mặc định
    return {
      code: 500,
      message: 'Có lỗi xảy ra khi tìm kiếm',
      products: [],
      total: 0,
      filters: {
        brands: [],
        categories: [],
        price_range: { min: 0, max: 0 }
      }
    };
  }
};