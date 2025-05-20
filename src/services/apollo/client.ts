import { ApolloClient, InMemoryCache, HttpLink, from, ApolloLink } from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { refreshTokenAPI } from "../auth/endpoints";
import { Observable } from "@apollo/client";
import { toast } from "sonner";
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
      if (
        error.extensions?.code === 'UNAUTHENTICATED' || 
        error.message.includes('token') || 
        error.message.includes('authentication')||
        error.message.includes('Unauthenticated.')
      ) {
        const { refreshToken } = getTokens();
        
        if (!refreshToken) {
          toast.error('Vui lòng đăng nhập lại');
          setTimeout(()=>{
            window.location.href = '/login';
          },2000);
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
              resolve(forward(operation));
            })
            .catch(()=>{
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
  const { requiresAuth } = operation.getContext();
  if (requiresAuth && !accessToken) {
      return new Observable(observer => {        
          observer.complete();
      });
  }
  operation.setContext({
    headers: {
      authorization: accessToken ? `Bearer ${accessToken}` : '',
    },
  });
  
  return forward(operation);
});

// HTTP link
const httpLink = new HttpLink({
  uri: 'https://0862-116-110-41-30.ngrok-free.app/graphql', 
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