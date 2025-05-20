import { ApolloClient, InMemoryCache, HttpLink, from, ApolloLink } from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { refreshTokenAPI } from "../auth/endpoints";
import { Observable } from "@apollo/client";
import { toast } from "sonner";
const getTokens = () => {
  if (typeof window === 'undefined') return { accessToken: null, refreshToken: null };

  // Kiểm tra cả hai cách lưu token
  const accessToken = localStorage.getItem('token') || localStorage.getItem('access_token');
  const refreshToken = localStorage.getItem('refreshToken') || localStorage.getItem('refresh_token');

  console.log('Getting tokens for Apollo client:',
    accessToken ? 'Access token found' : 'No access token',
    refreshToken ? 'Refresh token found' : 'No refresh token'
  );

  return { accessToken, refreshToken };
};
// @ts-ignore
const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  // Xử lý lỗi GraphQL
  if (graphQLErrors) {
    console.log('GraphQL Errors:', graphQLErrors);

    for (const error of graphQLErrors) {
      // Xử lý lỗi xác thực
      if (
        error.extensions?.code === 'UNAUTHENTICATED' ||
        error.message.includes('token') ||
        error.message.includes('authentication') ||
        error.message.includes('Unauthenticated.')
      ) {
        console.log('Authentication error detected:', error.message);
        const { refreshToken } = getTokens();

        if (!refreshToken) {
            console.error('No refresh token available, redirecting to login');
            toast.error('Phiên đăng nhập hết hạn, vui lòng đăng nhập lại');
            // Không chuyển hướng tự động, để tránh vòng lặp chuyển hướng
            return;
          }

        console.log('Attempting to refresh token...');
        return new Promise(resolve => {
          refreshTokenAPI(refreshToken)
            .then(response => {
              if (response?.data?.refreshToken?.access_token) {
                const newAccessToken = response.data.refreshToken.access_token;
                console.log('Token refreshed successfully');

                // Lưu token mới vào localStorage
                localStorage.setItem('token', newAccessToken);
                localStorage.setItem('access_token', newAccessToken);

                // Cập nhật header authorization cho request hiện tại
                const oldHeaders = operation.getContext().headers || {};
                operation.setContext({
                  headers: {
                    ...oldHeaders,
                    authorization: `Bearer ${newAccessToken}`,
                  },
                });
                resolve(forward(operation));
              } else {
                console.error('Failed to refresh token, invalid response:', response);
                toast.error('Không thể làm mới phiên đăng nhập, vui lòng đăng nhập lại');
                // Không chuyển hướng tự động, để tránh vòng lặp chuyển hướng
                resolve(forward(operation));
              }
            })
            .catch((refreshError) => {
              console.error('Error refreshing token:', refreshError);
              toast.error('Lỗi khi làm mới phiên đăng nhập, vui lòng đăng nhập lại');
              // Không chuyển hướng tự động, để tránh vòng lặp chuyển hướng
              resolve(forward(operation));
            });
        });
      }
    }
  }

  // Xử lý lỗi mạng
  if (networkError) {
    console.error('Network Error:', networkError);

    // Kiểm tra lỗi CORS
    if (networkError.message && networkError.message.includes('CORS')) {
      console.error('CORS error detected:', networkError.message);
      toast.error('Lỗi kết nối đến máy chủ (CORS). Vui lòng liên hệ quản trị viên.');
    } else {
      toast.error('Lỗi kết nối đến máy chủ. Vui lòng thử lại sau.');
    }
  }
});

// Link thêm token vào mọi request
const authLink = new ApolloLink((operation, forward) => {
  const { accessToken } = getTokens();
  const { requiresAuth } = operation.getContext();

  // Nếu yêu cầu xác thực nhưng không có token, trả về Observable rỗng
  if (requiresAuth && !accessToken) {
    console.error('Authentication required but no token found for operation:', operation.operationName);
    // Hiển thị thông báo lỗi cho người dùng
    if (typeof window !== 'undefined') {
      toast.error('Vui lòng đăng nhập lại để tiếp tục');
    }
    return new Observable(observer => {
      observer.complete();
    });
  }

  // Thêm token vào header của request
  const headers: Record<string, string> = {};
  if (accessToken) {
    headers.authorization = `Bearer ${accessToken}`;
    console.log('Adding auth token to request:', operation.operationName);
  }

  // Lấy headers hiện tại và kết hợp với headers mới
  const currentContext = operation.getContext();
  const currentHeaders = currentContext.headers || {};

  operation.setContext({
    ...currentContext,
    headers: {
      ...currentHeaders,
      ...headers,
    },
  });

  return forward(operation);
});

// HTTP link
const httpLink = new HttpLink({
  uri: 'https://0862-116-110-41-30.ngrok-free.app/graphql', // URL API
  // Không sử dụng credentials: 'include' để tránh lỗi CORS
});

// Create and export the client instance
export const apolloClient = new ApolloClient({
  link: from([authLink, errorLink, httpLink]),
  cache: new InMemoryCache(),
  // Không lưu trữ truy vấn/kết quả trong localStorage để tránh lưu dữ liệu nhạy cảm
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
    query: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
});

// Hàm tiện ích để reset client khi đăng xuất
export const resetApolloClient = () => {
  // Xóa cache
  apolloClient.resetStore();
};