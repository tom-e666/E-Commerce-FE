'use client';

import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";
import React from 'react';
import { JSX } from "react/jsx-runtime";

const client = new ApolloClient({
  uri: 'http://127.0.0.1:8000/graphql',
  cache: new InMemoryCache(),
});
const Provider = ({children}:{children: React.ReactNode}): JSX.Element => {
    return(
        <ApolloProvider client={client}>{children}</ApolloProvider>
    );
}
export default Provider;