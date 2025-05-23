import { ApolloClient, InMemoryCache, HttpLink, from, ApolloLink } from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { refreshTokenAPI } from "../auth/endpoints";
import { Observable } from "@apollo/client";
import { toast } from "sonner";
import { tokenEvents, TOKEN_UPDATED, TOKEN_REMOVED } from '../auth/tokenEvents';

function getTokens(skipLogging = false) {
  if (typeof window === 'undefined') return { accessToken: null, refreshToken: null };

  // Kiểm tra cả hai cách lưu token
  const accessToken = localStorage.getItem('token') || localStorage.getItem('access_token');
  const refreshToken = localStorage.getItem('refreshToken') || localStorage.getItem('refresh_token');

  // Chỉ log khi không yêu cầu bỏ qua logging
  // if (!skipLogging) {
  //   console.log('Getting tokens for Apollo client:',
  //     accessToken ? 'Access token found' : 'No access token',
  //     refreshToken ? 'Refresh token found' : 'No refresh token'
  //   );
  // }

  return { accessToken, refreshToken };
}
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
        const { refreshToken } = getTokens(false); // Hiển thị log vì đây là lỗi xác thực

        if (!refreshToken) {
          console.error('No refresh token available, redirecting to login');
          toast.error('Phiên đăng nhập hết hạn, vui lòng đăng nhập lại');
          // Không chuyển hướng tự động, để tránh vòng lặp chuyển hướng
          return;
        }

        console.log('Attempting to refresh token...');
        return new Observable(observer => {
          refreshTokenAPI(refreshToken)
            .then(response => {
              const refreshData = response.data?.refreshToken;
              if (refreshData?.access_token) {
                const newAccessToken = refreshData.access_token;
                console.log('Token refreshed successfully');

                // Lưu token mới vào localStorage (lưu cả hai định dạng để đảm bảo tương thích)
                localStorage.setItem('token', newAccessToken);
                localStorage.setItem('access_token', newAccessToken);

                if (refreshData.refresh_token) {
                  localStorage.setItem('refreshToken', refreshData.refresh_token);
                  localStorage.setItem('refresh_token', refreshData.refresh_token);
                }

                if (refreshData.expires_at) {
                  localStorage.setItem('expiresAt', refreshData.expires_at);
                }

                // Kích hoạt sự kiện token đã được cập nhật
                tokenEvents.emit(TOKEN_UPDATED);

                // Cập nhật header authorization cho request hiện tại
                const oldHeaders = operation.getContext().headers || {};
                operation.setContext({
                  headers: {
                    ...oldHeaders,
                    authorization: `Bearer ${newAccessToken}`,
                  },
                });

                // Forward lại operation với token mới
                forward(operation).subscribe({
                  next: observer.next.bind(observer),
                  error: observer.error.bind(observer),
                  complete: observer.complete.bind(observer),
                });
              } else {
                console.error('Failed to refresh token, invalid response:', response);
                toast.error('Không thể làm mới phiên đăng nhập, vui lòng đăng nhập lại');

                // Chuyển tiếp lỗi
                observer.error(new Error('Failed to refresh token'));
                observer.complete();
              }
            })
            .catch((refreshError) => {
              console.error('Error refreshing token:', refreshError);
              toast.error('Lỗi khi làm mới phiên đăng nhập, vui lòng đăng nhập lại');

              // Xóa token lưu trữ vì không thể refresh
              localStorage.removeItem('token');
              localStorage.removeItem('access_token');
              localStorage.removeItem('refreshToken');
              localStorage.removeItem('refresh_token');
              localStorage.removeItem('expiresAt');

              // Kích hoạt sự kiện token đã bị xóa
              tokenEvents.emit(TOKEN_REMOVED);

              // Chuyển tiếp lỗi
              observer.error(refreshError);
              observer.complete();
            });
        });
      }
    }
  }

  // Xử lý lỗi mạng
  if (networkError) {
    console.error('Network Error:', networkError);

    // Kiểm tra loại lỗi mạng
    if (networkError.message && networkError.message.includes('CORS')) {
      console.error('CORS error detected:', networkError.message);
      toast.error('Lỗi kết nối đến máy chủ (CORS). Vui lòng liên hệ quản trị viên.');
    } else if (networkError.message && networkError.message.includes('timeout')) {
      toast.error('Kết nối đến máy chủ quá chậm. Vui lòng thử lại sau.');
    } else if (networkError.message && networkError.message.includes('Failed to fetch')) {
      toast.error('Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng và thử lại.');
    } else {
      toast.error('Lỗi kết nối đến máy chủ. Vui lòng thử lại sau.');
    }
  }
});

