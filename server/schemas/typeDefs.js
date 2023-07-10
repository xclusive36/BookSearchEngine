const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type User {
    _id: ID
    username: String
    email: String
    password: String
    savedBooks: [Book]!
  }

  type Book {
    _id: ID
    title: String!
    authors: [String]!
    description: String
    bookId: String!
    image: String
    link: String
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    users: [User]
    user(username: String!): User
    book(bookId: ID!): Book
    books(username: String): [Book]
    me: User
  }

  type Mutation {
    addUser(username: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
    saveBook(title: String!, authors: [String]!, description: String, bookId: String, image: String, link: String): Book
    removeBook(bookId: String!): User
  }
`;

module.exports = typeDefs;
