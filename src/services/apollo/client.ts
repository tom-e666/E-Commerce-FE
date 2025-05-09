import { ApolloClient, InMemoryCache, HttpLink, from, ApolloLink } from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { refreshTokenAPI } from "../auth/endpoints";

const getTokens = () => {
  if (typeof window === 'undefined') return { accessToken: null, refreshToken: null };
  return {
    accessToken: localStorage.getItem('access_token'),
    refreshToken: localStorage.getItem('refresh_token')
  };
};
// @ts-ignore
const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    for (const error of graphQLErrors) {
      console.log('GraphQL Error:', error);
      if (
        error.extensions?.code === 'UNAUTHENTICATED' || 
        error.message.includes('token') || 
        error.message.includes('authentication')
      ) {
        const { refreshToken } = getTokens();
        
        if (!refreshToken) {
          console.log('No refresh token available, redirect to login');
          window.location.href = '/login';
          return;
        }
        
        return new Promise(resolve => {
          
          refreshTokenAPI(refreshToken)
            .then(newAccessToken => {
              // Cập nhật header authorization cho request hiện tại
              const oldHeaders = operation.getContext().headers;
              operation.setContext({
                headers: {
                  ...oldHeaders,
                  authorization: `Bearer ${newAccessToken}`,
                },
              });
              // Thực hiện lại request
              resolve(forward(operation));
            })
            .catch(err => {
              // Xử lý lỗi refresh token
              console.error('Failed to refresh token:', err);
              window.location.href = '/login';
              resolve(forward(operation));
            });
        });
      }
    }
  }
  
  if (networkError) {
    console.log('Network Error:', networkError);
    // Xử lý lỗi mạng nếu cần
  }
});

// Link thêm token vào mọi request
const authLink = new ApolloLink((operation, forward) => {
  const { accessToken } = getTokens();
  
  operation.setContext({
    headers: {
      authorization: accessToken ? `Bearer ${accessToken}` : '',
    },
  });
  
  return forward(operation);
});

// HTTP link
const httpLink = new HttpLink({
  uri: 'http://127.0.0.1:8000/graphql',
  // Thêm credentials nếu cần để xử lý cookies
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