const { AuthenticationError } = require("apollo-server-express"); // import AuthenticationError from apollo-server-express
const { User, Book } = require("../models"); // import User and Book models
const { signToken } = require("../utils/auth"); // import signToken function from auth.js

const resolvers = {
  // create resolvers object
  Query: {
    // add Query nested object with me, users, and user fields
    users: async () => {
      // add users field
      return User.find().populate("savedBooks"); // return all users and populate savedBooks field
    },
    user: async (parent, { username }) => {
      // add user field
      return User.findOne({ username }).populate("savedBooks"); // return user by username and populate savedBooks field
    },
    me: async (parent, args, context) => {
      // add me field
      if (context.user) {
        // if user object exists
        return User.findOne({ _id: context.user._id }).populate("savedBooks"); // return user by id and populate savedBooks field
      }
      throw new AuthenticationError("You need to be logged in!"); // throw authentication error if no user object exists
    },
  },

  Mutation: {
    // add Mutation nested object with login, addUser, saveBook, and removeBook fields
    addUser: async (parent, { username, email, password }) => {
      // add addUser field
      const user = await User.create({ username, email, password }); // create user
      const token = signToken(user); // create token
      return { token, user }; // return token and user
    },
    login: async (parent, { email, password }) => {
      // add login field
      const user = await User.findOne({ email }); // find user by email

      if (!user) {
        // if no user found with email
        throw new AuthenticationError("No user found with this email address"); // throw authentication error
      }

      const correctPw = await user.isCorrectPassword(password); // check if password is correct

      if (!correctPw) {
        // if password is incorrect
        throw new AuthenticationError("Incorrect credentials"); // throw authentication error
      }

      const token = signToken(user); // create token

      return { token, user }; // return token and user
    },
    saveBook: async (
      // add saveBook field
      parent,
      { title, authors, description, bookId, image, link },
      context
    ) => {
      if (context.user) {
        // if user object exists
        const book = await Book.create({
          // create book with title, authors, description, bookId, image, and link fields
          title,
          authors,
          description,
          bookId,
          image,
          link,
        });

        await User.findOneAndUpdate(
          // find user by id and add book to savedBooks array
          { _id: context.user._id },
          { $addToSet: { savedBooks: book._id } }
        );

        return book; // return book
      }
      throw new AuthenticationError("You need to be logged in!"); // throw authentication error if no user object exists
    },
    removeBook: async (parent, { bookId }, context) => {
      // add removeBook field
      if (context.user) {
        // if user object exists
        const book = await Book.findOneAndDelete({
          // find book by id and delete
          bookId: bookId,
        });

        const me = await User.findOneAndUpdate(
          // find user by id and remove book from savedBooks array
          { _id: context.user._id },
          { $pull: { savedBooks: book._id } },
          { new: true }
        );

        return me; // return user
      }
      throw new AuthenticationError("You need to be logged in!"); // throw authentication error if no user object exists
    },
  },
};

module.exports = resolvers; // export resolvers
