import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';

// Use HTTPS in production or when served over HTTPS
const getGraphQLUri = () => {
  const baseUri = '20.11.66.22:8000/graphql';
  
  // Check if we're in a browser environment and the page is served over HTTPS
  if (typeof window !== 'undefined' && window.location.protocol === 'https:') {
    // Try HTTPS first, fallback to HTTP if needed
    return `https://${baseUri}`;
  }
  
  // Default to HTTP for development
  return `http://${baseUri}`;
};

const httpLink = createHttpLink({
  uri: getGraphQLUri(),
  credentials: 'include',
});

const authLink = setContext((_, { headers }) => {
  // ...existing auth logic...
});

const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (networkError) {
    console.error('Network error:', networkError);
    
    // If HTTPS fails, try HTTP fallback
    if (networkError.message?.includes('Mixed Content') || 
        networkError.message?.includes('net::ERR_SSL_PROTOCOL_ERROR')) {
      
      const httpUri = `http://20.11.66.22:8000/graphql`;
      operation.setContext({
        ...operation.getContext(),
        uri: httpUri,
      });
      
      return forward(operation);
    }
  }
  
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.error(`GraphQL error: Message: ${message}, Location: ${locations}, Path: ${path}`);
    });
  }
});

const client = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
    },
    query: {
      errorPolicy: 'all',
    },
  },
});

export default client;