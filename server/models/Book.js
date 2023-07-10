const { Schema, model } = require("mongoose"); // import mongoose Schema and model

const bookSchema = new Schema({
  // create book schema with title, authors, description, bookId, image, and link fields
  title: {
    // add title field with validation rules
    type: String,
    required: true,
    trim: true,
  },
  authors: [
    // add authors field with validation rules
    {
      type: String,
      required: true,
      trim: true,
    },
  ],
  description: {
    // add description field with validation rules
    type: String,
    required: false,
    trim: true,
  },
  bookId: {
    // add bookId field with validation rules
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  image: {
    // add image field with validation rules
    type: String,
    required: false,
    trim: true,
  },
  link: {
    // add link field with validation rules
    type: String,
    required: false,
    trim: true,
  },
});

const Book = model("Book", bookSchema); // create Book model using bookSchema

module.exports = Book; // export Book model
