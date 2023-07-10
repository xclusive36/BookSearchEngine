const { Schema, model } = require("mongoose");

const bookSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  authors: [
    {
      type: String,
      required: true,
      trim: true,
    },
  ],
  description: {
    type: String,
    required: false,
    trim: true,
  },
  bookId: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  image: {
    type: String,
    required: false,
    trim: true,
  },
  link: {
    type: String,
    required: false,
    trim: true,
  },
});

const Book = model("Book", bookSchema);

module.exports = Book;
