import { gql } from '@apollo/client';
import { apolloClient } from '@/services/apollo/client';

// Types matching the GraphQL schema
export interface Specification {
  name: string;
  value: string;
}

export interface ProductDetails {
  description: string;
  specifications: Specification[];
  images: string[];
  keywords: string[];
}

export interface Product {
  id: string;
  name: string;
  price: number;
  default_price: number;
  stock: number;
  status: boolean;
  brand_id: string;
  details: ProductDetails;
  weight: number;
}

export interface BaseResponse {
  code: number;
  message: string;
}

export interface ProductResponse extends BaseResponse {
  product: Product;
}

export interface ProductsResponse extends BaseResponse {
  products: Product[];
}

export interface PaginationInfo {
  total: number;
  current_page: number;
  per_page: number;
  last_page: number;
  from: number | null;
  to: number | null;
  has_more_pages: boolean;
}

export interface PaginatedProductsResponse extends BaseResponse {
  products: Product[];
  pagination: PaginationInfo;
}

// GraphQL queries and mutations
export const GET_PRODUCT = gql`
  query GetProduct($getProductId: ID!) {
    getProduct(id: $getProductId) {
      code
      message
      product {
        id
        name
        price
        default_price
        stock
        status
        brand_id
        weight
        details {
          description
          specifications {
            name
            value
          }
          images
          keywords
        }
      }
    }
  }
`;
export const SMART_SEARCH = gql`query SmartSearch($query: String!) {
  smartSearch(query: $query) {
    code
    filters {
      brands {
        count
        id
        name
      }
      categories {
        count
        id
        name
      }
      price_range {
        max
        min
      }
    }
    message
    products {
      brand_id
      details {
        description
        images
        keywords
        specifications {
          name
          value
        }
      }
      id
      name
      price
      status
      stock
      weight
    }
    total
  }
}`
const GET_PRODUCTS = gql`
  query GetProducts($status: String) {
    getProducts(status: $status) {
      code
      message
      products {
        id
        name
        price
        default_price
        stock
        status
        brand_id
        weight
        details {
          description
          specifications {
            name
            value
          }
          images
          keywords
        }
      }
    }
  }
`;

const GET_PAGINATED_PRODUCTS = gql`
  query GetPaginatedProducts(
    $search: String
    $status: String
    $category_id: ID
    $brand_id: ID
    $price_min: Float
    $price_max: Float
    $sort_field: String
    $sort_direction: String
    $page: Int
    $per_page: Int
  ) {
    getPaginatedProducts(
      search: $search
      status: $status
      category_id: $category_id
      brand_id: $brand_id
      price_min: $price_min
      price_max: $price_max
      sort_field: $sort_field
      sort_direction: $sort_direction
      page: $page
      per_page: $per_page
    ) {
      code
      message
      products {
        id
        name
        price
        default_price
        stock
        status
        brand_id
        weight
        details {
          description
          specifications {
            name
            value
          }
          images
          keywords
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

const CREATE_PRODUCT = gql`
  mutation CreateProduct(
    $name: String!
    $price: Float!
    $defaultPrice: Float
    $stock: Int!
    $status: Boolean!
    $brand_id: ID!
    $weight: Float!
    $details: ProductDetailsInput!
  ) {
    createProduct(
      name: $name
      price: $price
      default_price: $defaultPrice
      stock: $stock
      status: $status
      brand_id: $brand_id
      weight: $weight
      details: $details
    ) {
      code
      message
      product {
        id
        name
        price
        default_price
        stock
        status
        brand_id
        weight
        details {
          description
          specifications {
            name
            value
          }
          images
          keywords
        }
      }
    }
  }
`;

const UPDATE_PRODUCT = gql`
  mutation UpdateProduct(
    $id: ID!
    $name: String
    $price: Float
    $defaultPrice: Float
    $stock: Int
    $status: Boolean
    $brand_id: ID
    $weight: Float
    $details: ProductDetailsInput
  ) {
    updateProduct(
      id: $id
      name: $name
      price: $price
      default_price: $defaultPrice
      stock: $stock
      status: $status
      brand_id: $brand_id
      weight: $weight
      details: $details
    ) {
      code
      message
      product {
        id
        name
        price
        default_price
        stock
        status
        brand_id
        weight
        details {
          description
          specifications {
            name
            value
          }
          images
          keywords
        }
      }
    }
  }
`;

const DELETE_PRODUCT = gql`
  mutation DeleteProduct($id: ID!) {
    deleteProduct(id: $id) {
      code
      message
    }
  }
