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

export const UPDATE_BRAND_MUTATION = gql`
  mutation UpdateBrand($id: String!, $name: String!) {
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
  mutation DeleteBrand($id: String!) {
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