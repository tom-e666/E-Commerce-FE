import { gql } from "@apollo/client";
import { apolloClient } from "../apollo/client";

export const GET_BRANDS_QUERY = gql`
  query GetBrands {
    getBrands {
      code
      message
      brands {
        id
        name
      }
    }
  }
`;

export const getBrands = async () => {
  return apolloClient.query({
    query: GET_BRANDS_QUERY
  });
};

// Optimized getBrands with persistent caching
export const getBrandsWithCache = async () => {
  try {
    // Try to get from localStorage cache first
    const cachedBrands = localStorage.getItem('cachedBrands');
    const cacheTimestamp = localStorage.getItem('brandsCacheTimestamp');
    
    // Check if cache exists and is less than 24 hours old
    if (cachedBrands && cacheTimestamp) {
      const isValid = (Date.now() - parseInt(cacheTimestamp)) < 24 * 60 * 60 * 1000;
      if (isValid) {
        return JSON.parse(cachedBrands);
      }
    }
    
    // If not in cache or cache expired, fetch from server
    const response = await apolloClient.query({
      query: GET_BRANDS_QUERY,
      fetchPolicy: 'network-only' // Force refresh if we need to update cache
    });
    
    if (response.data?.getBrands?.brands) {
      // Update cache
      localStorage.setItem('cachedBrands', JSON.stringify(response.data.getBrands));
      localStorage.setItem('brandsCacheTimestamp', Date.now().toString());
    }
    
    return response.data.getBrands;
  } catch (error) {
    console.error('Error fetching brands with cache:', error);
    
    // Fallback to cache even if it's expired in case of network error
    const cachedBrands = localStorage.getItem('cachedBrands');
    if (cachedBrands) {
      return JSON.parse(cachedBrands);
    }
    
    throw error;
  }
};

export const CREATE_BRAND_MUTATION = gql`
  mutation CreateBrand($name: String!) {
    createBrand(name: $name) {
      code
      message
      brand {
        id
        name
      }
    }
  }
`;

export const createBrand = async (name: string) => {
  return apolloClient.mutate({
    mutation: CREATE_BRAND_MUTATION,
    variables: {
      name
    }
  });
};

// Update cache after mutations
export const createBrandWithCacheUpdate = async (name: string) => {
  const result = await apolloClient.mutate({
    mutation: CREATE_BRAND_MUTATION,
    variables: { name },
    update: (cache, { data }) => {
      // Update Apollo cache
      const existingBrands = cache.readQuery({ query: GET_BRANDS_QUERY });
      if (existingBrands && data?.createBrand?.brand) {
        cache.writeQuery({
          query: GET_BRANDS_QUERY,
          data: { 
            getBrands: {
              ...existingBrands.getBrands,
              brands: [...existingBrands.getBrands.brands, data.createBrand.brand]
            }
          }
        });
      }
      
      // Also update localStorage cache
      const cachedBrands = localStorage.getItem('cachedBrands');
      if (cachedBrands && data?.createBrand?.brand) {
        const parsedCache = JSON.parse(cachedBrands);
        parsedCache.brands.push(data.createBrand.brand);
        localStorage.setItem('cachedBrands', JSON.stringify(parsedCache));
        localStorage.setItem('brandsCacheTimestamp', Date.now().toString());
      }
    }
  });
  
  return result;
};

export const UPDATE_BRAND_MUTATION = gql`
  mutation UpdateBrand($id: ID!, $name: String!) {
    updateBrand(id: $id, name: $name) {
      code
      message
      brand {
        id
        name
      }
    }
  }
`;

export const updateBrand = async (id: string, name: string) => {
  return apolloClient.mutate({
    mutation: UPDATE_BRAND_MUTATION,
    variables: {
      id,
      name
    }
  });
};

export const DELETE_BRAND_MUTATION = gql`
  mutation DeleteBrand($id: ID!) {
    deleteBrand(id: $id) {
      code
      message
    }
  }
`;

export const deleteBrand = async (id: string) => {
  return apolloClient.mutate({
    mutation: DELETE_BRAND_MUTATION,
    variables: {
      id
    }
  });
};