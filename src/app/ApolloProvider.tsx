'use client';

import { ApolloProvider } from "@apollo/client";
import React from 'react';
import { apolloClient } from "@/services/apollo/client";

const Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ApolloProvider client={apolloClient}>{children}</ApolloProvider>
  );
}
export default Provider;