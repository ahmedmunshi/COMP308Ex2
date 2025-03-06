import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

// Connect to our GraphQL server
const httpLink = createHttpLink({
  uri: "http://localhost:4000/graphql",
});

// Create an auth link to add the token to the headers
const authLink = setContext((_, { headers }) => {
  // Get the token from localStorage
  const token = localStorage.getItem("token");

  // Return the headers to the context
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

// New instance of an Apollo Client
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default client;
