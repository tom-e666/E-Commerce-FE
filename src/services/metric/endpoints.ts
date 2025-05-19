import { gql } from "@apollo/client";
import { apolloClient } from "../apollo/client";

// Main dashboard metrics for quick overview
export const GET_ADMIN_DASHBOARD_METRICS = gql`
  query GetAdminDashboardMetrics {
    getAdminDashboardMetrics {
      code
      message
      orders_today
      orders_week
      orders_month
      revenue_today
      revenue_week
      revenue_month
      total_products
      low_stock_products
      out_of_stock_products
      total_users
      new_users_today
      new_users_week
      support_tickets_open
      support_tickets_total
    }
  }
`;

// Detailed sales metrics for charts
export const GET_SALES_METRICS = gql`
  query GetSalesMetrics($timeframe: String!, $startDate: String, $endDate: String) {
    getSalesMetrics(timeframe: $timeframe, start_date: $startDate, end_date: $endDate) {
      code
      message
      daily_metrics {
        date
        revenue
        orders_count
        average_order_value
      }
      weekly_metrics {
        date
        revenue
        orders_count
        average_order_value
      }
      monthly_metrics {
        date
        revenue
        orders_count
        average_order_value
      }
    }
  }
`;

// Product performance metrics
export const GET_PRODUCT_METRICS = gql`
  query GetProductMetrics($limit: Int) {
    getProductMetrics(limit: $limit) {
      code
      message
      top_selling_products {
        id
        name
        sales_count
        revenue
        stock_remaining
        stock_percentage
      }
      low_stock_products {
        id
        name
        sales_count
        revenue
        stock_remaining
        stock_percentage
      }
    }
  }
`;

// Support ticket metrics
export const GET_SUPPORT_METRICS = gql`
  query GetSupportMetrics {
    getSupportMetrics {
      code
      message
      open_tickets
      in_progress_tickets
      resolved_tickets
      average_resolution_time
    }
  }
`;

// Helper function to get admin dashboard metrics
export const getAdminDashboardMetrics = async () => {
  try {
    const { data } = await apolloClient.query({
      query: GET_ADMIN_DASHBOARD_METRICS,
      context: {
        requiresAuth: true
      },
      // Disable cache to always get fresh data for dashboards
      fetchPolicy: 'network-only'
    });
    return data.getAdminDashboardMetrics;
  } catch (error) {
    console.error("Error fetching admin dashboard metrics:", error);
    throw error;
  }
};

// Helper function to get sales metrics
export const getSalesMetrics = async (
  timeframe: 'daily' | 'weekly' | 'monthly',
  startDate?: string,
  endDate?: string
) => {
  try {
    const { data } = await apolloClient.query({
      query: GET_SALES_METRICS,
      variables: { 
        timeframe, 
        startDate, 
        endDate 
      },
      context: {
        requiresAuth: true
      },
      fetchPolicy: 'network-only'
    });
    return data.getSalesMetrics;
  } catch (error) {
    console.error("Error fetching sales metrics:", error);
    throw error;
  }
};

// Helper function to get product metrics
export const getProductMetrics = async (limit: number = 10) => {
  try {
    const { data } = await apolloClient.query({
      query: GET_PRODUCT_METRICS,
      variables: { limit },
      context: {
        requiresAuth: true
      },
      fetchPolicy: 'network-only'
    });
    return data.getProductMetrics;
  } catch (error) {
    console.error("Error fetching product metrics:", error);
    throw error;
  }
};

// Helper function to get support metrics
export const getSupportMetrics = async () => {
  try {
    const { data } = await apolloClient.query({
      query: GET_SUPPORT_METRICS,
      context: {
        requiresAuth: true
      },
      fetchPolicy: 'network-only'
    });
    return data.getSupportMetrics;
  } catch (error) {
    console.error("Error fetching support metrics:", error);
    throw error;
  }
};

// Types for admin dashboard metrics
export interface DashboardMetrics {
  code: number;
  message: string;
  orders_today: number;
  orders_week: number;
  orders_month: number;
  revenue_today: number;
  revenue_week: number;
  revenue_month: number;
  total_products: number;
  low_stock_products: number;
  out_of_stock_products: number;
  total_users: number;
  new_users_today: number;
  new_users_week: number;
  support_tickets_open: number;
  support_tickets_total: number;
}

// Types for time-based metrics
export interface TimeMetric {
  date: string;
  revenue: number;
  orders_count: number;
  average_order_value: number;
}

// Types for sales metrics response
export interface SalesMetricsResponse {
  code: number;
  message: string;
  daily_metrics?: TimeMetric[];
  weekly_metrics?: TimeMetric[];
  monthly_metrics?: TimeMetric[];
}

// Types for product metrics
export interface ProductMetric {
  id: string;
  name: string;
  sales_count: number;
  revenue: number;
  stock_remaining: number;
  stock_percentage: number;
}

// Types for product metrics response
export interface ProductMetricsResponse {
  code: number;
  message: string;
  top_selling_products: ProductMetric[];
  low_stock_products: ProductMetric[];
}

// Types for support metrics response
export interface SupportMetricsResponse {
  code: number;
  message: string;
  open_tickets: number;
  in_progress_tickets: number;
  resolved_tickets: number;
  average_resolution_time: string; // Usually in format like "2d 5h 30m"
}