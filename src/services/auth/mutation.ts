import { gql } from "@apollo/client";
import { apolloClient } from "../apollo/client";
export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      access_token
      refresh_token
      expires_at
    }
  }
`;
export const login = async (email: string, password: string) => {
  return apolloClient.mutate({
    mutation: LOGIN_MUTATION,
    variables: {
      email,
      password
    }
  });
};
export const SIGNUP_MUTATION = gql`
  mutation Signup(
    $email:String!
    $phone:String!
    $password:String!
    $full_name:String!
    ) {

    signup(email: $email,phone: $phone,password: $password,full_name: $full_name) {
      code
      message
    }
  }
`;
export const signup = async (email: string, phone: string, password: string, full_name: string) => {
  return apolloClient.mutate({
    mutation: SIGNUP_MUTATION,
    variables: {
      email,
      phone,
      password,
      full_name
    }
  });
}
export const LOGOUT_MUTATION = gql`
  mutation Logout (
    $refresh_token:String!
  ){
      logout(refresh_token: $refresh_token) {
      code
      message
    }
  }
`;
export const logout = async (refresh_token: string) => {
  return apolloClient.mutate({
    mutation: LOGOUT_MUTATION,
    variables: {
      refresh_token
    }
  });
}



