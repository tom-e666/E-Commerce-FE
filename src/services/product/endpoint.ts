import { gql } from '@apollo/client';
export const GET_PRODUCTS_QUERY = gql`
  query GetProducts($status: String!) {
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
        details {
          description
          images
          keywords
          specifications {
            name
            value
          }
        }
      }
    }
  }
`;
export const GET_PRODUCT_QUERY = gql`
  query GetProduct($id: ID!) {
    getProduct(id: $id) {
      code
      message
      product {
        id
        name
        price
        stock
        status
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
      }
    }
  }
`;
export const CREATE_PRODUCT_MUTATION = gql`
  mutation CreateProduct(
    $name: String!
    $price: Float!
    $stock: Int!
    $status: Boolean!
    $brand_id: ID!
    $details: ProductDetailsInput!
  ) {
    createProduct(
      name: $name
      price: $price
      stock: $stock
      status: $status
      brand_id: $brand_id
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
        details {
          description
          images
          keywords
          specifications {
            name
            value
          }
        }
      }
    }
  }
`;
export const UPDATE_PRODUCT_MUTATION = gql`
  mutation UpdateProduct(
    $id: ID!
    $name: String
    $price: Float
    $stock: Int
    $status: Boolean
    $brand_id: ID
    $details: ProductDetailsInput
  ) {
    updateProduct(
      id: $id
      name: $name
      price: $price
      stock: $stock
      status: $status
      brand_id: $brand_id
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
        details {
          description
          images
          keywords
          specifications {
            name
            value
          }
        }
      }
    }
  }
`;
export const DELETE_PRODUCT_MUTATION = gql`
  mutation DeleteProduct($id: ID!) {
    deleteProduct(id: $id) {
      code
      message
    }
  }
`;
export interface ProductSpecification {
  name: string;
  value: string;
}
export interface ProductDetails {
  description: string;
  images: string[];
  keywords: string[];
  specifications: ProductSpecification[];
}
export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  status: boolean;
  brand_id: string;
  details: ProductDetails;
}
import { apolloClient } from "../apollo/client";

export const getProducts = async (status = "1") => {
  try {
    return await apolloClient.query({
      query: GET_PRODUCTS_QUERY,
      variables: { status },
      fetchPolicy: 'network-only'
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};
export const getProduct = async (id: string) => {
  try {
    return await apolloClient.query({
      query: GET_PRODUCT_QUERY,
      variables: { id },
      fetchPolicy: 'network-only'
    });
  } catch (error) {
    console.error(`Error fetching product with id ${id}:`, error);
    throw error;
  }
};
export const createProduct = async (
  name: string,
  price: number,
  stock: number,
  status: boolean,
  brand_id: string,
  details: ProductDetails
) => {
  try {
    return await apolloClient.mutate({
      mutation: CREATE_PRODUCT_MUTATION,
      variables: {
        name,
        price,
        stock,
        status,
        brand_id,
        details: cleanInputObject(details)

      }
    });
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};
export const updateProduct = async (
  id: string,
  data: {
    name?: string;
    price?: number;
    stock?: number;
    status?: boolean;
    brand_id?: string;
    details?: Partial<ProductDetails>;
  }
) => {
  try {
    const cleanedData = { ...data };
    
    if (cleanedData.details) {
      cleanedData.details = cleanInputObject(cleanedData.details);
    }
    return await apolloClient.mutate({
      mutation: UPDATE_PRODUCT_MUTATION,
      variables: {
        id,
        ...cleanedData
      }
    });
  } catch (error) {
    console.error(`Error updating product with id ${id}:`, error);
    throw error;
  }
};
export const deleteProduct = async (id: string) => {
  try {
    return await apolloClient.mutate({
      mutation: DELETE_PRODUCT_MUTATION,
      variables: { id }
    });
  } catch (error) {
    console.error(`Error deleting product with id ${id}:`, error);
    throw error;
  }
};
//@ts-expect-error dynamic type
function cleanInputObject(obj:any){
  if (!obj) return obj;

  if (Array.isArray(obj)) {
    return obj.map(cleanInputObject);
  }
  
  if (typeof obj === 'object') {
    const cleaned = { ...obj };
    
    if ('__typename' in cleaned) {
      delete cleaned.__typename;
    }
    
    Object.keys(cleaned).forEach(key => {
      if (typeof cleaned[key] === 'object' && cleaned[key] !== null) {
        cleaned[key] = cleanInputObject(cleaned[key]);
      }
    });
    
    return cleaned;
  }
  
  return obj;
}