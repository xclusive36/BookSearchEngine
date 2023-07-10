const { gql } = require("apollo-server-express"); // import gql tagged template function

const typeDefs = gql`
  type User { // define User type with _id, username, email, password, and savedBooks fields
    _id: ID
    username: String
    email: String
    password: String
    savedBooks: [Book]!
  }

  type Book { // define Book type with _id, title, authors, description, bookId, image, and link fields
    _id: ID
    title: String!
    authors: [String]!
    description: String
    bookId: String!
    image: String
    link: String
  }

  type Auth { // define Auth type with token and user fields
    token: ID!
    user: User
  }

  type Query { // define Query type with me, user, users, book, and books fields
    users: [User]
    user(username: String!): User
    book(bookId: ID!): Book
    books(username: String): [Book]
    me: User
  }

  type Mutation { // define Mutation type with login, addUser, saveBook, and removeBook fields
    addUser(username: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
    saveBook(title: String!, authors: [String]!, description: String, bookId: String, image: String, link: String): Book
    removeBook(bookId: String!): User
  }
`;

module.exports = typeDefs; // export typeDefs
