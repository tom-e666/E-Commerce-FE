import { gql } from '@apollo/client';
import { apolloClient } from '@/services/apollo/client';

// Define GraphQL Queries and Mutations
export const GET_SHIPPING_BY_ORDER_ID = gql`
  query GetShippingByOrderId($orderId: ID!) {
    getShippingByOrderId(order_id: $orderId) {
      code
      message
      shipping {
        id
        order_id
        estimated_date
        status
        address
        recipient_name
        recipient_phone
        note
        ghn_order_code
        province_name
        district_name
        ward_name
        shipping_fee
        expected_delivery_time
        created_at
        updated_at
        shipping_method
      }
    }
  }
`;

export const GET_PROVINCES = gql`
  query GetProvinces {
    getProvinces {
      code
      message
      provinces {
        ProvinceID
        ProvinceName
      }
    }
  }
`;

export const GET_DISTRICTS = gql`
  query GetDistricts($provinceId: ID!) {
    getDistricts(province_id: $provinceId) {
      code
      message
      districts {
        DistrictID
        DistrictName
      }
    }
  }
`;

export const GET_WARDS = gql`
  query GetWards($districtId: ID!) {
    getWards(district_id: $districtId) {
      code
      message
      wards {
        WardCode
        WardName
      }
    }
  }
`;

export const CALCULATE_SHIPPING_FEE = gql`
  mutation CalculateShippingFee($toDistrictId: ID!, $toWardCode: String!, $weight: Int!, $value: Int) {
    calculateShippingFee(
      to_district_id: $toDistrictId,
      to_ward_code: $toWardCode,
      weight: $weight,
      value: $value
    ) {
      code
      message
      fee
      expected_delivery_time
    }
  }
`;

export const CREATE_SHIPPING = gql`
  mutation CreateShipping(
    $orderId: ID!,
    $estimatedDate: String,
    $status: String!,
    $address: String!,
    $recipientName: String!,
    $recipientPhone: String!,
    $note: String,
    $provinceName: String!,
    $districtName: String!,
    $wardName: String!,
    $shippingMethod: String!,
    $shippingFee: Float,
    $toDistrictId: ID!,
    $toWardCode: String!
  ) {
    createShipping(
      order_id: $orderId,
      estimated_date: $estimatedDate,
      status: $status,
      address: $address,
      recipient_name: $recipientName,
      recipient_phone: $recipientPhone,
      note: $note,
      province_name: $provinceName,
      district_name: $districtName,
      ward_name: $wardName,
      shipping_method: $shippingMethod,
      shipping_fee: $shippingFee,
      to_district_id: $toDistrictId,
      to_ward_code: $toWardCode
    ) {
      code
      message
      shipping {
        id
        ghn_order_code
        shipping_fee
        expected_delivery_time
      }
    }
  }
`;

export const UPDATE_SHIPPING = gql`
  mutation UpdateShipping(
    $shippingId: ID!,
    $address: String,
    $recipientName: String,
    $recipientPhone: String,
    $note: String
  ) {
    updateShipping(
      id: $shippingId,
      address: $address,
      recipient_name: $recipientName,
      recipient_phone: $recipientPhone,
      note: $note
    ) {
      code
      message
    }
  }
`;

export const UPDATE_SHIPPING_STATUS = gql`
  mutation UpdateShippingStatus($shippingId: ID!, $newStatus: String!) {
    updateShippingStatus(id: $shippingId, status: $newStatus) {
      code
      message
    }
  }
`;

// API function implementations
export const getShippingByOrderId = async (orderId: string) => {
  try {
    const response = await apolloClient.query({
      query: GET_SHIPPING_BY_ORDER_ID,
      variables: { orderId },
      fetchPolicy: 'network-only',
      context: {
        requiresAuth: true
      }
    });
    return response.data.getShippingByOrderId;
  } catch (error) {
    console.error('Error fetching shipping by order ID:', error);
    throw error;
  }
};

export const getProvinces = async () => {
  try {
    const response = await apolloClient.query({
      query: GET_PROVINCES,
      fetchPolicy: 'cache-first' // Provinces don't change often, so caching is fine
    });
    return response.data.getProvinces.provinces;
  } catch (error) {
    console.error('Error fetching provinces:', error);
    throw error;
  }
};

export const getDistricts = async (provinceId: string) => {
  try {
    const response = await apolloClient.query({
      query: GET_DISTRICTS,
      variables: { provinceId },
      fetchPolicy: 'network-only'
    });
    return response.data.getDistricts.districts;
  } catch (error) {
    console.error('Error fetching districts:', error);
    throw error;
  }
};

export const getWards = async (districtId: string) => {
  try {
    const response = await apolloClient.query({
      query: GET_WARDS,
      variables: { districtId },
      fetchPolicy: 'network-only'
    });
    return response.data.getWards.wards;
  } catch (error) {
    console.error('Error fetching wards:', error);
    throw error;
  }
};

export const calculateShippingFee = async (
  toDistrictId: string,
  toWardCode: string,
  weight: number,
  value?: number
) => {
  try {
    const response = await apolloClient.mutate({
      mutation: CALCULATE_SHIPPING_FEE,
      variables: {
        toDistrictId,
        toWardCode,
        weight,
        value
      }
    });
    return response.data.calculateShippingFee;
  } catch (error) {
    console.error('Error calculating shipping fee:', error);
    throw error;
  }
};

export const createShipping = async (
  orderId: string,
  address: string,
  recipientName: string,
  recipientPhone: string,
  provinceName: string,
  districtName: string,
  wardName: string,
  toDistrictId: string,
  toWardCode: string,
  shippingMethod: string = 'SHOP',
  shippingFee: number = 0,
  note?: string,
  estimatedDate?: string
) => {
  try {
    const response = await apolloClient.mutate({
      mutation: CREATE_SHIPPING,
      variables: {
        orderId,
        address,
        recipientName,
        recipientPhone,
        provinceName,
        districtName,
        wardName,
        toDistrictId,
        toWardCode,
        shippingMethod,
        shippingFee,
        note,
        estimatedDate,
        status: 'pending'
      },
      context: {
        requiresAuth: true
      }
    });
    return response.data.createShipping;
  } catch (error) {
    console.error('Error creating shipping:', error);
    throw error;
  }
};

export const updateShipping = async (
  shippingId: string,
  address?: string,
  recipientName?: string,
  recipientPhone?: string,
  note?: string
) => {
  try {
    const response = await apolloClient.mutate({
      mutation: UPDATE_SHIPPING,
      variables: {
        shippingId,
        address,
        recipientName,
        recipientPhone,
        note
      },
      context: {
        requiresAuth: true
      }
    });
    return response.data.updateShipping;
  } catch (error) {
    console.error('Error updating shipping:', error);
    throw error;
  }
};

export const updateShippingStatus = async (shippingId: string, newStatus: string) => {
  try {
    const response = await apolloClient.mutate({
      mutation: UPDATE_SHIPPING_STATUS,
      variables: {
        shippingId,
        newStatus
      },
      context: {
        requiresAuth: true
      }
    });
    return response.data.updateShippingStatus;
  } catch (error) {
    console.error('Error updating shipping status:', error);
    throw error;
  }
};