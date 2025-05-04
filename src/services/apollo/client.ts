import { ApolloClient, InMemoryCache, HttpLink, from, ApolloLink } from "@apollo/client";
import { onError } from "@apollo/client/link/error";


const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) console.log('GraphQL Error:', graphQLErrors);
  if (networkError) console.log('Network Error:', networkError);
});

const authLink = new ApolloLink((operation, forward) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  
  operation.setContext({
    headers: {
      authorization: token ? `Bearer ${token}` : '',
    },
  });
  
  return forward(operation);
});

// HTTP link
const httpLink = new HttpLink({
  uri: 'http://127.0.0.1:8000/graphql',
});

// Create and export the client instance
export const apolloClient = new ApolloClient({
  link: from([authLink, errorLink, httpLink]),
  cache: new InMemoryCache(),
});