`;

// API methods
export const getProduct = (() => {
  // Create a request cache to avoid duplicate in-flight requests
  const requestCache = new Map<string, Promise<ProductResponse>>();
  
  return async (id: string): Promise<ProductResponse> => {
    // Check if we already have this request in flight
    if (requestCache.has(id)) {
      return requestCache.get(id)!;
    }
    
    // Check if we have this in Apollo cache first
    try {
      const cachedData = apolloClient.readQuery({
        query: GET_PRODUCT,
        variables: { getProductId: id }
      });
      
      if (cachedData?.getProduct) {
        return cachedData.getProduct;
      }
    } catch {
      // Cache miss, continue with network request
    }
    
    // Create the request promise
    const requestPromise = (async () => {
      try {
        const response = await apolloClient.query({
          query: GET_PRODUCT,
          variables: { getProductId: id },
          fetchPolicy: 'cache-first', // Use cache when available
          context: {
            requiresAuth: false
          }
        });
  
        return response.data.getProduct;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        const isNetworkError = errorMessage.includes('Failed to fetch') ||
                              errorMessage.includes('Network error') ||
                              errorMessage.includes('timeout');
  
        return {
          code: 500,
          message: isNetworkError
            ? 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng và thử lại.'
            : 'Có lỗi xảy ra khi tải thông tin sản phẩm',
          product: null as Product | null
        };
      } finally {
        // Remove from the request cache after a short delay to allow for batched requests
        setTimeout(() => {
          requestCache.delete(id);
        }, 500);
      }
    })();
    
    // Store the request promise in the cache
    requestCache.set(id, requestPromise);
    return requestPromise;
  };
})();

export const getProducts = async (status?: string): Promise<ProductsResponse> => {
  try {
    const response = await apolloClient.query({
      query: GET_PRODUCTS,
      variables: status ? { status } : {},
      fetchPolicy: 'network-only',
      context: {
        requiresAuth: false // Chỉ định rõ ràng rằng API này không yêu cầu xác thực (không thêm token vào header)
      }
    });
    return response.data.getProducts;
  } catch (error) {
    console.error('Error fetching products:', error);

    // Kiểm tra lỗi kết nối
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const isNetworkError = errorMessage.includes('Failed to fetch') ||
                           errorMessage.includes('Network error') ||
                           errorMessage.includes('timeout');

    // Return a formatted error response instead of throwing
    return {
      code: 500,
      message: isNetworkError
        ? 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng và thử lại.'
        : 'Không thể tải danh sách sản phẩm',
      products: []
    };
  }
};

export const getPaginatedProducts = async (filters?: {
  search?: string;
  status?: string;
  category_id?: string;
  brand_id?: string;
  price_min?: number;
  price_max?: number;
  sort_field?: string;
  sort_direction?: string;
  page?: number;
  per_page?: number;
}): Promise<PaginatedProductsResponse> => {
  try {
    const response = await apolloClient.query({
      query: GET_PAGINATED_PRODUCTS,
      variables: filters || {},
      fetchPolicy: 'network-only',
      context: {
        requiresAuth: false // Chỉ định rõ ràng rằng API này không yêu cầu xác thực (không thêm token vào header)
      }
    });
    return response.data.getPaginatedProducts;
  } catch (error) {
    console.error('Error fetching paginated products:', error);

    // Kiểm tra lỗi kết nối
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const isNetworkError = errorMessage.includes('Failed to fetch') ||
                           errorMessage.includes('Network error') ||
                           errorMessage.includes('timeout');

    // Return a formatted error response instead of throwing
    return {
      code: 500,
      message: isNetworkError
        ? 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng và thử lại.'
        : 'Không thể tải danh sách sản phẩm',
      products: [],
      pagination: {
        total: 0,
        current_page: 1,
        per_page: 10,
        last_page: 1,
        from: null,
        to: null,
        has_more_pages: false
      }
    };
  }
};

export const createProduct = async (
  productData: Omit<Product, "id">
): Promise<ProductResponse> => {
  try {
    const response = await apolloClient.mutate({
      mutation: CREATE_PRODUCT,
      variables: productData,
      context: {
        requiresAuth: true
      }
    });
    return response.data.createProduct;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

export const updateProduct = async (
  id: string,
  productData: Partial<Product>
): Promise<ProductResponse> => {
  try {
    const response = await apolloClient.mutate({
      mutation: UPDATE_PRODUCT,
      variables: {
        id,
        ...productData
      },
      context: {
        requiresAuth: true
      }
    });
    return response.data.updateProduct;
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

export const deleteProduct = async (id: string): Promise<BaseResponse> => {
  try {
    const response = await apolloClient.mutate({
      mutation: DELETE_PRODUCT,
      variables: { id },
      context: {
        requiresAuth: true
      }
    });
    return response.data.deleteProduct;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

// Add helper function to get products with optimized caching
export const getProductsWithCache = async (options = { status: undefined }) => {
  try {
    // Check cache first to avoid unnecessary network requests
    const cachedData = apolloClient.readQuery({
      query: GET_PRODUCTS,
      variables: { status: options.status }
    });
    
    if (cachedData) {
      console.log('Using cached product data');
      return cachedData.getProducts;
    }
    
    const { data } = await apolloClient.query({
      query: GET_PRODUCTS,
      variables: { status: options.status },
      fetchPolicy: 'cache-first'
    });
    
    return data.getProducts;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

// Optimized function for product details with 15-minute cache
export const getProductDetails = async (productId: string) => {
  try {
    const { data } = await apolloClient.query({
      query: GET_PRODUCT,
      variables: { getProductId: productId },
      fetchPolicy: 'cache-first',
      // Cache product details for 15 minutes
      context: {
        fetchOptions: {
          next: { revalidate: 900 }
        }
      }
    });
    return data.getProduct;
  } catch (error) {
    console.error('Error fetching product details:', error);
    throw error;
  }
};