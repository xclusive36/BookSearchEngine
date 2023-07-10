import React from "react"; // import react library
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from "@apollo/client"; // import ApolloClient, InMemoryCache, ApolloProvider, and createHttpLink
import { setContext } from "@apollo/client/link/context"; // import setContext
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // import BrowserRouter, Routes, and Route
import SearchBooks from "./pages/SearchBooks"; // import SearchBooks page
import SavedBooks from "./pages/SavedBooks"; // import SavedBooks page
import Navbar from "./components/Navbar"; // import Navbar component

// Construct our main GraphQL API endpoint
const httpLink = createHttpLink({
  uri: "/graphql",
});

// Construct request middleware that will attach the JWT token to every request as an `authorization` header
const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem("id_token");
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  // Set up our client to execute the `authLink` middleware prior to making the request to our GraphQL API
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <>
          <Navbar />
          <Routes>
            <Route path="/" element={<SearchBooks />} />
            <Route path="/saved" element={<SavedBooks />} />
            <Route render={() => <h1 className="display-2">Wrong page!</h1>} />
          </Routes>
        </>
      </Router>
    </ApolloProvider>
  );
}

export default App; // export App component