// Link thêm token vào request khi cần thiết
// Nếu operation.getContext().requiresAuth === false, token sẽ không được thêm vào
const authLink = new ApolloLink((operation, forward) => {
  const { requiresAuth } = operation.getContext();
  // Bỏ qua logging khi API không yêu cầu xác thực
  const { accessToken } = getTokens(requiresAuth === false);

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

  // Thêm token vào header của request chỉ khi requiresAuth là true hoặc không được chỉ định
  const headers: Record<string, string> = {};
  if (accessToken && requiresAuth !== false) {
    headers.authorization = `Bearer ${accessToken}`;
    // Chỉ log khi không phải API public
    if (requiresAuth !== false) {
      console.log('Adding auth token to request:', operation.operationName);
    }
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
  uri: process.env.NEXT_PUBLIC_GRAPHQL_API_URL || 'http://192.168.2.21:8000/graphql', // URL API
  // Không sử dụng credentials: 'include' để tránh lỗi CORS
  fetch: (uri, options) => {
    // Thêm timeout để tránh chờ quá lâu
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Request timeout after 15 seconds'));
      }, 15000);

      fetch(uri, options)
        .then(response => {
          clearTimeout(timeout);
          resolve(response);
        })
        .catch(error => {
          clearTimeout(timeout);
          console.error('Fetch error:', error);
          reject(error);
        });
    });
  }
});

// Enhanced cache configuration with typePolicies and field merging
const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        // Products don't need refetching on every navigation
        getProducts: {
          merge(existing, incoming) {
            return incoming;
          },
          read(existing) {
            return existing;
          }
        },
        // Brands rarely change - good caching candidate
        getBrands: {
          merge(existing, incoming) {
            return incoming;
          }
        },
        // Provinces and other location data rarely change
        getProvinces: {
          merge(existing, incoming) {
            return incoming;
          }
        },
        getDistricts: {
          keyArgs: ["province_id"],
        },
        getWards: {
          keyArgs: ["district_id"],
        }
      }
    }
  }
});

// Create and export the client instance
export const apolloClient = new ApolloClient({
  link: from([authLink, errorLink, httpLink]),
  cache,
  defaultOptions: {
    watchQuery: {
      // Use cache-first instead of cache-and-network for better performance
      fetchPolicy: 'cache-first',
      // Cache results for 5 minutes before considering them stale
      nextFetchPolicy: 'cache-first',
      // Only refetch if cache is empty or stale
      notifyOnNetworkStatusChange: true,
    },
    query: {
      // Change default to cache-first instead of network-only
      fetchPolicy: 'cache-first',
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
});

// Add optimized cache reset function that preserves certain cached data
export const resetApolloClient = () => {
  // Don't evict static data like brands and provinces when resetting
  apolloClient.cache.evict({ fieldName: 'getCartItems' });
  apolloClient.cache.evict({ fieldName: 'getUserInfo' });
  apolloClient.cache.evict({ fieldName: 'getCurrentUser' });
  apolloClient.cache.gc();
};

// // Hàm tiện ích để reset client khi đăng xuất
// export const resetApolloClient = () => {
//   // Xóa cache
//   apolloClient.resetStore();
// };

// Lắng nghe sự kiện token thay đổi để reset Apollo Cache
if (typeof window !== 'undefined') {
  // Khi token được cập nhật, xóa cache để tránh dữ liệu cũ
  tokenEvents.on(TOKEN_UPDATED, () => {
    console.log('Token updated, resetting Apollo cache');
    apolloClient.resetStore().catch(err => {
      console.error('Error resetting Apollo cache:', err);
    });
  });

  // Khi token bị xóa (đăng xuất), reset store
  tokenEvents.on(TOKEN_REMOVED, () => {
    console.log('Token removed, resetting Apollo store');
    resetApolloClient();
  });
}