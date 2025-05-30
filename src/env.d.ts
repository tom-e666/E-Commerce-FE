declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_GRAPHQL_ENDPOINT: string;
    NEXT_PUBLIC_API_URL: string;
    NODE_ENV: 'development' | 'production' | 'test';
  }
}
