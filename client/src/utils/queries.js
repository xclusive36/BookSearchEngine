import { gql } from '@apollo/client'; // import gql tagged template function

export const QUERY_USER = gql`
  query user($username: String!) { // define user query accepting $username variable
    user(username: $username) {
      _id
      username
      email
      savedBooks {
        _id
        title
        authors
        description
        bookId
        image
        link
      }
    }
  }
`;

export const QUERY_BOOKS = gql`
  query getBooks { // define getBooks query
    savedBooks {
      _id
      title
      authors
      description
      bookId
      image
      link
    }
  }
`;

export const QUERY_SINGLE_BOOK = gql`
  query getSingleBook($bookId: ID!) { // define getSingleBook query accepting $bookId variable
    savedBooks(bookId: $bookId) {
      _id
      title
      authors
      description
      bookId
      image
      link
    }
  }
`;

export const QUERY_ME = gql`
  query me { // define me query
    me {
      _id
      username
      email
      savedBooks {
        _id
        title
        authors
        description
        bookId
        image
        link
      }
    }
  }
`;
