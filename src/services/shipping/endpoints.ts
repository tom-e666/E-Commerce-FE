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

export const GET_ALL_SHIPPINGS = gql`
  query GetAllShippings($status: String) {
    getAllShippings(status: $status) {
      code
      message
      shippings {
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
  query CalculateShippingFee($toDistrictId: ID!, $toWardCode: String!, $weight: Int!, $value: Int) {
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
    $address: String!,
    $recipientName: String!,
    $recipientPhone: String!,
    $note: String,
    $provinceName: String!,
    $districtName: String!,
    $wardName: String!,
    $shippingMethod: String!
  ) {
    createShipping(
      order_id: $orderId,
      address: $address,
      recipient_name: $recipientName,
      recipient_phone: $recipientPhone,
      note: $note,
      province_name: $provinceName,
      district_name: $districtName,
      ward_name: $wardName,
      shipping_method: $shippingMethod
    ) {
      code
      message
      shipping {
        id
        ghn_order_code
        shipping_fee
        expected_delivery_time
        status
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
    $note: String,
    $provinceName: String,
    $districtName: String,
    $wardName: String
  ) {
    updateShipping(
      shipping_id: $shippingId,
      address: $address,
      recipient_name: $recipientName,
      recipient_phone: $recipientPhone,
      note: $note,
      province_name: $provinceName,
      district_name: $districtName,
      ward_name: $wardName
    ) {
      code
      message
      shipping {
        id
        address
        recipient_name
        recipient_phone
        note
        province_name
        district_name
        ward_name
        updated_at
      }
    }
  }
`;

export const UPDATE_SHIPPING_STATUS = gql`
  mutation UpdateShippingStatus($shippingId: ID!, $status: String!) {
    updateShippingStatus(
      shipping_id: $shippingId, 
      status: $status
    ) {
      code
      message
      shipping {
        id
        status
        updated_at
      }
    }
  }
`;

export const CANCEL_SHIPPING = gql`
  mutation CancelShipping($shippingId: ID!) {
    cancelShipping(shipping_id: $shippingId) {
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

export const getAllShippings = async (status?: string) => {
  try {
    const response = await apolloClient.query({
      query: GET_ALL_SHIPPINGS,
      variables: status ? { status } : {},
      fetchPolicy: 'network-only',
      context: {
        requiresAuth: true
      }
    });
    return response.data.getAllShippings;
  } catch (error) {
    console.error('Error fetching all shippings:', error);
    throw error;
  }
};

export const getProvinces = async () => {
  try {
    const response = await apolloClient.query({
      query: GET_PROVINCES,
      fetchPolicy: 'cache-first' // Cache provinces data since it doesn't change frequently
    });
    return response.data.getProvinces;
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
      fetchPolicy: 'cache-first' // Cache districts data as well
    });
    return response.data.getDistricts;
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
      fetchPolicy: 'cache-first' // Cache wards data as well
    });
    return response.data.getWards;
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
    const response = await apolloClient.query({
      query: CALCULATE_SHIPPING_FEE,
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
  shippingMethod: string = 'SHOP',
  note?: string
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
        shippingMethod,
        note
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
  data: {
    address?: string;
    recipientName?: string;
    recipientPhone?: string;
    note?: string;
    provinceName?: string;
    districtName?: string;
    wardName?: string;
  }
) => {
  try {
    const variables = {
      shippingId,
      ...data
    };
    
    const response = await apolloClient.mutate({
      mutation: UPDATE_SHIPPING,
      variables: variables,
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

export const updateShippingStatus = async (shippingId: string, status: string) => {
  try {
    const response = await apolloClient.mutate({
      mutation: UPDATE_SHIPPING_STATUS,
      variables: {
        shippingId,
        status
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

export const cancelShipping = async (shippingId: string) => {
  try {
    const response = await apolloClient.mutate({
      mutation: CANCEL_SHIPPING,
      variables: {
        shippingId
      },
      context: {
        requiresAuth: true
      }
    });
    return response.data.cancelShipping;
  } catch (error) {
    console.error('Error canceling shipping:', error);
    throw error;
  }
};

export interface Shipping {
  id: string;
  order_id: string;
  estimated_date?: string;
  status: string;
  address: string;
  recipient_name: string;
  recipient_phone: string;
  note?: string;
  ghn_order_code?: string;
  province_name?: string;
  district_name?: string;
  ward_name?: string;
  shipping_fee?: number;
  expected_delivery_time?: string;
  created_at: string;
  updated_at: string;
  shipping_method: string;
}

export interface Province {
  ProvinceID: string;
  ProvinceName: string;
}

export interface District {
  DistrictID: string;
  DistrictName: string;
}

export interface Ward {
  WardCode: string;
  WardName: string;
}

export interface BaseResponse {
  code: number;
  message: string;
}

export interface ShippingResponse extends BaseResponse {
  shipping: Shipping;
}

export interface ShippingsResponse extends BaseResponse {
  shippings: Shipping[];
}

export interface ProvinceResponse extends BaseResponse {
  provinces: Province[];
}

export interface DistrictResponse extends BaseResponse {
  districts: District[];
}

export interface WardResponse extends BaseResponse {
  wards: Ward[];
}

export interface ShippingFeeResponse extends BaseResponse {
  fee?: number;
  expected_delivery_time?: string;
}