import { gql } from "@apollo/client"; // import gql tagged template function

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) { // define login mutation accepting $email and $password variables
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) { // define addUser mutation accepting $username, $email, and $password variables
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const SAVE_BOOK = gql`
  mutation savebook($title: String!, $authors: [String]!, $description: String, $bookId: String!, $image: String, $link: String) { // define saveBook mutation accepting $title, $authors, $description, $bookId, $image, and $link variables
    saveBook(title: $title, authors: $authors, description: $description, bookId: $bookId, image: $image, link: $link) {
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

export const REMOVE_BOOK = gql`
  mutation removeBook($bookId: String!) { // define removeBook mutation accepting $bookId variable
    removeBook(bookId: $bookId) {
      _id
      username
    }
  }
`;
