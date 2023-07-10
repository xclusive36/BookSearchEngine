const { AuthenticationError } = require("apollo-server-express");
const { User, Book } = require("../models");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    users: async () => {
      return User.find().populate("savedBooks");
    },
    user: async (parent, { username }) => {
      return User.findOne({ username }).populate("savedBooks");
    },
    me: async (parent, args, context) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id }).populate("savedBooks");
      }
      throw new AuthenticationError("You need to be logged in!");
    },
  },

  Mutation: {
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError("No user found with this email address");
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError("Incorrect credentials");
      }

      const token = signToken(user);

      return { token, user };
    },
    saveBook: async (
      parent,
      { title, authors, description, bookId, image, link },
      context
    ) => {
      if (context.user) {
        if (context.user) {
          const book = await Book.create({
            title,
            authors,
            description,
            bookId,
            image,
            link,
          });

          await User.findOneAndUpdate(
            { _id: context.user._id },
            { $addToSet: { savedBooks: book._id } }
          );

          return book;
        }
        throw new AuthenticationError("You need to be logged in!");
      }
    },
    removeBook: async (parent, { bookId }, context) => {
      if (context.user) {
        const book = await Book.findOneAndDelete({
          bookId: bookId,
        });

        const me = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: book._id } },
          { new: true }
        );

        return me;
      }
      throw new AuthenticationError("You need to be logged in!");
    },
  },
};

module.exports = resolvers;
