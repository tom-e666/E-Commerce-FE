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
const GET_PRODUCT = gql`
  query GetProduct($getProductId: ID!) {
    getProduct(id: $getProductId) {
      code
      message
      product {
        id
        name
        price
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
    $stock: Int!
    $status: Boolean!
    $brand_id: ID!
    $weight: Float!
    $details: ProductDetailsInput!
  ) {
    createProduct(
      name: $name
      price: $price
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
export const getProduct = async (id: string): Promise<ProductResponse> => {
  try {
    const response = await apolloClient.query({
      query: GET_PRODUCT,
      variables: { getProductId: id },
      fetchPolicy: 'network-only',
    });
    return response.data.getProduct;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
};

export const getProducts = async (status?: string): Promise<ProductsResponse> => {
  try {
    const response = await apolloClient.query({
      query: GET_PRODUCTS,
      variables: status ? { status } : {},
      fetchPolicy: 'network-only',
    });
    return response.data.getProducts;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
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
    });
    return response.data.getPaginatedProducts;
  } catch (error) {
    console.error('Error fetching paginated products:', error);
    throw error;
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